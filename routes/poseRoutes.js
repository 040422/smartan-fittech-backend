import express from "express";
import multer from "multer";
import { extractPose } from "../controllers/poseController.js";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.post("/extract-pose", upload.single("image"), extractPose);

export default router;
