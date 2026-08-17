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
 */

export const CLIENTS = {
  "001osot": "Osotspa Public Company Limited",
};

/** The display name for a slug, or null if the link isn't one we issued. */
export const clientName = (slug) => CLIENTS[slug] ?? null;

export const clientSlugs = () => Object.keys(CLIENTS);
