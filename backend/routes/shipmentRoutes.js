import express from "express";
import {
  createShipment,
  deleteShipment,
  getAllShipments,
  getShipment,
  updateShipment
} from "../controllers/shipmentController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getAllShipments).post(authorize("admin", "logisticsPartner"), createShipment);
router
  .route("/:id")
  .get(getShipment)
  .put(authorize("admin", "logisticsPartner"), updateShipment)
  .delete(authorize("admin"), deleteShipment);

export default router;
