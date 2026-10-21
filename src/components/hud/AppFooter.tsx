"use client";

import { useEffect, useState } from "react";
import { BwToggle } from "./BwToggle";
import { audio } from "@/lib/audio";

const MY_EMAIL = "ferrelrashad15@gmail.com";

export function AppFooter() {
  const [timeStr, setTimeStr] = useState("13:00 WIB");
  const [copied, setCopied] = useState(false);

  // Dynamic real-time clock in WIB (UTC+7)
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = {
          timeZone: "Asia/Jakarta",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        };
        const formatted = new Intl.DateTimeFormat("en-US", options).format(now);
        setTimeStr(`${formatted} WIB`);
      } catch {
        setTimeStr("13:00 WIB");
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyEmail = () => {
    audio.playClick(1.3);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(MY_EMAIL).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="w-full flex items-center justify-between select-none z-40 text-xs tracking-wider">
      {/* 1. Left: Local Timezone Clock & B&W Mode Switch */}
      <div className="flex items-center gap-5 sm:gap-7">
        <span className="text-crt-phosphor/70 font-mono tracking-widest text-[13px]">
          {timeStr}
        </span>
        <BwToggle />
      </div>

      {/* 2. Right: Hardware Source Stamp & Interactive Email Copy */}
      <div className="flex items-center gap-5 sm:gap-7">
        <span className="text-crt-phosphor/50 tracking-wider">
          SOURCE: MAC
        </span>

        <button
          type="button"
          onClick={handleCopyEmail}
          className="text-crt-phosphor/80 hover:text-white transition-colors cursor-pointer border-b border-crt-phosphor/30 hover:border-white pb-0.5 tracking-wider active:scale-95"
          aria-label={`Copy email ${MY_EMAIL}`}
        >
          {copied ? "[ COPIED ]" : "EMAIL"}
        </button>
      </div>
    </footer>
  );
}

