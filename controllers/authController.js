const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


exports.signup = async (req, res) => {//export is used to export this fn as a file to others, that is this signup fn can be shared if someone req or need for processing (path should be this page ie, in require("../controller/authControl.js"))
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in db
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user", // default role
    });


    res.status(201).json({ 
      message: "User registered successfully", 
      user: newUser
    });//instead of newUser you can pass a different user model to json file that doesnt show password for more protection, just create a new vari using const 

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};//sign up function



exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};// login function

