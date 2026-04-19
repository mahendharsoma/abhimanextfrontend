"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { NavVisibility } from "@/lib/website";

const ALL_NAV_ITEMS = [
  { href: "/",         label: "Home",         key: "home"       },
  { href: "/about",    label: "About Us",      key: "about_us"   },
  { href: "/services", label: "Our Services",  key: "services"   },
  { href: "/portfolio",label: "Our Products",  key: "portfolio"  },
  { href: "/career",   label: "Career",        key: "carrer"     },
  { href: "/contact",  label: "Contact",       key: "contact_us" },
] as const;

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navVis, setNavVis] = useState<NavVisibility | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    fetch("/api/nav")
      .then((r) => r.json())
      .then((data: NavVisibility) => setNavVis(data))
      .catch(() => {}); // keep all items visible on error
  }, []);

  const navItems = navVis
    ? ALL_NAV_ITEMS.filter((item) => navVis[item.key])
    : ALL_NAV_ITEMS;

  return (
    <header className={`header${scrolled ? " scrolled" : ""}`}>
      <div className="container">
        <Link href="/" className="logo">
          <Image
            src="/images/logo.png"
            alt="Abhima Technologies"
            className="logo-img"
            width={120}
            height={120}
            priority
          />
        </Link>
        <nav className={`nav-links${menuOpen ? " active" : ""}`} id="navLinks">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
              {pathname === item.href && <span className="nav-dot"></span>}
            </Link>
          ))}
        </nav>
        <div className="nav-right">
          <a
            href="#"
            className="super-group-link"
            target="_blank"
            rel="noopener"
            aria-label="Abhima Group"
          >
            <Image
              src="/images/superlogo.png"
              alt="Abhima Group"
              className="super-group-logo"
              width={40}
              height={40}
            />
          </a>
          <button
            className="menu-toggle"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <i className={`fas ${menuOpen ? "fa-xmark" : "fa-bars"}`}></i>
          </button>
        </div>
      </div>
    </header>
  );
}
