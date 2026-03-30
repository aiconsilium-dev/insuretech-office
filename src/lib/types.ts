export type TabId = "dashboard" | "claims" | "new" | "more";

export type TypeClass = "A" | "B" | "C";

export type ClaimStatus = "received" | "review" | "assess" | "complete";

export type ClaimSource = "resident" | "office";

export type SubPage = "inspection" | "cost" | "subrogation" | null;

export interface ClaimDetail {
  desc: string;
  warranty?: string;
  aiAmount?: string;
  ownerAmount?: string;
  tenantAmount?: string;
  defectDetail?: string;
  exemptReason?: string;
  clauseRef?: string;
}

export interface Claim {
  id: string;
  type: string;
  dong: string;
  ho: string;
  source: ClaimSource;
  typeClass: TypeClass;
  status: ClaimStatus;
  statusLabel: string;
  date: string;
  detail: ClaimDetail;
}

export const STATUS_LABELS: Record<ClaimStatus, string> = {
  received: "접수",
  review: "검토",
  assess: "산정",
  complete: "완료",
};

export const STATUS_ORDER: ClaimStatus[] = ["received", "review", "assess", "complete"];

export const INITIAL_CLAIMS: Claim[] = [
  {
    id: "HC-2026-0041", type: "누수", dong: "101", ho: "1204", source: "resident", typeClass: "C",
    status: "received", statusLabel: "접수", date: "2026.03.28",
    detail: { desc: "욕실 천장 누수, 윗층 배관 의심", warranty: "공용배관 10년 (2033.06 만료)", aiAmount: "2,450,000원", ownerAmount: "1,960,000원", tenantAmount: "490,000원" },
  },
  {
    id: "HC-2026-0040", type: "파손", dong: "103", ho: "802", source: "resident", typeClass: "A",
    status: "review", statusLabel: "검토", date: "2026.03.28",
    detail: { desc: "거실 벽체 균열, 시공 당시 하자 의심", warranty: "구조체 10년 (2033.06 만료)", defectDetail: "벽체 균열 폭 0.3mm 이상, 구조적 하자 해당" },
  },
  {
    id: "HC-2026-0039", type: "결로", dong: "105", ho: "501", source: "resident", typeClass: "B",
    status: "assess", statusLabel: "산정", date: "2026.03.27",
    detail: { desc: "북측 벽면 결로 및 곰팡이 발생", exemptReason: "환기 부족에 의한 결로 — 입주자 관리 부주의", clauseRef: "약관 제7조 2항 면책사유 (나)호" },
  },
  {
    id: "HC-2026-0038", type: "배관", dong: "지하", ho: "B2 주차장", source: "office", typeClass: "C",
    status: "received", statusLabel: "접수", date: "2026.03.27",
    detail: { desc: "지하 B2 공용배관 파열, 누수 확산", warranty: "공용배관 10년 (2033.06 만료)", aiAmount: "4,800,000원", ownerAmount: "4,800,000원", tenantAmount: "0원" },
  },
  {
    id: "HC-2026-0037", type: "사고", dong: "지하", ho: "B1 주차장", source: "office", typeClass: "C",
    status: "review", statusLabel: "검토", date: "2026.03.26",
    detail: { desc: "배달 오토바이 미끄러짐, 바닥 도장 파손", warranty: "해당없음 (사고)", aiAmount: "850,000원", ownerAmount: "850,000원", tenantAmount: "0원" },
  },
  {
    id: "HC-2026-0036", type: "도장", dong: "102", ho: "1501", source: "resident", typeClass: "C",
    status: "complete", statusLabel: "완료", date: "2026.03.25",
    detail: { desc: "현관 천장 도장 박리", warranty: "마감재 3년 (만료)", aiAmount: "380,000원", ownerAmount: "304,000원", tenantAmount: "76,000원" },
  },
  {
    id: "HC-2026-0035", type: "창호", dong: "104", ho: "602", source: "resident", typeClass: "C",
    status: "assess", statusLabel: "산정", date: "2026.03.24",
    detail: { desc: "거실 창호 기밀 불량, 결로 동반", warranty: "창호 3년 (만료)", aiAmount: "1,280,000원", ownerAmount: "1,024,000원", tenantAmount: "256,000원" },
  },
  {
    id: "HC-2026-0034", type: "타일", dong: "지하", ho: "B1 주차장", source: "office", typeClass: "B",
    status: "review", statusLabel: "검토", date: "2026.03.23",
    detail: { desc: "주차장 벽면 타일 들뜸", exemptReason: "시설 노후에 의한 자연 마모", clauseRef: "약관 제7조 3항 면책사유 (가)호" },
  },
];
