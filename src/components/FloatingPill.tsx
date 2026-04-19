"use client";

import { useEffect, useState } from "react";

export default function FloatingPill() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`floating-pill${visible ? " visible" : ""}`}>
      <button
        className="pill-btn scroll-top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll to top"
      >
        <i className="fas fa-arrow-up"></i>
      </button>
      <a href="tel:+19476224462" className="pill-btn phone" aria-label="Call us">
        <i className="fas fa-phone"></i>
      </a>
    </div>
  );
}
