"use client";

import { useEffect, useState } from "react";
import { BwToggle } from "./BwToggle";
import { audio } from "@/lib/audio";
import { Reveal } from "./Reveal";

const MY_EMAIL = "ferrelrashad15@gmail.com";

interface AppFooterProps {
  intro?: boolean;
}

export function AppFooter({ intro = true }: AppFooterProps) {
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
    <footer className="w-full flex items-center justify-between select-none z-40 tracking-wider shrink-0 font-mono text-[clamp(11px,1.15vw,16px)] pointer-events-none">
      {/* 1. Left: Local Timezone Clock & B&W Mode Switch (Adaptive gap) */}
      <div className="flex items-center gap-[clamp(12px,2.5vw,36px)] pointer-events-auto">
        <Reveal on={intro} i={3} inline>
          <span className="text-crt-phosphor/70 tracking-widest whitespace-nowrap">
            {timeStr}
          </span>
        </Reveal>
        <Reveal on={intro} i={4} inline>
          <BwToggle />
        </Reveal>
      </div>

      {/* 2. Right: Hardware Source Stamp & Interactive Email Copy (Adaptive gap) */}
      <div className="flex items-center gap-[clamp(14px,3.8vw,60px)] pointer-events-auto">
        <Reveal on={intro} i={4} inline className="hidden sm:inline-flex">
          <span className="text-crt-phosphor/50 tracking-wider whitespace-nowrap">
            SOURCE: MAC
          </span>
        </Reveal>

        <Reveal on={intro} i={5} inline>
          <button
            type="button"
            onClick={handleCopyEmail}
            className="text-crt-phosphor/80 hover:text-white transition-colors cursor-pointer border-b border-crt-phosphor/30 hover:border-white pb-0.5 tracking-wider active:scale-95 pointer-events-auto whitespace-nowrap"
            aria-label={`Copy email ${MY_EMAIL}`}
          >
            {copied ? "[ COPIED ]" : "EMAIL"}
          </button>
        </Reveal>
      </div>
    </footer>
  );
}
