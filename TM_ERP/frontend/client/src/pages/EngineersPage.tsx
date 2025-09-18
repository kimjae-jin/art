import React, { useEffect, useMemo, useState } from "react";
import { listEngineers, type Engineer } from "../api";

type Row = Engineer & { __checked?: boolean };
type Key = keyof Row;
type Col = { key: Key; label: string; width: number };

const FIXED_COLS: ReadonlyArray<Col> = [
  { key: "__checked", label: "□", width: 44 },
  { key: "status", label: "상태", width: 88 },
  { key: "employeeId", label: "사번", width: 120 },
  { key: "employeeName", label: "성명", width: 120 },
  { key: "dateOfBirth", label: "생년월일", width: 120 },
  { key: "hireDate", label: "입사일", width: 120 },
  { key: "rank", label: "등급", width: 80 },
  { key: "remarks", label: "특이사항", width: 200 },
  { key: "note2", label: "비고", width: 200 },
] as const;

const EXTRA_COLS: ReadonlyArray<Col> = [
  { key: "address", label: "주소", width: 280 },
  { key: "mobile", label: "전화번호", width: 140 },
  { key: "department", label: "부서명", width: 120 },
] as const;

const COLS: ReadonlyArray<Col> = [...FIXED_COLS, ...EXTRA_COLS] as const;

export default function EngineersPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    listEngineers()
      .then((data: Engineer[]) => {
        if (!alive) return;
        const sorted = [...data].sort((a, b) =>
          (a.employeeId || "").localeCompare(b.employeeId || "")
        );
        setRows(sorted);
      })
      .catch((e: unknown) => {
        console.error("listEngineers failed:", e);
        setRows([]);
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const view: Row[] = useMemo(() => {
    const term = q.trim();
    if (!term) return rows;
    const t = term.toLowerCase();
    return rows.filter((r) => {
      const hay =
        [
          r.employeeId,
          r.employeeName,
          r.status,
          r.department,
          r.address,
          r.mobile,
          r.remarks,
          r.note2,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
      return hay.includes(t);
    });
  }, [q, rows]);

  const allChecked = view.length > 0 && view.every((r) => r.__checked);
  const toggleAll = () => {
    const ids = new Set(view.map((v) => v.employeeId));
    setRows((prev) =>
      prev.map((r) => (ids.has(r.employeeId) ? { ...r, __checked: !allChecked } : r))
    );
  };

  const toggleOne = (id: string) => {
    setRows((prev) =>
      prev.map((r) => (r.employeeId === id ? { ...r, __checked: !r.__checked } : r))
    );
  };

  const handleDoubleClick = (r: Row) => {
    // TODO: 라우팅 연결 (더블클릭 상세 진입)
    console.info("open detail:", r.employeeId);
  };

  return (
    <div className="engineers-page" style={{ padding: "0 16px" }}>
      {/* 상단 툴바 */}
      <div
        className="toolbar"
        style={{
          marginTop: "4px",
          marginBottom: "8px",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {/* 좌측: 찾기, 선택삭제 */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
          <input
            value={q}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value)}
            placeholder="찾기"
            style={{
              flexBasis: 240,
              flexGrow: 0,
              height: 36,
              padding: "0 10px",
              border: "1px solid var(--border, #444)",
              borderRadius: 6,
              background: "var(--bg, #111)",
              color: "var(--fg, #eee)",
            }}
          />
          <button
            type="button"
            onClick={() => {
              const ids = rows.filter((r) => r.__checked).map((r) => r.employeeId);
              if (ids.length === 0) return;
              setRows((prev) => prev.filter((r) => !ids.includes(r.employeeId)));
              // TODO: 백엔드 삭제 API 연동
            }}
            style={btnStyle()}
          >
            선택삭제
          </button>
        </div>

        {/* 우측: 불러오기, 내보내기, 신규등록(맨 오른쪽) */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button type="button" style={btnStyle()} onClick={() => alert("불러오기 준비 중")}>
            불러오기
          </button>

          <button
            type="button"
            style={btnStyle()}
            onClick={() => {
              const header = ["사번", "성명", "생년월일", "입사일", "주소", "전화번호", "부서명", "비고"];
              const lines = [header.join(",")];
              for (const r of view) {
                lines.push(
                  [
                    safe(r.employeeId),
                    safe(r.employeeName),
                    safe(r.dateOfBirth),
                    safe(r.hireDate),
                    safe(r.address),
                    safe(r.mobile ?? r.tel),
                    safe(r.department),
                    safe(r.remarks ?? r.note2),
                  ].join(",")
                );
              }
              const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "engineers.csv";
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            내보내기
          </button>

          <button
            type="button"
            style={{ ...btnStyle(true), marginLeft: 4 }}
            onClick={() => alert("신규등록 준비 중")}
          >
            신규등록
          </button>
        </div>
      </div>

      {/* 표 */}
      <div
        className="table-wrap"
        style={{
          overflowX: "hidden",
          overflowY: "auto",
          maxHeight: "calc(100vh - 180px)",
          border: "1px solid var(--border, #333)",
          borderRadius: 8,
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: 0,
            tableLayout: "fixed",
          }}
        >
          <thead style={{ position: "sticky", top: 0, background: "var(--bg, #111)", zIndex: 1 }}>
            <tr>
              {COLS.map((c) => (
                <th
                  key={c.key}
                  style={{
                    textAlign: "left",
                    padding: "10px 8px",
                    borderBottom: "1px solid var(--border, #333)",
                    width: c.width,
                    minWidth: c.width,
                    whiteSpace: "nowrap",
                    fontWeight: 600,
                  }}
                >
                  {c.key === "__checked" ? (
                    <input type="checkbox" checked={allChecked} onChange={toggleAll} />
                  ) : (
                    c.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={COLS.length} style={{ padding: 16 }}>
                  로딩 중…
                </td>
              </tr>
            )}
            {!loading && view.length === 0 && (
              <tr>
                <td colSpan={COLS.length} style={{ padding: 16 }}>
                  데이터가 없습니다.
                </td>
              </tr>
            )}
            {!loading &&
              view.map((r) => (
                <tr
                  key={r.employeeId}
                  onDoubleClick={() => handleDoubleClick(r)}
                  style={{ cursor: "default" }}
                >
                  {COLS.map((c) => {
                    const v = r[c.key]; // ← keyof Row로 안전 접근 (캐스팅 불필요)
                    return (
                      <td
                        key={c.key}
                        style={{
                          padding: "8px",
                          borderBottom: "1px solid var(--border, #222)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {c.key === "__checked" ? (
                          <input
                            type="checkbox"
                            checked={!!r.__checked}
                            onChange={() => toggleOne(r.employeeId)}
                          />
                        ) : (
                          renderCell(c.key, v)
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function renderCell(key: Key, v: unknown): React.ReactNode {
  if (v == null) return "";
  if (key === "status") {
    const s = String(v);
    const style: React.CSSProperties =
      s === "중지중"
        ? { color: "#e74c3c", fontStyle: "italic", fontWeight: 600 }
        : s === "보류중"
        ? { color: "#f1c40f", fontWeight: 600 }
        : s === "완료"
        ? { color: "#2ecc71", fontWeight: 600 }
        : {};
    return <span style={style}>{s}</span>;
  }
  return String(v ?? "");
}

function btnStyle(primary = false): React.CSSProperties {
  return {
    height: 36,
    padding: "0 12px",
    borderRadius: 8,
    border: "1px solid var(--border, #444)",
    background: primary ? "var(--btn, #1e88e5)" : "var(--bg, #111)",
    color: primary ? "#fff" : "var(--fg, #eee)",
    fontWeight: 600,
  };
}

function safe(v?: string): string {
  if (!v) return "";
  const needQuote = /[",\n]/.test(v);
  const escaped = v.replace(/"/g, '""');
  return needQuote ? `"${escaped}"` : escaped;
}