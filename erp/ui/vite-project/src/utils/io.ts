import * as XLSX from "xlsx";

export function toCSV<T extends Record<string, any>>(rows: T[], headers: string[]) {
  const head = headers.join(",");
  const body = rows.map(r => headers.map(h => {
    const v = r[h] ?? "";
    const s = String(v).replace(/"/g,'""');
    return /[",\n]/.test(s) ? `"${s}"` : s;
  }).join(",")).join("\n");
  return head + "\n" + body;
}

export function downloadBlob(b: Blob, filename: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(b);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

export function exportXLSX<T extends Record<string, any>>(rows: T[], headers: string[], filename:string){
  const ws = XLSX.utils.json_to_sheet(rows, { header: headers as any});
  const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  const out = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  downloadBlob(new Blob([out], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), filename);
}
