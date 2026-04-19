import Link from "next/link";
import { getImageUrl } from "@/lib/api";
import {
  listWebsiteServices,
  listWebsiteProducts,
  listWebsiteProductTags,
  listWhyChooseUs,
  listIndustries,
  listAboutUs,
  getBanners,
  getSetting,
} from "@/lib/website";

export default async function Home() {
  const [services, products, whyChooseUs, industries, aboutUsList, banners, setting] = await Promise.all([
    listWebsiteServices().catch(() => []),
    listWebsiteProducts().catch(() => []),
    listWhyChooseUs().catch(() => []),
    listIndustries().catch(() => []),
    listAboutUs().catch(() => []),
    getBanners().catch(() => null),
    getSetting().catch(() => null),
  ]);

  const productTagsMap = new Map<number, string[]>();
  await Promise.all(
    products.map(async (p) => {
      const tags = await listWebsiteProductTags(p.id).catch(() => []);
      productTagsMap.set(p.id, tags.map((t) => t.tagName));
    }),
  );

  const aboutUs = aboutUsList[0];

  return (
    <>
      {/* ========== HERO ========== */}
      <section className="hero">
        {banners?.heroVideo && (
          <video
            className="hero-video"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Abhima hero video"
          >
            <source src={banners.heroVideo} type="video/mp4" />
          </video>
        )}
        <div className="container">
          <div className="hero-grid">
            <div className="hero-left">
              {banners?.heroBannerText && (
                <h1 className="section-title">
                  <span className="text-white">
                    {banners.heroBannerText.substring(0, banners.heroBannerText.lastIndexOf(" "))}{" "}
                  </span>
                  <span className="accent">
                    {banners.heroBannerText.substring(banners.heroBannerText.lastIndexOf(" ") + 1)}
                  </span>
                </h1>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ========== ABOUT ========== */}
      <section className="about" id="about">
        <div className="container">
          <div className="about-left">
            <span className="section-badge outline">
              <i className="fas fa-circle"></i> WHO WE ARE
            </span>
            {setting?.companyName && (
              <h2 className="section-title about-title-single-line">
                About <span className="accent">{setting.companyName}</span>
              </h2>
            )}
            {aboutUs && (
              <>
                {aboutUs.title && <p className="section-subtitle">{aboutUs.title}</p>}
                {aboutUs.description && (
                  <p className="section-subtitle" style={{ marginTop: 12 }}>
                    {aboutUs.description}
                  </p>
                )}
              </>
            )}
          </div>
          <div className="about-right">
            {aboutUs?.aboutImage && (
              <div className="about-image">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getImageUrl(aboutUs.aboutImage)}
                  alt={setting?.companyName || "About"}
                  loading="lazy"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========== SERVICES ========== */}
      <section className="services" id="services">
        <div className="section-header container">
          <span className="section-badge dark">
            <i className="fas fa-circle"></i> WHAT WE DO
          </span>
          <h2 className="section-title">
            Our Core <span className="accent">Services</span>
          </h2>
        </div>
        <div className="container">
          <div className="services-grid">
            {services.map((svc) => (
              <div className="service-card" key={svc.id}>
                <div className="service-image">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getImageUrl(svc.serviceImage)}
                    alt={svc.title}
                    loading="lazy"
                  />
                </div>
                <h3>{svc.title}</h3>
                <p>{svc.shortDescription}</p>
                <Link
                  href={`/service-details?id=${svc.id}`}
                  className="service-link"
                >
                  Learn More <i className="fas fa-arrow-right"></i>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PRODUCTS ========== */}
      <section className="products" id="products">
        <div className="section-header container">
          <span className="section-badge light">
            <i className="fas fa-circle"></i> What We Offer
          </span>
          <h2 className="section-title">
            Our <span className="accent">Product Suite</span>
          </h2>
        </div>
        <div className="container">
          <div className="products-grid">
            {products.map((product) => {
              const tags = productTagsMap.get(product.id) ?? [];
              return (
                <div className="product-card" key={product.id}>
                  <div className="product-image">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getImageUrl(product.productImage)}
                      alt={product.title}
                      loading="lazy"
                    />
                  </div>
                  <h3>{product.title}</h3>
                  <p>{product.description}</p>
                  {tags.length > 0 && (
                    <div className="product-tags">
                      {tags.map((tag) => (
                        <span className="product-tag" key={tag}>{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== WHY CHOOSE US ========== */}
      <section className="why-us">
        <div className="section-header container">
          <span className="section-badge dark">
            <i className="fas fa-circle"></i> WHY CHOOSE US
          </span>
          <h2 className="section-title">What&apos;s <span className="accent">Sets Us</span> Apart</h2>
        </div>
        <div className="container">
          <div className="why-grid">
            {whyChooseUs.map((item) => (
              <div className="why-card" key={item.id}>
                <div className="why-card-media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getImageUrl(item.whyChooseUsImage)}
                    alt={item.title}
                    loading="lazy"
                  />
                </div>
                <div className="why-card-overlay">
                  <h3 className="why-card-title">{item.title}</h3>
                  <p className="why-card-desc">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== INDUSTRIES ========== */}
      <section className="industries">
        <div className="section-header container">
          <span className="section-badge outline">
            <i className="fas fa-circle"></i> Industries
          </span>
          <h2 className="section-title">
            {" "}<span className="accent">Domains</span> We Support{" "}
          </h2>
        </div>
        <div className="container">
          <div className="industries-list">
            {industries.map((industry) => (
              <span key={industry.id} className="industry-pill">
                {industry.icon && (
                  <span className="industry-icon" aria-hidden="true">
                    <i className={industry.icon}></i>
                  </span>
                )}
                <span>{industry.name}</span>
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
