"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

const servicesData: Record<
  string,
  {
    title: string;
    image: string;
    summary: string;
    description: string;
    highlights: string[];
  }
> = {
  software: {
    title: "Software and Mobile Application Development",
    image:
      "https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=1800&q=80",
    summary:
      "We engineer secure, scalable web and mobile products tailored to your business workflows, customer journeys, and growth targets.",
    description:
      "From product discovery and architecture design to launch and lifecycle support, we build robust digital products that improve customer experience, streamline internal operations, and create measurable return on investment. Our teams focus on speed, quality, and long-term maintainability so your platform keeps delivering value as your business evolves.",
    highlights: [
      "Custom web applications for enterprise and customer portals",
      "Native and cross-platform mobile app development",
      "API integrations with payment, ERP, CRM, and cloud systems",
      "Performance optimization, testing, and ongoing enhancements",
    ],
  },
  staffing: {
    title: "IT Staffing Services",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1800&q=80",
    summary:
      "Scale your teams quickly with pre-screened technology talent aligned to your stack, delivery model, and project timelines.",
    description:
      "Our staffing practice helps you close critical skill gaps through contract, contract-to-hire, and full-time hiring support across engineering, QA, cloud, data, and support functions. We align every role to your technical environment and business outcomes, helping your teams stay productive without delays in delivery.",
    highlights: [
      "Fast talent deployment for urgent project requirements",
      "Flexible hiring models for short-term or long-term needs",
      "Skill validation and role-based technical screening",
      "Transparent coordination with your hiring and delivery teams",
    ],
  },
  consulting: {
    title: "IT Consulting and Managed Services",
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1800&q=80",
    summary:
      "Strengthen your technology foundation through expert consulting, governance frameworks, and proactive managed support.",
    description:
      "We evaluate your current technology landscape, identify bottlenecks, and define practical modernization roadmaps that balance innovation with operational stability. Our managed services teams then operate, monitor, and optimize your infrastructure, security posture, and performance so your internal teams can focus on strategic business initiatives.",
    highlights: [
      "Technology assessments and transformation roadmaps",
      "Cloud operations, monitoring, and incident response",
      "Security hardening, compliance, and risk reduction",
      "SLA-based managed support for business continuity",
    ],
  },
  implementation: {
    title: "Project Implementation",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1800&q=80",
    summary:
      "Deliver complex initiatives with structured planning, disciplined execution, and predictable measurable outcomes.",
    description:
      "Our implementation team manages every phase of execution, including scope validation, resource planning, milestone governance, quality assurance, and go-live readiness. After deployment, we continue with performance tracking and optimization so the delivered solution remains aligned with evolving business needs.",
    highlights: [
      "End-to-end project planning and execution governance",
      "Milestone tracking with clear reporting and accountability",
      "Risk management, change control, and quality assurance",
      "Post-implementation support and continuous improvement",
    ],
  },
};

function ServiceDetailsContent() {
  const searchParams = useSearchParams();
  const key = searchParams.get("service") || "software";
  const service = servicesData[key] || servicesData.software;

  return (
    <>
      <section
        className="page-hero service-detail-hero"
        style={{
          background: `linear-gradient(rgba(20, 28, 45, 0.55), rgba(20, 28, 45, 0.55)), url('${service.image}') center/cover no-repeat`,
        }}
      >
        <h1>{service.title}</h1>
        <div className="breadcrumb">
          <Link href="/">Home</Link>
          <span className="separator">/</span>
          <Link href="/services">Services</Link>
          <span className="separator">/</span>
          <span className="current">{service.title}</span>
        </div>
      </section>

      <section className="service-detail-page">
        <div className="container">
          <div className="service-detail-content">
            <span className="section-badge">Our Expertise</span>
            <h2>{service.title}</h2>
            <p>{service.summary}</p>
            <p>{service.description}</p>

            <h3>What You Get</h3>
            <ul className="service-detail-points">
              {service.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div className="service-detail-actions">
              <Link href="/contact" className="btn-cta">
                Start Your Project
              </Link>
              <Link href="/services" className="service-back-link">
                Back to Services <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function ServiceDetailsPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: "200px 0", textAlign: "center" }}>
          Loading...
        </div>
      }
    >
      <ServiceDetailsContent />
    </Suspense>
  );
}
