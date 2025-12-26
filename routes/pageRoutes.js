const express = require("express");
const axios = require("axios");//Axios is a promise-based HTTP client for both Node.js and browsers, designed to simplify making HTTP requests
const router = express.Router();

const API_BASE = "http://localhost:3000/api";

router.get("/login", (req, res) => {
    res.render("login", { title: "Login", error: null,success: req.query.success });
});

router.get("/signup", (req, res) => {
    res.render("signup", { title: "Signup", error: null });
});

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

router.get("/posts/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `${API_BASE}/posts/${req.params.id}`
    );

    res.render("singlePost", {
      title: response.data.title,
      post: response.data,
      likes: response.data.likes
    });

  } catch (err) {
    res.redirect("/");
  }
});

router.get("/create-post", (req, res) => {
  res.render("createPost", { title: "Create Post" });
});

router.get("/posts/:id/edit", async (req, res) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/posts/${req.params.id}`
    );

    res.render("editPost", {
      title: "Edit Post",
      post: response.data
    });

  } catch (err) {
    res.redirect("/");
  }
});


module.exports = router;

