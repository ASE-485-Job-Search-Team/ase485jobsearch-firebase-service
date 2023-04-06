const express = require('express')
const router = express.Router()

const multer = require("multer")
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file');

const { bucket, db } = require("../util/admin");

const jobRef = db.collection('Job');
const userRef = db.collection('Users');
const resumeRef = db.collection('Resumes');
const adminRef = db.collection('Admins');

router.use(express.json())

router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
})

//CRUD operations for job profile
//req.body 
router.post("/", async (req, res) => {
    try {

        const data = req.body;
        //post a new job
        if (data.hasOwnProperty("job_id")) {
        } else {
            //create new random id
            data.job_id = userRef.doc().id
        }
        //update admin first
        const admin = await adminRef.doc(data.admin_id).get()

        if (result.empty) {
            res.status(200).send('Invalid admin ID.');
            return;
        }

        var updated = admin.data()
        updated.jobs.push(data.job_id);
        adminRef.doc(data.admin_id).set(updated).then(
            async () => {
                jobRef.doc(data.job_id).set(data).then(
                    res.status(200).json({ 'post': 'success' })
                );
            }
        );
    } catch (err) {
        res.status(400).send(err.message)
    }
})

router.get("/posting/:job_id", async (req, res) => {

    try {
        //console.log(req.body)
        const job_id = req.params.job_id
        const result = await jobRef.doc(job_id).get()
        if (!result.exists) {
            res.status(200).json({ 'msg': 'no results' })
            return;
        }

        res.status(200).json(result.data())
    } catch (err) {
        res.status(400).send(err.message)
    }
})

router.put("/", async (req, res) => {

    try {
        const job_id = req.body.job_id
        jobRef.doc(job_id).update(req.body).then(
            res.status(200).json({ 'put': 'success' })
        );
    } catch (err) {
        res.status(400).send(err.message)
    }
})

router.delete("/", async (req, res) => {
    try {
        const job_id = req.body.job_id
        jobRef.doc(job_id).delete().then(
            res.status(200).json({ 'post': 'success' })
        );
    } catch (err) {
        res.status(400).send(err.message)
    }
})

//API routes for feed

//returns JSON array of job postings, {offset: int, limit: int}//to be implemented


//returns 50 job posts
router.get("/job-postings", async (req, res) => {
    try {
        const result = await jobRef.get()
        if (!result.exists) {
            res.status(200).json({ 'msg': 'no results' })
        } else {
            res.status(200).json(result.docs.map(doc => doc.data()))
        }

    } catch (err) {
        res.status(400).send(err.message)
    }
})


//Getting all applications from a job posting
//req.body {job_id: String}
router.get('/jobResumes', async (req, res) => {
    try {
        //get application array from job_id
        //get resume_id from array
        const job_id = req.body.job_id
        const result = await jobRef.doc(job_id).get()
        if (result.empty) {
            res.status(200).json({ 'msg': 'no results' })
        } else {

        }
        res.status(200).json(result.data().application)
    }
    catch (err) {
        res.status(400).send(err.message)
    }
})



router.get('/jobUsers', async (req, res) => {
    try {
        //get array of resume_id
        const job_id = req.body.job_id
        var resumes = (await jobRef.doc(job_id).get()).data().application
        //get user_id from resume_id
        var user_ids = []
        resumes = resumes.filter((value, index, array) => array.indexOf(value) === index);


        for (let i = 0; i < resumes.length; i++) {
            result = (await resumeRef.doc(resumes[i]).get()).data().user_id
            user_ids.push(result)
        }


        //get all users data from user_id
        var user_data = []

        for (let i = 0; i < user_ids.length; i++) {
            result = (await userRef.doc(user_ids[i]).get()).data();

            user_data.push(result)
        }
        res.status(200).json(user_data)
    }
    catch (err) {
        res.status(400).send(err.message)
    }
})





module.exports = router 