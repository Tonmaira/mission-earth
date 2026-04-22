"use client";
import { createContext, useContext, useState, useEffect } from "react";
import en from "@/messages/en.json";
import th from "@/messages/th.json";

const messages = { en, th };

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved === "en" || saved === "th") setLang(saved);
  }, []);

  const toggleLang = () => {
    const next = lang === "en" ? "th" : "en";
    setLang(next);
    localStorage.setItem("lang", next);
  };

  const t = (key) => {
    const keys = key.split(".");
    let val = messages[lang];
    for (const k of keys) val = val?.[k];
    return val ?? key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
