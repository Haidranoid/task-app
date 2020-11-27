require('../config/index')
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const msg = {
    to: 'haidranoid16@gmail.com', // Change to your recipient
    from: 'martinezlara_joseeduardo@hotmail.com', // Change to your verified sender
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    //html: '<strong>k patza mario</strong>',
}
sgMail.send(msg).then(() => {
    console.log('Email sent')
}).catch((error) => {
    console.error(error)
})
