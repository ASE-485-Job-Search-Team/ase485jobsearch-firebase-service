const express = require('express')
const router = express.Router()

const multer = require("multer")
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file');

const {bucket, db} = require("../util/admin");

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
router.post("/",async (req,res)=>{
    try{
      
        const data = req.body;
        //post a new job
        const job = await jobRef.doc().set(data).then(
            //add job to jobs list for admin
            
            async ()=>{
                //find admin
                var admin = await (await adminRef.doc(data.admin_id).get()).data();
                admin.jobs.push(job_id);
                //update admin
                await (await adminRef.doc(data.admin_id).get()).data().then(res.status(200).json({'post':'success'}));

                }
            )

    }catch(err){
        res.status(400).send(err.message)
    }
})

router.get("/",async (req,res)=>{
    
    try{
        //console.log(req.body)
        const job_id = req.body.job_id
        const result = await jobRef.doc(job_id).get()
        res.json(result)
    }catch(err){
        res.status(400).send(err.message)
    }
})

router.put("/",async (req,res)=>{
    
    try{
        const job_id = req.body.job_id
        jobRef.doc(job_id).update(req.body).then(
            res.status(200).json({'put':'success'})
        );
    }catch(err){
        res.status(400).send(err.message)
    }
})

router.delete("/",async (req,res)=>{
    try{
        const job_id = req.body.job_id
        jobRef.doc(job_id).delete().then(
            res.status(200).json({'post':'success'})
        );
    }catch(err){
        res.status(400).send(err.message)
    }
})

//API routes for feed

//returns JSON array of job postings, {offset: int, limit: int}//to be implemented


//returns 50 job posts
router.get("/feed",async (req,res)=>{
    try{
        const start = req.body.start;
        const end = req.body.end;
        
        const result = await jobRef.limit(50)
        res.json(result.data())
    }catch(err){
        res.status(400).send(err.message)
    }
})


//submitting a job application

//req.body {resume_id: String,job_id : String} sends resume with resume_id to job at job_id
router.post('/submit', async (req,res)=>{
    try{
      
        const resume_id = req.body.resume_id
        const job_id = req.body.job_id
        //add resume_id to list of application
        var job =  await (await jobRef.doc(job_id).get()).data
        job.application.push(resume_id)
        await jobRef.doc(job_id).update(job).then(
            async ()=>{
                //add job_id to users list of application
                var resume = await (await resumeRef.doc(resume_id).get()).data()
                var user = await (await userRef.doc(resume.user_id).get()).data()
                user.application.push(job_id)
                userRef.doc(resume.user_id).update(user).then(
                    res.status(200).json({'put':'success'})
                );
            }
        );

    }catch(err){
        res.status(400).send(err.message)
    }
})


module.exports = router 