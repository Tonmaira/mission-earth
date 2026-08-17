"use client";

import { createContext, useContext } from "react";

/**
 * Who the deck is prepared for, handed down to the top bar every slide draws.
 *
 * The value comes from the route — /credential/<slug>, resolved against the
 * list in clients.js — not from anything a viewer can type. It travels by
 * context rather than as a prop through every slide because the top bar is the
 * only thing that reads it.
 */

const PreparedForContext = createContext("");

export const usePreparedFor = () => useContext(PreparedForContext);

export default function PreparedForProvider({ value = "", children }) {
  return <PreparedForContext.Provider value={value}>{children}</PreparedForContext.Provider>;
}
