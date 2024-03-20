const format = require("pg-format");
const bcrypt = require("bcryptjs");

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

			const insertQuery = format(
				"INSERT INTO users (email, password, name, address, phone) VALUES (%L, %L, %L, %L, %L) RETURNING *",
				email,
				passwordHash,
				name,
				address,
				phone,
			);

			await client.query(insertQuery);
			await client.query("COMMIT");
			
			client.release();

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
const updateUser = async (req, res) => {
	
};
const deleteUser = (req, res) => {

};
const getUser = (req, res) => {

};
const login = (req, res) => {

};
const verifyPhone = (req, res) => {

};

module.exports = {
	createUser,
	updateUser,
	deleteUser,
	getUser,
	login,
	verifyEmail,
	verifyPhone,
};
