const express = require('express');
const Company = require('../Models/Company.js');
const Job = require('../Models/Job.js');
const auth = require('../middleware/auth.js');
const router = express.Router();

//all about the Jobs

// create a job posting
router.post('/api/job/post', auth, async (req, res) => {
  try {
    const company = await Company.findOne({
      owner: req.user._id,
    });

    const job = new Job({
      ...req.body,
      address: company.address,
      lat: company.lat,
      lng: company.lng,
      JobOwner: company._id,
      companyName: company.companyName,
      companyAvatar: company.avatar,
    });

    await job.save();
    console.log(job);
    res.status(201).send(job);
  } catch (err) {
    res.status(500).send(err);
  }
});

//view job
router.get('/api/job/info/:_id', async (req, res) => {
  try {
    const _id = req.params._id;
    const job = await Job.findById(_id);
    const companyInfo = await Company.findOne({ _id: job.JobOwner });
    res.send({ job, companyInfo });
  } catch (err) {
    res.status(400).send(err);
  }
});

//view all jobs --must include search and pagination
router.get('/api/job/all-job', async (req, res) => {
  //qury link example
  // /api/job/all-job?limit=10&skip=0?catagory=WebDev
  let sortValue = -1;

  console.log(req.query);
  //finding any related data corisponding to search criteria via $or mongodb and $regex mongodb
  jobTitlesSearchCriteriaObject = {
    $or: [
      { jobTitle: { $regex: req.query.jobTitle, $options: 'i' } },
      { catagory: { $regex: req.query.jobTitle, $options: 'i' } },
      { keyWords: { $regex: req.query.jobTitle, $options: 'i' } },
      { companyName: { $regex: req.query.jobTitle, $options: 'i' } },
    ],
  };

  let bigLat = Number(req.query.lat) + 0.23;
  let smallLat = Number(req.query.lat) - 0.23;
  let bigLng = Number(req.query.lng) + 0.23;
  let smallLng = Number(req.query.lng) - 0.23;

  jobAdressSearchCriteriaObject = {
    $and: [
      { lat: { $gte: smallLat } },
      { lat: { $lte: bigLat } },
      { lng: { $gte: smallLng } },
      { lng: { $lte: bigLng } },
    ],
  };

  try {
    const job = await Job.find({
      $and: [jobTitlesSearchCriteriaObject, jobAdressSearchCriteriaObject],
    })
      .limit(parseInt(req.query.limit))
      .skip(parseInt(req.query.skip))
      .sort({ createdAt: sortValue });
    res.send(job);
  } catch (err) {
    res.status(400).send(err);
  }
});

//view all my company job posts
router.post('/api/job/my-jobs', auth, async (req, res) => {
  console.log(req.body._id);
  try {
    const job = await Job.find({ JobOwner: req.body._id });
    res.send(job);
  } catch (err) {
    res.status(400).send(err);
  }
});

//delete job post
router.delete('/api/job/delete/:_id', async (req, res) => {
  try {
    const _id = req.params._id;
    await Job.findByIdAndDelete(_id);

    res.send({ success: 'Job Post Successfully deleted!' });
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
