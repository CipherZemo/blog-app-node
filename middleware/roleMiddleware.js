exports.authorizeRoles = (...roles) => {//'...' are REST parameter syntax (to accept ANY number of arguments and turn them into an array)
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

