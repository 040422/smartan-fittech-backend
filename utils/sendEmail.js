import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";

export const sendBackupEmail = async (zipPath) => {
  try {
    // 1️⃣ Configure transporter
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your Gmail
        pass: process.env.EMAIL_PASS  // app password
      }
    });

    const date = new Date().toISOString().split("T")[0];

    // 2️⃣ Email options
    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,   // recipient email
      subject: `Daily DB Backup - ${date}`,
      text: "Your backup file is attached.",
      attachments: [
        {
          filename: path.basename(zipPath),
          path: zipPath
        }
      ]
    };

    // 3️⃣ Send email
    await transporter.sendMail(mailOptions);

    console.log("📩 Backup email sent successfully!");

  } catch (err) {
    console.error("❌ Email sending failed:", err);
  }
};
