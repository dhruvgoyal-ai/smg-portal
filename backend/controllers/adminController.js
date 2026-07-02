import mongoose from "mongoose";
import Shipment from "../models/Shipment.js";
import User from "../models/User.js";
import Customer from "../models/Customer.js";
import asyncHandler from "../utils/asyncHandler.js";

const getAllUsers = asyncHandler(async (req, res) => {
  const adminsAndPartners = await User.find()
    .select("-password")
    .sort({ createdAt: -1 });

  const customers = await Customer.find()
    .select("-password")
    .sort({ createdAt: -1 });

  const users = [...adminsAndPartners, ...customers];

  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
});

const getAllAdminShipments = asyncHandler(async (req, res) => {
  const shipments = await Shipment.find()
    .populate("assignedPartner", "name email phone role")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: shipments.length,
    shipments,
  });
});

const deleteUserByAdmin = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid user ID");
  }

  let deleted = await User.findByIdAndDelete(req.params.id);

  if (!deleted) {
    deleted = await Customer.findByIdAndDelete(req.params.id);
  }

  if (!deleted) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

const deleteShipmentByAdmin = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid shipment ID");
  }

  const shipment = await Shipment.findById(req.params.id);

  if (!shipment) {
    res.status(404);
    throw new Error("Shipment not found");
  }

  await shipment.deleteOne();

  res.status(200).json({
    success: true,
    message: "Shipment deleted successfully",
  });
});

const getDashboardStatistics = asyncHandler(async (req, res) => {
  const [
    totalShipments,
    deliveredShipments,
    pendingShipments,
    inTransitShipments,
    totalUsers,
    totalCustomers,
    totalPartners,
  ] = await Promise.all([
    Shipment.countDocuments(),
    Shipment.countDocuments({ status: "Delivered" }),
    Shipment.countDocuments({ status: "Pending" }),
    Shipment.countDocuments({ status: "In Transit" }),
    User.countDocuments({ role: "admin" }),
    Customer.countDocuments(),
    User.countDocuments({ role: "logisticsPartner" }),
  ]);

  res.status(200).json({
    success: true,
    totalUsers: totalUsers + totalCustomers,
    totalCustomers,
    totalPartners,
    totalShipments,
    deliveredShipments,
    pendingShipments,
    inTransitShipments,
  });
});

export {
  deleteShipmentByAdmin,
  deleteUserByAdmin,
  getAllAdminShipments,
  getAllUsers,
  getDashboardStatistics,
};