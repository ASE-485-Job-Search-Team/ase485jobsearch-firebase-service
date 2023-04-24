const express = require('express')
const router = express.Router()

const multer = require("multer")
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file');

const { bucket, db } = require("../util/admin");


const companyRef = db.collection('Company');
const jobRef = db.collection('Job');
const userRef = db.collection('User');
const resumeRef = db.collection('Resume');
const jobApplicationRef = db.collection('JobApplication');

router.use(express.json())

router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
})

// companyId:UUID
// companyName:String
// companyLogoUrl:String


//CRUD operations for company profile
router.post("/create", async (req, res) => {
    try {
        //console.log(req.body)
        const data = req.body;
        var companyId

        if (data.hasOwnProperty("companyId")) {
            //check if company already exists
            companyId = req.body.companyId
            const company = await companyRef.where('companyId', '==', companyId).get();
            if (!company.empty) {
                return res.status(400).json({ message: 'Company already exists.' });
            }
        }
        //if no ID, create new random ID 
        else {
            data.company = companyRef.doc().id
        }

        await companyRef.doc(data.companyId).set(data).then(
            res.status(200).json({ message: 'post success' })
        );
    } catch (err) {
        res.status(400).send(err.message)
    }
})

router.get("/:companyId", async (req, res) => {

    try {
        const companyId = req.params.companyId
        const company = await companyRef.where('companyId', '==', companyId).get();

        if (company.empty) {
            return res.status(400).json({ message: 'No company found.' });
        }
        else {
            //companyId SHOULD be unique
            res.status(200).json(company.docs[0].data())
        }
    } catch (err) {
        res.status(400).send(err.message)
    }
})

router.put("/:companyId/edit", async (req, res) => {

    try {
        const companyId = req.params.companyId
        //check if company exists
        const company = await companyRef.where('companyId', '==', companyId).get();
        if (company.empty) {
            return res.status(400).json({ message: 'No company found.' });
        }
        companyRef.doc(companyId).update(req.body).then(
            res.status(200).json({ message: 'edit success' })
        );
    } catch (err) {
        res.status(400).send(err.message)
    }
})



router.delete("/:companyId/delete", async (req, res) => {
    try {
        const companyId = req.params.companyId
        //check if company exists
        const company = await companyRef.where('companyId', '==', companyId).get();
        if (company.empty) {
            return res.status(400).json({ message: 'No company found.' });
        }
        companyRef.doc(companyId).delete().then(
            res.status(200).json({ message: 'delete success' })
        );
    } catch (err) {
        res.status(400).send(err.message)
    }
})

//gets all jobs postings posted by company
router.get("/:companyId/jobs", async (req, res) => {
    try {
        const companyId = req.params.companyId
        //check if company exists
        const company = await companyRef.where('companyId', '==', companyId).get();
        if (company.empty) {
            return res.status(400).json({ message: 'No company found.' });
        }
        const jobsSnapshot = await jobRef.where('companyId', '==', companyId).get();
        const jobsData = [];
        jobsSnapshot.forEach((doc) => {
            jobsData.push(doc.data());
        });
        res.status(200).json(jobsData);

    } catch (err) {
        res.status(400).send(err.message)
    }
})

//gets all applications for one job
router.get("/:companyId/jobs/:jobId/jobApplications", async (req, res) => {
    try {
        const companyId = req.params.companyId
        const jobId = req.params.jobId
        //check if company exists
        const company = await companyRef.where('companyId', '==', companyId).get();
        if (company.empty) {
            return res.status(400).json({ message: 'No company found.' });
        }
        //check if job exists
        const job = await jobRef.where('companyId', '==', companyId).where('jobId', '==', jobId).get();
        if (job.empty) {
            return res.status(400).json({ message: 'No job found.' });
        }
        const applications = await jobApplicationRef.where('jobId', '==', jobId).get();
        const jobApplicationData = [];
        applications.forEach((doc) => {
            jobApplicationData.push(doc.data());
        });
        res.status(200).json(jobApplicationData);

    } catch (err) {
        res.status(400).send(err.message)
    }
})


//gets all applications for all jobs

router.get("/:companyId/jobs/allJobApplications", async (req, res) => {
    try {
        const companyId = req.params.companyId
        //check if company exists
        const company = await companyRef.where('companyId', '==', companyId).get();
        if (company.empty) {
            return res.status(400).json({ message: 'No company found.' });
        }
        //get all jobs from company
        const jobsSnapshot = await jobRef.where('companyId', '==', companyId).get();
        const jobsData = [];
        const jobApplications = [];
        //get all jobs
        jobsSnapshot.forEach((doc) => {
            jobsData.push(doc.data().jobId);
        });
        //get all applications from jobs, forEach does not work well with async
        for (let i = 0; i < jobsData.length; i++) {
            var applicationSnapshot = await jobApplicationRef.where('jobId', '==', jobsData[i]).get();
            applicationSnapshot.forEach((doc) => {
                jobApplications.push(doc.data());
            })
        }
        res.status(200).json(jobApplications);
    } catch (err) {
        res.status(400).send(err.message)
    }
})

//gets all resumes for one job
router.get("/:companyId/jobs/:jobId/resumes", async (req, res) => {
    try {
        const companyId = req.params.companyId
        const jobId = req.params.jobId
        //check if company exists
        const company = await companyRef.where('companyId', '==', companyId).get();
        if (company.empty) {
            return res.status(400).json({ message: 'No company found.' });
        }
        //check if job exists
        const job = await jobRef.where('companyId', '==', companyId).where('jobId', '==', jobId).get();
        if (job.empty) {
            return res.status(400).json({ message: 'No job found.' });
        }
        //get all users from all applications
        const applications = await jobApplicationRef.where('jobId', '==', jobId).get();
        const userIds = [];
        const resumes = []
        applications.forEach((doc) => {
            userIds.push(doc.data().userId);
        });

        //get all resumes
        for (let i = 0; i < userIds.length; i++) {
            var userSnapshot = await resumeRef.where('userId', '==', userIds[i]).get();
            userSnapshot.forEach((doc) => {
                resumes.push(doc.data());
            })
        }
        res.status(200).json(resumes);
    } catch (err) {
        res.status(400).send(err.message)
    }
})

//gets all resumes for one job
router.get("/:companyId/jobs/:jobId/users", async (req, res) => {
    try {
        const companyId = req.params.companyId
        const jobId = req.params.jobId
        //check if company exists
        const company = await companyRef.where('companyId', '==', companyId).get();
        if (company.empty) {
            return res.status(400).json({ message: 'No company found.' });
        }
        //check if job exists
        const job = await jobRef.where('companyId', '==', companyId).where('jobId', '==', jobId).get();
        if (job.empty) {
            return res.status(400).json({ message: 'No job found.' });
        }
        //get all users from all applications
        const applications = await jobApplicationRef.where('jobId', '==', jobId).get();
        const userIds = [];
        const resumes = []
        applications.forEach((doc) => {
            userIds.push(doc.data().userId);
        });

        //get all resumes
        for (let i = 0; i < userIds.length; i++) {
            var userSnapshot = await userRef.where('userId', '==', userIds[i]).get();
            userSnapshot.forEach((doc) => {
                resumes.push(doc.data());
            })
        }
        res.status(200).json(resumes);
    } catch (err) {
        res.status(400).send(err.message)
    }
})




module.exports = router 