/**
 * Who the deck can be prepared for, and the link that says so.
 *
 * The name used to ride in the URL as `?for=<anything>`, which meant anyone
 * holding a link could put any company on every slide and screenshot it. Now a
 * name only exists if it is listed here, and the link that carries it is a
 * route of its own: /credential/<slug>. Anything not on this list is a 404.
 *
 * The random tail on each slug is deliberate. Without it, /credential/ptt or
 * /credential/scg could be guessed, and a guess that worked would tell the
 * guesser who else has been pitched.
 *
 * To add a client: pick the company's short name, add a fresh random tail
 *   node -e "console.log(require('crypto').randomBytes(3).toString('hex'))"
 * and add one line below. Send them /credential/<slug>.
 *
 * Plain /credential stays the generic deck, with no client on it at all.
 *
 * A client is either the name on its own, or a block that carries the name
 * plus whatever else that link should do differently:
 *
 *   "001osot": "Osotspa Public Company Limited",
 *   "002ptt":  { name: "PTT", cases: ["forest-bathing", "green-mission"] },
 *
 * `cases` picks which case studies that link shows, in the order given — a
 * pitch about forests need not walk anyone through the water workshop first.
 * Leave it out and the client sees every case in the usual order, so an
 * existing link keeps working untouched. Listing an id that no case uses is
 * an error rather than a silently missing slide; the ids are the `id` fields
 * in caseStudies.js. An empty array means a deck with no case studies at all.
 */

export const CLIENTS = {
  "001osot": "Osotspa Public Company Limited",
  "mflfa690d9": {
    name: "มูลนิธิแม่ฟ้าหลวง ในพระบรมราชูปถัมภ์",
    cases: [
      "scg-prayotsuk",
      "wildfire",
      "biocourse",
      "water-workshop",
      "dek-sang-nan-1",
      "forest-bathing",
    ],
  },
};

/** A client's entry in one shape, whichever of the two was written above. */
const entry = (slug) => {
  const found = CLIENTS[slug];
  if (!found) return null;
  return typeof found === "string" ? { name: found } : found;
};

/** The display name for a slug, or null if the link isn't one we issued. */
export const clientName = (slug) => entry(slug)?.name ?? null;

/** The case ids this client should see, or null for "every case". */
export const clientCaseIds = (slug) => entry(slug)?.cases ?? null;

export const clientSlugs = () => Object.keys(CLIENTS);
