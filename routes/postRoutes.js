const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");

const {
  createPost,getAllPosts,getPostById,updatePost,deletePost,toggleLike,addComment,deleteComment
} = require("../controllers/postController"); 

const { validatePost } = require("../middleware/postValid");


// Post 
router.post("/", authMiddleware, upload.single("image"),validatePost, createPost); //.single() expects single image only
router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.put("/:id", authMiddleware, upload.single("image"),validatePost, updatePost);
router.delete("/:id", authMiddleware, deletePost);

// Likes
router.post("/:id/like", authMiddleware, toggleLike);


// Comments
router.post("/:id/comment", authMiddleware, addComment);
router.delete("/:id/comment/:commentId", authMiddleware, deleteComment);

module.exports = router;

