import type { ClaimType, ClaimTypeOption, EstimationData } from './types';

export const CLAIM_TYPES: ClaimTypeOption[] = [
  { type: "facility", title: "시설 파손", desc: "공용부 벽면·바닥·시설물 파손", symbol: "■", color: "#00854A", completionMsg: "현장조사가 배정됩니다" },
  { type: "leak", title: "누수·침수", desc: "공용 배관 누수, 지하 침수", symbol: "●", color: "#0061AF", completionMsg: "누수원인 조사가 진행됩니다" },
  { type: "injury", title: "안전사고", desc: "입주민·방문자 부상 사고", symbol: "◆", color: "#C9252C", completionMsg: "현장조사 후 산정됩니다" },
  { type: "fire", title: "화재·폭발", desc: "화재, 가스 폭발", symbol: "▲", color: "#F47920", completionMsg: "화재증명원 확인 후 처리됩니다" },
];

export const FACILITY_LOCATIONS = ["주차장", "복도·계단", "로비·현관", "놀이터", "옥상", "기타"];
export const FACILITY_DAMAGE_TYPES = [
  { id: "crack", label: "벽면 균열", desc: "공용부 벽면·천장 균열" },
  { id: "floor", label: "바닥 파손", desc: "바닥재·포장 파손" },
  { id: "landscape", label: "조경·포장", desc: "조경시설·외부 포장" },
  { id: "equipment", label: "설비 고장", desc: "전기·기계·설비 고장" },
];

export const LEAK_LOCATIONS = ["지하주차장", "옥상", "외벽", "공용 배관"];
export const LEAK_DAMAGES = ["바닥 침수", "벽면 젖음", "천장 누수", "전기 설비 피해", "기타"];

export const SAFETY_TYPES = ["미끄러짐", "낙하물", "시설물 사고", "기타"];
export const SAFETY_PLACES = ["주차장", "복도·계단", "놀이터", "로비·현관", "옥상", "기타"];

export const FIRE_TYPES = ["전기 화재", "가스 폭발", "방화", "기타"];
export const FIRE_DAMAGE_SCOPE = ["대물만", "대인만", "대물+대인"];

export const FACILITY_ESTIMATION: Record<string, EstimationData> = {
  crack: {
    items: [
      { name: "균열 보수(V커팅+충전)", qty: "8m", unitPrice: 22000, total: 176000 },
      { name: "도장 재시공", qty: "20㎡", unitPrice: 15000, total: 300000 },
      { name: "부자재", qty: "1식", unitPrice: 60000, total: 60000 },
    ],
    damageTotal: 536000, insurance: 536000,
  },
  floor: {
    items: [
      { name: "바닥재 철거", qty: "15㎡", unitPrice: 8000, total: 120000 },
      { name: "바닥재 재시공", qty: "15㎡", unitPrice: 35000, total: 525000 },
      { name: "부자재·폐기물", qty: "1식", unitPrice: 80000, total: 80000 },
    ],
    damageTotal: 725000, insurance: 725000,
  },
  landscape: {
    items: [
      { name: "포장 철거·재시공", qty: "10㎡", unitPrice: 45000, total: 450000 },
      { name: "조경 보수", qty: "1식", unitPrice: 200000, total: 200000 },
    ],
    damageTotal: 650000, insurance: 650000,
  },
  equipment: {
    items: [
      { name: "설비 부품 교체", qty: "1식", unitPrice: 350000, total: 350000 },
      { name: "공사비", qty: "1식", unitPrice: 180000, total: 180000 },
    ],
    damageTotal: 530000, insurance: 530000,
  },
};

export const LEAK_DAMAGE_COSTS: Record<string, { items: { name: string; qty: string; unitPrice: number; total: number }[]; subtotal: number }> = {
  "바닥 침수": { items: [{ name: "바닥 방수·도장", qty: "30㎡", unitPrice: 25000, total: 750000 }], subtotal: 750000 },
  "벽면 젖음": { items: [{ name: "벽면 도장", qty: "40㎡", unitPrice: 15000, total: 600000 }], subtotal: 600000 },
  "천장 누수": { items: [{ name: "천장 보수", qty: "20㎡", unitPrice: 18000, total: 360000 }], subtotal: 360000 },
  "전기 설비 피해": { items: [{ name: "전기 설비 복구", qty: "1식", unitPrice: 500000, total: 500000 }], subtotal: 500000 },
  "기타": { items: [{ name: "기타 피해 복구", qty: "1식", unitPrice: 200000, total: 200000 }], subtotal: 200000 },
};

export const NEXT_STEPS: Record<ClaimType, string[]> = {
  facility: ["현장조사 배정 (1~3일)", "손해사정 확정", "보험금 지급 / 구상권 청구"],
  leak: ["누수원인 조사 (3~5일)", "책임소재 판단", "수리비 확정"],
  injury: ["현장조사 (1~3일)", "손해사정사 심사", "대인 보상금 확정"],
  fire: ["화재증명원 확인 (5~7일)", "현장 감정", "보험금 확정"],
};
