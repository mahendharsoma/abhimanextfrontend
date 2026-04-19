"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface Props {
  jobTitle: string;
  onClose: () => void;
}

export default function ApplyModal({ jobTitle, onClose }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [loading, setLoading] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const normalizePhone = (value: string) => {
    const cleaned = value.replace(/[^\d+\-\s()]/g, "").slice(0, 24);
    const hasLeadingPlus = cleaned.startsWith("+");
    const withoutExtraPlus = cleaned.replace(/\+/g, "");
    return hasLeadingPlus ? `+${withoutExtraPlus}` : withoutExtraPlus;
  };

  const isValidPhone = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length < 7 || digits.length > 15) return false;
    if (!/^\+?[\d()\-\s]+$/.test(value)) return false;
    const plusCount = (value.match(/\+/g) || []).length;
    return plusCount <= 1 && (plusCount === 0 || value.startsWith("+"));
  };

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    // Prevent background scroll
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFileError("");
    if (!selected) { setFile(null); return; }
    const allowed = ["application/pdf", "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(selected.type)) {
      setFileError("Only PDF or DOC/DOCX files are allowed.");
      setFile(null);
      e.target.value = "";
      return;
    }
    if (selected.size > 5 * 1024 * 1024) {
      setFileError("File size must be under 5 MB.");
      setFile(null);
      e.target.value = "";
      return;
    }
    setFile(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { setFileError("Please attach your resume."); return; }
    if (!isValidPhone(phone)) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("jobTitle", jobTitle);
      fd.append("name", name);
      fd.append("phone", phone);
      fd.append("email", email);
      fd.append("resume", file);

      const res = await fetch("/api/apply", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Submission failed. Please try again.");
      } else {
        toast.success("Application submitted! We'll be in touch soon.");
        onClose();
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="apply-modal-overlay"
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="apply-modal" role="dialog" aria-modal="true" aria-labelledby="apply-modal-title">
        <div className="apply-modal-header">
        <button className="apply-modal-close" onClick={onClose} aria-label="Close">
          <i className="fas fa-xmark"></i>
        </button>
        <h3 id="apply-modal-title">Apply for Position</h3>
          <p className="apply-modal-job">
            <i className="fas fa-briefcase"></i> {jobTitle}
          </p>
        </div>

        <div className="apply-modal-body">
        <form onSubmit={handleSubmit} className="apply-form" noValidate>
          <div className="form-group">
            <label htmlFor="apply-name">Full Name *</label>
            <input
              id="apply-name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="apply-phone">Phone Number *</label>
            <input
              id="apply-phone"
              type="tel"
              placeholder="+91 XXXXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(normalizePhone(e.target.value))}
              onPaste={(e) => {
                e.preventDefault();
                const pasted = e.clipboardData.getData("text");
                setPhone(normalizePhone(pasted));
              }}
              inputMode="tel"
              pattern="^\\+?[\\d()\\-\\s]{7,24}$"
              maxLength={24}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="apply-email">Email Address *</label>
            <input
              id="apply-email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="apply-resume">Resume * <span className="form-hint">(PDF or DOC/DOCX, max 5 MB)</span></label>
            <input
              id="apply-resume"
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFile}
            />
            {fileError && <span className="form-error-inline">{fileError}</span>}
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Submitting..." : (<>Submit Application <i className="fas fa-paper-plane"></i></>)}
          </button>
        </form>
        </div>
      </div>
    </div>
  );
}
