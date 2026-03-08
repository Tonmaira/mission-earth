// components/earthfeed/useEarthFeed.js
import { useState, useEffect } from "react";

// Next.js ใช้ relative path ได้เลย ไม่ต้อง NEXT_PUBLIC_API_URL
const BASE = "/api";

/**
 * useFeedItems — GET /api/feed
 */
export function useFeedItems() {
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    fetch(`${BASE}/feed`)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

/**
 * useActivityCards — GET /api/activities
 */
export function useActivityCards() {
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    fetch(`${BASE}/activities`)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

/**
 * useCalendarEvents — GET /api/events/calendar?year=YYYY&month=M
 */
export function useCalendarEvents(year, month) {
  const [eventDays, setEventDays] = useState(new Set());
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  useEffect(() => {
    fetch(`${BASE}/events/calendar?year=${year}&month=${month + 1}`)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(json => setEventDays(new Set(json.days)))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [year, month]);

  return { eventDays, loading, error };
}