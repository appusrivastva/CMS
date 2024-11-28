// role_auth_middleware.js
const jwt = require("jsonwebtoken");

const isLogIn = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log(verified);
    req.user = verified; // Attach the verified token to the request
    console.log(req.user.role);
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid Token" });
  }
};

// Role-Based Access Control
const auth =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access Denied" });
    }
    next();
  };

module.exports = { isLogIn, auth };
