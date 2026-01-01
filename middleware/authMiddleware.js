const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {//A middleware must be a function with three arguments: req, res, next

  const authHeader = req.headers.authorization;// Get token from header. When the frontend sends a protected request, it includes a header like Authorization: Bearer YOUR_TOKEN_HERE

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];//second part is the actual JWT token, so split the string by space and take the second part
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Once the token is verified, JWT returns a decoded object.Attaching it to user request
    req.user = decoded;

    next();// next middleware or controller will run(routing chains)

  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
