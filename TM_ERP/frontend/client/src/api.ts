// frontend/client/src/api.ts
export interface Engineer {
  employeeId: string;
  employeeName: string;
  status?: string;
  dateOfBirth?: string;
  hireDate?: string;
  rank?: string;
  department?: string;
  position?: string;
  mobile?: string;
  tel?: string;
  address?: string;
  remarks?: string;
  note2?: string;
}

const BASE =
  (import.meta as any)?.env?.VITE_API_BASE ||
  (typeof process !== "undefined" && (process as any)?.env?.VITE_API_BASE) ||
  "http://localhost:8000";

/** 원시 Response 반환 (JSON 아닐 수도 있으니) */
async function httpRaw(path: string, init?: RequestInit): Promise<Response> {
  const url = `${BASE}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    redirect: "follow",
    ...init,
  });
  return res;
}

/** JSON 응답 시 객체/배열을 unknown으로 반환 */
async function httpJSON(path: string, init?: RequestInit): Promise<unknown> {
  const res = await httpRaw(path, init);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText} @ ${res.url}\n${text}`);
  }
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    return null;
  }
  return (await res.json()) as unknown;
}

/** 단일 레코드 정규화 */
function normalizeOne(r: unknown): Engineer | null {
  if (!r || typeof r !== "object") return null;
  const o = r as Record<string, unknown>;
  const str = (v: unknown): string | undefined =>
    typeof v === "string" ? v : undefined;

  const employeeId =
    str(o["employeeId"]) ??
    str(o["id"]) ??
    str(o["empId"]) ??
    str(o["emp_id"]) ??
    "";
  const employeeName =
    str(o["employeeName"]) ??
    str(o["name"]) ??
    str(o["empName"]) ??
    str(o["emp_name"]) ??
    "";

  if (!employeeId || !employeeName) return null;

  const pick = (k: string): string | undefined => str(o[k]);

  return {
    employeeId,
    employeeName,
    status: pick("status") ?? pick("empStatus") ?? pick("state") ?? "근무",
    dateOfBirth: pick("dateOfBirth") ?? pick("birth") ?? pick("dob"),
    hireDate: pick("hireDate") ?? pick("joinDate") ?? pick("hired_at"),
    rank: pick("rank") ?? pick("grade"),
    department: pick("department") ?? pick("dept"),
    position: pick("position"),
    mobile: pick("mobile") ?? pick("phone") ?? pick("tel"),
    tel: pick("tel"),
    address: pick("address") ?? pick("addr"),
    remarks: pick("remarks") ?? pick("note") ?? pick("notes"),
    note2: pick("note2"),
  };
}

/** 리스트 정규화: 배열/래핑객체/단일객체 모두 수용 */
function normalizeList(json: unknown): Engineer[] {
  if (Array.isArray(json)) {
    return (json as unknown[]).map((x: unknown) => normalizeOne(x)).filter((x): x is Engineer => !!x);
  }
  if (json && typeof json === "object") {
    const o = json as Record<string, unknown>;
    const items = (Array.isArray(o["items"]) ? (o["items"] as unknown[])
                  : Array.isArray(o["data"]) ? (o["data"] as unknown[])
                  : []) as unknown[];
    if (items.length) {
      return items.map((x: unknown) => normalizeOne(x)).filter((x): x is Engineer => !!x);
    }
  }
  const one = normalizeOne(json);
  return one ? [one] : [];
}

/** 목록 */
export async function listEngineers(): Promise<Engineer[]> {
  try {
    const j = await httpJSON("/engineers/");
    return normalizeList(j);
  } catch {
    const j2 = await httpJSON("/engineers");
    return normalizeList(j2);
  }
}

/** 생성 */
export async function createEngineer(payload: Engineer): Promise<Engineer> {
  try {
    const j = await httpJSON("/engineers/", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const arr = normalizeList(j);
    if (arr.length) return arr[0];
    const one = normalizeOne(j);
    if (one) return one;
    throw new Error("Unexpected response shape");
  } catch {
    const j2 = await httpJSON("/engineers", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const arr2 = normalizeList(j2);
    if (arr2.length) return arr2[0];
    const one2 = normalizeOne(j2);
    if (one2) return one2;
    throw new Error("Unexpected response shape");
  }
}