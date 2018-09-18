const router=require('express').Router();
const nodemailer = require('nodemailer');

router.post('/send',(req,res)=>{
    console.log("mail ")
    const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
      <li>To: ${req.body.to}</li>
      <li>Name: ${req.body.subject}</li>
      <li>Product Message: ${req.body.message}</li>
      <li>phone number: ${req.body.phone_no}</li>
    </ul>
  `;

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'stock.management2018@gmail.com', // generated ethereal user
            pass: '$tockmanagement2018' // generated ethereal password
        },
           tls: {
               rejectUnauthorized: false
           }
       });

    let mailOptions = {
        from: '"Order Product request" <stock.management2018@gmail.com>', // sender address
        to: req.body.to, // list of receivers
        subject: 'Out of stock prodct message', // Subject line
        text: 'hello', // plain text body
        html: output // html body
    };


    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.status(200).json({
            message:"Email send."
        })
    });
});

module.exports=router;