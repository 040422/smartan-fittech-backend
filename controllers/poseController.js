import fs from "fs";
import { SQL } from "../models/sqlModel.js";
import MongoImage from "../models/mongoModel.js";
import { extractKeypoints } from "../utils/extractPose.js";

export const extractPose = async (req, res) => {
  try {
    console.log("Incoming request:", req.body);

    // 1️⃣ Check if file exists
    if (!req.file) {
      console.log("❌ No file received");
      return res.status(400).json({ error: "No image uploaded. Use key 'image' in form-data." });
    }

    const imagePath = req.file.path;
    console.log("📸 Image path:", imagePath);

    // 2️⃣ Extract keypoints
    let keypoints;

    try {
      keypoints = await extractKeypoints(imagePath);
    } catch (err) {
      console.error("❌ Error in extractKeypoints():", err);
      return res.status(500).json({ error: "Pose extraction failed: " + err });
    }

    // 3️⃣ Store in SQL
    let sqlEntry;

    try {
      sqlEntry = await SQL.create({ keypoints: JSON.stringify(keypoints) });
    } catch (err) {
      console.error("❌ SQL Insert Error:", err);
      return res.status(500).json({ error: "SQL insert failed: " + err });
    }

    // 4️⃣ Store image in Mongo
    try {
      const imgBuffer = fs.readFileSync(imagePath);

      await MongoImage.create({
        image: imgBuffer,
        referenceId: sqlEntry.id,
      });
    } catch (err) {
      console.error("❌ Mongo Insert Error:", err);
      return res.status(500).json({ error: "Mongo insert failed: " + err });
    }

    // 5️⃣ SUCCESS
    console.log("✅ Pose extraction complete");
    return res.json({
      message: "Pose extracted successfully",
      keypoints,
      id: sqlEntry.id,
    });

  } catch (err) {
    console.error("💥 Unexpected backend error:", err);
    return res.status(500).json({ error: err.toString() });
  }
};
