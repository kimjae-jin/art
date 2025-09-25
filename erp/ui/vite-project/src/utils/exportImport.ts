import { apiPost } from "./api";

/** CSV 다운로드 트리거 */
export function exportEngineersCSV() {
  // 백엔드 같은 오리진 가정
  window.location.href = "/engineers/export-csv";
}

/** 파일 -> rows 변환 (CSV/XLSX 모두 지원, xlsx 의존) */
export async function fileToRows(file: File): Promise<any[]> {
  const XLSX = await import("xlsx"); // 이미 의존성 있으신 걸로 확인됨
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array" });

  // 첫 시트만 사용
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, { defval: "" });
  return rows as any[];
}

/** 백엔드에 임포트 요청 */
export async function importEngineersRows(rows: any[]) {
  if (!Array.isArray(rows)) throw new Error("rows must be array");
  const res = await apiPost("/engineers/import-csv", { rows });
  return res; // {saved: n}
}
