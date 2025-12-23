const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("home", { title: "Home" });
});

router.get("/login", (req, res) => {
    res.render("login", { title: "Login", error: null });
});

router.get("/signup", (req, res) => {
    res.render("signup", { title: "Signup", error: null });
});

module.exports = router;
