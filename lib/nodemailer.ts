import nodemailer from "nodemailer";

const HOST = process.env.EMAIL_SERVER_HOST ?? "";
const PORT = Number(process.env.EMAIL_SERVER_PORT ?? "587");
const USER = process.env.EMAIL_SERVER_USER ?? "";
const PASS = process.env.EMAIL_SERVER_PASSWORD ?? "";
const FROM = process.env.EMAIL_FROM ?? "DK Creative Solutions <hello@dkcreativesolutions.com>";

export const isSmtpConfigured = Boolean(HOST && USER && PASS);

// Setup SMTP transporter if credentials exist
const transporter = isSmtpConfigured
  ? nodemailer.createTransport({
      host: HOST,
      port: PORT,
      secure: PORT === 465, // True for 465, false for 587
      auth: {
        user: USER,
        pass: PASS,
      },
    })
  : null;

/**
 * Sends a premium-styled HTML OTP email to the user.
 */
export async function sendOTPEmail(email: string, code: string) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Verify Your Email</title>
      <style>
        body {
          background-color: #050505;
          color: #ffffff;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          margin: 0;
          padding: 40px 20px;
        }
        .container {
          max-width: 480px;
          margin: 0 auto;
          background-color: #111111;
          border: 1px solid rgba(247, 165, 0, 0.15);
          border-radius: 16px;
          padding: 40px;
          text-align: center;
          box-shadow: 0 8px 32px rgba(247, 165, 0, 0.08);
        }
        h1 {
          font-size: 22px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 24px;
          letter-spacing: -0.5px;
        }
        .gold-text {
          color: #F7A500;
        }
        .code {
          font-size: 36px;
          font-weight: bold;
          letter-spacing: 8px;
          color: #FFB800;
          background-color: rgba(247, 165, 0, 0.04);
          padding: 16px 28px;
          border-radius: 12px;
          border: 1px dashed rgba(247, 165, 0, 0.25);
          display: inline-block;
          margin: 28px 0;
          font-family: monospace, Courier, monospace;
        }
        p {
          font-size: 13.5px;
          color: #a3a3a3;
          line-height: 1.6;
          margin: 0;
        }
        .footer {
          margin-top: 36px;
          font-size: 10px;
          color: #555555;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 20px;
          letter-spacing: 0.5px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>DK <span class="gold-text">Creative</span></h1>
        <p>Please use the following 4-digit code to verify your email address and complete your request:</p>
        <div class="code">${code}</div>
        <p>This code is valid for 5 minutes. If you did not request this, you can safely ignore this email.</p>
        <div class="footer">
          DK Creative Solutions &copy; 2026. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;

  if (!transporter) {
    console.warn("\n==================================================");
    console.warn("📨 SMTP NOT CONFIGURED. DEMO OTP EMAIL SIMULATION:");
    console.warn(`To: ${email}`);
    console.warn(`OTP Code: ${code}`);
    console.warn("==================================================\n");
    return;
  }

  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: `Verify your email: ${code}`,
    text: `Your verification code is: ${code}. Valid for 5 minutes.`,
    html: htmlContent,
  });
}
