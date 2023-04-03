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
        //console.log(req.body)
        const user_id = req.body.user_id
        const result = await UsersRef.doc(user_id).get();
        res.json(result.data())

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
