import { NextResponse } from "next/server";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3005").replace(/\/+$/, "");

const NAV_DEFAULTS = {
  home: true,
  about_us: true,
  services: true,
  portfolio: true,
  carrer: true,
  contact_us: true,
};

export async function GET() {
  try {
    const res = await fetch(`${API_BASE_URL}/nav/website`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return NextResponse.json(NAV_DEFAULTS);
    }

    const data = await res.json();
    const raw: Record<string, unknown> =
      data && typeof data === "object" && !Array.isArray(data) && (data as Record<string, unknown>).data
        ? ((data as Record<string, unknown>).data as Record<string, unknown>)
        : (data as Record<string, unknown>);

    const isShow = (val: unknown) => val === "show" || val === true;

    return NextResponse.json({
      home: isShow(raw.home),
      about_us: isShow(raw.about_us),
      services: isShow(raw.services),
      portfolio: isShow(raw.portfolio),
      carrer: isShow(raw.carrer),
      contact_us: isShow(raw.contact_us),
    });
  } catch (err) {
    console.error("Failed to fetch nav visibility:", err);
    return NextResponse.json(NAV_DEFAULTS);
  }
}
