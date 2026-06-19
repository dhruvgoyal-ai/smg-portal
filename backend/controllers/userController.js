import mongoose from "mongoose";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

const getUsers = asyncHandler(async (req, res) => {
  const { role, department, isActive, search } = req.query;
  const query = {};

  if (role) {
    query.role = role;
  }

  if (department) {
    query.department = new RegExp(department, "i");
  }

  if (typeof isActive !== "undefined") {
    query.isActive = isActive === "true";
  }

  if (search) {
    query.$or = [
      { name: new RegExp(search, "i") },
      { email: new RegExp(search, "i") },
      { employeeId: new RegExp(search, "i") }
    ];
  }

  const users = await User.find(query).select("-password").sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: users.length,
    users
  });
});

const getUserById = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid user ID");
  }

  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    success: true,
    user
  });
});

const updateUser = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid user ID");
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const { name, department, phone, role, isActive, password } = req.body;

  if (name) {
    user.name = name;
  }

  if (department) {
    user.department = department;
  }

  if (phone) {
    user.phone = phone;
  }

  if (role) {
    user.role = role;
  }

  if (typeof isActive !== "undefined") {
    user.isActive = isActive;
  }

  if (password) {
    user.password = password;
  }

  const updatedUser = await user.save();

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    user: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      employeeId: updatedUser.employeeId,
      role: updatedUser.role,
      department: updatedUser.department,
      phone: updatedUser.phone,
      isActive: updatedUser.isActive,
      lastLogin: updatedUser.lastLogin,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    }
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid user ID");
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User deleted successfully"
  });
});

export { getUsers, getUserById, updateUser, deleteUser };
