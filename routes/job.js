const express = require('express')
const router = express.Router()

const multer = require("multer")
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file');

const { bucket, db } = require("../util/admin");

const admin = require('firebase-admin');
const jobRef = db.collection('Job');
const jobPostingRef = db.collection('JobPosting');
const jobApplicationRef = db.collection('JobApplication');
const companyRef = db.collection('Company');
const userRef = db.collection('Users');
const resumeRef = db.collection('Resumes');
const adminRef = db.collection('Admins');

router.use(express.json())

router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
})

router.get("/job-postings", async (req, res) => {
    try {
        // Get all job postings
        const jobPostings = await jobPostingRef.get();
        console.log(jobPostings.docs[0].data());

        // Use Promise.all() to map over the job postings and get the associated company data for each one
        const data = await Promise.all(
            jobPostings.docs.map(async (jobPosting) => {
                // Get the data for the company associated with the job posting
                const company = await companyRef.doc(jobPosting.data().companyId).get()

                // Log the job posting and company data to the console
                console.log({ ...jobPosting.data(), company: company.data().companyName, company: company.data().companyLogoURL, id: jobPosting.id });

                // Return an object with the job posting data, company name and logo, and ID
                return {
                    ...jobPosting.data(),
                    company: company.data().companyName,
                    companyLogo: company.data().companyLogoURL,
                    id: jobPosting.id
                };
            })
        );

        // Send the data in the response
        res.json(data);
    } catch (err) {
        // Handle any errors
        res.status(400).send(err.message);
    }
});

//CRUD operations for job profile
//req.body 
router.post("/create", async (req, res) => {
    try {
        const data = req.body;
        //post a new job
        if (data.hasOwnProperty("jobId")) {
        } else {
            //create new random id
            data.jobId = jobRef.doc().id
        }

        if (data.hasOwnProperty("companyId")) {
            const company = await companyRef.where('companyId', '==', data.companyId).get();
            if (company.empty) {
                res.status(200).send({ msg: "Could not find company with companyId" });
                return;
            }
        } else {
            //can't create a job posting without companyId
            res.status(200).send({ msg: "Missing companyId or invalid" });
            return;
        }
        jobRef.doc(data.jobId).set(data).then(
            res.status(200).json({ 'post': 'success' })
        );

    } catch (err) {
        res.status(400).send(err.message)
    }
})


router.post("/apply", async (req, res) => {
    const { userId, jobId } = req.body;

    // Check if the user has already applied for the job
    const jobApplication = await jobApplicationRef.where('userId', '==', userId).where('jobId', '==', jobId).get();

    if (!jobApplication.empty) {
        return res.status(400).json({ message: 'User has already applied for this job.' });
    }

    // Create a new JobApplication document
    const jobApplicationData = {
        userId,
        jobId,
        id: admin.firestore().collection('JobApplication').doc().id,
        dateApplied: new Date().toISOString(),
        status: 'applied',
    };

    // Save the new JobApplication document to Firebase
    const jobApplicationDocRef = jobApplicationRef.doc(jobApplicationData.id);
    await jobApplicationDocRef.set(jobApplicationData);

    return res.status(200).json({ message: 'Job application submitted successfully.' });
});


router.put("/:jobId/edit", async (req, res) => {

    try {
        const jobId = req.params.jobId
        const job = await jobRef.where('jobId', '==', jobId).get();
        if (job.empty) {
            res.status(200).send({ msg: "Could not find job with jobId" });
            return;
        }
        jobRef.doc(jobId).update(req.body).then(
            res.status(200).json({ 'put': 'success' })
        );
    } catch (err) {
        res.status(400).send(err.message)
    }
})

router.delete("/:jobId/delete", async (req, res) => {
    try {
        const jobId = req.params.jobId
        const job = await jobRef.where('jobId', '==', jobId).get();
        if (job.empty) {
            res.status(200).send({ msg: "Could not find job with jobId" });
            return;
        }
        jobRef.doc(jobId).delete().then(
            res.status(200).json({ 'Delete': 'success' })
        );
    } catch (err) {
        res.status(400).send(err.message)
    }
})

//gets job from jobId
router.get("/:jobId", async (req, res) => {
    try {
        const jobId = req.params.jobId
        const job = await jobRef.where('jobId', '==', jobId).get();
        if (job.empty) {
            res.status(200).send({ msg: "Could not find job with jobId" });
            return;
        }
        res.status(200).json(job.docs[0].data());
    } catch (err) {
        res.status(400).send(err.message)
    }
})

//submitting a job application now is post("/apply")

//req.body {resume_id: String, job_id : String} sends resume with resume_id to job at job_id
// router.post('/submit', async (req, res) => {
//     try {

//         const resumeId = req.body.resumeId
//         const jobId = req.body.jobId
//         //add resume_id to list of application
//         const job = await (await jobRef.doc(jobId).get()).data()
//         job.application.push(resume_id);
//         await jobRef.doc(job_id).update(job).then(
//             async () => {
//                 //add job_id to users list of application
//                 const resume = await (await resumeRef.doc(resume_id).get()).data()
//                 const user = await (await userRef.doc(resume.user_id).get()).data()
//                 user.application.push(job_id)
//                 userRef.doc(resume.user_id).update(user).then(
//                     res.status(200).json({ 'put': 'success' })
//                 );
//             }
//         );


//     } catch (err) {
//         res.status(400).send(err.message)
//     }
// })

//This is a company function, so it has been moved to company routes
//Getting all applications from a job posting
// //req.body {job_id: String}
// router.get('/jobResumes', async (req, res) => {
//     try {
//         //get application array from job_id
//         //get resume_id from array
//         const job_id = req.body.job_id
//         const result = await jobRef.doc(job_id).get()
//         if (result.empty) {
//             res.status(200).json({ 'msg': 'no results' })
//         } else {

//         }
//         res.status(200).json(result.data().application)
//     }
//     catch (err) {
//         res.status(400).send(err.message)
//     }
// })


//This is a company function, so it has been moved to company routes
// Getting all users who applied to a job posting
// router.get('/jobUsers', async (req, res) => {
//     try {
//         //get array of resume_id
//         const job_id = req.body.job_id
//         var resumes = (await jobRef.doc(job_id).get()).data().application
//         //get user_id from resume_id
//         var user_ids = []
//         resumes = resumes.filter((value, index, array) => array.indexOf(value) === index);


//         for (let i = 0; i < resumes.length; i++) {
//             result = (await resumeRef.doc(resumes[i]).get()).data().user_id
//             user_ids.push(result)
//         }


//         //get all users data from user_id
//         var user_data = []

//         for (let i = 0; i < user_ids.length; i++) {
//             result = (await userRef.doc(user_ids[i]).get()).data();

//             user_data.push(result)
//         }
//         res.status(200).json(user_data)
//     }
//     catch (err) {
//         res.status(400).send(err.message)
//     }
// })





module.exports = router 