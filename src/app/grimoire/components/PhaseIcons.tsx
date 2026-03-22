"use client";

import Image from "next/image";

interface SharedPhaseIconProps {
  className?: string;
}

export function SetupIcon({ className }: SharedPhaseIconProps) {
  return (
    <span aria-hidden="true" className={className}>
      ⚙
    </span>
  );
}

export function NightIcon({ className }: SharedPhaseIconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function DayIcon({ className }: SharedPhaseIconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M4.93 4.93l1.41 1.41" />
      <path d="M17.66 17.66l1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="M4.93 19.07l1.41-1.41" />
      <path d="M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

export function EndIcon({ className }: SharedPhaseIconProps) {
  return (
    <Image
      src="/assets/botc/wiki.bloodontheclocktower.com/Logo_bad_moon_rising-0e601f1bf5.png"
      alt="Game Over"
      width={24}
      height={24}
      className={className}
    />
  );
}
