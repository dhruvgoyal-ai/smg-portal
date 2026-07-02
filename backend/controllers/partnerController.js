import mongoose from "mongoose";
import Shipment from "../models/Shipment.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

// ====================================================
// Logistics Partner: Shipment Operations
// ====================================================

const getAssignedShipments = asyncHandler(async (req, res) => {
  const shipments = await Shipment.find({ assignedPartner: req.user._id })
    .populate("assignedPartner", "name email phone role")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: shipments.length,
    shipments
  });
});

const updateAssignedShipmentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid shipment ID");
  }

  if (!status) {
    res.status(400);
    throw new Error("Status is required");
  }

  const shipment = await Shipment.findOne({
    _id: req.params.id,
    assignedPartner: req.user._id
  });

  if (!shipment) {
    res.status(404);
    throw new Error("Assigned shipment not found");
  }

  shipment.status = status;

  if (status === "Delivered") {
    shipment.currentLocation = "Delivered to destination";
  }

  shipment.timeline.push({
    status: shipment.status,
    location: shipment.currentLocation,
    note: status === "Delivered" ? "Shipment marked delivered" : "Shipment status updated"
  });

  await shipment.save();

  const updatedShipment = await Shipment.findById(shipment._id).populate(
    "assignedPartner",
    "name email phone role"
  );

  res.status(200).json({
    success: true,
    message: status === "Delivered" ? "Shipment marked as delivered" : "Shipment status updated successfully",
    shipment: updatedShipment
  });
});

const updateAssignedShipmentLocation = asyncHandler(async (req, res) => {
  const { currentLocation } = req.body;

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid shipment ID");
  }

  if (!currentLocation) {
    res.status(400);
    throw new Error("Current location is required");
  }

  const shipment = await Shipment.findOne({
    _id: req.params.id,
    assignedPartner: req.user._id
  });

  if (!shipment) {
    res.status(404);
    throw new Error("Assigned shipment not found");
  }

  shipment.currentLocation = currentLocation;
  shipment.timeline.push({
    status: shipment.status,
    location: shipment.currentLocation,
    note: "Current location updated"
  });

  await shipment.save();

  const updatedShipment = await Shipment.findById(shipment._id).populate(
    "assignedPartner",
    "name email phone role"
  );

  res.status(200).json({
    success: true,
    message: "Shipment location updated successfully",
    shipment: updatedShipment
  });
});

// ====================================================
// Admin: Partner Management
// ====================================================

const getAllPartners = asyncHandler(async (req, res) => {
  const partners = await User.find({ role: "logisticsPartner" })
    .select("-password")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: partners.length,
    partners
  });
});

const createPartner = asyncHandler(async (req, res) => {
  const { name, email, phone, city, password } = req.body;

  if (!name || !email || !password || !phone) {
    res.status(400);
    throw new Error("Name, email, phone and password are required");
  }

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(400);
    throw new Error("A user with this email already exists");
  }

  const partner = await User.create({
    name,
    email,
    phone,
    city,
    password,
    role: "logisticsPartner"
  });

  const safePartner = await User.findById(partner._id).select("-password");

  res.status(201).json({
    success: true,
    message: "Logistics partner created successfully",
    partner: safePartner
  });
});

const updatePartner = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid partner ID");
  }

  const partner = await User.findOne({
    _id: req.params.id,
    role: "logisticsPartner"
  });

  if (!partner) {
    res.status(404);
    throw new Error("Logistics partner not found");
  }

  const { name, email, phone, city, status, password } = req.body;

  if (name     !== undefined) partner.name   = name;
  if (email    !== undefined) partner.email  = email;
  if (phone    !== undefined) partner.phone  = phone;
  if (city     !== undefined) partner.city   = city;
  if (status   !== undefined) partner.status = status;
  if (password)               partner.password = password;

  await partner.save();

  const updatedPartner = await User.findById(partner._id).select("-password");

  res.status(200).json({
    success: true,
    message: "Logistics partner updated successfully",
    partner: updatedPartner
  });
});

const deletePartner = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid partner ID");
  }

  const partner = await User.findOne({
    _id: req.params.id,
    role: "logisticsPartner"
  });

  if (!partner) {
    res.status(404);
    throw new Error("Logistics partner not found");
  }

  await partner.deleteOne();

  res.status(200).json({
    success: true,
    message: "Logistics partner deleted successfully"
  });
});

export {
  getAssignedShipments,
  updateAssignedShipmentStatus,
  updateAssignedShipmentLocation,
  getAllPartners,
  createPartner,
  updatePartner,
  deletePartner
};