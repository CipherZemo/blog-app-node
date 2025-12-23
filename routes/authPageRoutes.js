const express = require("express");
const axios = require("axios");
const router = express.Router();

const API_BASE = "http://localhost:3000/api/auth";

// SIGNUP HANDLER
router.post("/signup", async (req, res) => {
  try {
    await axios.post(`${API_BASE}/signup`, req.body);
    res.redirect("/login");
  } catch (err) {
    const error =
      err.response?.data?.message || "Signup failed";
    res.render("signup", { title: "Signup", error });
  }
});

// LOGIN HANDLER
router.post("/login", async (req, res) => {
  try {
    const response = await axios.post(
      `${API_BASE}/login`,
      req.body
    );

    const token = response.data.token;

    // store token in localStorage via script
    res.send(`
      <script>
        localStorage.setItem("token", "${token}");
        window.location.href = "/";
      </script>
    `);
  } catch (err) {
    const error =
      err.response?.data?.message || "Login failed";
    res.render("login", { title: "Login", error });
  }
});

module.exports = router;
