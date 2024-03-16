require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

const admin = require("./routes/admin")
const user = require("./routes/user")

app.use("/admin",admin);
app.use("/user", user);

app.get('/', (req, res) => {
    res.status(200).json({
      data: 'Namaste! Welcome to Auth Microservice'
    })
  })
  
  app.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })
