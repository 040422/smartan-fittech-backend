import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectSQL } from "./models/sqlModel.js";
import poseRoutes from "./routes/poseRoutes.js";
import poseCRUDRoutes from "./routes/poseCRUDRoutes.js";
import { loadModel } from "./utils/extractPose.js";
import { startCronJob } from "./cron/cronJob.js";


const app = express();
app.use(express.json());
dotenv.config();

app.use("/api/poses", poseCRUDRoutes);

await connectSQL(); // <-- NOW IT WORKS

mongoose.connect("mongodb://127.0.0.1:27017/poseDB");
console.log("MongoDB Connected!");
startCronJob();


await loadModel();

app.use("/api", poseRoutes);


app.listen(3000, () => console.log("Server running on port 3000"));
