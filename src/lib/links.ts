/**
 * Where a buyer can reach us, for example to ask for more free AI uses. Set these in the environment when the site is
 * deployed. Until then the contact page is the way in. NEXT_PUBLIC_ values are read when the site is built.
 */
export const links = {
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || "",
  contact: "https://v2stack.com/contact",
};
