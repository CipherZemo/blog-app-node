const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");

const {
  createPost,getAllPosts,getPostById,updatePost,deletePost,toggleLike,addComment,deleteComment
} = require("../controllers/postController"); // 

const { validatePost } = require("../middleware/postValid");
//{} is there for a reason bcuz no file is exported there at ../(location) ,ie here only obj is coming no function.

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







//--------NOTE:------------------------

//.single() accepts single image bcuz Multi-image management is heavy
//-How will the frontend display multiple images? Carousel? Grid? Popup?
//-How will you store the filenames? Array of strings? With captions? Main image + gallery? 
//-How will you clean up old images? When a post updates — delete all old images? Only replace some? Or allow partial updates to images?
