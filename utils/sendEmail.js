import sendGridMail from '@sendgrid/mail'
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);


export const sendEmail = (mailOptions) => {
    return new Promise((resolve, reject) => {
        sendGridMail.send(mailOptions, (error, result) => {
            if (error) return reject(error);
            return resolve(result);
        });
    });
}