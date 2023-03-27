const express = require('express')
const router = express.Router()

const multer = require("multer")
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file');

const { bucket, db } = require("../util/admin");


const AdminRef = db.collection('Admins');

router.use(express.json())

router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
})

//CRUD operations for admin profile
router.post("/", async (req, res) => {
    try {
        //console.log(req.body)
        const data = req.body;
        if (data.hasOwnProperty("admin_id")) {
            const admin = await AdminRef.doc(data.admin_id).set(data).then(
                res.status(200).json({ 'post': 'success' })
            );
        } else {
            const admin = await AdminRef.doc().set(data).then(
                res.status(200).json({ 'post': 'success' })
            );
        }


    } catch (err) {
        res.status(400).send(err.message)
    }
})

router.get("/", async (req, res) => {

    try {
        //console.log(req.body)
        const admin_id = req.body.admin_id
        const result = await AdminRef.doc(admin_id).get()
        res.status(200).json(result.data())
    } catch (err) {
        res.status(400).send(err.message)
    }
})

router.put("/", async (req, res) => {

    try {
        const admin_id = req.body.admin_id
        AdminRef.doc(admin_id).update(req.body).then(
            res.status(200).json({ 'put': 'success' })
        );
    } catch (err) {
        res.status(400).send(err.message)
    }
})

router.delete("/", async (req, res) => {
    try {
        const admin_id = req.body.admin_id
        AdminRef.doc(admin_id).delete().then(
            res.status(200).json({ 'post': 'success' })
        );
    } catch (err) {
        res.status(400).send(err.message)
    }
})


module.exports = router 