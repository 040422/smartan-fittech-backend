import express from "express";
import {
  getAllPoses,
  getPoseById,
  updatePose,
  deletePose
} from "../controllers/poseCRUDController.js";

const router = express.Router();

router.get("/", getAllPoses);
router.get("/:id", getPoseById);
router.put("/:id", updatePose);
router.delete("/:id", deletePose);

export default router;
