import nodemailer from "nodemailer";

export const sendBackupEmail = async (filePath) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: "admin@company.com",
    subject: "Daily DB Backup - " + new Date().toLocaleDateString(),
    text: "Find attached backup.",
    attachments: [{ path: filePath }],
  });
};
