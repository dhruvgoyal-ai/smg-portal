import express from "express";
import {
  getAssignedShipments,
  updateAssignedShipmentLocation,
  updateAssignedShipmentStatus
} from "../controllers/partnerController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(authorize("logisticsPartner"));

router.get("/shipments", getAssignedShipments);
router.put("/update-status/:id", updateAssignedShipmentStatus);
router.put("/update-location/:id", updateAssignedShipmentLocation);

export default router;
