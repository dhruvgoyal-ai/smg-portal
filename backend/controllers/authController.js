import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  companyName: user.companyName,
  isActive: user.isActive,
  lastLogin: user.lastLogin,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, companyName } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email and password are required");
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    res.status(409);
    throw new Error("User with this email already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    phone,
    companyName
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    token: generateToken(user._id),
    user: sanitizeUser(user)
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  //if (!user.isActive) {
   // res.status(403);
    //throw new Error("Your account has been deactivated");
 // }

  user.lastLogin = new Date();
  await user.save();

  res.status(200).json({
    success: true,
    message: "Login successful",
    token: generateToken(user._id),
    user: sanitizeUser(user)
  });
});

const getUserProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
});

export { registerUser, loginUser, getUserProfile };
