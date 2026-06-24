import express from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser
} from "../controllers/userController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(authorize("admin", "manager"));

router.route("/")
  .get(getUsers)
  .post(createUser);
router.route("/:id").get(getUserById).put(authorize("admin"), updateUser).delete(authorize("admin"), deleteUser);

export default router;
