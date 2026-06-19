import express from "express";
import { getTrackingDetails } from "../controllers/trackingController.js";

const router = express.Router();

router.get("/:trackingId", getTrackingDetails);

export default router;
