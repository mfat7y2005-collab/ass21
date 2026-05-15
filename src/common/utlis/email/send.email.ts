import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";


const APP_EMAIL = process.env.APP_EMAIL as string;
const APP_EMAIL_PASSWORD = process.env.APP_EMAIL_PASSWORD as string;

export const sendEmail = async ({
  to,
  subject,
  text,
  html,
  cc,
  bcc,
  attachments = [],
}: Mail.Options): Promise<void> => {

  if (!to && !cc && !bcc) {
    throw new Error("At least one recipient (to, cc, or bcc) must be provided.");
  }

  
  if (attachments.length > 0 && !html) {
    throw new Error("HTML content is required when attachments are provided.");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: APP_EMAIL,
      pass: APP_EMAIL_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: `"Your App Name" <${APP_EMAIL}>`,
    to,
    subject,
    text,
    html,
    cc,
    bcc,
    attachments,
  });





  console.log(`📧 Email sent: ${info.messageId}`);

  
};


