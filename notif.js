const notifRoute = require("express").Router();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    port: 465,               // true for 465, false for other ports
    host: "smtp.gmail.com",
       auth: {
            user: 'noreply-cd-org@gmail.com',
            pass: 'password',
         },
    secure: true,
    });

notifRoute.post('/', function(req, res) {
    const { from, to, subject, msg } = req;

    const mailData = {
        from,  // sender address
          to,   // list of receivers
          subject: subject,
          text: msg
        };

    transporter.sendMail(mailData, function (err, info) {
        if(err)
            console.error(err)
        else
            console.log(info);
        });
});

module.exports = notifRoute;