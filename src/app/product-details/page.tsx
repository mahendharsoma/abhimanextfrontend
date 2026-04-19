"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

const productsData: Record<
  string,
  {
    title: string;
    image: string;
    summary: string;
    description: string;
    highlights: string[];
  }
> = {
  edutech: {
    title: "Abhima EduTech",
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1800&q=80",
    summary:
      "Abhima EduTech is a connected platform that modernizes teaching, learning, and institutional operations.",
    description:
      "The solution integrates learning management, academic operations, immersive digital learning, and AI-supported assessment into one scalable ecosystem. It helps institutions improve engagement, streamline administration, and deliver better educational outcomes.",
    highlights: [
      "Unified LMS and ERP platform for institutions",
      "AI evaluator for adaptive assessment and feedback",
      "Digital library and virtual lab integration",
      "Immersive 3D learning modules for practical understanding",
    ],
  },
  bssoss: {
    title: "BSS/OSS Solutions",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1800&q=80",
    summary:
      "Our telecom BSS/OSS suite supports billing, catalog, revenue, and customer operations at scale.",
    description:
      "Designed for telecom providers, this product streamlines business support, charging workflows, service lifecycle, and operational control. It enables high-volume transaction handling with better visibility, reliability, and monetization outcomes.",
    highlights: [
      "Subscriber and billing lifecycle management",
      "Catalogue and inventory support workflows",
      "Revenue optimization and collection management",
      "Campaign and alert capabilities for customer operations",
    ],
  },
  inventory: {
    title: "Inventory Management Solution",
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1800&q=80",
    summary:
      "A real-time inventory control platform for accurate stock visibility and efficient operations.",
    description:
      "This product provides live inventory tracking, automated reorder workflows, and analytics-driven planning tools. It helps organizations improve stock accuracy, reduce delays, and integrate operations with ERP, accounting, and commerce systems.",
    highlights: [
      "Live stock visibility with alerts and tracking",
      "Smart workflow automation for replenishment",
      "Custom dashboards for operational decisions",
      "Integration-ready architecture for enterprise systems",
    ],
  },
  fleet: {
    title: "Fleet Management Solution",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1800&q=80",
    summary:
      "A comprehensive fleet intelligence solution for monitoring, optimization, and safety.",
    description:
      "The platform combines GPS monitoring, route optimization, maintenance scheduling, and actionable analytics. It gives organizations stronger operational control, lower mobility costs, and better performance management across fleets.",
    highlights: [
      "GPS-based real-time monitoring and visibility",
      "Route optimization and dispatch efficiency",
      "Maintenance scheduling with predictive insights",
      "Analytics and alerts for safer fleet operations",
    ],
  },
};

function ProductDetailsContent() {
  const searchParams = useSearchParams();
  const key = searchParams.get("product") || "edutech";
  const product = productsData[key] || productsData.edutech;

  return (
    <>
      <section
        className="page-hero service-detail-hero"
        style={{
          background: `linear-gradient(rgba(20, 28, 45, 0.55), rgba(20, 28, 45, 0.55)), url('${product.image}') center/cover no-repeat`,
        }}
      >
        <h1>{product.title}</h1>
        <div className="breadcrumb">
          <Link href="/">Home</Link>
          <span className="separator">/</span>
          <Link href="/portfolio">Products</Link>
          <span className="separator">/</span>
          <span className="current">{product.title}</span>
        </div>
      </section>

      <section className="service-detail-page">
        <div className="container">
          <div className="service-detail-content">
            <span className="section-badge">Product Overview</span>
            <h2>{product.title}</h2>
            <p>{product.summary}</p>
            <p>{product.description}</p>

            <h3>What You Get</h3>
            <ul className="service-detail-points">
              {product.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div className="service-detail-actions">
              <Link href="/contact" className="btn-cta">
                Request Demo
              </Link>
              <Link href="/portfolio" className="service-back-link">
                Back to Products <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function ProductDetailsPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: "200px 0", textAlign: "center" }}>
          Loading...
        </div>
      }
    >
      <ProductDetailsContent />
    </Suspense>
  );
}
