require('dotenv').config()
// const nodemailer = require("nodemailer");


// // const senderMail = "myemail@yahoo.com";

// // const emailTransporter = nodemailer.createTransport({
// //             host: 'smtp.mail.yahoo.com',
// //             port: 465,
// //             service:'yahoo',
// //             secure: false,
// //             auth: {
// //                user: senderMail,
// //                pass: 'mypassword'
// //             },
// //             debug: false,
// //             logger: true 
// // });

// var smtpConfig = {
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true, // use SSL
//     auth: {
//         user: process.env.GMAIL_EMAIL,
//         pass: process.env.GMAIL_PASSWORD,
//     },
//     debug: false,
//     logger: true 
// };
// var transporter = nodemailer.createTransport(smtpConfig);

// transporter.sendMail({
//     from: 'example@gmail.com',
//     to: 'ekwo.evans@yahoo.com',
//     subject: 'forget password',
//     text: 'this is a texting mail',
// }, (err, info) => {
//     if (err) {

//         console.log(err)
//     }
//     else {
//         console.log(info)
//     }
// });
console.log(process.env.PORT
    );