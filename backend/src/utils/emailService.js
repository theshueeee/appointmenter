import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `http://localhost:${process.env.FRONTEND_PORT || 3002}/reset-password/${resetToken}`;

  const { data, error } = await resend.emails.send({
    from: `Appointmenter <${process.env.RESEND_FROM_EMAIL}>`,
    to: [email],
    subject: "Reset your Appointmenter password",
    html: `
      <div style="font-family: 'Helvetica', 'Arial', sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 2px solid #1c1917; background: #fafaf9;">
        <div style="width: 32px; height: 32px; background: #1c1917; display: flex; align-items: center; justify-content: center; margin-bottom: 24px;">
          <span style="color: #fef3c7; font-size: 14px; font-weight: bold;">A</span>
        </div>
        <h1 style="color: #1c1917; font-size: 18px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px 0;">
          Reset your password
        </h1>
        <div style="width: 32px; height: 2px; background: #1c1917; margin-bottom: 16px;"></div>
        <p style="color: #44403c; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0;">
          You requested a password reset for your Appointmenter account. Click the button below to set a new password. This link expires in 15 minutes.
        </p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 24px; background: #1c1917; color: #fef3c7; text-decoration: none; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em;">
          Reset password
        </a>
        <p style="color: #78716c; font-size: 12px; margin-top: 24px; border-top: 1px solid #d6d3d1; padding-top: 12px;">
          If you did not request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend email error:", error);
    throw new Error("Failed to send reset email");
  }

  return data;
};

export { sendPasswordResetEmail };