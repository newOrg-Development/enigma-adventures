const express = require("express");
const router = express.Router();

/* GET users listing. */
router.post("/", function (req, res, next) {
  console.log("email route" + req.body.teamName);

  // main(req.body).catch(console.error);
});

("use strict");
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function main(userInputs) {
  let emailText =
    "Your team name is " +
    userInputs.teamName +
    " and your team email is " +
    userInputs.teamEmail +
    " and your team password is " +
    userInputs.teamPassword +
    " and the scanner data  is " +
    userInputs.qrCodeData;
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  //Ben Pfeffer
  let transporter = nodemailer.createTransport({
    service: "hotmail",
    // port: 465,
    // secure: true, // true for 465, false for other ports
    // logger: true,
    // debug: true,
    // secureConnection: false,
    auth: {
      user: "forsy4444@msn.com", // generated ethereal user
      pass: "3A69COz2nPI0", // generated ethereal password
    },
    tls: {
      rejectUnAuthorized: true,
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: "forsy4444@msn.com", // sender address
    to: userInputs.teamEmail, // list of receivers
    subject: "New Escape Room Submit", // Subject line
    text: emailText, // plain text body
    //html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports = router;
