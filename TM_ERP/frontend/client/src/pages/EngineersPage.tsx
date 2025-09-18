// frontend/client/src/pages/EngineersPage.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import type { Engineer } from "../api";
import { createEngineer, listEngineers } from "../api";

type Row = Engineer & { __checked?: boolean };

type StickyCol =
  | { key: "__checked"; label: string; width: number; stickyLeft: number }
  | { key: "status" | "employeeId" | "employeeName"; label: string; width: number; stickyLeft: number };
type NormalCol =
  | { key: "dateOfBirth" | "hireDate" | "rank" | "remarks" | "note2"; label: string; width: number; render?: (r: Row) => React.ReactNode };
type Column = StickyCol | NormalCol;

const COLS: Column[] = [
  { key: "__checked", label: "□", width: 48, stickyLeft: 0 },
  { key: "status", label: "상태", width: 96, stickyLeft: 48 },
  { key: "employeeId", label: "사번", width: 120, stickyLeft: 144 },
  { key: "employeeName", label: "성명", width: 152, stickyLeft: 264 },
  { key: "dateOfBirth", label: "생년월일", width: 120 },
  { key: "hireDate", label: "입사일", width: 120 },
  { key: "rank", label: "등급", width: 88 },
  { key: "remarks", label: "특이사항", width: 240 },
  { key: "note2", label: "비고", width: 200, render: (r: Row) => r.address || "" },
];

const isSticky = (c: Column): c is StickyCol => (c as StickyCol).stickyLeft !== undefined;
const fmtDate = (x?: string) => x ?? "";

/** 따옴표 인식 CSV/TSV 라인 파서 */
function parseDelimitedLine(line: string, delim: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (!inQuotes && ch === delim) {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out.map((s) => s.replace(/^\uFEFF/, "").trim());
}

function indexOfHeader(headers: string[], names: string[]): number {
  for (const n of names) {
    const idx = headers.findIndex((h) => h.trim() === n);
    if (idx >= 0) return idx;
  }
  return -1;
}

const toCSV = (rows: Row[]) => {
  const header = ["선택","상태","사번","성명","생년월일","입사일","주소","연락처","부서","특이사항","비고"];
  const lines = rows.map((r) => [
    r.__checked ? "Y" : "",
    r.status ?? "",
    r.employeeId ?? "",
    r.employeeName ?? "",
    fmtDate(r.dateOfBirth),
    fmtDate(r.hireDate),
    r.address ?? "",
    r.mobile ?? r.tel ?? "",
    r.department ?? "",
    r.remarks ?? "",
    r.address ?? "",
  ]);
  return [header, ...lines]
    .map((a) => a.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");
};

export default function EngineersPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("전체");
  const [creating, setCreating] = useState(false);
  const [err, setErr] = useState<string>("");
  const formInit: Engineer = { employeeId: "", employeeName: "", status: "근무", rank: "", department: "", mobile: "", address: "" };
  const [form, setForm] = useState<Engineer>(formInit);
  const clickTimer = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await listEngineers();
        setRows(data);
      } catch (e: any) {
        setErr("목록 불러오기에 실패했습니다. (백엔드 연결 확인)");
        console.error(e);
      }
    })();
  }, []);

  const view = useMemo(() => {
    const term = q.trim();
    let out = rows;
    if (statusFilter !== "전체") out = out.filter((r) => (r.status ?? "") === statusFilter);
    if (term) {
      const t = term.toLowerCase();
      out = out.filter((r) =>
        [r.employeeId, r.employeeName, r.rank, r.department, r.position, r.remarks, r.address, r.mobile, r.tel]
          .map((v) => (v ?? "").toLowerCase())
          .some((v) => v.includes(t)),
      );
    }
    return out;
  }, [rows, q, statusFilter]);

  function onRowClick(idx: number) {
    if (clickTimer.current) {
      window.clearTimeout(clickTimer.current);
      clickTimer.current = null;
      const r = view[idx];
      alert(`상세로 이동: ${r.employeeName} (${r.employeeId})`);
      return;
    }
    clickTimer.current = window.setTimeout(() => {
      clickTimer.current = null;
      const r = view[idx];
      setRows((prev) => prev.map((p) => (p.employeeId === r.employeeId ? { ...p, __checked: !p.__checked } : p)));
    }, 220);
  }

  const toggleAll = (checked: boolean) => setRows((prev) => prev.map((p) => ({ ...p, __checked: checked })));

  async function onCreateSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!form.employeeId || !form.employeeName) { alert("사번, 성명은 필수입니다."); return; }
    try {
      const saved = await createEngineer(form);
      setRows((prev) => [{ ...saved }, ...prev]);
      setCreating(false);
      setForm(formInit);
    } catch (e: any) {
      setErr(`저장 실패: ${e?.message || e}`);
      alert(`저장 실패\n${e?.message || e}`);
      console.error(e);
    }
  }

  async function onImportFile(file: File) {
    setErr("");
    if (fileInputRef.current) fileInputRef.current.value = "";

    const saveMany = async (items: Engineer[]) => {
      let ok = 0, fail = 0;
      for (const e of items) {
        try { await createEngineer(e); ok++; }
        catch (err: any) { fail++; console.error("createEngineer 실패:", err); }
      }
      try {
        const fresh = await listEngineers();
        setRows(fresh);
      } catch (e) {
        console.warn("목록 갱신 실패", e);
      }
      alert(`불러오기 완료: 성공 ${ok}건 / 실패 ${fail}건`);
    };

    const ext = (file.name.split(".").pop() || "").toLowerCase();
    // CSV/TSV
    if (ext === "csv" || ext === "tsv" || ext === "txt") {
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length === 0) { setErr("파일이 비어 있습니다."); return; }

      const useTab = /\t/.test(lines[0]);
      const delim = useTab ? "\t" : ",";
      const headers = parseDelimitedLine(lines[0], delim);
      const idx = (names: string[]) => indexOfHeader(headers, names);

      const IDX = {
        employeeId: idx(["사번","employeeId"]),
        employeeName: idx(["성명","employeeName"]),
        dateOfBirth: idx(["생년월일","dateOfBirth"]),
        hireDate: idx(["입사일","hireDate"]),
        address: idx(["주소","address"]),
        mobile: idx(["전화번호","연락처","mobile","tel","전화","휴대폰","핸드폰"]),
        department: idx(["부서명","부서","department"]),
        retirePlan: idx(["퇴사예정일","plannedLeaveDate","retirePlan"]),
        retireDate: idx(["퇴사일","leaveDate"]),
        remarks: idx(["비고","remarks"]),
        status: idx(["상태","status"]),
      };

      // 필수 헤더 확인
      const missing: string[] = [];
      if (IDX.employeeId < 0) missing.push("사번");
      if (IDX.employeeName < 0) missing.push("성명");
      if (missing.length) {
        setErr(`필수 헤더 누락: ${missing.join(", ")}\n감지된 헤더: ${headers.join(" | ")}`);
        alert(`필수 헤더 누락: ${missing.join(", ")}`);
        return;
      }

      const parsed: Engineer[] = [];
      for (let i = 1; i < lines.length; i++) {
        const cells = parseDelimitedLine(lines[i], delim);
        const employeeId = cells[IDX.employeeId];
        const employeeName = cells[IDX.employeeName];
        if (!employeeId || !employeeName) continue;

        const status = IDX.status >= 0 ? (cells[IDX.status] || "근무") : "근무";
        const dateOfBirth = IDX.dateOfBirth >= 0 ? (cells[IDX.dateOfBirth] || "") : "";
        const hireDate = IDX.hireDate >= 0 ? (cells[IDX.hireDate] || "") : "";
        const address = IDX.address >= 0 ? (cells[IDX.address] || "") : "";
        const mobile = IDX.mobile >= 0 ? (cells[IDX.mobile] || "") : "";
        const department = IDX.department >= 0 ? (cells[IDX.department] || "") : "";
        const remark = IDX.remarks >= 0 ? (cells[IDX.remarks] || "") : "";
        const retirePlan = IDX.retirePlan >= 0 ? (cells[IDX.retirePlan] || "") : "";
        const retireDate = IDX.retireDate >= 0 ? (cells[IDX.retireDate] || "") : "";

        const mergedRemarks = [
          remark,
          retirePlan ? `퇴사예정일: ${retirePlan}` : "",
          retireDate ? `퇴사일: ${retireDate}` : "",
        ].filter(Boolean).join(" / ");

        parsed.push({
          employeeId, employeeName, status,
          dateOfBirth: dateOfBirth || undefined,
          hireDate: hireDate || undefined,
          address, mobile, department,
          remarks: mergedRemarks,
        });
      }

      if (parsed.length === 0) {
        setErr(`파싱 결과 0건입니다. (구분자: ${useTab ? "탭" : "콤마"})\n헤더: ${headers.join(" | ")}`);
        alert("파싱 결과 0건입니다.");
        return;
      }

      await saveMany(parsed);
      return;
    }

    // XLSX
    try {
      const XLSX: typeof import("xlsx") = await import("xlsx");
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];

      type XKeys =
        | "사번" | "employeeId"
        | "성명" | "employeeName"
        | "상태" | "status"
        | "생년월일" | "dateOfBirth"
        | "입사일" | "hireDate"
        | "주소" | "address"
        | "전화번호" | "연락처" | "mobile" | "tel" | "전화" | "휴대폰" | "핸드폰"
        | "부서명" | "부서" | "department"
        | "퇴사예정일" | "plannedLeaveDate" | "retirePlan"
        | "퇴사일" | "leaveDate"
        | "비고" | "remarks";
      type XRow = Partial<Record<XKeys, string>>;

      const arr = XLSX.utils.sheet_to_json<XRow>(ws, { defval: "" });

      const parsed: Engineer[] = arr
        .map((r) => {
          const employeeId = r["사번"] || r["employeeId"] || "";
          const employeeName = r["성명"] || r["employeeName"] || "";
          if (!employeeId || !employeeName) return null;

          const status = r["상태"] || r["status"] || "근무";
          const dateOfBirth = r["생년월일"] || r["dateOfBirth"] || "";
          const hireDate = r["입사일"] || r["hireDate"] || "";
          const address = r["주소"] || r["address"] || "";
          const department = r["부서명"] || r["부서"] || r["department"] || "";
          const mobile =
            r["전화번호"] || r["연락처"] || r["mobile"] || r["휴대폰"] || r["핸드폰"] || r["tel"] || r["전화"] || "";
          const remark = r["비고"] || r["remarks"] || "";
          const retirePlan = r["퇴사예정일"] || r["plannedLeaveDate"] || r["retirePlan"] || "";
          const retireDate = r["퇴사일"] || r["leaveDate"] || "";

          const mergedRemarks = [
            remark,
            retirePlan ? `퇴사예정일: ${retirePlan}` : "",
            retireDate ? `퇴사일: ${retireDate}` : "",
          ].filter(Boolean).join(" / ");

          return {
            employeeId, employeeName, status,
            dateOfBirth, hireDate, address, department, mobile,
            remarks: mergedRemarks,
          } as Engineer;
        })
        .filter((e): e is Engineer => !!e);

      if (parsed.length === 0) {
        setErr("XLSX 파싱 결과 0건입니다. 첫 시트의 헤더를 확인해 주세요.");
        alert("XLSX 파싱 결과 0건입니다.");
        return;
      }

      await saveMany(parsed);
    } catch (e: any) {
      console.error(e);
      setErr("XLSX 처리 실패: 'xlsx' 패키지 설치 필요 또는 파일 형식 확인");
      alert("XLSX 처리 실패: CSV/TSV로 저장해서 불러와 주세요.");
    }
  }

  const exportCSV = () => {
    const blob = new Blob([toCSV(view)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "engineers.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const checkedCount = rows.filter((r) => r.__checked).length;

  return (
    <main className="container">
      <div className="toolbar">
        <div className="left">
          <input className="search" placeholder="찾기" value={q} onChange={(e) => setQ(e.target.value)} />
          <select className="search" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="전체">전체</option>
            <option value="근무">근무</option>
            <option value="휴직">휴직</option>
            <option value="퇴직">퇴직</option>
          </select>
          <button className="btn" disabled={checkedCount === 0} onClick={() => alert("선택삭제는 다음 단계에서 구현됩니다.")}>
            선택삭제({checkedCount})
          </button>
        </div>
        <div className="right">
          <label className="btn">
            불러오기
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.tsv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.txt"
              onChange={(e) => e.target.files && onImportFile(e.target.files[0])}
              style={{ display: "none" }}
            />
          </label>
          <button className="btn" onClick={exportCSV}>내보내기(CSV)</button>
          <button className="btn primary" onClick={() => setCreating((v) => !v)}>신규 등록</button>
        </div>
      </div>

      {err && <div className="error" style={{margin:"6px 8px", color:"var(--red, #e66)"}}>{err}</div>}

      {creating && (
        <form className="create" onSubmit={onCreateSubmit}>
          <div className="row">
            <label>사번*</label>
            <input value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} required />
            <label>성명*</label>
            <input value={form.employeeName} onChange={(e) => setForm({ ...form, employeeName: e.target.value })} required />
            <label>입사일</label>
            <input type="date" value={form.hireDate || ""} onChange={(e) => setForm({ ...form, hireDate: e.target.value })} />
            <label>상태</label>
            <select value={form.status || "근무"} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option>근무</option><option>휴직</option><option>퇴직</option>
            </select>
            <label>등급</label>
            <input value={form.rank || ""} onChange={(e) => setForm({ ...form, rank: e.target.value })} />
            <label>특이사항</label>
            <input value={form.remarks || ""} onChange={(e) => setForm({ ...form, remarks: e.target.value })} />
            <label>주소</label>
            <input value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <label>연락처</label>
            <input value={form.mobile || ""} onChange={(e) => setForm({ ...form, mobile: e.target.value })} placeholder="휴대폰 또는 대표연락처" />
            <label>부서</label>
            <input value={form.department || ""} onChange={(e) => setForm({ ...form, department: e.target.value })} />
          </div>
          <div className="act">
            <button className="btn" type="submit">저장</button>
            <button className="btn ghost" type="button" onClick={() => setCreating(false)}>닫기</button>
          </div>
        </form>
      )}

      <div className="table-wrap">
        <div className="table-inner">
          <table className="grid-table">
            <thead>
              <tr>
                {COLS.map((c, i) => (
                  <th
                    key={i}
                    style={{
                      width: c.width, minWidth: c.width, maxWidth: c.width,
                      position: "sticky", top: 0,
                      left: isSticky(c) ? c.stickyLeft : undefined,
                    }}
                  >
                    {c.key === "__checked"
                      ? <input type="checkbox" onChange={(e) => toggleAll(e.target.checked)} />
                      : c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {view.map((r, idx) => (
                <tr key={r.employeeId} onClick={() => onRowClick(idx)} onDoubleClick={(e) => e.preventDefault()}>
                  {COLS.map((c, i) => {
                    const style: React.CSSProperties = {
                      width: c.width, minWidth: c.width, maxWidth: c.width,
                      position: isSticky(c) ? "sticky" : undefined,
                      left: isSticky(c) ? c.stickyLeft : undefined,
                      zIndex: isSticky(c) ? 1 : undefined,
                    };
                    let val: React.ReactNode;
                    if ("render" in c && c.render) val = c.render(r);
                    else if (c.key === "__checked") val = <input type="checkbox" checked={!!r.__checked} readOnly />;
                    else {
                      const key = c.key as keyof Row;
                      if (key === "dateOfBirth" || key === "hireDate") val = fmtDate(r[key]);
                      else val = (r[key] ?? "") as string;
                    }
                    return (
                      <td key={i} style={style} title={typeof val === "string" ? val : ""}>
                        {val}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {view.length === 0 && (
                <tr><td colSpan={COLS.length} className="empty">데이터가 없습니다.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}