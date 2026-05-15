export const emailTemplate = ({
  title,
  code,
}: {
  title: string;
  code: number | string;
}) => {
  return `
  <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 10px; text-align: center;">
      
      <h2 style="color: #333;">${title}</h2>
      
      <p style="color: #555; font-size: 16px;">
        Use the verification code below to continue:
      </p>

      <div style="
        font-size: 28px;
        font-weight: bold;
        letter-spacing: 4px;
        background: #f1f1f1;
        padding: 15px;
        border-radius: 8px;
        margin: 20px 0;
        color: #007BFF;
      ">
        ${code}
      </div>

      <p style="color: #777; font-size: 14px;">
        This code will expire in 10 minutes.
      </p>

      <p style="color: #777; font-size: 14px;">
        If you didn't request this, you can safely ignore this email.
      </p>

      <hr style="margin: 20px 0;" />

      <p style="font-size: 12px; color: #aaa;">
        © 2026 Your App. All rights reserved.
      </p>

    </div>
  </div>
  `;
};