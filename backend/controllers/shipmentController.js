import mongoose from "mongoose";
import Shipment from "../models/Shipment.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

const validateAssignedPartner = async (assignedPartner) => {
  if (!mongoose.Types.ObjectId.isValid(assignedPartner)) {
    return false;
  }

  const partner = await User.findById(assignedPartner);

  return Boolean(partner && partner.role === "logisticsPartner");
};

const createShipment = asyncHandler(async (req, res) => {
  const {
    trackingId,
    senderName,
    receiverName,
    senderAddress,
    receiverAddress,
    status,
    currentLocation,
    expectedDeliveryDate,
    assignedPartner,
    timelineNote
  } = req.body;

  if (
    !trackingId ||
    !senderName ||
    !receiverName ||
    !senderAddress ||
    !receiverAddress ||
    !currentLocation ||
    !expectedDeliveryDate ||
    !assignedPartner
  ) {
    res.status(400);
    throw new Error("All shipment fields are required");
  }

  const existingShipment = await Shipment.findOne({ trackingId: trackingId.toUpperCase() });

  if (existingShipment) {
    res.status(409);
    throw new Error("Shipment with this tracking ID already exists");
  }

  const isValidPartner = await validateAssignedPartner(assignedPartner);

  if (!isValidPartner) {
    res.status(400);
    throw new Error("Assigned partner must be a valid logistics partner");
  }

  const shipment = await Shipment.create({
    trackingId,
    senderName,
    receiverName,
    senderAddress,
    receiverAddress,
    status,
    currentLocation,
    expectedDeliveryDate,
    assignedPartner,
    timeline: [
      {
        status: status || "Pending",
        location: currentLocation,
        note: timelineNote || "Shipment created"
      }
    ]
  });

  const populatedShipment = await Shipment.findById(shipment._id).populate(
    "assignedPartner",
    "name email phone role"
  );

  res.status(201).json({
    success: true,
    message: "Shipment created successfully",
    shipment: populatedShipment
  });
});

const getShipment = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid shipment ID");
  }

  const shipment = await Shipment.findById(req.params.id).populate(
    "assignedPartner",
    "name email phone role"
  );

  if (!shipment) {
    res.status(404);
    throw new Error("Shipment not found");
  }

  res.status(200).json({
    success: true,
    shipment
  });
});

const getAllShipments = asyncHandler(async (req, res) => {
  const query = {};

  // If user is a customer, they can only see shipments where they are the sender or receiver
  if (req.user.role === "customer") {
    query.$or = [
      { senderName: { $regex: new RegExp("^" + req.user.name + "$", "i") } },
      { receiverName: { $regex: new RegExp("^" + req.user.name + "$", "i") } }
    ];
  }

  if (req.query.status) {
    query.status = req.query.status;
  }

  if (req.query.assignedPartner && mongoose.Types.ObjectId.isValid(req.query.assignedPartner)) {
    query.assignedPartner = req.query.assignedPartner;
  }

  const shipments = await Shipment.find(query)
    .populate("assignedPartner", "name email phone role")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: shipments.length,
    shipments
  });
});


const updateShipment = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid shipment ID");
  }

  const shipment = await Shipment.findById(req.params.id);

  if (!shipment) {
    res.status(404);
    throw new Error("Shipment not found");
  }

  const {
    trackingId,
    senderName,
    receiverName,
    senderAddress,
    receiverAddress,
    status,
    currentLocation,
    expectedDeliveryDate,
    assignedPartner,
    timelineNote
  } = req.body;

  const previousStatus = shipment.status;
  const previousLocation = shipment.currentLocation;

  if (trackingId && trackingId.toUpperCase() !== shipment.trackingId) {
    const duplicateShipment = await Shipment.findOne({ trackingId: trackingId.toUpperCase() });

    if (duplicateShipment) {
      res.status(409);
      throw new Error("Shipment with this tracking ID already exists");
    }

    shipment.trackingId = trackingId;
  }

  if (typeof assignedPartner !== "undefined") {
    const isValidPartner = await validateAssignedPartner(assignedPartner);

    if (!isValidPartner) {
      res.status(400);
      throw new Error("Assigned partner must be a valid logistics partner");
    }

    shipment.assignedPartner = assignedPartner;
  }

  if (senderName) shipment.senderName = senderName;
  if (receiverName) shipment.receiverName = receiverName;
  if (senderAddress) shipment.senderAddress = senderAddress;
  if (receiverAddress) shipment.receiverAddress = receiverAddress;
  if (status) shipment.status = status;
  if (currentLocation) shipment.currentLocation = currentLocation;
  if (expectedDeliveryDate) shipment.expectedDeliveryDate = expectedDeliveryDate;

  const hasTrackingChange =
    (status && status !== previousStatus) ||
    (currentLocation && currentLocation !== previousLocation) ||
    timelineNote;

  if (hasTrackingChange) {
    shipment.timeline.push({
      status: shipment.status,
      location: shipment.currentLocation,
      note: timelineNote || "Shipment updated"
    });
  }

  await shipment.save();

  const updatedShipment = await Shipment.findById(shipment._id).populate(
    "assignedPartner",
    "name email phone role"
  );

  res.status(200).json({
    success: true,
    message: "Shipment updated successfully",
    shipment: updatedShipment
  });
});

const deleteShipment = asyncHandler(async (req, res) => {
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
    message: "Shipment deleted successfully"
  });
});

export { createShipment, updateShipment, deleteShipment, getShipment, getAllShipments };
