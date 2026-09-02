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
  { id: "company", number: "01", placement: "profile", status: "placeholder" },
  { id: "contamination", number: "02", placement: "solution", status: "placeholder" },
  { id: "breathers", number: "03", placement: "products", status: "placeholder" },
  { id: "filtration", number: "04", placement: "products", status: "placeholder" },
  { id: "case", number: "05", placement: "results", status: "placeholder" },
  { id: "economics", number: "06", placement: "economics", status: "placeholder" },
  { id: "industries", number: "07", placement: "industries", status: "placeholder" },
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
