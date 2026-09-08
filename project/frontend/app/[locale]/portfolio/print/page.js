import WorksIndexList from "@/components/credential/WorksIndexList";
import "./print.css";

/*
 * A4 export target for the "all works" index — not a page anyone browses to.
 * scripts/gen-credential-pdf.mjs renders this URL to
 * public/credential-pdf/mission-earth-all-works-index.pdf; print.css pins it
 * to A4 with @page. Kept out of search the same way /credential is.
 */
export const metadata = {
  title: "All Works | Mission Earth",
  robots: { index: false, follow: false },
};

export default function PortfolioPrintPage() {
  return (
    <main className="portfolio-print min-h-screen bg-[#002740] px-10 py-14 text-white print:p-0 md:px-16 md:py-20">
      <WorksIndexList columns={1} showYears={false} />
    </main>
  );
}
