import cron from "node-cron";
import archiver from "archiver";
import fs from "fs-extra";
import path from "path";
import mongoose from "mongoose";
import MongoImage from "../models/mongoModel.js";
import { sendBackupEmail } from "../utils/sendEmail.js";

export const startCronJob = () => {
  // Runs every day at 11:59 PM
  cron.schedule("*/10 * * * * *", async () => {
    console.log("⏳ Running daily backup...");

    try {
      // Create backup folder if not exists
      const backupDir = path.join("backup");
      await fs.ensureDir(backupDir);

      // Filename example: 2025-12-10-backup.zip
      const date = new Date().toISOString().split("T")[0];
      const zipPath = path.join(backupDir, `${date}-backup.zip`);

      const output = fs.createWriteStream(zipPath);
      const archive = archiver("zip");

      archive.pipe(output);

      // 1️⃣ Add SQLite DB (poseDB.sqlite)
      const sqliteFile = "poseDB.sqlite";
      if (fs.existsSync(sqliteFile)) {
        archive.file(sqliteFile, { name: "poseDB.sqlite" });
      }

      // 2️⃣ Add MongoDB images (export as JSON)
      const mongoData = await MongoImage.find().lean();
      const mongoJsonPath = path.join("backup", "mongo_backup.json");
      await fs.writeJson(mongoJsonPath, mongoData, { spaces: 2 });

      archive.file(mongoJsonPath, { name: "mongo_backup.json" });

      await archive.finalize();

      console.log("✅ Backup completed:", zipPath);
      await sendBackupEmail(zipPath);

      // Cleanup temporary JSON
      await fs.remove(mongoJsonPath);

    } catch (err) {
      console.error("❌ Backup error:", err);
    }
  });

  console.log("🕒 Daily Cron Job Scheduled (11:59 PM)");
};
