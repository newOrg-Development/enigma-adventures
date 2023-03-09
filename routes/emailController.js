const nodemailer = require("nodemailer");

async function sendEmail(userInputs) {
  console.log("userInputs: ", userInputs);
  let magicLink = "";
  if (userInputs.env == "production") {
    magicLink =
      "https://enigma-adventures.herokuapp.com/magicLink?uuid=" +
      userInputs.uuid;
  } else {
    magicLink = "https://localhost:3000/magicLink?uuid=" + userInputs.uuid;
  }

  let emailText =
    "Your team name is " +
    userInputs.teamName +
    " and your magicLink is " +
    magicLink;

  let transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: "forsy4444@msn.com", // generated ethereal user
      pass: "3A69COz2nPI0", // generated ethereal password
    },
    tls: {
      rejectUnAuthorized: true,
    },
  });
  let info = await transporter.sendMail({
    from: "forsy4444@msn.com", // sender address
    to: userInputs.teamEmail, // list of receivers
    subject: "New Escape Room Submit", // Subject line
    text: emailText, // plain text body
  });
}

module.exports = { sendEmail };
