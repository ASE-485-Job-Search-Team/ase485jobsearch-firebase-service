const express = require('express')
const router = express.Router()

const multer = require("multer")
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file');

const { bucket, db } = require("../util/admin");
const resumesRef = db.collection('Resume');
const usersRef = db.collection('User');

router.use(express.json())

router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
})
router.get('/test', (req, res) => {
    res.send('something')
})

//get a resume by User
router.get("/:userId/resume", async (req, res) => {

    try {
        //console.log(req.body)
        const userId = req.params.userId
        //check if user exists
        const user = await usersRef.doc(userId).get()
        if (user.empty) {
            return res.status(400).json({ message: 'No user found.' });
        }
        const result = await resumesRef.doc(userId).get()
        if (result.empty) {
            return res.status(400).json({ message: 'No resume found.' });
        }
        res.status(200).json(result.data())
    } catch (err) {
        res.status(400).send(err.message)
    }
})

//get a resume by Resume_ID
router.get("/:resumeId", async (req, res) => {
    try {
        //console.log(req.body)
        const resumeId = req.params.resumeId
        const result = await resumesRef.doc(resumeId).get()
        if (result.empty) {
            return res.status(400).json({ message: 'No resume found.' });
        }
        res.status(200).json(result.data())
    } catch (err) {
        res.status(400).send(err.message)
    }
})


router.post("/:userId/createResume", upload, async (req, res) => {
    try {
        const file = req.file;
        const name = file.originalname;
        const bucketFile = bucket.file(name);
        const userId = req.params.userId
        const data = req.body;
        //if user already has resume
        const resume = await resumesRef.where('userId', '==', userId).get();
        if (!resume.empty) {
            return res.status(400).json({ message: 'User already has existing resume.' });
        }
        if (data && data.resumeId) {
        } else {
            //create new random id
            const resumeId = resumesRef.doc().id
            data.resumeId = resumeId;
        }
        //update bucket with pdf
        bucketFile
            .save(new Buffer.from((file.buffer)))
            .then(() => {
                //update database with resume entry
                var downloadUrl = `https://storage.googleapis.com/${bucket.name}/${name}`
                resumesRef.doc(data.resumeId).set({
                    "fileName": name,
                    "resumeId": data.resumeId,
                    'userId': userId,
                    'downloadUrl': downloadUrl
                }).then(() => {
                    res.status(200).json({
                        status: 'success',
                        data: Object.assign({}, bucketFile.metadata, {
                            userId: userId,
                            resumeId: data.resumeId,
                            downloadURL: downloadUrl,
                        })
                    });
                })
            })
    } catch (err) {
        res.status(400).send(err.message)
    }
})

router.delete("/:resumeId/delete", async (req, res) => {
    const resumeId = req.params.resumeId
    const resume = await resumesRef.where('resumeId', '==', resumeId).get();
    if (resume.empty) {
        return res.status(400).json({ message: 'No resume found.' });
    }
    downloadUrl = resume.docs[0].data().downloadUrl
    bucket.deleteFiles(downloadUrl).then(() => {
        res.status(200).json({ 'post': 'success' })
    })
        .catch(err => {
            res.status(500).json({
                status: 'error',
                errors: err.message,
            });
        });
})

router.get("/:resumeId/download", async (req, res) => {
    const resumeId = req.params.resumeId
    const resume = await resumesRef.where('resumeId', '==', resumeId).get();
    if (resume.empty) {
        return res.status(400).json({ message: 'No resume found.' });
    }


    const file = bucket.file(resume.docs[0].data().fileName);
    const [exists] = await file.exists()
    if (!exists) {
        return res.status(404).send('File not found');
    }

    res.set({
        'Content-Type': file.contentType,
        'Content-Length': file.metadata.size,
        'Content-Disposition': `attachment; filename="${file.name}"`
    });
    const readStream = file.createReadStream();
    readStream.pipe(res);

})





module.exports = router  