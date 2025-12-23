const express = require("express");
const router = express.Router();

const { signup, login } = require("../controllers/authController");// {} is used to bcuz at ../ its not exported as module

router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
