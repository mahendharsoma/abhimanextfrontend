import PageHero from "@/components/PageHero";
import { getImageUrl } from "@/lib/api";
import { listLifeAtAbhima, listOpenings, getBanners, listWhyWe } from "@/lib/website";
import CareerOpenings from "@/components/CareerOpenings";

export const metadata = {
  title: "Career",
};

export default async function CareerPage() {
  const [lifeItems, openings, banners, whyWeList] = await Promise.all([
    listLifeAtAbhima().catch(() => []),
    listOpenings().catch(() => []),
    getBanners().catch(() => null),
    listWhyWe().catch(() => []),
  ]);

  const whyWe = whyWeList[0];

  const heroBg = banners?.careerBanner
    ? getImageUrl(banners.careerBanner)
    : "";
  const heroTitle = banners?.careerBannerText || "";

  return (
    <>
      <PageHero
        backgroundImage={heroBg}
        title={
          heroTitle ? <span dangerouslySetInnerHTML={{ __html: heroTitle }} /> : null
        }
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Career" },
        ]}
      />

      {/* ========== WHY JOIN US ========== */}
      {whyWe && (
        <section className="about-story">
          <div className="container">
            <div className="about-story-grid">
              <div className="about-story-content">
                {whyWe.title && (
                  <span className="section-badge">
                    <i className="fas fa-circle"></i> {whyWe.title}
                  </span>
                )}
                {whyWe.subtitle && (
                  <h2 className="section-title"
                    dangerouslySetInnerHTML={{
                      __html: whyWe.subtitle.replace(
                        /(\S+)\s*$/,
                        '<span class="accent">$1</span>'
                      ),
                    }}
                  />
                )}
                {whyWe.description && (
                  <div dangerouslySetInnerHTML={{ __html: whyWe.description }} />
                )}
              </div>
              {whyWe.whyWeImage && (
                <div className="about-story-image">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getImageUrl(whyWe.whyWeImage)}
                    alt={whyWe.title}
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ========== PERKS (Life at Abhima) ========== */}
      {lifeItems.length > 0 && (
        <section className="career-why">
          <div className="section-header container">
            <span className="section-badge dark">
              <i className="fas fa-circle"></i> WHAT WE OFFER
            </span>
            <h2 className="section-title">
              Life at <span className="accent">Abhima</span>
            </h2>
            <p
              className="section-subtitle"
              style={{ margin: "0 auto", textAlign: "center" }}
            >
              We invest in our people — because when our team thrives, so do our
              clients.
            </p>
          </div>
          <div className="container">
            <div className="career-perks-grid">
              {lifeItems.map((perk) => (
                <div className="career-perk" key={perk.id}>
                  <div className="career-perk-image">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getImageUrl(perk.lifeImage)}
                      alt={perk.title}
                      loading="lazy"
                    />
                  </div>
                  <h3>{perk.title}</h3>
                  <p>{perk.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========== OPEN POSITIONS ========== */}
      {openings.length > 0 && (
        <section className="career-openings">
          <div className="section-header container">
            <span className="section-badge">
              <i className="fas fa-circle"></i> OPEN POSITIONS
            </span>
            <h2 className="section-title">
              Current <span className="accent">Opportunities</span>
            </h2>
            <p
              className="section-subtitle"
              style={{ margin: "0 auto", textAlign: "center" }}
            >
              Explore our open roles and find where your skills and passion align.
            </p>
          </div>
          <div className="container">
            <CareerOpenings openings={openings} />
          </div>
        </section>
      )}
    </>
  );
}
