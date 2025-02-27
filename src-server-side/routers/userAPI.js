const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../Models/User.js');
const Company = require('../Models/Company.js');
const Job = require('../Models/Job.js');
const TempUser = require('../Models/TempUser.js');
const auth = require('../middleware/auth.js');
const {
  sendVerificationCodeToUser,
  sendCVToCompanyEmail,
  genirateCode,
} = require('../emails/accountEmails.js');
const router = express.Router();

//all about the users

// veryfy email route
router.post('/api/users/verifyemail', async (req, res) => {
  const code = genirateCode();
  tempUser = {};
  try {
    //check if user already exixst before creation
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      throw new Error({ error: 'user with email adress already exists' });
    }

    //check if temperary user already exists to set only one verification code and make only one valid
    tempUser = await TempUser.findOne({ email: req.body.email });
    if (tempUser) {
      tempUser.verificationCode = code;
      //semd the email with code
      await sendVerificationCodeToUser(
        req.body.email,
        req.body.firstName,
        req.body.lastName,
        code
      );
    } else {
      //if no verification code was sent, create a temparery user with the code
      tempUser = new TempUser({
        email: req.body.email,
        verificationCode: code,
        verified: false,
      });
      //semd the email with code
      await sendVerificationCodeToUser(
        req.body.email,
        req.body.firstName,
        req.body.lastName,
        code
      );
    }

    await tempUser.save();
    res.status(201).send({
      verifyEmail:
        'please verify the email you provided by the passcode sent to your email',
      success: true,
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

//read temp user

router.delete('/api/users/verifyemail/check', async (req, res) => {
  try {
    const tempUser = await TempUser.findOne({
      email: req.body.email,
      verificationCode: req.body.verificationCode,
    });
    const prevTempUser = tempUser;
    await tempUser.delete();
    res.status(201).send(prevTempUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

// create users
router.post('/api/users/signup', async (req, res) => {
  const user = new User(req.body);
  try {
    const token = await user.genirateAuthToken();
    await user.save();
    res.status(201).send({ user, token });
  } catch (err) {
    res.status(400).send(err);
  }
});

//login
router.post('/api/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.genirateAuthToken();
    await user.save();
    res.send({ user, token });
  } catch (err) {
    res.status(400).send({ error: 'invalid email or password.' });
  }
});

//delete user
router.delete('/api/users/deactivate', auth, async (req, res) => {
  try {
    await req.user.delete();
    res.send({
      message: 'user has been succesfully deleted.',
      userInfo: req.user,
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

//read profile
router.get('/api/user/me', auth, (req, res) => {
  try {
    res.send(req.user);
  } catch {
    res.status(400).send(err);
  }
});

//update user info
router.patch('/api/users/update', auth, async (req, res) => {
  const change = req.body;

  // validation to updates
  const allowedUpdates = ['firstName', 'lastName', 'email', 'password'];
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res
      .status(400)
      .send({ error: 'you can only update a valid user entery' });
  }
  try {
    updates.forEach((update) => (req.user[update] = change[update]));
    await req.user.save();
    res.send(req.user);
  } catch (err) {
    res.status(500).send(err);
  }
});

//logout user
router.post('/api/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      if (token.token !== req.token) {
        return token;
      }
    });
    await req.user.save();
    res.send();
  } catch (err) {
    res.status(500).send();
  }
});

//logout all users
router.post('/api/users/logoutall', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (err) {
    res.status(500).send();
  }
});

//delete route later______________________________________________
router.get('/api/users/show-all', (req, res) => {
  try {
    User.find({}).then((user) => {
      res.status(200).send(user);
    });
  } catch {
    res.status(400).send(err);
  }
});

//avatar routes

//avatar profile picture upload
const avatar = multer({
  limits: {
    fileSize: 10000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
      return cb(new Error('file must be an image'));
    }
    cb(undefined, true);
  },
});
router.post(
  '/api/users/me/avatar/:_id',
  avatar.single('avatar'),
  async (req, res) => {
    const user = await User.findById(req.params._id);
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    user.avatar = buffer;
    await user.save();
    res.status(201).send({
      success: 'avatar picture was successfully uploaded',
      avatar: user.avatar,
    });
  },
  (err, req, res, next) => {
    res.status(400).send({ error: err.message });
  }
);

//avatar profile picture delete
router.delete('/api/users/me/avatar', auth, async (req, res) => {
  try {
    if (!req.user.avatar) {
      res
        .status(400)
        .send({ error: 'can not delete non existing avatar picture' });
    }
    req.user.avatar = undefined;
    await req.user.save();
    res.send({ success: 'avatar picture was successfully deleted' });
  } catch (err) {
    res.status(500).send({ error: 'can not delete avatar profile picture' });
  }
});

//serving up an image
router.get('/api/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error('can not get picture');
    }
    res.set('Content-Type', 'image/jpg');
    res.send(user.avatar);
  } catch (err) {
    res.send({ error: err.message });
  }
});

//store applied job info in database
router.post('/api/job/apply', async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body._id });
    const jobAppliedTo = await Job.findOne({ _id: req.body.jobID });
    const company = await Company.findOne({ _id: jobAppliedTo.JobOwner });
    const userOfJobPost = await User.findOne({ _id: company.owner });

    //adding the applied job info into the User model in databae
    user.jobsAppliedTo.push({
      email: userOfJobPost.email,
      applicantEmail: user.email,
      jobId: jobAppliedTo._id,
      jobTitle: jobAppliedTo.jobTitle,
      salary: jobAppliedTo.salary,
      location: jobAppliedTo.location,
      jobOwner: jobAppliedTo.JobOwner,
    });

    await user.save();
    res
      .status(201)
      .send({ success: 'Your Application was Succesfully Sent', ...user });
  } catch (err) {
    res.send(err);
  }
});
// cv picture upload
const cv = multer({
  limits: {
    fileSize: 100000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(pdf|doc|docx)$/)) {
      return cb(new Error('file must be an document'));
    }
    cb(undefined, true);
  },
});
// apply to job
router.post(
  '/api/job/apply/:fromUserId/:toUserId',
  cv.single('inpFile'),
  async (req, res) => {
    try {
      const fromEmail = await User.findOne({
        _id: req.params.fromUserId,
      });

      const jobAppliedTo = await Job.findOne({
        _id: req.params.toUserId,
      });
      const company = await Company.findOne({ _id: jobAppliedTo.JobOwner });
      const toUser = await User.findOne({ _id: company.owner });

      await sendCVToCompanyEmail(
        fromEmail.email,
        toUser.email,
        fromEmail.firstName,
        fromEmail.lastName,
        jobAppliedTo.jobTitle,
        jobAppliedTo._id,
        req.file
      );

      await fromEmail.save();
      res.status(201).send({ success: 'your cv was sent successfully' });
    } catch (err) {
      res.status(500).send(err);
    }
  }
);

module.exports = router;
