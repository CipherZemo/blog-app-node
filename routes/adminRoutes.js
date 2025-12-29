const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {authorizeRoles} = require("../middleware/roleMiddleware");

const {
  getAdminStats,getAllUsers,updateUserRole, deleteUser,getAllPostsAdmin
} = require("../controllers/adminController");

router.use(authMiddleware);
router.use(authorizeRoles("admin"));

router.get("/stats", getAdminStats);
router.get("/users", getAllUsers);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);
router.get("/posts", getAllPostsAdmin);

module.exports = router;
