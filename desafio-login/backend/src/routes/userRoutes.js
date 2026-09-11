const express = require("express");
const { createUserController, loginController } = require("../controllers/userControler");

const router = express.Router();

router.post("/usuarios", createUserController);
router.post("/login", loginController);

module.exports = router;
