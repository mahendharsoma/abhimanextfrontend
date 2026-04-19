import Link from "next/link";
import Image from "next/image";

interface FooterProps {
  ctaTitle?: string;
  ctaDescription?: string;
  showBrochure?: boolean;
}

export default function Footer({
  ctaTitle = "Ready to Transform Your Business?",
  ctaDescription = "Let's build something exceptional together.",
  showBrochure = true,
}: FooterProps) {
  return (
    <footer className="footer">
      {/* Footer CTA Banner */}
      <div className="footer-cta">
        <div className="container">
          <div className="footer-cta-inner">
            <div className="footer-cta-text">
              <h3>{ctaTitle}</h3>
              <p>{ctaDescription}</p>
            </div>
            <div className="footer-cta-actions">
              {showBrochure && (
                <a
                  href="/Brochure/broucher.pdf"
                  className="footer-cta-btn"
                  download="broucher.pdf"
                >
                  Download Brochure <i className="fas fa-download"></i>
                </a>
              )}
              <Link href="/contact" className="footer-cta-btn">
                Contact Us <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Main */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Column 1: Brand */}
            <div className="footer-col footer-brand">
              <Link href="/" className="logo">
                <Image
                  src="/images/logo.png"
                  alt="Abhima Technologies"
                  className="logo-img"
                  width={120}
                  height={120}
                />
              </Link>
              <p className="footer-desc">
                Driving global success through smart digital solutions,
                future-ready technology, and trusted collaborations.
              </p>
              <div className="footer-socials">
                <a href="#" className="footer-social-link" aria-label="Instagram">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="footer-social-link" aria-label="LinkedIn">
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a href="#" className="footer-social-link" aria-label="WhatsApp">
                  <i className="fab fa-whatsapp"></i>
                </a>
                <a href="#" className="footer-social-link" aria-label="Facebook">
                  <i className="fab fa-facebook-f"></i>
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="footer-col">
              <h4 className="footer-col-title">Quick Links</h4>
              <ul className="footer-links">
                <li><Link href="/">Home</Link></li>
                <li><Link href="/about">About Us</Link></li>
                <li><Link href="/services">Services</Link></li>
                <li><Link href="/portfolio">Our Products</Link></li>
                <li><Link href="/career">Career</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>

            {/* Column 3: Services */}
            <div className="footer-col">
              <h4 className="footer-col-title">Services</h4>
              <ul className="footer-links">
                <li><Link href="/services">Software Development</Link></li>
                <li><Link href="/services">Cloud Solutions</Link></li>
                <li><Link href="/services">Data Analytics</Link></li>
                <li><Link href="/services">IT Consulting</Link></li>
                <li><Link href="/services">Digital Transformation</Link></li>
              </ul>
            </div>

            {/* Column 4: Contact */}
            <div className="footer-col">
              <h4 className="footer-col-title">Contact Us</h4>
              <div className="footer-contact-list">
                <div className="footer-contact-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <div>
                    <strong>USA Office</strong>
                    <p>
                      24155 Drake Road, Suite 206, Farmington, MI 48335-3168,
                      United States
                    </p>
                  </div>
                </div>
                <div className="footer-contact-item">
                  <i className="fas fa-phone"></i>
                  <div>
                    <a href="tel:+19476224462">+1-947-6 ABHIMA,</a>
                    <a href="tel:+19476224462">+1-947-622-4462</a>
                  </div>
                </div>
                <div className="footer-contact-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <div>
                    <strong>India Office</strong>
                    <p>
                      Sri Venkata Sai Complex, 1-62/33/34 First Floor, Kavuri
                      Hills, Madhapur, Hyderabad 500033
                    </p>
                  </div>
                </div>
                <div className="footer-contact-item">
                  <i className="fas fa-phone"></i>
                  <div>
                    <a href="tel:+919989130999">+91 99891 30999,</a>
                    <a href="tel:+919063585823">+91 90635 85823</a>
                  </div>
                </div>
                <div className="footer-contact-item">
                  <i className="fas fa-envelope"></i>
                  <a href="mailto:contact@abhima.com">contact@abhima.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-inner">
            <p className="footer-copyright">
              &copy; 2026 Abhima Technologies. All rights reserved.
            </p>
            <div className="footer-legal-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms &amp; Conditions</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
