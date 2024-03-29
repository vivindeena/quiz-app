require("dotenv").config({ path: "../../.env" }); //remove from prod
const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const user = require("./routes/user");

app.use("/user", user);

app.get("/", (req, res) => {
	res.status(200).json({
		data: "Namaste! Welcome to Auth Microservice",
	});
});

app.listen(process.env.AUTH_PORT, () => {
	console.log(`Listening on port ${process.env.AUTH_PORT}`);
});
