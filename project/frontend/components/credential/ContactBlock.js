"use client";

/**
 * The address / phone / socials block from the Figma cover.
 *
 * Shared, because it belongs to two slides: the cover (where it is currently
 * hidden — see CoverSlide) and the closing slide, which shows it. One copy, so
 * a changed phone number can't end up right on one slide and stale on the other.
 *
 * Layout and type live in the `.cover-contacts` / `.cover-social` rules in
 * credential.css, which both slides inherit through `slide-stage`.
 */

const SOCIALS = [
  {
    icon: "/credential/social-line.svg",
    name: "LINE",
    label: "@missionearth",
    href: "https://line.me/R/ti/p/@missionearth",
  },
  {
    icon: "/credential/social-instagram.svg",
    name: "Instagram",
    label: "missionearth.co",
    href: "https://www.instagram.com/missionearth.co",
  },
  {
    icon: "/credential/social-facebook.svg",
    name: "Facebook",
    label: "missionearth TH",
    href: "https://www.facebook.com/missionearthTH",
  },
];

export default function ContactBlock({ className = "", ...rest }) {
  return (
    <section className={`cover-contacts ${className}`} {...rest}>
      <h2>CONTACTS</h2>
      <address>
        MANEEYA CENTER BUILDING - 518/5 Phloen Chit Rd, Lumphini, Pathum Wan, Bangkok 10330
        <br />
        <b>email: info@missionearth.co | Tel. 092 525 3595</b>
      </address>

      <div className="cover-social">
        {SOCIALS.map((s) => (
          <a key={s.name} href={s.href} target="_blank" rel="noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element -- flat SVG, nothing for the optimizer to do */}
            <img src={s.icon} alt={s.name} />
            {s.label}
          </a>
        ))}
        <span>www.missionearth.co</span>
      </div>
    </section>
  );
}
