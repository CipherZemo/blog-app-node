const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {//A middleware must be a function with three arguments: req, res, next

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];//second part is the actual JWT token, so split the string by space and take the second part
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Once the token is verified, JWT returns the decoded object.Attaching it to user request
    next();

  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
