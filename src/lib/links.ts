/**
 * Where a buyer can reach us, for example to ask for more free AI uses. Set these in the environment when the site is
 * deployed. Until then the contact page is the way in. NEXT_PUBLIC_ values are read when the site is built.
 */
// A placeholder such as "none" typed into the dashboard must not become a link, so only a real web address or email counts.
const webAddress = (v: string | undefined) => (v && /^https?:\/\/\S+$/i.test(v.trim()) ? v.trim() : "");
const emailAddress = (v: string | undefined) => (v && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? v.trim() : "");

export const links = {
  email: emailAddress(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  youtube: webAddress(process.env.NEXT_PUBLIC_YOUTUBE_URL),
  contact: "https://v2stack.com/contact",
};
