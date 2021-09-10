

"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function sendOTP(email, otp) {

        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            host:  process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: `"SecureIt" <${process.env.MAIL_USER}>`, // sender address
            to: `${email}`, // list of receivers
            subject: "no-reply", // Subject line
            html: `<h4> your OTP is ${otp} </h4> <div style="color: yellow"> note: this OTP is only valid for 2 hours </div>`, // html body
        });

        // console.log("Message sent: %s", info.messageId);
                  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

                  // Preview only available when sending through an Ethereal account
        // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  

}


module.exports = sendOTP;