import mongoose from "mongoose";
import Shipment from "../models/Shipment.js";
import asyncHandler from "../utils/asyncHandler.js";

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

export {
  getAssignedShipments,
  updateAssignedShipmentStatus,
  updateAssignedShipmentLocation
};
