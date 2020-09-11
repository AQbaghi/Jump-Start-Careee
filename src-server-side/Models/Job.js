const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema(
  {
    secretKeyToFindJob: {
      type: String,
      required: true,
    },
    jobTitle: {
      required: true,
      type: String,
    },
    jobDescription: {
      required: true,
      type: String,
    },
    requiredSkills: [
      {
        required: true,
        type: String,
      },
    ],
    responsabilities: [
      {
        required: true,
        type: String,
      },
    ],
    advantages: [
      {
        type: String,
      },
    ],
    salary: {
      type: String,
      required: true,
    },
    JobOwner: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
    keyWords: [
      {
        required: true,
        type: String,
      },
    ],
    companyName: {
      type: String,
      required: true,
    },
    companyAvatar: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model('Job', JobSchema);

module.exports = Job;
