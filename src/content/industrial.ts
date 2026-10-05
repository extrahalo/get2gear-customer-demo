/**
 * Stable, non-localized content records for the public website.
 *
 * Copy stays in messages/{locale}.json while media, identifiers and publishing
 * state live here. These records are intentionally shaped so they can be
 * replaced by a CMS response without changing the page components.
 */

export type ProductSystemId = "breathers" | "filtration" | "monitoring";
export type VideoStoryId =
  | "company"
  | "contamination"
  | "breathers"
  | "filtration"
  | "case"
  | "economics"
  | "industries";

export const productSystems = [
  {
    id: "breathers",
    number: "01",
    partner: "DES-CASE",
    image: "/images/products/descase-breather-family.webp",
    imageWidth: 2200,
    imageHeight: 1304,
    videoId: "breathers",
    productKeys: ["ventGuard", "extremeDuty", "rebuildableSteel"],
  },
  {
    id: "filtration",
    number: "02",
    partner: "RMF SYSTEMS",
    image: "/images/products/rmf-olu-monitoring.webp",
    imageWidth: 1200,
    imageHeight: 1985,
    videoId: "filtration",
    productKeys: ["kl121", "olu", "bypass"],
  },
  {
    id: "monitoring",
    number: "03",
    partner: "DES-CASE / RMF",
    image: "/images/products/descase-cmc-3-2.webp",
    imageWidth: 1200,
    imageHeight: 1200,
    videoId: null,
    productKeys: ["cmc", "sampling", "analytics"],
  },
] as const;

export const videoStories = [
  { id: "company", number: "01", placement: "profile", status: "ready", duration: "01:00" },
  { id: "contamination", number: "02", placement: "solution", status: "ready", duration: "01:04" },
  { id: "breathers", number: "03", placement: "products", status: "ready", duration: "01:02" },
  { id: "filtration", number: "04", placement: "products", status: "ready", duration: "01:04" },
  { id: "case", number: "05", placement: "results", status: "ready", duration: "01:00" },
  { id: "economics", number: "06", placement: "economics", status: "ready", duration: "01:00" },
  { id: "industries", number: "07", placement: "industries", status: "ready", duration: "01:04" },
] as const;

export const videoDemonstrations = [
  { id: "rmf-demonstration", number: "08", brand: "RMF SYSTEMS", file: "RMF_Off-line_Filter_Unit_Get2Gear_contacts_1080p.mp4", duration: "02:48" },
  { id: "descase-breather", number: "09", brand: "DES-CASE", file: "DesCase_Breather_RU_Get2Gear_1080p.mp4", duration: "01:33" },
  { id: "descase-oil-analysis", number: "10", brand: "DES-CASE", file: "DesCase_Visual_Oil_Analysis_RU_Get2Gear_1080p.mp4", duration: "01:03" },
] as const;

export const proofGallery = [
  {
    id: "breather-family",
    image: "/images/products/contamination-control-family.webp",
    width: 1200,
    height: 800,
  },
  {
    id: "rmf-kl-family",
    image: "/images/products/rmf-kl-family.webp",
    width: 1800,
    height: 1313,
  },
] as const;

export const contentModelVersion = "2026-08-19";
