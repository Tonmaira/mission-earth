import "./credential.css";

export const viewport = {
  themeColor: "#002740",
};

export const metadata = {
  title: "Credentials | Mission Earth",
  description:
    "Mission Earth credentials — Your Trusted Partner in Sustainable Growth, Empowered by Experts.",
  // a pitch deck, not a public page — kept out of search and out of sitemap.js
  robots: { index: false, follow: false },
};

export default function CredentialLayout({ children }) {
  return children;
}
