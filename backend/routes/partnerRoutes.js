import express from "express";
import {
  getAssignedShipments,
  updateAssignedShipmentLocation,
  updateAssignedShipmentStatus,
  getAllPartners,
  createPartner,
  updatePartner,
  deletePartner
} from "../controllers/partnerController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

// ── Logistics Partner: named routes FIRST (must come before /:id) ───
router.get("/shipments",           authorize("logisticsPartner"), getAssignedShipments);
router.put("/update-status/:id",   authorize("logisticsPartner"), updateAssignedShipmentStatus);
router.put("/update-location/:id", authorize("logisticsPartner"), updateAssignedShipmentLocation);

// ── Admin: parameterized routes AFTER ───────────────────────────────
router.get("/",       authorize("admin"), getAllPartners);
router.post("/",      authorize("admin"), createPartner);
router.put("/:id",    authorize("admin"), updatePartner);
router.delete("/:id", authorize("admin"), deletePartner);

export default router;