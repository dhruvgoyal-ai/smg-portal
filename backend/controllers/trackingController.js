import Shipment from "../models/Shipment.js";
import asyncHandler from "../utils/asyncHandler.js";

const getTrackingDetails = asyncHandler(async (req, res) => {
  const trackingId = req.params.trackingId?.trim().toUpperCase();

  if (!trackingId) {
    res.status(400);
    throw new Error("Tracking ID is required");
  }

  const shipment = await Shipment.findOne({ trackingId }).populate(
    "assignedPartner",
    "name email phone role"
  );

  if (!shipment) {
    res.status(404);
    throw new Error("Shipment not found");
  }

  const shipmentTimeline =
    shipment.timeline.length > 0
      ? shipment.timeline
      : [
          {
            status: shipment.status,
            location: shipment.currentLocation,
            note: "Tracking record created",
            updatedAt: shipment.createdAt
          }
        ];

  res.status(200).json({
    success: true,
    trackingId: shipment.trackingId,
    currentStatus: shipment.status,
    currentLocation: shipment.currentLocation,
    expectedDeliveryDate: shipment.expectedDeliveryDate,
    shipmentTimeline
  });
});

export { getTrackingDetails };
