"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

/** ฟอร์ม "แจ้งเตือนเมื่อเปิดจอง" — พอร์ตมาจาก NotifyForm ใน ForestBathingLocations.js
 *  ใช้กับกิจกรรมที่ is_open = false เท่านั้น */
export default function ActivityNotifyForm({ activityId, name }) {
  const t = useTranslations();
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle"); // idle | sending | done | error
  const [message, setMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setState("sending");
    setMessage("");

    try {
      const res = await fetch("/api/activities/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, activityId }),
      });
      const data = await res.json();

      if (!res.ok) {
        setState("error");
        setMessage(t("activities.notify.failed"));
        return;
      }

      setState("done");
      setMessage(data.alreadySubscribed ? t("activities.notify.already") : t("activities.notify.done"));
    } catch {
      setState("error");
      setMessage(t("activities.notify.network"));
    }
  };

  if (state === "done") {
    return (
      <p className="rounded-xl border border-[#CEA870]/40 bg-[#CEA870]/10 px-4 py-3 text-[14px] text-[#484848]">
        {message}
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <label htmlFor="activity-notify-email" className="text-[14px] text-[#484848]/70">
        {t("activities.notify.label", { name })}
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="activity-notify-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("activities.notify.placeholder")}
          className="flex-1 rounded-full border border-black/10 bg-black/[0.02] px-5 py-3 text-[15px] text-[#484848] placeholder:text-black/30 focus:border-[#CEA870] focus:outline-none"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className="rounded-full bg-[#FDF164] px-6 py-3 text-[15px] font-medium text-[#484848] transition-colors hover:bg-[#f5e94f] disabled:opacity-50"
        >
          {state === "sending" ? t("activities.notify.sending") : t("activities.notify.submit")}
        </button>
      </div>
      {state === "error" && <p className="text-[14px] text-red-600">{message}</p>}
    </form>
  );
}
