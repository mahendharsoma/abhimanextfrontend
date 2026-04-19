// ---------------------------------------------------------------------------
// Contact form subject options
// ---------------------------------------------------------------------------
// Edit this array to add/remove/reorder subjects shown in the contact form.
// Set to an empty array to hide the subject dropdown entirely.

export const contactSubjects = [
  { value: "General Inquiry", label: "General Inquiry" },
  { value: "Web Development", label: "Web Development" },
  { value: "Mobile App", label: "Mobile App Development" },
  { value: "Cloud Services", label: "Cloud Services" },
  { value: "IT Consulting", label: "IT Consulting" },
  { value: "Support", label: "Technical Support" },
  { value: "Other", label: "Other" },
];

// ---------------------------------------------------------------------------
// Email configuration (used by /api/contact)
// ---------------------------------------------------------------------------
// SMTP credentials are read from environment variables:
//   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
// Recipient email(s) to receive contact form submissions:
//   CONTACT_EMAIL  — comma-separated for multiple recipients

export const emailConfig = {
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  user: process.env.SMTP_USER || "",
  pass: process.env.SMTP_PASS || "",
  to: process.env.CONTACT_EMAIL || "",
};
