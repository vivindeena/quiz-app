const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');

const sendEmail = async(email_id,name,endpoint,subject,intro,instructions,text) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_ID,
            pass: process.env.GMAIL_PASSWORD
        }
    });
    let mailGenerator = new Mailgen({
		theme: "default",
		product: {
			name: "Quiz App",
			link: "",
		},
	});
    let emailContent = {
		body: {
			name: name,
			intro: intro,
			action: {
				instructions: `${instructions}, please click here:`,
				button: {
					color: "#22BC66", 
					text: text,
					link: `${process.env.BASE_URL}/${endpoint}`,
				},
			},
			outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
		},
	};

	let emailBody = mailGenerator.generate(emailContent);

    let message = {
        from: process.env.GMAIL_ID,
        to: email_id,
        subject: `${subject} - Quiz App `,
        html: emailBody,
    };
    try {
        await transporter.sendMail(message);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

const emailVerification = async(req, res, next) => {
    const { email, name } = req.body;
    const endpoint = "auth/verifyEmail/?token=" + uniqueId;
    const subject = "Verify Email";
    const intro = 'Welcome to Quiz App! We\'re very excited to have you on board.';
    const instructions = 'To verify your email, and get started with Quiz App, please click here:';
    const text = 'Confirm your email';
    
    let emailSent = await sendEmail(email, name, endpoint, subject, intro, instructions, text);
    if (emailSent) {
        res.status(200).json({
            message: "Email sent successfully",
        });
    } else {
        res.status(500).json({
            message: "Email could not be sent",
        });
    }
    
}

module.exports = {
    emailVerification
};