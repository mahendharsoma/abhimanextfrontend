import axios, { AxiosError } from "axios";

const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3005";

export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, "");

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

function getErrorMessage(payload: unknown, fallback: string): string {
  if (!payload) return fallback;
  if (typeof payload === "string" && payload.trim().length > 0) return payload;
  if (typeof payload === "object") {
    const obj = payload as Record<string, unknown>;
    for (const key of ["message", "error", "detail"]) {
      if (typeof obj[key] === "string" && (obj[key] as string).trim().length > 0) {
        return obj[key] as string;
      }
    }
  }
  return fallback;
}

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const payload = error.response?.data;
    const message = getErrorMessage(payload, error.message || "Something went wrong!");
    const status = error.response?.status ?? 500;
    return Promise.reject(new ApiError(message, status, payload));
  },
);

export function getImageUrl(path: string | undefined | null): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

export const websiteEndpoints = {
  whyWe: "/why-we/website",
  whyChooseUs: "/why-choose-us/website",
  lifeAtAbhima: "/life-at-abhima/website",
  openings: "/openings/website",
  coreValues: "/core-values/website",
  certifications: "/certifications/website",
  visionAndMission: "/vision-and-mission/website",
  banners: "/banners/website",
  aboutStory: {
    list: "/about-story/website",
    details: (id: string | number) => `/about-story/website/${id}`,
  },
  aboutStoryTiles: "/about-story-tiles/website",
  aboutUs: {
    list: "/about-us/website",
    details: (id: string | number) => `/about-us/website/${id}`,
  },
  clients: {
    list: "/clients/website",
    details: (clientId: string | number) => `/clients/website/${clientId}`,
  },
  industries: {
    list: "/industries/website",
    details: (industryId: string | number) => `/industries/website/${industryId}`,
  },
  services: {
    list: "/services/website",
    details: (serviceId: string | number) => `/services/website/${serviceId}`,
    tags: (serviceId: string | number) => `/website/services/${serviceId}/tags`,
  },
  products: {
    list: "/website/products",
    details: (id: string | number) => `/website/products/${id}`,
    bySlug: (slug: string) => `/website/products/slug/${slug}`,
    metrics: (productId: string | number) => `/website/products/${productId}/metrics`,
    tags: (productId: string | number) => `/website/products/${productId}/tags`,
  },
  setting: "/setting/website",
  nav: "/nav/website",
};
