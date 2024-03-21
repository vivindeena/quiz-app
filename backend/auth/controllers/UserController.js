const format = require("pg-format");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const {emailVerification} = require("../middleware/sendEmail");

const { dbUserPool } = require("../db/db");

const createUser = async (req, res) => {
	const { email, password, name, address, phone } = req.body;
	if (!email || !password || !name || !address || !phone) {
		res.status(400).json({
			data: "Missing parameters",
		});
	}
	try {
		const client = await dbUserPool.connect();
		await client.query("BEGIN");

		const checkEmailQuery = format(
			"SELECT * FROM users WHERE email = %L",
			email
		);

		const result = await client.query(checkEmailQuery);
		if (result.rows.length > 0) {
			client.release();
			return res.status(409).json({
				message: "Email already exists",
			});
		} else {
			const salt = bcrypt.genSaltSync(10);
			const passwordHash = bcrypt.hashSync(req.body.password, salt);

			const userCreationQuery = format(
				"INSERT INTO users (email, password, name, address, phone) VALUES (%L, %L, %L, %L, %L) RETURNING *",
				email,
				passwordHash,
				name,
				address,
				phone,
			);

			const result = await client.query(userCreationQuery);
			const unique_id = uuidv4() +'-'+ result.rows[0].user_id;
			const userMailVerificationQuery = format(
				"INSERT INTO usersVerification (user_id, unique_id, verifiyType) VALUES (%L, %L, %L) RETURNING *",
				result.rows[0].user_id,
				unique_id,
				"email"
			);
			await client.query(userMailVerificationQuery);
			await client.query("COMMIT");
			client.release();
			await emailVerification(email, name, unique_id);
			return res.status(200).json({
				message: "User added successfully, verify email to login",
			});
		}
	} catch (error) {
		console.log("Error: ", error);
		return res.status(500).json({
			message: "Error Adding User",
			error: error,
		});
	}
};

const verifyEmail = async(req, res) => {
	const {unique_id} = req.params;
	if(!unique_id){
		res.status(400).json({
			message: "Missing parameters",
		});
	}
	try {
		const client = await dbUserPool.connect();
		await client.query("BEGIN");

		const checkEmailQuery = format(
			"SELECT * FROM usersVerification WHERE unique_id = %L",
			unique_id
		);

		const result = await client.query(checkEmailQuery);
		if (result.rows.length > 0) {
			const verificationUpdatingQuery = format(
				"UPDATE users SET email_verified = true WHERE user_id = %L",
				result.rows[0].user_id
			);
			await client.query(verificationUpdatingQuery);

			const deleteVerificationQuery = format("DELETE FROM usersVerification WHERE unique_id = %L", unique_id);
			
			await client.query(deleteVerificationQuery);
			await client.query("COMMIT");
			client.release();
			return res.status(200).json({
				message: "Email verified successfully",
			});
		} else {
			client.release();
			return res.status(409).json({
				message: "Email verification failed",
			});
		}
	} catch (error) {
		console.log("Error: ", error);
		return res.status(500).json({
			message: "Error Verifying Email",
			error: error,
		});
	}
};

const verifyPhone = (req, res) => {

};

const updateUser = async (req, res) => {
	
};


const deleteUser = (req, res) => {

};

const getUser = (req, res) => {

};

const login = (req, res) => {

};


const changePassword = (req, res) => {
}

module.exports = {
	createUser,
	updateUser,
	deleteUser,
	getUser,
	login,
	verifyEmail,
	verifyPhone,
	changePassword
};
