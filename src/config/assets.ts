// VOK site assets, served by the site itself from `public/brand/`.
// They used to live in a Supabase Storage bucket; moving them here leaves the
// site with no dependency on Supabase.
const BRAND = `${import.meta.env.BASE_URL}brand`;
export const ASSETS = {
  logoWhite: `${BRAND}/vok_wordmark_white.svg`,
  logoNavy: `${BRAND}/vok_wordmark_navy.svg`,
  caseMockup: `${BRAND}/case_mockup.png`,
  favicon: `${BRAND}/favicon_512.png`,
};
