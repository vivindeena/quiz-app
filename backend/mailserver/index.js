const amqp = require('amqplib');
const nodemailer = require('nodemailer');


const sendEmail = async (email_id, subject, emailBody) => {
	let transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.GMAIL_ID,
			pass: process.env.GMAIL_PASSWORD,
		},
	});

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
};


async function reciveMessages() {
	const connection = await amqp.connect("amqp://localhost");
	const channel = await connection.createChannel();

	const queueName = "myQueue";
	const options = { durable: true };

	await channel.assertQueue(queueName, options);

    channel.consume(queueName, (msg) => {
		if (msg !== null) {
			console.log("Recieved:", msg.content.toString());
            const message = JSON.parse(msg.content.toString());
            const emailSent = sendEmail(message.email_id, message.subject, message.emailBody);
			if(emailSent){
				channel.ack(msg);
			}
		} else {
			console.log("Consumer cancelled by server");
		}
	});

	await channel.close();
	await connection.close();
}

reciveMessages();
