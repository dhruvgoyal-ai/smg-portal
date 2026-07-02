import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Customer from "../models/Customer.js";
import asyncHandler from "../utils/asyncHandler.js";

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("Not authorized, token missing");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Support both { userId } (generateToken util) and { id } (customerRoutes inline)
    const id = decoded.userId || decoded.id;

    // Try User model first, then fall back to Customer model
    let principal = await User.findById(id).select("-password");
    if (!principal) {
      principal = await Customer.findById(id).select("-password");
    }

    if (!principal) {
      res.status(401);
      throw new Error("Not authorized, user not found");
    }

    req.user = principal;
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, token invalid");
  }
});

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    res.status(403);
    throw new Error("Access denied");
  }

  next();
};

export { protect, authorize };
