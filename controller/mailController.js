const express=require('express');
const router=express.Router();
const sendmail = require('sendmail')("sabin21","sendgrid21");
var fs = require('fs');

//  sendmail = require('sendmail')({
//     logger: {
//       debug: console.log,
//       info: console.info,
//       warn: console.warn,
//       error: console.error
//     },
//     silent: false,
//     dkim: { // Default: False
//       keySelector: 'mydomainkey'
//     },
//     devPort: 1025, // Default: False
//     devHost: 'localhost', // Default: localhost
//     smtpPort: 2525, // Default: 25
//     smtpHost: 'localhost' // Default: -1 - extra smtp host after resolveMX
//   })


router.get("/",(req,res)=>{
    sendmail({
        from: 'sabin@noveltytechnology.com',
        to: 'sabinshrestha292@gmail.com',
        subject: 'test sendmail',
        html: 'Mail of test sendmail ',
      }, function(err, reply) {
        console.log(err && err.stack);
        console.dir(reply);
    });
});

module.exports=router;