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
const userRef = db.collection('User');
const resumeRef = db.collection('Resume');
const companyRef = db.collection('Company');
const jobPostingRef = db.collection('JobPosting');
const jobApplicationRef = db.collection('JobApplication');
const jobRef = db.collection('Job');


router.use(express.json())

router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
})

// This route is used to get all of the job applications a user has applied to
router.get("/:userId/applications", async (req, res) => {
    try {
        // Get the user ID from the request parameters
        const userId = req.params.userId;

        // Get all job applications where the user ID matches
        const applications = await jobApplicationRef.where("userId", "==", userId).get();

        // Use Promise.all() to map over the applications and get the job posting and company data for each one
        const applicationData = await Promise.all(
            applications.docs.map(async (application) => {
                // Get the ID and data for the job application
                const applicationId = application.id;
                const applicationData = application.data();

                // Get the data for the job posting associated with the application
                const jobPosting = await jobPostingRef.doc(applicationData.jobId).get();
                const jobPostingData = jobPosting.data();

                // Get the data for the company associated with the job posting
                const company = await companyRef.doc(jobPostingData.companyId).get()
                const companyData = company.data()

                // Return an object with the job application data, ID, and job posting and company data
                return {
                    ...applicationData,
                    id: applicationId,
                    jobPosting: {
                        ...jobPostingData,
                        id: jobPosting.id,
                        company: companyData.companyName,
                        companyLogo: companyData.companyLogoURL
                    }
                };
            })
        );

        // Log the application data to the console
        console.log(applicationData);

        // Send the application data in the response
        res.json(applicationData);
    } catch (err) {
        // Handle any errors
        res.status(400).send(err.message);
    }
});



router.post("/", async (req, res) => {
    try {
        //console.log(req.body)
        const data = req.body;
        if (data.hasOwnProperty("user_id")) {
        } else {
            //create new random id
            data.user_id = UserRef.doc().id
        }
        const user = await UsersRef.doc(data.user_id).set(data).then(
            res.status(200).json({ 'post': 'success' })
        );
    } catch (err) {
        res.status(400).send(err.message)
    }
})

router.get("/", async (req, res) => {
    try {
        const user_id = req.body.user_id
        const result = await UsersRef.doc(user_id).get();
        res.json(result.data());
    } catch (err) {
        res.status(400).send(err.message)
    }
})

router.put("/", async (req, res) => {

    try {
        const user_id = req.body.user_id
        UsersRef.doc(user_id).update(req.body).then(
            res.status(200).json({ 'put': 'success' })
        );
    } catch (err) {
        res.status(400).send(err.message)
    }
})

router.delete("/", async (req, res) => {
    try {
        const user_id = req.body.user_id
        UsersRef.doc(user_id).delete().then(
            res.status(200).json({ 'post': 'success' })
        );
    } catch (err) {
        res.status(400).send(err.message)
    }
})






module.exports = router  
