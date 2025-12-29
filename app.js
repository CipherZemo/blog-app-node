
require("dotenv").config();// this allows to use process.env.PORT,process.env.DB_URI

// Connect to DB
const connectDB = require("./config/db");
const express = require("express");
const app = express();
const cors = require("cors");


// Middleware
app.use(express.json());
app.use(cors());


app.set("view engine", "ejs");// enable EJS
app.use(express.urlencoded({extended: true}));//enabling form handling
app.use(express.static("public"));//
app.use("/uploads", express.static("uploads"));//make folder static so images can be served


// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const postRoutes = require("./routes/postRoutes");
app.use("/api/posts", postRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

const pageRoutes = require("./routes/pageRoutes");
app.use("/", pageRoutes);

const authPageRoutes = require("./routes/authPageRoutes");
app.use("/", authPageRoutes);


// Start Server
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
