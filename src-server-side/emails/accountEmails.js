const sgMail = require('@sendgrid/mail');
const fs = require('fs');

const sendgridAPIKey = process.env.SENDGRID_API_KEY;

const genirateCode = () => {
  const verificationCode = `${Math.floor(Math.random() * 10)}${Math.floor(
    Math.random() * 10
  )}${Math.floor(Math.random() * 10)}${Math.floor(
    Math.random() * 10
  )}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`;

  return verificationCode;
};

const sendVerificationCodeToUser = (email, firstName, lastName, code) => {
  sgMail.setApiKey(sendgridAPIKey);

  sgMail
    .send({
      to: email,
      from: 'aqbaghi@atomiccode.uk',
      subject: 'Verification Code',
      text: `Hello ${firstName} ${lastName}, Your Verification code is: ${code}`,
    })
    .then(() => {
      console.log('Message sent');
    })
    .catch((error) => {
      console.log(error.response.body);
      // console.log(error.response.body.errors[0].message);
    });
};

const sendCVToCompanyEmail = (
  applicantEmail,
  jobPostOwnerEmail,
  applicantFirstName,
  applicantLastName,
  jobTitle,
  jobId,
  applicantCV
) => {
  sgMail.setApiKey(sendgridAPIKey);

  sgMail
    .send({
      to: jobPostOwnerEmail,
      from: 'aqbaghi@atomiccode.uk',
      subject: 'You Have a new Applicant',
      html: `<h2> ${applicantFirstName} ${applicantLastName} is interested in the Position you have posted on Jump Start Career, and would like you to review their cv.</h2>
      <h3> Applicants Email: ${applicantEmail}</h3>
      <h3> Title of Position Applied To: ${jobTitle}</h3>
      <a href="${process.env.FRONT_END_URL}/jobs/${jobId}">Job Post link on Jumo Start Career</a>`,
      attachments: [
        {
          filename: 'cv',
          content: applicantCV.buffer.toString('base64'),
          type: 'application/pdf',
          disposition: 'attachment',
        },
      ],
    })
    .then(() => {
      console.log('Message sent');
    })
    .catch((error) => {
      console.log('cv was not sent');
      // console.log(error.response.body.errors[0].message);
    });
};

module.exports = {
  sendVerificationCodeToUser,
  sendCVToCompanyEmail,
  genirateCode,
};
