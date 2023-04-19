const express = require('express');
const router = express.Router();
const { db } = require('../util/admin');

const UsersRef = db.collection('Users');
const JobRef = db.collection('Job');
const AdminRef = db.collection('Admins');

router.use(express.json())

router.use((req, res, next) => {
  const d = new Date();
  let text = d.toJSON();
  console.log('Time: ', text)
  next()
})

router.get('/snapshot', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalUsers = await UsersRef.get().then((snapshot) => snapshot.size);

    const totalJobs = await JobRef.get().then((snapshot) => snapshot.size);

    const newUsersToday = await UsersRef.where('created_at', '>=', today).get().then((snapshot) => snapshot.size);

    const newJobsToday = await JobRef.where('created_at', '>=', today).get().then((snapshot) => snapshot.size);

    const totalCompanies = await AdminRef.get().then((snapshot) => snapshot.size);

    res.status(200).json({
      total_users: totalUsers,
      total_jobs: totalJobs,
      new_users_today: newUsersToday,
      job_posts_today: newJobsToday,
      companies: totalCompanies,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.get('/users', async (req, res) => {
  try {
    const userNames = [];
    const adminNames = [];

    const usersSnapshot = await UsersRef.get();
    usersSnapshot.forEach((doc) => {
      userNames.push(doc.data().name);
    });

    const adminsSnapshot = await AdminRef.get();
    adminsSnapshot.forEach((doc) => {
      adminNames.push(doc.data().name);
    });

    res.status(200).json({
      userNames: userNames,
      adminNames: adminNames,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
