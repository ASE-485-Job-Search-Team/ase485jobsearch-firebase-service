const express = require('express')
const router = express.Router()

const multer = require("multer")
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file');
const { firebase } = require('../util/firebase');

const { bucket, db, admin } = require("../util/admin");
const User = require('../models/user')
const Resume = require('../models/resume')

const ResumesRef = db.collection('Resume');
// Need to change to User
const userRef = db.collection('User');
const resumeRef = db.collection('Resume'); //
const companyRef = db.collection('Company');
const jobPostingRef = db.collection('JobPosting');
const jobApplicationRef = db.collection('JobApplication');
const jobRef = db.collection('Job');


router.use(express.json())

router.use((req, res, next) => {
    const d = new Date();
    let text = d.toJSON();
    console.log('Time: ', text)
    next()
})

// This route is used to get all of the job applications a user has applied to
router.get("/:userId/applications", async (req, res) => {
    // try {
    // Get the user ID from the request parameters
    const userId = req.params.userId;
    const user = await userRef.doc(userId).get();
    if (!user.exists) {
        return res.status(404).json({ error: "User not found" });
    }
    const userData = user.data();
    const resumeSnapshot = await resumeRef.doc(userData.resumeId).get();
    const resumeData = resumeSnapshot.data();

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
                name: userData.fullName,
                resumeUrl: resumeData.downloadUrl,
                jobPosting: {
                    ...jobPostingData,
                    id: jobPosting.id,
                    company: companyData.companyName,
                    companyLogo: companyData.companyLogoURL
                }
            };
        })
    );

    // Send the application data in the response
    res.json(applicationData);
    // } catch (err) {
    //     // Handle any errors
    //     res.status(400).send(err.message);
    // }
});

router.get("/:userId/resume", async (req, res) => {
    try {
        const userId = req.params.userId
        const user = await userRef.doc(userId).get();

        if (!user.exists) {
            return res.status(404).json({ error: "User not found" });
        }
        const userData = user.data();
        const resumeSnapshot = await resumeRef.doc(userData.resumeId).get();
        const resumeData = resumeSnapshot.data();
        res.json(resumeData);
    } catch (err) {
        res.status(400).send(err.message)
    }
});

router.get("/:userId", async (req, res) => {

    try {
        const userId = req.params.userId
        const user = await userRef.where('userId', '==', userId).get();

        if (user.empty) {
            return res.status(400).json({ message: 'No user found.' });
        }
        else {
            //userId SHOULD be unique
            res.status(200).json(user.docs[0].data())
        }
    } catch (err) {
        res.status(400).send(err.message)
    }
})

router.put("/:userId/edit", async (req, res) => {
    try {
        const userId = req.params.userId
        //check if user exists
        const user = await userRef.where('userId', '==', userId).get();
        if (user.empty) {
            return res.status(400).json({ message: 'No company found.' });
        }
        userRef.doc(userId).update(req.body).then(
            res.status(200).json({ message: 'edit success' })
        );
    } catch (err) {
        res.status(400).send(err.message)
    }
})

router.delete("/:userId/delete", async (req, res) => {
    try {
        const userId = req.params.userId
        //check if user exists
        const user = await userRef.where('userId', '==', userId).get();
        if (user.empty) {
            return res.status(400).json({ message: 'No user found.' });
        }
        userRef.doc(userId).delete().then(
            res.status(200).json({ message: 'delete success' })
        );
    } catch (err) {
        res.status(400).send(err.message)
    }
})


router.post("/create", async (req, res) => {
    try {
        const { fullName, userId } = req.body;

        if (!userId) {
            return res.status(400).send('userId is required');
        }

        const data = {
            fullName,
            resumeId: "",
            userId,
            created_at: new Date()
        };

        userRef.doc(userId).set(data).then(
            res.status(200).json({ 'post': 'success' })
        );

    } catch (err) {
        res.status(400).send(err.message);
    }
});


router.put("/update/resume-id", async (req, res) => {
    try {
        const { userId, resumeId } = req.body;
        const data = {
            resumeId
        };

        userRef.doc(userId).update(data).then(
            res.status(200).json({ 'put': 'success' })
        );
    } catch (err) {
        res.status(400).send(err.message);
    }
});



module.exports = router


//depricated
// router.get('/:userId/application', async (req, res) => {
//     try {
//         //get array of resume_id
//         const user_id = req.params.user_id
//         var appArray = (await usersRef.doc(user_id).get()).data().applications
//         var jobs = []
//         //filter
//         appArray = appArray.filter((value, index, array) => array.indexOf(value) === index);


//         for (let i = 0; i < appArray.length; i++) {
//             result = (await jobRef.doc(appArray[i]).get()).data()
//             jobs.push(result)
//         }

//         res.status(200).json(jobs)
//     }
//     catch (err) {
//         res.status(400).send(err.message)
//     }
// })


//submitting a job application
//depricated
//req.body {resume_id: String,job_id : String} sends resume with resume_id to job at job_id
// router.post('/:user_id/submit/:job_id', async (req, res) => {
//     try {

//         const resume_id = req.body.resume_id
//         const job_id = req.body.job_id
//         //add resume_id to list of application
//         var job = await (await jobRef.doc(job_id).get()).data()
//         job.application.push(resume_id);
//         await jobRef.doc(job_id).update(job).then(
//             async () => {
//                 //add job_id to users list of application
//                 var resume = await (await resumeRef.doc(resume_id).get()).data()
//                 var user = await (await usersRef.doc(resume.user_id).get()).data()
//                 user.application.push(job_id)
//                 usersRef.doc(resume.user_id).update(user).then(
//                     res.status(200).json({ 'put': 'success' })
//                 );
//             }
//         );

//     } catch (err) {
//         res.status(400).send(err.message)
//     }
// })


// router.post("/create", async (req, res) => {
//     try {
//         //console.log(req.body)
//         const data = req.body;
//         if (data.hasOwnProperty("userId")) {

//             //check if user already exists
//             const userId = req.body.userId
//             const user = await usersRef.where('userId', '==', userId).get();
//             if (!user.empty) {
//                 return res.status(400).json({ message: 'User with that userId already exists.' });
//             }

//         } else {
//             //create new random id
//             data.userId = usersRef.doc().id
//         }
//         const user = await usersRef.doc(data.userId).set(data).then(
//             res.status(200).json({ 'post': 'success' })
//         );
//     } catch (err) {
//         res.status(400).send(err.message)
//     }
// })