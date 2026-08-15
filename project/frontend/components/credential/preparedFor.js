"use client";

import { createContext, useContext } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Who the deck is prepared for, taken from the URL: `/credential?for=<name>`.
 *
 * Nothing is hard-coded, so the plain `/credential` is the generic deck with no
 * client on it, and a pitch is the same deck with a name in the query string —
 * no edit, no rebuild, and no chance of last month's client being left on every
 * slide of this month's meeting.
 *
 * It travels by context rather than as a prop through every slide, because the
 * only thing that ever reads it is the top bar each slide already renders.
 */

const PreparedForContext = createContext("");

export const usePreparedFor = () => useContext(PreparedForContext);

export default function PreparedForProvider({ children }) {
  // `?for=` blank or missing both mean "no client on this deck"
  const name = useSearchParams().get("for")?.trim() || "";
  return <PreparedForContext.Provider value={name}>{children}</PreparedForContext.Provider>;
}
