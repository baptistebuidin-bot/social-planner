export type PlatformKey = "FACEBOOK" | "INSTAGRAM" | "LINKEDIN";

export const PLATFORMS: Record<
  PlatformKey,
  { label: string; color: string; dot: string; badge: string }
> = {
  FACEBOOK: {
    label: "Facebook",
    color: "#1877F2",
    dot: "bg-[#1877F2]",
    badge: "bg-blue-100 text-blue-700",
  },
  INSTAGRAM: {
    label: "Instagram",
    color: "#E1306C",
    dot: "bg-[#E1306C]",
    badge: "bg-pink-100 text-pink-700",
  },
  LINKEDIN: {
    label: "LinkedIn",
    color: "#0A66C2",
    dot: "bg-[#0A66C2]",
    badge: "bg-sky-100 text-sky-700",
  },
};

export type StatusKey =
  | "IDEA"
  | "TO_WRITE"
  | "IN_PROGRESS"
  | "READY"
  | "SCHEDULED"
  | "PUBLISHED";

export const STATUSES: Record<
  StatusKey,
  { label: string; badge: string; column: string }
> = {
  IDEA: {
    label: "Idée",
    badge: "bg-slate-100 text-slate-600",
    column: "bg-slate-100",
  },
  TO_WRITE: {
    label: "À écrire",
    badge: "bg-red-100 text-red-700",
    column: "bg-red-50",
  },
  IN_PROGRESS: {
    label: "En rédaction",
    badge: "bg-amber-100 text-amber-700",
    column: "bg-amber-50",
  },
  READY: {
    label: "Prête à publier",
    badge: "bg-emerald-100 text-emerald-700",
    column: "bg-emerald-50",
  },
  SCHEDULED: {
    label: "Programmée",
    badge: "bg-violet-100 text-violet-700",
    column: "bg-violet-50",
  },
  PUBLISHED: {
    label: "Publiée",
    badge: "bg-teal-100 text-teal-700",
    column: "bg-teal-50",
  },
};

export const STATUS_ORDER: StatusKey[] = [
  "IDEA",
  "TO_WRITE",
  "IN_PROGRESS",
  "READY",
  "SCHEDULED",
  "PUBLISHED",
];

export const ALL_PLATFORM_KEYS = Object.keys(PLATFORMS) as PlatformKey[];
export const ALL_STATUS_KEYS = STATUS_ORDER;

export const MONTH_NAMES = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export { WEEKDAYS };
