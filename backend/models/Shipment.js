import mongoose from "mongoose";

const shipmentTimelineSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["Pending", "Picked Up", "In Transit", "Out For Delivery", "Delivered"],
      required: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    note: {
      type: String,
      trim: true,
      maxlength: [250, "Timeline note cannot exceed 250 characters"]
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const shipmentSchema = new mongoose.Schema(
  {
    trackingId: {
      type: String,
      required: [true, "Tracking ID is required"],
      unique: true,
      trim: true,
      uppercase: true
    },
    senderName: {
      type: String,
      required: [true, "Sender name is required"],
      trim: true,
      maxlength: [100, "Sender name cannot exceed 100 characters"]
    },
    receiverName: {
      type: String,
      required: [true, "Receiver name is required"],
      trim: true,
      maxlength: [100, "Receiver name cannot exceed 100 characters"]
    },
    senderAddress: {
      type: String,
      required: [true, "Sender address is required"],
      trim: true,
      maxlength: [300, "Sender address cannot exceed 300 characters"]
    },
    receiverAddress: {
      type: String,
      required: [true, "Receiver address is required"],
      trim: true,
      maxlength: [300, "Receiver address cannot exceed 300 characters"]
    },
    status: {
      type: String,
      enum: ["Pending", "Picked Up", "In Transit", "Out For Delivery", "Delivered"],
      default: "Pending"
    },
    currentLocation: {
      type: String,
      required: [true, "Current location is required"],
      trim: true,
      maxlength: [150, "Current location cannot exceed 150 characters"]
    },
    expectedDeliveryDate: {
      type: Date,
      required: [true, "Expected delivery date is required"]
    },
    assignedPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Assigned partner is required"]
    },
    timeline: {
      type: [shipmentTimelineSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

const Shipment = mongoose.model("Shipment", shipmentSchema);

export default Shipment;
