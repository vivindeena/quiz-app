const router = require("express").Router();
const userController = require("../controllers/UserController");

router
	.route("")
	.post(userController.createUser)
	.patch(userController.updateUser)
	.delete(userController.deleteUser);

router.route("/:id").get(userController.getUser);

router.route("/verifyEmail").post(userController.verifyEmail);

router.route("/verifyPhone").post(userController.verifyEmail);

router.route("/password").patch(userController.changePassword);

module.exports = router;
