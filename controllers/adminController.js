const User = require("../models/User");
const Post = require("../models/Post");

exports.getAdminStats = async (req, res) => {
  const users = await User.countDocuments();
  const posts = await Post.countDocuments();

  res.json({ users, posts });
};

exports.getAllUsers = async (req, res) => {
  const users = await User.find().select("name email role");
  res.json(users);
};

exports.updateUserRole = async (req, res) => {
  const { role } = req.body;

  if (!["user", "admin"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  );

  res.json(user);
};

exports.deleteUser = async (req, res) => {
  const userToDelete = await User.findById(req.params.id);

  if (!userToDelete) {
    return res.status(404).json({ message: "User not found" });
  }

  if (userToDelete.role === "admin") {
    const adminCount = await User.countDocuments({ role: "admin" });

    if (adminCount === 1) {
      return res.status(400).json({
        message: "Cannot delete the last admin"
      });
  
    }
  }

  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
};

exports.getAllPostsAdmin = async (req, res) => {

  const page = parseInt(req.query.page) || 1;
  const limit = 4;
  const skip = (page - 1) * limit;

  const posts = await Post.find()
    .populate("author", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Post.countDocuments();

  res.json({
    posts,
    page,
    totalPages: Math.ceil(total / limit)
  });

};
