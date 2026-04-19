import { API_BASE_URL, axiosInstance, websiteEndpoints } from "@/lib/api";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toNum(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function extractArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (typeof payload === "object" && payload !== null) {
    const obj = payload as Record<string, unknown>;
    if (Array.isArray(obj.data)) return obj.data;
    if (Array.isArray(obj.value)) return obj.value;
  }
  return [];
}

function extractObject(payload: unknown): Record<string, unknown> {
  if (typeof payload === "object" && payload !== null) {
    const data = (payload as { data?: unknown }).data;
    if (data && typeof data === "object") return data as Record<string, unknown>;
    return payload as Record<string, unknown>;
  }
  return {};
}

function str(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function bool(value: unknown): boolean {
  return value === true || value === "true";
}

// ---------------------------------------------------------------------------
// Banner
// ---------------------------------------------------------------------------

export interface BannerData {
  bannerId: number;
  heroVideo: string;
  heroBannerText: string;
  aboutUsBanner: string;
  aboutUsBannerText: string;
  servicesBanner: string;
  servicesBannerText: string;
  productsBanner: string;
  productsBannerText: string;
  careerBanner: string;
  careerBannerText: string;
  contactUsBanner: string;
  contactUsBannerText: string;
}

function normalizeBanner(raw: Record<string, unknown>): BannerData {
  return {
    bannerId: toNum(raw.banner_id ?? raw.bannerId ?? raw.id),
    heroVideo: str(raw.hero_video ?? raw.heroVideo),
    heroBannerText: str(raw.hero_banner_text ?? raw.heroBannerText),
    aboutUsBanner: str(raw.about_us_banner ?? raw.aboutUsBanner),
    aboutUsBannerText: str(raw.about_us_banner_text ?? raw.aboutUsBannerText),
    servicesBanner: str(raw.services_banner ?? raw.servicesBanner),
    servicesBannerText: str(raw.services_banner_text ?? raw.servicesBannerText),
    productsBanner: str(raw.products_banner ?? raw.productsBanner),
    productsBannerText: str(raw.products_banner_text ?? raw.productsBannerText),
    careerBanner: str(raw.career_banner ?? raw.careerBanner),
    careerBannerText: str(raw.career_banner_text ?? raw.careerBannerText),
    contactUsBanner: str(raw.contact_us_banner ?? raw.contactUsBanner),
    contactUsBannerText: str(raw.contact_us_banner_text ?? raw.contactUsBannerText),
  };
}

// ---------------------------------------------------------------------------
// Nav Visibility
// ---------------------------------------------------------------------------

export interface NavVisibility {
  home: boolean;
  about_us: boolean;
  services: boolean;
  portfolio: boolean;
  carrer: boolean;
  contact_us: boolean;
}

const NAV_DEFAULTS: NavVisibility = {
  home: true,
  about_us: true,
  services: true,
  portfolio: true,
  carrer: true,
  contact_us: true,
};

export async function getNavVisibility(): Promise<NavVisibility> {
  try {
    const res = await fetch(`${API_BASE_URL}${websiteEndpoints.nav}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return NAV_DEFAULTS;
    const data = await res.json();
    const obj: Record<string, unknown> = (data && typeof data === "object" && !Array.isArray(data) && (data as Record<string, unknown>).data
      ? (data as Record<string, unknown>).data
      : data) as Record<string, unknown>;
    const isShow = (val: unknown) => val === "show" || val === true;
    return {
      home: isShow(obj.home) ?? NAV_DEFAULTS.home,
      about_us: isShow(obj.about_us) ?? NAV_DEFAULTS.about_us,
      services: isShow(obj.services) ?? NAV_DEFAULTS.services,
      portfolio: isShow(obj.portfolio) ?? NAV_DEFAULTS.portfolio,
      carrer: isShow(obj.carrer) ?? NAV_DEFAULTS.carrer,
      contact_us: isShow(obj.contact_us) ?? NAV_DEFAULTS.contact_us,
    };
  } catch {
    return NAV_DEFAULTS;
  }
}

export async function getBanners(): Promise<BannerData | null> {
  const res = await axiosInstance.get(websiteEndpoints.banners);
  const payload = res.data;
  // API may return a single object or an array with one item
  if (Array.isArray(payload)) {
    const arr = payload.length > 0 ? payload : ((payload as unknown as { data?: unknown[] }).data ?? []) as unknown[];
    return arr.length > 0 ? normalizeBanner(arr[0] as Record<string, unknown>) : null;
  }
  if (payload && typeof payload === "object") {
    const data = (payload as { data?: unknown }).data;
    if (data && typeof data === "object" && !Array.isArray(data)) {
      return normalizeBanner(data as Record<string, unknown>);
    }
    if (Array.isArray(data) && data.length > 0) {
      return normalizeBanner(data[0] as Record<string, unknown>);
    }
    return normalizeBanner(payload as Record<string, unknown>);
  }
  return null;
}

// ---------------------------------------------------------------------------
// About Us
// ---------------------------------------------------------------------------

export interface AboutUsItem {
  id: number;
  sectionBadge: string;
  title: string;
  description: string;
  aboutImage: string;
}

function normalizeAboutUs(raw: Record<string, unknown>): AboutUsItem {
  return {
    id: toNum(raw.about_id ?? raw.aboutId ?? raw.id),
    sectionBadge: str(raw.section_badge ?? raw.sectionBadge),
    title: str(raw.title),
    description: str(raw.description_ ?? raw.description),
    aboutImage: str(raw.image ?? raw.about_image ?? raw.aboutImage),
  };
}

export async function listAboutUs(): Promise<AboutUsItem[]> {
  const res = await axiosInstance.get(websiteEndpoints.aboutUs.list);
  return extractArray(res.data).map((item) => normalizeAboutUs(item as Record<string, unknown>));
}

export async function getAboutUs(id: number | string): Promise<AboutUsItem> {
  const res = await axiosInstance.get(websiteEndpoints.aboutUs.details(id));
  return normalizeAboutUs(extractObject(res.data));
}

// ---------------------------------------------------------------------------
// About Story
// ---------------------------------------------------------------------------

export interface AboutStoryItem {
  id: number;
  sectionBadge: string;
  title: string;
  accentText: string;
  description: string;
  storyImage: string;
}

function normalizeAboutStory(raw: Record<string, unknown>): AboutStoryItem {
  return {
    id: toNum(raw.id),
    sectionBadge: str(raw.section_badge ?? raw.sectionBadge),
    title: str(raw.title),
    accentText: str(raw.accent_text ?? raw.accentText),
    description: str(raw.description),
    storyImage: str(raw.image ?? raw.story_image ?? raw.storyImage),
  };
}

export async function listAboutStory(): Promise<AboutStoryItem[]> {
  const res = await axiosInstance.get(websiteEndpoints.aboutStory.list);
  return extractArray(res.data).map((item) => normalizeAboutStory(item as Record<string, unknown>));
}

export async function getAboutStory(id: number | string): Promise<AboutStoryItem> {
  const res = await axiosInstance.get(websiteEndpoints.aboutStory.details(id));
  return normalizeAboutStory(extractObject(res.data));
}

// ---------------------------------------------------------------------------
// About Story Tiles
// ---------------------------------------------------------------------------

export interface AboutStoryTileItem {
  id: number;
  title: string;
  description: string;
}

function normalizeAboutStoryTile(raw: Record<string, unknown>): AboutStoryTileItem {
  return {
    id: toNum(raw.about_story_tile_id ?? raw.aboutStoryTileId ?? raw.id),
    title: str(raw.title),
    description: str(raw.description),
  };
}

export async function listAboutStoryTiles(): Promise<AboutStoryTileItem[]> {
  const res = await axiosInstance.get(websiteEndpoints.aboutStoryTiles);
  return extractArray(res.data).map((item) => normalizeAboutStoryTile(item as Record<string, unknown>));
}

// ---------------------------------------------------------------------------
// Vision & Mission
// ---------------------------------------------------------------------------

export interface VisionMissionItem {
  id: number;
  title: string;
  description: string;
}

function normalizeVisionMission(raw: Record<string, unknown>): VisionMissionItem {
  return {
    id: toNum(raw.id),
    title: str(raw.title),
    description: str(raw.description),
  };
}

export async function listVisionAndMission(): Promise<VisionMissionItem[]> {
  const res = await axiosInstance.get(websiteEndpoints.visionAndMission);
  return extractArray(res.data).map((item) => normalizeVisionMission(item as Record<string, unknown>));
}

// ---------------------------------------------------------------------------
// Core Values
// ---------------------------------------------------------------------------

export interface CoreValueItem {
  id: number;
  title: string;
  description: string;
  coreValueImage: string;
}

function normalizeCoreValue(raw: Record<string, unknown>): CoreValueItem {
  return {
    id: toNum(raw.core_value_id ?? raw.coreValueId ?? raw.id),
    title: str(raw.title),
    description: str(raw.description),
    coreValueImage: str(raw.core_value_image ?? raw.coreValueImage ?? raw.image),
  };
}

export async function listCoreValues(): Promise<CoreValueItem[]> {
  const res = await axiosInstance.get(websiteEndpoints.coreValues);
  return extractArray(res.data).map((item) => normalizeCoreValue(item as Record<string, unknown>));
}

// ---------------------------------------------------------------------------
// Certifications
// ---------------------------------------------------------------------------

export interface CertificationItem {
  id: number;
  title: string;
  subtitle: string;
  certificationImage: string;
}

function normalizeCertification(raw: Record<string, unknown>): CertificationItem {
  return {
    id: toNum(raw.certification_id ?? raw.certificationId ?? raw.id),
    title: str(raw.title),
    subtitle: str(raw.subtitle ?? raw.sub_title),
    certificationImage: str(raw.certification_image ?? raw.certificationImage ?? raw.image),
  };
}

export async function listCertifications(): Promise<CertificationItem[]> {
  const res = await axiosInstance.get(websiteEndpoints.certifications);
  return extractArray(res.data).map((item) => normalizeCertification(item as Record<string, unknown>));
}

// ---------------------------------------------------------------------------
// Why Choose Us
// ---------------------------------------------------------------------------

export interface WhyChooseUsItem {
  id: number;
  title: string;
  description: string;
  whyChooseUsImage: string;
}

function normalizeWhyChooseUs(raw: Record<string, unknown>): WhyChooseUsItem {
  return {
    id: toNum(raw.why_choose_us_id ?? raw.whyChooseUsId ?? raw.id),
    title: str(raw.title),
    description: str(raw.description),
    whyChooseUsImage: str(raw.why_choose_us_image ?? raw.whyChooseUsImage ?? raw.image),
  };
}

export async function listWhyChooseUs(): Promise<WhyChooseUsItem[]> {
  const res = await axiosInstance.get(websiteEndpoints.whyChooseUs);
  return extractArray(res.data).map((item) => normalizeWhyChooseUs(item as Record<string, unknown>));
}

// ---------------------------------------------------------------------------
// Why We
// ---------------------------------------------------------------------------

export interface WhyWeItem {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  whyWeImage: string;
}

function normalizeWhyWe(raw: Record<string, unknown>): WhyWeItem {
  return {
    id: toNum(raw.why_we_id ?? raw.whyWeId ?? raw.id),
    title: str(raw.title),
    subtitle: str(raw.sub_title ?? raw.subTitle),
    description: str(raw.description),
    whyWeImage: str(raw.image ?? raw.why_we_image ?? raw.whyWeImage),
  };
}

export async function listWhyWe(): Promise<WhyWeItem[]> {
  const res = await axiosInstance.get(websiteEndpoints.whyWe);
  const payload = res.data;
  const arr = extractArray(payload);
  if (arr.length > 0) return arr.map((item) => normalizeWhyWe(item as Record<string, unknown>));
  // API may return a single object instead of an array
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    const data = (payload as { data?: unknown }).data;
    if (data && typeof data === "object" && !Array.isArray(data)) {
      return [normalizeWhyWe(data as Record<string, unknown>)];
    }
    if ((payload as Record<string, unknown>).why_we_id || (payload as Record<string, unknown>).whyWeId || (payload as Record<string, unknown>).title) {
      return [normalizeWhyWe(payload as Record<string, unknown>)];
    }
  }
  return [];
}

// ---------------------------------------------------------------------------
// Clients
// ---------------------------------------------------------------------------

export interface ClientItem {
  id: number;
  name: string;
  clientImage: string;
}

function normalizeClient(raw: Record<string, unknown>): ClientItem {
  return {
    id: toNum(raw.client_id ?? raw.clientId ?? raw.id),
    name: str(raw.name ?? raw.title ?? raw.client_name),
    clientImage: str(raw.client_image ?? raw.clientImage ?? raw.image),
  };
}

export async function listClients(): Promise<ClientItem[]> {
  const res = await axiosInstance.get(websiteEndpoints.clients.list);
  return extractArray(res.data).map((item) => normalizeClient(item as Record<string, unknown>));
}

export async function getClient(clientId: number | string): Promise<ClientItem> {
  const res = await axiosInstance.get(websiteEndpoints.clients.details(clientId));
  return normalizeClient(extractObject(res.data));
}

// ---------------------------------------------------------------------------
// Industries
// ---------------------------------------------------------------------------

export interface IndustryItem {
  id: number;
  name: string;
  icon: string;
  description: string;
  industryImage: string;
}

function normalizeIndustry(raw: Record<string, unknown>): IndustryItem {
  return {
    id: toNum(raw.industry_id ?? raw.industryId ?? raw.id),
    name: str(raw.name ?? raw.title ?? raw.industry_name),
    icon: str(raw.icon ?? raw.icon_class ?? raw.iconClass),
    description: str(raw.description),
    industryImage: str(raw.industry_image ?? raw.industryImage ?? raw.image),
  };
}

export async function listIndustries(): Promise<IndustryItem[]> {
  const res = await axiosInstance.get(websiteEndpoints.industries.list);
  return extractArray(res.data).map((item) => normalizeIndustry(item as Record<string, unknown>));
}

export async function getIndustry(industryId: number | string): Promise<IndustryItem> {
  const res = await axiosInstance.get(websiteEndpoints.industries.details(industryId));
  return normalizeIndustry(extractObject(res.data));
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

export interface WebsiteServiceItem {
  id: number;
  title: string;
  shortDescription: string;
  description: string;
  serviceImage: string;
  featured: boolean;
  slug: string;
}

function normalizeWebsiteService(raw: Record<string, unknown>): WebsiteServiceItem {
  return {
    id: toNum(raw.service_id ?? raw.serviceId ?? raw.id),
    title: str(raw.title ?? raw.name),
    shortDescription: str(raw.short_description ?? raw.shortDescription),
    description: str(raw.description),
    serviceImage: str(raw.service_image ?? raw.serviceImage),
    featured: bool(raw.featured),
    slug: str(raw.slug),
  };
}

export interface WebsiteServiceTagItem {
  id: number;
  serviceId: number;
  tagName: string;
}

function normalizeWebsiteServiceTag(raw: Record<string, unknown>): WebsiteServiceTagItem {
  return {
    id: toNum(raw.service_tag_id ?? raw.serviceTagId ?? raw.id),
    serviceId: toNum(raw.service_id ?? raw.serviceId),
    tagName: str(raw.tag_name ?? raw.tagName),
  };
}

export async function listWebsiteServices(): Promise<WebsiteServiceItem[]> {
  const res = await axiosInstance.get(websiteEndpoints.services.list);
  return extractArray(res.data).map((item) => normalizeWebsiteService(item as Record<string, unknown>));
}

export async function getWebsiteService(id: number | string): Promise<WebsiteServiceItem> {
  const res = await axiosInstance.get(websiteEndpoints.services.details(id));
  return normalizeWebsiteService(extractObject(res.data));
}

export async function listWebsiteServiceTags(serviceId: number | string): Promise<WebsiteServiceTagItem[]> {
  const res = await axiosInstance.get(websiteEndpoints.services.tags(serviceId));
  return extractArray(res.data).map((item) => normalizeWebsiteServiceTag(item as Record<string, unknown>));
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export interface WebsiteProductItem {
  id: number;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  productImage: string;
  featured: boolean;
  slug: string;
}

function normalizeWebsiteProduct(raw: Record<string, unknown>): WebsiteProductItem {
  return {
    id: toNum(raw.product_id ?? raw.productId ?? raw.id),
    title: str(raw.title ?? raw.name),
    category: str(raw.category),
    description: str(raw.description),
    longDescription: str(raw.long_description ?? raw.longDescription),
    productImage: str(raw.product_image ?? raw.productImage),
    featured: bool(raw.featured),
    slug: str(raw.slug),
  };
}

export interface WebsiteProductMetricItem {
  id: number;
  productId: number;
  metricValue: string;
  metricLabel: string;
}

function normalizeProductMetric(raw: Record<string, unknown>): WebsiteProductMetricItem {
  return {
    id: toNum(raw.metric_id ?? raw.metricId ?? raw.id),
    productId: toNum(raw.product_id ?? raw.productId),
    metricValue: str(raw.metric_value ?? raw.metricValue ?? raw.value),
    metricLabel: str(raw.metric_label ?? raw.metricLabel ?? raw.label),
  };
}

export interface WebsiteProductTagItem {
  id: number;
  productId: number;
  tagName: string;
}

function normalizeProductTag(raw: Record<string, unknown>): WebsiteProductTagItem {
  return {
    id: toNum(raw.product_tag_id ?? raw.productTagId ?? raw.id),
    productId: toNum(raw.product_id ?? raw.productId),
    tagName: str(raw.tag_name ?? raw.tagName),
  };
}

export async function listWebsiteProducts(): Promise<WebsiteProductItem[]> {
  const res = await axiosInstance.get(websiteEndpoints.products.list);
  return extractArray(res.data).map((item) => normalizeWebsiteProduct(item as Record<string, unknown>));
}

export async function getWebsiteProduct(id: number | string): Promise<WebsiteProductItem> {
  const res = await axiosInstance.get(websiteEndpoints.products.details(id));
  return normalizeWebsiteProduct(extractObject(res.data));
}

export async function getWebsiteProductBySlug(slug: string): Promise<WebsiteProductItem> {
  const res = await axiosInstance.get(websiteEndpoints.products.bySlug(slug));
  return normalizeWebsiteProduct(extractObject(res.data));
}

export async function listWebsiteProductMetrics(productId: number | string): Promise<WebsiteProductMetricItem[]> {
  const res = await axiosInstance.get(websiteEndpoints.products.metrics(productId));
  return extractArray(res.data).map((item) => normalizeProductMetric(item as Record<string, unknown>));
}

export async function listWebsiteProductTags(productId: number | string): Promise<WebsiteProductTagItem[]> {
  const res = await axiosInstance.get(websiteEndpoints.products.tags(productId));
  return extractArray(res.data).map((item) => normalizeProductTag(item as Record<string, unknown>));
}

// ---------------------------------------------------------------------------
// Life at Abhima
// ---------------------------------------------------------------------------

export interface LifeAtAbhimaItem {
  id: number;
  title: string;
  description: string;
  lifeImage: string;
}

function normalizeLifeAtAbhima(raw: Record<string, unknown>): LifeAtAbhimaItem {
  return {
    id: toNum(raw.life_at_abhima_id ?? raw.lifeAtAbhimaId ?? raw.id),
    title: str(raw.title),
    description: str(raw.description),
    lifeImage: str(raw.life_image ?? raw.lifeImage ?? raw.image),
  };
}

export async function listLifeAtAbhima(): Promise<LifeAtAbhimaItem[]> {
  const res = await axiosInstance.get(websiteEndpoints.lifeAtAbhima);
  return extractArray(res.data).map((item) => normalizeLifeAtAbhima(item as Record<string, unknown>));
}

// ---------------------------------------------------------------------------
// Openings
// ---------------------------------------------------------------------------

export interface OpeningItem {
  id: number;
  title: string;
  position: string;
  experience: string;
  location: string;
  modeOfWork: string;
  skills: string;
  description: string;
}

function normalizeOpening(raw: Record<string, unknown>): OpeningItem {
  return {
    id: toNum(raw.opening_id ?? raw.openingId ?? raw.id),
    title: str(raw.title),
    position: str(raw.position),
    experience: str(raw.experience),
    location: str(raw.location),
    modeOfWork: str(raw.mode_of_work ?? raw.modeOfWork),
    skills: str(raw.skills),
    description: str(raw.description),
  };
}

export async function listOpenings(): Promise<OpeningItem[]> {
  const res = await axiosInstance.get(websiteEndpoints.openings);
  return extractArray(res.data).map((item) => normalizeOpening(item as Record<string, unknown>));
}

// ---------------------------------------------------------------------------
// Setting
// ---------------------------------------------------------------------------

export interface SettingData {
  settingId: number;
  companyName: string;
  aboutCompany: string;
  email: string;
  indiaPhone: string;
  indiaAltPhone: string;
  usaPhone: string;
  usaAltPhone: string;
  whatsappNumber: string;
  facebook: string;
  twitter: string;
  youtube: string;
  instagram: string;
  address: string;
  usaAddress: string;
  logo: string;
  abhimaGroupLogo: string;
  brochure: string;
  favIcon: string;
  indiaGoogleMap: string;
  usaGoogleMap: string;
}

function normalizeSetting(raw: Record<string, unknown>): SettingData {
  return {
    settingId: toNum(raw.setting_id ?? raw.settingId ?? raw.id),
    companyName: str(raw.company_name ?? raw.companyName),
    aboutCompany: str(raw.about_company ?? raw.aboutCompany),
    email: str(raw.email),
    indiaPhone: str(raw.india_phone ?? raw.indiaPhone),
    indiaAltPhone: str(raw.india_alt_phone ?? raw.indiaAltPhone),
    usaPhone: str(raw.usa_phone ?? raw.usaPhone),
    usaAltPhone: str(raw.usa_alt_phone ?? raw.usaAltPhone),
    whatsappNumber: str(raw.whatsapp_number ?? raw.whatsappNumber),
    facebook: str(raw.facebook),
    twitter: str(raw.twitter),
    youtube: str(raw.youtube),
    instagram: str(raw.instagram),
    address: str(raw.address),
    usaAddress: str(raw.usa_address ?? raw.usaAddress),
    logo: str(raw.logo),
    abhimaGroupLogo: str(raw.abhima_group_logo ?? raw.abhimaGroupLogo),
    brochure: str(raw.brochure),
    favIcon: str(raw.fav_icon ?? raw.favIcon),
    indiaGoogleMap: str(raw.india_google_map ?? raw.indiaGoogleMap),
    usaGoogleMap: str(raw.usa_google_map ?? raw.usaGoogleMap),
  };
}

export async function getSetting(): Promise<SettingData | null> {
  const res = await axiosInstance.get(websiteEndpoints.setting);
  const payload = res.data;
  if (Array.isArray(payload)) {
    const arr = payload.length > 0 ? payload : ((payload as unknown as { data?: unknown[] }).data ?? []) as unknown[];
    return arr.length > 0 ? normalizeSetting(arr[0] as Record<string, unknown>) : null;
  }
  if (payload && typeof payload === "object") {
    const data = (payload as { data?: unknown }).data;
    if (data && typeof data === "object" && !Array.isArray(data)) {
      return normalizeSetting(data as Record<string, unknown>);
    }
    if (Array.isArray(data) && data.length > 0) {
      return normalizeSetting(data[0] as Record<string, unknown>);
    }
    return normalizeSetting(payload as Record<string, unknown>);
  }
  return null;
}
