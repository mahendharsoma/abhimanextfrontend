import Link from "next/link";
import PageHero from "@/components/PageHero";
import { getImageUrl } from "@/lib/api";
import { listWebsiteServices, getBanners } from "@/lib/website";

export const metadata = {
  title: "Services",
};

export default async function ServicesPage() {
  const [services, banners] = await Promise.all([
    listWebsiteServices().catch(() => []),
    getBanners().catch(() => null),
  ]);

  const heroBg = banners?.servicesBanner
    ? getImageUrl(banners.servicesBanner)
    : "";
  const heroTitle = banners?.servicesBannerText || "";

  return (
    <div className="services-page">
      <PageHero
        backgroundImage={heroBg}
        title={
          heroTitle ? <span dangerouslySetInnerHTML={{ __html: heroTitle }} /> : null
        }
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services" },
        ]}
      />

      {/* ========== CORE SERVICES ========== */}
      <section className="svc-detail-section svc-detail-light svc-spotlight-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Services</span>
            <h2 className="section-title">
              Our <span className="accent">Core</span> Services
            </h2>
          </div>
          <div className="svc-spotlight-list">
            {services.map((svc) => (
              <article className="svc-spotlight-card" key={svc.id}>
                <div
                  className="svc-spotlight-media"
                  style={{ backgroundImage: `url('${getImageUrl(svc.serviceImage)}')` }}
                ></div>
                <div className="svc-spotlight-overlay">
                  <h3>{svc.title}</h3>
                  <p>{svc.shortDescription}</p>
                  <Link href={`/service-details?id=${svc.id}`} className="svc-spotlight-link">
                    Read more <i className="fas fa-arrow-right"></i>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
