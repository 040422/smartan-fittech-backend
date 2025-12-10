import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";

export const sendBackupEmail = async (zipPath) => {
  try {
    
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS  
      }
    });

    const date = new Date().toISOString().split("T")[0];


    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,   
      subject: `Daily DB Backup - ${date}`,
      text: "Your backup file is attached.",
      attachments: [
        {
          filename: path.basename(zipPath),
          path: zipPath
        }
      ]
    };

    
    await transporter.sendMail(mailOptions);

    console.log("📩 Backup email sent successfully!");

  } catch (err) {
    console.error("❌ Email sending failed:", err);
  }
};
