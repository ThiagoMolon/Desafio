const express = require("express");
const {
	createUserController,
	loginController,
	requestPasswordResetController,
	resetPasswordController,
} = require("../controllers/userControler");

const router = express.Router();

router.post("/usuarios", createUserController);
router.post("/login", loginController);
router.post("/recuperar-senha", requestPasswordResetController);
router.post("/redefinir-senha", resetPasswordController);

module.exports = router;
