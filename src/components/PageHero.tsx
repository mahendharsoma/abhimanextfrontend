import Link from "next/link";
import { ReactNode } from "react";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeroProps {
  backgroundImage: string;
  title: ReactNode;
  breadcrumbs: Breadcrumb[];
}

export default function PageHero({ backgroundImage, title, breadcrumbs }: PageHeroProps) {
  return (
    <section
      className="page-hero"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1>{title}</h1>
      <nav className="breadcrumb" aria-label="Breadcrumb">
        {breadcrumbs.map((crumb, i) => (
          <span key={crumb.label}>
            {i > 0 && <span style={{ margin: "0 4px" }}>/</span>}
            {crumb.href ? (
              <Link href={crumb.href}>{crumb.label}</Link>
            ) : (
              <span>{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>
    </section>
  );
}