const express = require("express");
const axios = require("axios");
const router = express.Router();

const API_BASE = "http://localhost:3000/api";

router.get("/", async (req, res) => {
  try {
    const page = req.query.page || 1;
    const search = req.query.search || "";

    const response = await axios.get(`${API_BASE}/posts`, {
      params: {
        page,
        limit: 5,
        search
      }
    });

    res.render("home", {
      title: "Home",
      posts: response.data.posts,
      currentPage: response.data.page,
      totalPages: response.data.totalPages,
      search
    });

  } catch (err) {
    res.render("home", {
      title: "Home",
      posts: [],
      currentPage: 1,
      totalPages: 1,
      search: ""
    });
  }
});

router.get("/login", (req, res) => {
    res.render("login", { title: "Login", error: null });
});

router.get("/signup", (req, res) => {
    res.render("signup", { title: "Signup", error: null });
});

module.exports = router;

