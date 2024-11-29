
require("dotenv").config();
const User = require("../models/user.schema.js");
const jwt = require("jsonwebtoken");

const roleCheck = (roles) => async (req, res, next) => {
  try {
    // Get token from Authorization header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      console.log("No token provided");
      return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    // Verify the token and decode it
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // console.log("Decoded JWT:", decoded);

    // Find the user by decoded ID
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach the user to the request object
    req.user = user;

    // Check if the user's role matches any of the required roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access Denied. You do not have permission." });
    }

    next();
  } catch (err) {
    console.error("Error in roleCheck middleware:", err);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired. Please log in again." });
    }

    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = roleCheck;