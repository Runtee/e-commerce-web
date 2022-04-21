require('dotenv').config()
const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text,req,res) => {
    try {
        var smtpConfig = {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // use SSL
            auth: {
                user: process.env.GMAIL_EMAIL,
                pass: process.env.GMAIL_PASSWORD,
            },
            debug: false,
            logger: true 
        };
        var transporter = nodemailer.createTransport(smtpConfig);

        await transporter.sendMail({
            from: 'passwordreset@demo.com',
            to: email,
            subject: subject,
            text: text,
        },(err,succ)=>{
            if (err){
                res.send('something went wrong');
                throw err
            }
            else{

                req.flash('success','email sent sucessfully')
                res.redirect('/auth/forgot-password')
            }
            
        });
        req.flash('success','email sent sucessfully')
        res.redirect('/auth/forgot-password');
    } catch (error) {
        res.send('something went wrong');
    }
};

module.exports = sendEmail;
