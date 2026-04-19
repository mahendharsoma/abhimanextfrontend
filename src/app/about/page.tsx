import PageHero from "@/components/PageHero";
import { getImageUrl } from "@/lib/api";
import {
  listAboutStory,
  listAboutStoryTiles,
  listVisionAndMission,
  listCoreValues,
  listClients,
  listCertifications,
  getSetting,
  getBanners,
} from "@/lib/website";

export const metadata = {
  title: "About",
};

export default async function AboutPage() {
  const [aboutStories, storyTiles, visionMission, coreValues, clients, certifications, setting, banners] =
    await Promise.all([
      listAboutStory().catch(() => []),
      listAboutStoryTiles().catch(() => []),
      listVisionAndMission().catch(() => []),
      listCoreValues().catch(() => []),
      listClients().catch(() => []),
      listCertifications().catch(() => []),
      getSetting().catch(() => null),
      getBanners().catch(() => null),
    ]);

  const aboutStory = aboutStories[0];
  const mission = visionMission.find((vm) => vm.title.toLowerCase().includes("mission"));
  const vision = visionMission.find((vm) => vm.title.toLowerCase().includes("vision"));

  return (
    <>
      <PageHero
        backgroundImage={banners?.aboutUsBanner ? getImageUrl(banners.aboutUsBanner) : ""}
        title={
          banners?.aboutUsBannerText ? (
            <span dangerouslySetInnerHTML={{ __html: banners.aboutUsBannerText }} />
          ) : null
        }
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About" },
        ]}
      />

      {/* ========== COMPANY OVERVIEW ========== */}
      <section className="about-story">
        <div className="container">
          {aboutStory?.sectionBadge && <span className="section-badge">{aboutStory.sectionBadge}</span>}
          {aboutStory?.title && (
            <h2 className="section-title">
              <span dangerouslySetInnerHTML={{ __html: aboutStory.title }} />
            </h2>
          )}
          <div className="about-story-grid">
            <div className="about-story-content">
              {aboutStory?.description && (
                <div dangerouslySetInnerHTML={{ __html: aboutStory.description }} />
              )}
            </div>
            {aboutStory?.storyImage && (
              <div className="about-story-image">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getImageUrl(aboutStory.storyImage)}
                  alt={setting?.companyName || "About"}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  loading="lazy"
                />
              </div>
            )}
          </div>
          {storyTiles.length > 0 && (
            <div className="story-tiles">
              {storyTiles.map((tile) => (
                <article className="story-tile" key={tile.id}>
                  <h3>{tile.title}</h3>
                  <p>{tile.description}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ========== MISSION & VISION ========== */}
      <section className="mv-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Our Purpose</span>
            <h2
              className="section-title"
              style={{ color: "var(--white)" }}
            >
              Mission &amp; <span className="accent">Vision</span>
            </h2>
          </div>
          <div className="mv-grid">
            {mission && (
              <div className="mv-card">
                <div className="mv-card-head">
                  <div className="mv-icon">
                    <i className="fas fa-bullseye"></i>
                  </div>
                  <span className="mv-pill">Mission</span>
                </div>
                <div className="mv-card-body" dangerouslySetInnerHTML={{ __html: mission.description }} />
              </div>
            )}
            {vision && (
              <div className="mv-card">
                <div className="mv-card-head">
                  <div className="mv-icon">
                    <i className="fas fa-eye"></i>
                  </div>
                  <span className="mv-pill">Vision</span>
                </div>
                <div className="mv-card-body" dangerouslySetInnerHTML={{ __html: vision.description }} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========== CORE VALUES ========== */}
      {coreValues.length > 0 && (
        <section className="values-section">
          <div className="container">
            <div className="section-header">
              <span className="section-badge">Core Values</span>
              <h2 className="section-title">
                We Are Known <span className="accent">For</span>
              </h2>
              <p
                className="section-subtitle"
                style={{ margin: "0 auto" }}
              >
                Our comprehensive suite of IT services and solutions designed to
                propel your business forward.
              </p>
            </div>
            <div className="values-grid">
              {coreValues.map((val) => (
                <div className="value-card" key={val.id}>
                  <div className="value-image">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getImageUrl(val.coreValueImage)}
                      alt={val.title}
                      loading="lazy"
                    />
                  </div>
                  <h3>{val.title}</h3>
                  <p>{val.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========== CLIENTS ========== */}
      {clients.length > 0 && (
        <section className="clients-reference-section">
          <div className="container">
            <div className="clients-reference-head">
              <p>Our Clients</p>
              <h2>
                Driving Success <span>Together</span>
              </h2>
            </div>
            <div className="clients-reference-grid">
              {clients.map((client) => (
                <article className="ref-client-card" key={client.id}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getImageUrl(client.clientImage)}
                    alt={client.name || "Client logo"}
                    loading="lazy"
                  />
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========== QUALITY ========== */}
      <section className="quality-reference-section">
        <div className="quality-reference-head">
          <p>We are your Strategic Outsourcing Partner for</p>
          <h2>
            Uncompromised <span>Quality</span>
          </h2>
        </div>
        <div className="quality-reference-image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/standard-quality-control-collage-concept.jpg.jpeg"
            alt="Quality and standards assurance"
            loading="lazy"
          />
        </div>
      </section>

      {/* ========== CERTIFICATIONS ========== */}
      {certifications.length > 0 && (
        <section className="cert-reference-section">
          <div className="container">
            <div className="cert-reference-head">
              <p>Our Certifications</p>
              <h2>
                Our Expertise &ndash;{" "}
                <span>Your Strategic Edge</span>
              </h2>
            </div>
            <div className="cert-cascade">
              {certifications.map((cert, idx) => {
                const row = idx + 1;
                const side = row % 2 === 1 ? "left" : "right";
                return (
                  <div
                    className={`cert-cascade-row cert-row-${row}`}
                    key={cert.id}
                  >
                    <div className="cert-cascade-label cert-label-left">
                      {side === "left" && (
                        <>
                          <strong>{cert.title}</strong>
                          <span>{cert.subtitle}</span>
                        </>
                      )}
                    </div>
                    <div className="cert-cascade-line"></div>
                    <div className="cert-cascade-badge">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getImageUrl(cert.certificationImage)}
                        alt={cert.title}
                      />
                    </div>
                    <div className="cert-cascade-line"></div>
                    <div className="cert-cascade-label cert-label-right">
                      {side === "right" && (
                        <>
                          <strong>{cert.title}</strong>
                          <span>{cert.subtitle}</span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
