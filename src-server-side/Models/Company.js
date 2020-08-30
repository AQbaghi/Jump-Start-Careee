const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema(
  {
    companyName: {
      required: true,
      unique: true,
      type: String,
    },
    description: {
      required: true,
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
    lat: {
      type: String,
      required: true,
    },
    lng: {
      type: String,
      required: true,
    },
    owner: {
      type: String,
      required: true,
    },
    avatar: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

const Company = mongoose.model('Company', JobSchema);

module.exports = Company;
