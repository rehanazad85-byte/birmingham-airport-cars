import { locationSlugs, locations, type LocationSlug } from "@/lib/locations";

export const seoOnlyLocationSlugs = ["leicester", "coventry", "nottingham", "derby"] as const;
export type SeoOnlyLocationSlug = (typeof seoOnlyLocationSlugs)[number];
export type SeoLocationSlug = LocationSlug | SeoOnlyLocationSlug;

export type SeoLocation = {
  slug: SeoLocationSlug;
  name: string;
  collectionContext: string;
  areaPagePublished: boolean;
};

const existingLocations = Object.fromEntries(locationSlugs.map((slug) => [slug, {
  slug,
  name: locations[slug].name,
  collectionContext: locations[slug].localIntro[0],
  areaPagePublished: true,
}])) as Record<LocationSlug, SeoLocation>;

export const seoLocations: Record<SeoLocationSlug, SeoLocation> = {
  ...existingLocations,
  leicester: {
    slug: "leicester", name: "Leicester", areaPagePublished: false,
    collectionContext: "Collections can be quoted from Leicester city addresses and surrounding communities such as Oadby, Wigston and nearby parts of Leicestershire, using the passenger’s selected address.",
  },
  coventry: {
    slug: "coventry", name: "Coventry", areaPagePublished: false,
    collectionContext: "Coventry collections can begin at a home, hotel, workplace or university-area address, with the exact starting point used for live routing and quotation.",
  },
  nottingham: {
    slug: "nottingham", name: "Nottingham", areaPagePublished: false,
    collectionContext: "Nottingham journeys can be quoted from the city, West Bridgford, Beeston and nearby addresses, with the selected pickup determining the live driving route used for the quotation.",
  },
  derby: {
    slug: "derby", name: "Derby", areaPagePublished: false,
    collectionContext: "Derby collections can be arranged from city, residential, hotel and business addresses, with the actual pickup used instead of an assumed town-centre starting point.",
  },
};

export const seoLocationSlugs = [...locationSlugs, ...seoOnlyLocationSlugs] as const;
