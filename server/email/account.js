require('../config/config')
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const msg = {
    to: 'martinezlara_joseeduardo@hotmail.com', // Change to your recipient
    from: 'j.martinez@admdelcentro.com', // Change to your verified sender
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    //html: '<strong>k patza mario</strong>',
}
sgMail.send(msg).then(() => {
    console.log('Email sent')
}).catch((error) => {
    console.error(error)
})
