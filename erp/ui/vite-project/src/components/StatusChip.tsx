import React from "react";

type Props = { value?: string | null };

export default function StatusChip({ value }: Props) {
  const v = (value || "").trim();
  let cls = "status-chip";
  if (v === "퇴직") cls += " danger";
  else if (v === "퇴사예정") cls += " warn";
  else cls += " ok"; // 재직(기본)

  return <span className={cls}>{v || "재직"}</span>;
}
