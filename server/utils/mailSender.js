const nodemailer = require("nodemailer")
require("dotenv").config();



const mailSenderConnect = async(email, subject, body) => {
    try{
        let transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
            }
        })
        let info = await transporter.sendMail({
            from:"Verification Mail From Study Notion",
            to:`${email}`,
            subject:`${subject}`,
            html:`${body}`
        })
        return info;
    }
    catch(err){
        console.log("Something went wrong while Connecting Nodemailer");
        console.log(err.message);
    }
}

module.exports = mailSenderConnect;