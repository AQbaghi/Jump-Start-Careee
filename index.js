require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('./src-server-side/DB/mongooseDB.js');
const userRouter = require('./src-server-side/routers/userAPI.js');
const companyRouter = require('./src-server-side/routers/companyAPI.js');
const jobRouter = require('./src-server-side/routers/jobAPI.js');

//setting up express
const app = express();

//body parsing express
app.use(bodyParser.json());
app.use(express.json());

//express route
app.use(userRouter);
app.use(companyRouter);
app.use(jobRouter);

//serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  //set static assets
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;
//listening to server port
app.listen(port, () => {
  console.log(`Server up and running on port ${port}`);
});
