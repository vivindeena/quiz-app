const amqp = require("amqplib");
const nodemailer = require("nodemailer");
require("dotenv").config({ path: "../../.env" }); //remove from prod

const sendEmail = async (email_id, subject, emailBody) => {
	let transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.GMAIL_ID,
			pass: process.env.GMAIL_PASSWORD,
		}
	});

	let message = {
		from: process.env.GMAIL_ID,
		to: email_id,
		subject: `${subject} - Quiz App `,
		html: emailBody,
	};
	try {
		await transporter.sendMail(message);
		console.log("Email sent successfully");
		return true;
	} catch (error) {
		console.error("Error sending email:", error);
		return false;
	}
};

async function receiveMessages() {
	try {
		const connection = await amqp.connect("amqp://localhost");
		const channel = await connection.createChannel();

		const queueName = "mails";
		const options = { durable: true };

		await channel.assertQueue(queueName, options);

		channel.consume(queueName, async (msg) => {
			try {
				if (msg !== null) {
					console.log("Received:", msg);
					const message = JSON.parse(msg.content.toString());
					const emailSent = await sendEmail(
						message.email_id,
						message.subject,
						message.emailBody
					);
					if (emailSent) {
						channel.ack(msg);
					}
				} else {
					console.log("Consumer cancelled by server");
				}
			} catch (error) {
				console.error("Error processing message:", error);
			}
		});
	} catch (error) {
		console.error("Error establishing connection or channel:", error);
	}
}

receiveMessages();
