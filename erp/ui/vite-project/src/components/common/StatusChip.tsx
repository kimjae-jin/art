type Props = { status?: "재직"|"퇴직"|"퇴사예정"|string };
export default function StatusChip({status}:Props){
  const s = status || "";
  const color = s==="퇴직" ? "rgba(239,68,68,0.18)"
              : s==="퇴사예정" ? "rgba(234,179,8,0.18)"
              : "rgba(16,185,129,0.18)";
  const text  = s==="퇴직" ? "#ef4444" : s==="퇴사예정" ? "#eab308" : "#10b981";
  return (
    <span style={{
      display:"inline-block", padding:"4px 8px", borderRadius:999,
      background: color, color: text, fontSize:12, fontWeight:600
    }}>{s || "-"}</span>
  );
}
