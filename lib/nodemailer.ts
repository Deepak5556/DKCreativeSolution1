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

/**
 * Sends a notification email to dkcreativesupport@gmail.com with details of a new query form submission.
 */
export async function sendQueryNotificationEmail(queryItem: Record<string, unknown>) {
  const name = String(queryItem.name || "N/A");
  const email = String(queryItem.email || "N/A");
  const phone = String(queryItem.phone || "N/A");
  const category = String(queryItem.category || "N/A");
  const priority = String(queryItem.priority || "N/A");
  const subCategory = String(queryItem.sub_category || queryItem.subCategory || "N/A");
  const details = String(queryItem.details || "No additional details provided.");

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Query Submission</title>
      <style>
        body {
          background-color: #050505;
          color: #ffffff;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          margin: 0;
          padding: 40px 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #111111;
          border: 1px solid rgba(247, 165, 0, 0.15);
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 8px 32px rgba(247, 165, 0, 0.08);
        }
        h1 {
          font-size: 22px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 24px;
          letter-spacing: -0.5px;
          text-align: center;
        }
        .gold-text {
          color: #F7A500;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        td {
          padding: 12px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          font-size: 14px;
        }
        .label {
          color: #a3a3a3;
          font-weight: 600;
          width: 30%;
        }
        .value {
          color: #ffffff;
        }
        .details-box {
          background-color: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 16px;
          font-size: 14px;
          color: #e5e5e5;
          line-height: 1.6;
          margin-top: 10px;
          white-space: pre-wrap;
        }
        .footer {
          margin-top: 36px;
          font-size: 10px;
          color: #555555;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 20px;
          letter-spacing: 0.5px;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>DK <span class="gold-text">Creative</span> - New Inquiry</h1>
        <p style="font-size: 14px; color: #a3a3a3; text-align: center;">You have received a new contact/project query form submission.</p>
        
        <table>
          <tr>
            <td class="label">Name</td>
            <td class="value">${name}</td>
          </tr>
          <tr>
            <td class="label">Email</td>
            <td class="value">${email}</td>
          </tr>
          <tr>
            <td class="label">Phone</td>
            <td class="value">${phone}</td>
          </tr>
          <tr>
            <td class="label">Category</td>
            <td class="value">${category}</td>
          </tr>
          <tr>
            <td class="label">Sub-Category</td>
            <td class="value">${subCategory}</td>
          </tr>
          <tr>
            <td class="label">Priority</td>
            <td class="value" style="color: ${priority === "urgent" ? "#ff4d4d" : "#F7A500"}">${priority}</td>
          </tr>
        </table>

        <div style="font-size: 14px; color: #a3a3a3; font-weight: 600; margin-top: 20px;">Project Details / Message:</div>
        <div class="details-box">${details}</div>

        <div class="footer">
          DK Creative Solutions &copy; 2026. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;

  if (!transporter) {
    console.warn("\n==================================================");
    console.warn("📨 SMTP NOT CONFIGURED. DEMO INQUIRY SIMULATION:");
    console.warn(`To: dkcreativesupport@gmail.com`);
    console.warn(`From name: ${name} (${email})`);
    console.warn(`Details: ${details}`);
    console.warn("==================================================\n");
    return;
  }

  await transporter.sendMail({
    from: FROM,
    to: "dkcreativesupport@gmail.com",
    subject: `New Inquiry from ${name}: ${category}`,
    text: `New Inquiry from ${name} (${email})\nCategory: ${category}\nPriority: ${priority}\nDetails: ${details}`,
    html: htmlContent,
  });
}
