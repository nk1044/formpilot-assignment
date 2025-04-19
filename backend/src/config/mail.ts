// utils/mailer.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!,
  },
});


export async function sendAdminNotification(userEmail: string, creditsAdded: number) {
  await transporter.sendMail({
    from: '"Credit Update Bot" <no-reply@example.com>',
    to: process.env.ADMIN_EMAIL!, // store in .env
    subject: "Credit Update Notification",
    html: `
      <p><strong>${userEmail}</strong> has been granted <strong>${creditsAdded}</strong> credits.</p>
      <p>This request was triggered via the dashboard.</p>
    `,
  });
}
