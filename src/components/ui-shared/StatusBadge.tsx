import type { ReactNode } from "react";

const palette = {
  green: { bg: "#E6F2EB", fg: "#2D7A4F" },
  amber: { bg: "#FBEDD9", fg: "#B87820" },
  red: { bg: "#F8DCD9", fg: "#B83228" },
  blue: { bg: "#DDE7F6", fg: "#2558A8" },
  gold: { bg: "#F5EDD6", fg: "#8B6E1C" },
  gray: { bg: "#EDE9DF", fg: "#6B6450" },
} as const;

export type BadgeColor = keyof typeof palette;

export function StatusBadge({ color, children }: { color: BadgeColor; children: ReactNode }) {
  const c = palette[color];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
      style={{ background: c.bg, color: c.fg }}
    >
      {children}
    </span>
  );
}

export function statusAgendamentoColor(status: string): BadgeColor {
  switch (status) {
    case "atendido": return "green";
    case "agendado": return "gold";
    case "reagendado": return "amber";
    case "falta": return "red";
    case "cancelado": return "red";
    default: return "gray";
  }
}

export function statusLeadColor(status: string): BadgeColor {
  switch (status) {
    case "novo": return "blue";
    case "qualificando": return "amber";
    case "proposta": return "gold";
    case "convertido": return "green";
    case "perdido": return "red";
    default: return "gray";
  }
}
