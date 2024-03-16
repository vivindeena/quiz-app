const router = require("express").Router();
const userController = require("../controllers/UserController");

router.route("/user")
    .get(userController.getUser)
    .post(userController.createUser)
    .update(userController.updateUser)
    .delete(userController.deleteUser)

module.exports = router