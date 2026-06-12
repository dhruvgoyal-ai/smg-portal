import express from "express";
import {
  deleteShipmentByAdmin,
  deleteUserByAdmin,
  getAllAdminShipments,
  getAllUsers,
  getDashboardStatistics
} from "../controllers/adminController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(authorize("admin"));

router.get("/users", getAllUsers);
router.get("/shipments", getAllAdminShipments);
router.get("/dashboard", getDashboardStatistics);
router.delete("/users/:id", deleteUserByAdmin);
router.delete("/shipments/:id", deleteShipmentByAdmin);

export default router;
