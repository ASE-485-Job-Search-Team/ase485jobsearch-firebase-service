const express = require('express')
const router = express.Router()

const multer = require("multer")
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file');

const { bucket, db } = require("../util/admin");
const User = require('../models/user')
const Resume = require('../models/resume')

const ResumesRef = db.collection('Resumes');
const UsersRef = db.collection('Users');

router.use(express.json())

router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
})
router.get('/test', (req, res) => {
    res.send('something')
})

//get a resume by User
router.get("/user", async (req, res) => {

    try {
        //console.log(req.body)
        const user_id = req.body.user_id
        const result = await ResumesRef.doc(user_id).get()
        res.json(result.data())
    } catch (err) {
        res.status(400).send(err.message)
    }
})

//get a resume by Resume_ID
router.get("/resume_id", async (req, res) => {

    try {
        //console.log(req.body)
        const resume_id = req.body.resume_id
        const result = await ResumesRef.doc(resume_id).get()
        res.json(result)
    } catch (err) {
        res.status(400).send(err.message)
    }
})


router.post("/resumeCreate", upload, async (req, res) => {
    const file = req.file;
    const name = file.originalname;
    const bucketFile = bucket.file(name);
    //update bucket with pdf
    bucketFile
        .save(new Buffer.from((file.buffer)))
        .then(() => {
            //update database with resume entry
            var downloadUrl = `https://storage.googleapis.com/${bucket.name}/${name}`
            var resume_id = ResumesRef.id
            var user_id = req.body.user_id
            ResumesRef.add({
                id: resume_id,
                'user_id': user_id,
                'downloadUrl': downloadUrl
            }).then(() => {
                res.status(200).json({
                    status: 'success',
                    data: Object.assign({}, bucketFile.metadata, {
                        user_id: user_id,
                        resume_id: resume_id,
                        downloadURL: downloadUrl,
                    })
                });
            })
        })
        .catch(err => {
            res.status(500).json({
                status: 'error',
                errors: err.message,
            });
        });
})

router.delete("/resumeDelete", async (req, res) => {
    const downloadUrl = req.body.downloadUrl;

    const bucketFile = bucket.deleteFiles(downloadUrl).then(() => {
        res.status(200).json({ 'post': 'success' })
    })
        //update bucket with pdf

        .catch(err => {
            res.status(500).json({
                status: 'error',
                errors: err.message,
            });
        });
})





module.exports = router  