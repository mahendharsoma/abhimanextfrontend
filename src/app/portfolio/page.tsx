import Link from "next/link";
import PageHero from "@/components/PageHero";
import { getImageUrl } from "@/lib/api";
import {
  listWebsiteProducts,
  listWebsiteProductMetrics,
  listWebsiteProductTags,
  getBanners,
} from "@/lib/website";

export const metadata = {
  title: "Portfolio",
};

export default async function PortfolioPage() {
  const [products, banners] = await Promise.all([
    listWebsiteProducts().catch(() => []),
    getBanners().catch(() => null),
  ]);

  const heroBg = banners?.productsBanner
    ? getImageUrl(banners.productsBanner)
    : "";
  const heroTitle = banners?.productsBannerText || "";

  const metricsMap = new Map<number, { value: string; label: string }[]>();
  const tagsMap = new Map<number, string[]>();

  await Promise.all(
    products.map(async (p) => {
      const [metrics, tags] = await Promise.all([
        listWebsiteProductMetrics(p.id).catch(() => []),
        listWebsiteProductTags(p.id).catch(() => []),
      ]);
      metricsMap.set(
        p.id,
        metrics.map((m) => ({ value: m.metricValue, label: m.metricLabel })),
      );
      tagsMap.set(
        p.id,
        tags.map((t) => t.tagName),
      );
    }),
  );

  return (
    <>
      <PageHero
        backgroundImage={heroBg}
        title={
          heroTitle ? <span dangerouslySetInnerHTML={{ __html: heroTitle }} /> : null
        }
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Portfolio" },
        ]}
      />

      {/* ========== FEATURED PROJECTS ========== */}
      <section className="folio-section">
        <div className="section-header container">
          <span className="section-badge dark">
            <i className="fas fa-circle"></i> Products
          </span>
          <h2 className="section-title">
            <span className="accent">Our Products</span>
          </h2>
        </div>
        <div className="container">
          {products.map((product, idx) => {
            const metrics = metricsMap.get(product.id) ?? [];
            const tags = tagsMap.get(product.id) ?? [];
            const reverse = idx % 2 === 1;

            return (
              <div
                className={`folio-featured${reverse ? " folio-featured-reverse" : ""}`}
                key={product.id}
              >
                <div className="folio-featured-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getImageUrl(product.productImage)}
                    alt={product.title}
                  />
                  <div className="folio-featured-overlay">
                    <span className="folio-category">{product.category}</span>
                  </div>
                </div>
                <div className="folio-featured-content">
                  <h3>{product.title}</h3>
                  <p>{product.description}</p>
                  {metrics.length > 0 && (
                    <div className="folio-metrics">
                      {metrics.map((m) => (
                        <div className="folio-metric" key={m.label}>
                          <strong>{m.value}</strong>
                          <span>{m.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {tags.length > 0 && (
                    <div className="folio-tech">
                      {tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  )}
                  <Link
                    href={`/product-details?id=${product.id}`}
                    className="svc-spotlight-link"
                  >
                    Read more <i className="fas fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
