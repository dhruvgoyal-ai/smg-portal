import mongoose from "mongoose";
import Shipment from "../models/Shipment.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: users.length,
    users
  });
});

const getAllAdminShipments = asyncHandler(async (req, res) => {
  const shipments = await Shipment.find()
    .populate("assignedPartner", "name email phone role")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: shipments.length,
    shipments
  });
});

const deleteUserByAdmin = asyncHandler(async (req, res) => {
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
    message: "Shipment deleted successfully"
  });
});

const getDashboardStatistics = asyncHandler(async (req, res) => {
  const [shipmentStats, userStats] = await Promise.all([
    Shipment.aggregate([
      {
        $group: {
          _id: null,
          totalShipments: { $sum: 1 },
          deliveredShipments: {
            $sum: {
              $cond: [{ $eq: ["$status", "Delivered"] }, 1, 0]
            }
          },
          pendingShipments: {
            $sum: {
              $cond: [{ $eq: ["$status", "Pending"] }, 1, 0]
            }
          },
          inTransitShipments: {
            $sum: {
              $cond: [{ $eq: ["$status", "In Transit"] }, 1, 0]
            }
          }
        }
      }
    ]),
    User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 }
        }
      }
    ])
  ]);

  const shipmentSummary = shipmentStats[0] || {
    totalShipments: 0,
    deliveredShipments: 0,
    pendingShipments: 0,
    inTransitShipments: 0
  };

  const userSummary = userStats[0] || { totalUsers: 0 };

  res.status(200).json({
    totalUsers: userSummary.totalUsers,
    totalShipments: shipmentSummary.totalShipments,
    deliveredShipments: shipmentSummary.deliveredShipments,
    pendingShipments: shipmentSummary.pendingShipments,
    inTransitShipments: shipmentSummary.inTransitShipments
  });
});

export {
  deleteShipmentByAdmin,
  deleteUserByAdmin,
  getAllAdminShipments,
  getAllUsers,
  getDashboardStatistics
};
