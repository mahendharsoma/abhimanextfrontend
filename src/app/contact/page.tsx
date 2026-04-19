import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import { getBanners, getSetting } from "@/lib/website";
import { getImageUrl } from "@/lib/api";

export const metadata = {
  title: "Contact",
};

export default async function ContactPage() {
  const [banners, setting] = await Promise.all([
    getBanners().catch(() => null),
    getSetting().catch(() => null),
  ]);

  const heroBg = banners?.contactUsBanner
    ? getImageUrl(banners.contactUsBanner)
    : "";

  const heroTitle = banners?.contactUsBannerText || "";

  const usaAddress = setting?.usaAddress || "";
  const indiaAddress = setting?.address || "";
  const usaPhone = setting?.usaPhone || "";
  const usaAltPhone = setting?.usaAltPhone || "";
  const indiaPhone = setting?.indiaPhone || "";
  const indiaAltPhone = setting?.indiaAltPhone || "";
  const email = setting?.email || "";
  const facebook = setting?.facebook || "";
  const twitter = setting?.twitter || "";
  const youtube = setting?.youtube || "";
  const instagram = setting?.instagram || "";
  const usaGoogleMap = setting?.usaGoogleMap || "";
  const indiaGoogleMap = setting?.indiaGoogleMap || "";

  const phoneHref = (phone: string) => `tel:${phone.replace(/[^+\d]/g, "")}`;

  return (
    <>
      <PageHero
        backgroundImage={heroBg}
        title={
          heroTitle ? <span dangerouslySetInnerHTML={{ __html: heroTitle }} /> : null
        }
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Contact" },
        ]}
      />

      {/* ========== CONTACT SECTION ========== */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-left">
            <h2 className="section-title">
              Get In <span className="accent">Touch</span>
            </h2>
            <p
              className="section-subtitle"
              style={{ marginBottom: 32 }}
            >
              We&apos;re here to help. Contact us today and let&apos;s work
              together to bring your ideas to life.
            </p>
            <div className="contact-info-cards">
              <div className="contact-info-card">
                <i className="fas fa-location-dot"></i>
                <div>
                  <h4>USA Office</h4>
                  <p>{usaAddress}</p>
                  <p>
                    <i className="fas fa-phone inline-phone-icon"></i>{" "}
                    <a href={phoneHref(usaPhone)}>{usaPhone}</a>
                  </p>
                  <p>
                    <i className="fas fa-phone inline-phone-icon"></i>{" "}
                    <a href={phoneHref(usaAltPhone)}>{usaAltPhone}</a>
                  </p>
                </div>
              </div>
              <div className="contact-info-card">
                <i className="fas fa-location-dot"></i>
                <div>
                  <h4>India Office</h4>
                  <p>{indiaAddress}</p>
                  <p>
                    <i className="fas fa-phone inline-phone-icon"></i>{" "}
                    <a href={phoneHref(indiaPhone)}>{indiaPhone}</a>
                  </p>
                  <p>
                    <i className="fas fa-phone inline-phone-icon"></i>{" "}
                    <a href={phoneHref(indiaAltPhone)}>{indiaAltPhone}</a>
                  </p>
                </div>
              </div>
              <div className="contact-info-card">
                <i className="fas fa-envelope"></i>
                <div>
                  <h4>Email Us</h4>
                  <p>
                    <a href={`mailto:${email}`}>{email}</a>
                  </p>
                </div>
              </div>
              <div className="contact-social contact-info-card">
                <div style={{ flex: 1 }}>
                  <h4>Follow Us</h4>
                  <div className="contact-social-links">
                    <a href={facebook} aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href={twitter} aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a href={youtube} aria-label="YouTube" target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-youtube"></i>
                    </a>
                    <a href={instagram} aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-instagram"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="contact-right">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* ========== MAP SECTION ========== */}
      <section className="map-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">
              <i className="fas fa-circle"></i> OUR LOCATIONS
            </span>
            <h2 className="section-title">
              Find Our <span className="accent">Offices</span>
            </h2>
          </div>
          <div className="map-grid">
            <div className="map-card">
              <h3>USA Office</h3>
              <iframe
                src={usaGoogleMap}
                width="100%"
                height="400"
                style={{ border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Abhima Technologies USA Office Location"
              ></iframe>
            </div>
            <div className="map-card">
              <h3>India Office</h3>
              <iframe
                src={indiaGoogleMap}
                width="100%"
                height="400"
                style={{ border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Abhima Technologies India Office Location"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
