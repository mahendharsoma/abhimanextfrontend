import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { emailConfig } from "@/lib/config";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3005").replace(/\/+$/, "");

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) return false;
  if (!/^\+?[\d()\-\s]+$/.test(phone)) return false;
  const plusCount = (phone.match(/\+/g) || []).length;
  return plusCount <= 1 && (plusCount === 0 || phone.startsWith("+"));
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();

    const jobTitle = (form.get("jobTitle") as string | null)?.trim() ?? "";
    const name = (form.get("name") as string | null)?.trim() ?? "";
    const phone = (form.get("phone") as string | null)?.trim() ?? "";
    const email = (form.get("email") as string | null)?.trim() ?? "";
    const resume = form.get("resume") as File | null;

    // --- Validation ---
    if (!jobTitle || !name || !phone || !email || !resume) {
      return NextResponse.json(
        { error: "All fields including resume are required." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    if (!isValidPhone(phone)) {
      return NextResponse.json({ error: "Invalid phone number." }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(resume.type)) {
      return NextResponse.json(
        { error: "Only PDF or DOC/DOCX files are allowed." },
        { status: 400 }
      );
    }

    if (resume.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Resume file must be under 5 MB." },
        { status: 400 }
      );
    }

    // --- Save to database via backend API ---
    try {
      const dbForm = new FormData();
      dbForm.append("job_name", jobTitle);
      dbForm.append("full_name", name);
      dbForm.append("phone_number", phone);
      dbForm.append("email", email);
      dbForm.append(
        "resume_url",
        `${API_BASE_URL}/uploads/applications/${encodeURIComponent(resume.name)}`
      );
      // Send file in the expected backend field name.
      dbForm.append("resume", resume, resume.name);

      const dbRes = await fetch(`${API_BASE_URL}/applications`, {
        method: "POST",
        body: dbForm,
      });

      if (!dbRes.ok) {
        const dbBody = await dbRes.text();
        console.error("DB save failed:", dbRes.status, dbBody);
        return NextResponse.json(
          { error: dbBody || "Failed to save application in database." },
          { status: 502 }
        );
      }
    } catch (dbErr) {
      console.error("Failed to save application to database:", dbErr);
      return NextResponse.json(
        { error: "Database service unavailable. Please try again." },
        { status: 502 }
      );
    }

    // --- Send email ---
    if (!emailConfig.user || !emailConfig.pass || !emailConfig.to) {
      console.error("SMTP credentials or CONTACT_EMAIL not configured.");
      return NextResponse.json(
        { error: "Email service is not configured." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.port === 465,
      auth: { user: emailConfig.user, pass: emailConfig.pass },
    });

    const resumeBuffer = Buffer.from(await resume.arrayBuffer());
    const recipients = emailConfig.to.split(",").map((e) => e.trim()).filter(Boolean);

    await transporter.sendMail({
      from: `"Job Applications" <${emailConfig.user}>`,
      to: recipients.join(", "),
      replyTo: email,
      subject: `Job Application: ${jobTitle} — ${name}`,
      html: `
        <h2>New Job Application</h2>
        <table style="border-collapse:collapse;width:100%;max-width:600px;">
          <tr><td style="padding:8px;font-weight:bold;">Position</td><td style="padding:8px;">${escapeHtml(jobTitle)}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Name</td><td style="padding:8px;">${escapeHtml(name)}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Phone</td><td style="padding:8px;">${escapeHtml(phone)}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Email</td><td style="padding:8px;">${escapeHtml(email)}</td></tr>
        </table>
        <p>Resume attached.</p>
      `,
      attachments: [
        {
          filename: resume.name,
          content: resumeBuffer,
          contentType: resume.type,
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Job application error:", err);
    return NextResponse.json(
      { error: "Failed to submit application. Please try again later." },
      { status: 500 }
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
