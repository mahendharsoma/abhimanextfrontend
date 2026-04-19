import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { emailConfig } from "@/lib/config";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3005").replace(/\/+$/, "");

interface ContactBody {
  fullName: string;
  phone: string;
  altPhone?: string;
  email: string;
  subject?: string;
  message: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ContactBody;

    // --- Validation ---
    const { fullName, phone, email, subject, altPhone, message } = body;

    if (!fullName || !phone || !email || !message) {
      return NextResponse.json(
        { error: "Full name, phone, email and message are required." },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 },
      );
    }

    if (!emailConfig.user || !emailConfig.pass || !emailConfig.to) {
      console.error("SMTP credentials or CONTACT_EMAIL not configured.");
      return NextResponse.json(
        { error: "Email service is not configured." },
        { status: 500 },
      );
    }

    // --- Build transporter ---
    const transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.port === 465,
      auth: {
        user: emailConfig.user,
        pass: emailConfig.pass,
      },
    });

    // --- Email content ---
    const htmlBody = `
      <h2>New Contact Form Submission</h2>
      <table style="border-collapse:collapse;width:100%;max-width:600px;">
        <tr><td style="padding:8px;font-weight:bold;">Name</td><td style="padding:8px;">${escapeHtml(fullName)}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;">Phone</td><td style="padding:8px;">${escapeHtml(phone)}</td></tr>
        ${altPhone ? `<tr><td style="padding:8px;font-weight:bold;">Alt Phone</td><td style="padding:8px;">${escapeHtml(altPhone)}</td></tr>` : ""}
        <tr><td style="padding:8px;font-weight:bold;">Email</td><td style="padding:8px;">${escapeHtml(email)}</td></tr>
        ${subject ? `<tr><td style="padding:8px;font-weight:bold;">Subject</td><td style="padding:8px;">${escapeHtml(subject)}</td></tr>` : ""}
        <tr><td style="padding:8px;font-weight:bold;">Message</td><td style="padding:8px;">${escapeHtml(message)}</td></tr>
      </table>
    `;

    const recipients = emailConfig.to.split(",").map((e) => e.trim()).filter(Boolean);

    await transporter.sendMail({
      from: `"Contact Request" <${emailConfig.user}>`,
      to: recipients.join(", "),
      replyTo: email,
      subject: subject ? `Contact: ${subject}` : `Contact from ${fullName}`,
      html: htmlBody,
    });

    // --- Save to database via backend API ---
    try {
      const dbRes = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          phone,
          alt_phone: altPhone ?? "",
          email,
          subject: subject ?? "",
          message,
        }),
      });
      if (!dbRes.ok) {
        const dbBody = await dbRes.text();
        console.error("DB save failed:", dbRes.status, dbBody);
      }
    } catch (dbErr) {
      console.error("Failed to save contact to database:", dbErr);
      // Non-fatal: email was sent, still return success
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact email error:", err);
    return NextResponse.json(
      { error: "Failed to send email. Please try again later." },
      { status: 500 },
    );
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
