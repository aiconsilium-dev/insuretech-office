export type TabId = "dashboard" | "claims" | "new" | "more";

export type TypeClass = "A" | "B" | "C";

export type ClaimStatus = "received" | "review" | "assess" | "complete";

export type ClaimSource = "resident" | "office" | "visit";

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
  typeIcon: string;
  typeColor: string;
  dong: string;
  ho: string;
  location: string;
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
    id: "HC-2026-0041",
    type: "누수·침수",
    typeIcon: "●",
    typeColor: "#0061AF",
    dong: "101",
    ho: "1204",
    location: "주방·욕실",
    source: "resident",
    typeClass: "C",
    status: "review",
    statusLabel: "심사중",
    date: "2026.03.28",
    detail: {
      desc: "욕실 천장 누수, 윗층 배관 의심",
      warranty: "공용배관 10년 (2033.06 만료)",
      aiAmount: "2,450,000원",
      ownerAmount: "1,960,000원",
      tenantAmount: "490,000원",
    },
  },
  {
    id: "HC-2026-0040",
    type: "시설 파손",
    typeIcon: "■",
    typeColor: "#00854A",
    dong: "지하",
    ho: "B2 주차장",
    location: "주차장",
    source: "office",
    typeClass: "C",
    status: "assess",
    statusLabel: "산정완료",
    date: "2026.03.27",
    detail: {
      desc: "지하 B2 주차장 바닥 도장 파손, 배달 차량 사고",
      aiAmount: "850,000원",
      ownerAmount: "850,000원",
      tenantAmount: "0원",
    },
  },
  {
    id: "HC-2026-0039",
    type: "균열·파손",
    typeIcon: "■",
    typeColor: "#00854A",
    dong: "103",
    ho: "802",
    location: "거실",
    source: "resident",
    typeClass: "A",
    status: "review",
    statusLabel: "하자조사중",
    date: "2026.03.26",
    detail: {
      desc: "거실 벽체 균열, 시공 당시 하자 의심",
      warranty: "구조체 10년 (2033.06 만료)",
      defectDetail: "벽체 균열 폭 0.3mm 이상, 구조적 하자 해당",
    },
  },
  {
    id: "HC-2026-0038",
    type: "안전사고",
    typeIcon: "◆",
    typeColor: "#C9252C",
    dong: "지하",
    ho: "놀이터",
    location: "놀이터",
    source: "office",
    typeClass: "C",
    status: "received",
    statusLabel: "현장조사 대기",
    date: "2026.03.25",
    detail: {
      desc: "놀이터 시설물 파손으로 아동 부상, 현장조사 필요",
    },
  },
  {
    id: "HC-2026-0037",
    type: "방문요청",
    typeIcon: "●",
    typeColor: "#0061AF",
    dong: "101",
    ho: "1502",
    location: "주방·욕실",
    source: "visit",
    typeClass: "C",
    status: "received",
    statusLabel: "방문조사 대기",
    date: "2026.03.25",
    detail: {
      desc: "입주민이 누수 의심으로 관리소 방문 요청",
    },
  },
  {
    id: "HC-2026-0036",
    type: "시설 파손",
    typeIcon: "■",
    typeColor: "#00854A",
    dong: "지하",
    ho: "외벽",
    location: "외벽",
    source: "office",
    typeClass: "B",
    status: "review",
    statusLabel: "면책통보",
    date: "2026.03.23",
    detail: {
      desc: "외벽 타일 균열 — 자연 노화에 의한 마모",
      exemptReason: "자연 노화에 의한 자연 마모",
      clauseRef: "약관 제7조 3항 면책사유 (가)호",
    },
  },
];
