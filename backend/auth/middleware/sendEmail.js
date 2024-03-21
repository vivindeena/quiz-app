const Mailgen = require('mailgen');
const amqp = require('amqplib');

const sendEmail = async(email_id,name,endpoint,subject,intro,instructions,text) => {
    let mailGenerator = new Mailgen({
		theme: "default",
		product: {
			name: "Quiz App",
			link: `${process.env.BASE_URL}`,
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
					link: `${process.env.BASE_URL}:4001/${endpoint}`,
				},
			},
			outro: "The link <b>expires in 1 hour</b><br>Need help, or have questions? Just reply to this email, we'd love to help.",
		},
	};

	let emailBody = mailGenerator.generate(emailContent);

	const connection = await amqp.connect("amqp://localhost");
	const channel = await connection.createChannel();

	const queueName = "mails";
	const options = { durable: true };

	await channel.assertQueue(queueName, options);
	await channel.sendToQueue(queueName, Buffer.from(JSON.stringify({ email_id, subject, emailBody })));
}

const emailVerification = async (email,name,uniqueId) => {

    const endpoint = "auth/verifyEmail/?token=" + uniqueId;
    const subject = "Verify Email";
    const intro = 'Welcome to Quiz App! We\'re very excited to have you on board.';
    const instructions = 'To verify your email, and get started with Quiz App';
    const text = 'Confirm your email';
    
    await sendEmail(email, name, endpoint, subject, intro, instructions, text);    
}

module.exports = {
    emailVerification
};