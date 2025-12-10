import cron from "node-cron";
import fs from "fs";
import archiver from "archiver";
import { sendBackupEmail } from "../utils/email.js";

cron.schedule("59 23 * * *", async () => {
  const date = new Date().toISOString().split("T")[0];
  const zipPath = `backups/${date}-backup.zip`;

  const output = fs.createWriteStream(zipPath);
  const archive = archiver("zip");

  archive.pipe(output);

  archive.file("sql-backup.sql", { name: "sql.sql" });
  archive.file("mongo-backup.json", { name: "mongo.json" });

  await archive.finalize();

  sendBackupEmail(zipPath);

  console.log("Backup complete:", zipPath);
});
