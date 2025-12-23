require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("Connected to DB");

    // check if admin already exists
    const adminExists = await User.findOne({ email: "main.admin@gmail.com" });

    if (adminExists) {
      console.log("Admin already exists. Seeder aborted.");
      process.exit(0);
    }

    // create admin password hash
    const hashedPassword = await bcrypt.hash("admin@123", 10);

    // create admin user
    const admin = await User.create({
      name: "Admin",
      email: "main.admin@gmail.com",
      password: hashedPassword,
      role: "admin"
    });

    console.log("Admin created successfully:");
    console.log(admin);
    process.exit(0);
    
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
};

start();
