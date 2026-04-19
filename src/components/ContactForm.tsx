"use client";

import { useState } from "react";
import { toast } from "sonner";

interface FormState {
  fullName: string;
  phone: string;
  altPhone: string;
  email: string;
  subject: string;
  message: string;
}

const initialState: FormState = {
  fullName: "",
  phone: "",
  altPhone: "",
  email: "",
  subject: "",
  message: "",
};

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Something went wrong. Please try again.");
      } else {
        toast.success("Thank you! Your message has been sent successfully.");
        setForm(initialState);
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <h3>Send Us a Message</h3>
      <p className="form-subtitle">
        Fill out the form below and we&apos;ll get back to you within 24 hours
      </p>

      <div className="form-group">
        <label htmlFor="fullName">Full Name *</label>
        <input
          type="text"
          id="fullName"
          placeholder="Enter your full name"
          value={form.fullName}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="phone">Phone Number *</label>
        <input
          type="tel"
          id="phone"
          placeholder="+91 XXXXXXXXXX"
          value={form.phone}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="altPhone">Alternative Phone Number</label>
        <input
          type="tel"
          id="altPhone"
          placeholder="+91 XXXXXXXXXX"
          value={form.altPhone}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email Address *</label>
        <input
          type="email"
          id="email"
          placeholder="your.email@example.com"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="subject">Subject *</label>
        <select id="subject" value={form.subject} onChange={handleChange} required>
          <option value="" disabled>
            Select a subject
          </option>
          <option value="General Inquiry">General Inquiry</option>
          <option value="Web Development">Web Development</option>
          <option value="Mobile App">Mobile App Development</option>
          <option value="Cloud Services">Cloud Services</option>
          <option value="IT Consulting">IT Consulting</option>
          <option value="Support">Technical Support</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="message">Message *</label>
        <textarea
          id="message"
          placeholder="Tell us about your project or inquiry..."
          value={form.message}
          onChange={handleChange}
          required
        ></textarea>
      </div>
      <button type="submit" className="btn-submit" disabled={loading}>
        {loading ? "Sending..." : (
          <>Send Message <i className="fas fa-paper-plane"></i></>
        )}
      </button>
    </form>
  );
}
