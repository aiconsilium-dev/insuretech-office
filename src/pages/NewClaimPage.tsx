import { useState } from "react";
import StepIndicator from "@/components/common/StepIndicator";
import PhotoCapture from "@/components/common/PhotoCapture";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";

/* ─── 사고 유형 정의 ─── */
type ClaimType = "facility" | "leak" | "injury" | "fire";

interface ClaimTypeOption {
  type: ClaimType;
  title: string;
  desc: string;
  symbol: string;
  color: string;
  completionMsg: string;
}

const CLAIM_TYPES: ClaimTypeOption[] = [
  { type: "facility", title: "시설 파손", desc: "공용부 벽면·바닥·시설물 파손", symbol: "■", color: "#00854A", completionMsg: "현장조사가 배정됩니다" },
  { type: "leak", title: "누수·침수", desc: "공용 배관 누수, 지하 침수", symbol: "●", color: "#0061AF", completionMsg: "누수원인 조사가 진행됩니다" },
  { type: "injury", title: "안전사고", desc: "입주민·방문자 부상 사고", symbol: "◆", color: "#C9252C", completionMsg: "현장조사 후 산정됩니다" },
  { type: "fire", title: "화재·폭발", desc: "화재, 가스 폭발", symbol: "▲", color: "#F47920", completionMsg: "화재증명원 확인 후 처리됩니다" },
];

/* ─── 시설 파손 옵션 ─── */
const FACILITY_LOCATIONS = ["주차장", "복도·계단", "로비·현관", "놀이터", "옥상", "기타"];
const FACILITY_DAMAGE_TYPES = [
  { id: "crack", label: "벽면 균열", desc: "공용부 벽면·천장 균열" },
  { id: "floor", label: "바닥 파손", desc: "바닥재·포장 파손" },
  { id: "landscape", label: "조경·포장", desc: "조경시설·외부 포장" },
  { id: "equipment", label: "설비 고장", desc: "전기·기계·설비 고장" },
];

/* ─── 누수 옵션 ─── */
const LEAK_LOCATIONS = ["지하주차장", "옥상", "외벽", "공용 배관"];
const LEAK_DAMAGES = ["바닥 침수", "벽면 젖음", "천장 누수", "전기 설비 피해", "기타"];

/* ─── 안전사고 옵션 ─── */
const SAFETY_TYPES = ["미끄러짐", "낙하물", "시설물 사고", "기타"];
const SAFETY_PLACES = ["주차장", "복도·계단", "놀이터", "로비·현관", "옥상", "기타"];

/* ─── 화재 옵션 ─── */
const FIRE_TYPES = ["전기 화재", "가스 폭발", "방화", "기타"];
const FIRE_DAMAGE_SCOPE = ["대물만", "대인만", "대물+대인"];

/* ─── AI 적산 (시설 파손) ─── */
interface EstimationItem { name: string; qty: string; unitPrice: number; total: number; }
interface EstimationData { items: EstimationItem[]; damageTotal: number; insurance: number; }

const FACILITY_ESTIMATION: Record<string, EstimationData> = {
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

/* ─── AI 적산 (누수) ─── */
const LEAK_DAMAGE_COSTS: Record<string, { items: { name: string; qty: string; unitPrice: number; total: number }[]; subtotal: number }> = {
  "바닥 침수": { items: [{ name: "바닥 방수·도장", qty: "30㎡", unitPrice: 25000, total: 750000 }], subtotal: 750000 },
  "벽면 젖음": { items: [{ name: "벽면 도장", qty: "40㎡", unitPrice: 15000, total: 600000 }], subtotal: 600000 },
  "천장 누수": { items: [{ name: "천장 보수", qty: "20㎡", unitPrice: 18000, total: 360000 }], subtotal: 360000 },
  "전기 설비 피해": { items: [{ name: "전기 설비 복구", qty: "1식", unitPrice: 500000, total: 500000 }], subtotal: 500000 },
  "기타": { items: [{ name: "기타 피해 복구", qty: "1식", unitPrice: 200000, total: 200000 }], subtotal: 200000 },
};

/* ─── 다음 단계 ─── */
const NEXT_STEPS: Record<ClaimType, string[]> = {
  facility: ["현장조사 배정 (1~3일)", "손해사정 확정", "보험금 지급 / 구상권 청구"],
  leak: ["누수원인 조사 (3~5일)", "책임소재 판단", "수리비 확정"],
  injury: ["현장조사 (1~3일)", "손해사정사 심사", "대인 보상금 확정"],
  fire: ["화재증명원 확인 (5~7일)", "현장 감정", "보험금 확정"],
};

/* ─── 숫자 포맷 ─── */
function fmt(n: number) { return n.toLocaleString("ko-KR"); }

/* ─── 공통: 뒤로가기 헤더 ─── */
function BackHeader({ onBack, title }: { onBack: () => void; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <button onClick={onBack} className="btn btn-icon bg-bg-secondary">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <h2 className="text-xl font-bold text-text-heading">{title}</h2>
    </div>
  );
}

/* ─── 공통: 섹션 라벨 ─── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-semibold text-text-body mb-2">{children}</label>;
}

/* ─── 공통: 선택 그리드 ─── */
function SelectGrid({ items, selected, onSelect, color }: {
  items: { id: string; label: string; desc?: string }[];
  selected: string | null;
  onSelect: (id: string) => void;
  color: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => onSelect(item.id)}
          className={clsx(
            "card border py-3.5 px-4 cursor-pointer transition-all text-center",
            selected === item.id ? "" : "border-border hover:border-text-dim"
          )}
          style={selected === item.id ? { borderColor: color, backgroundColor: `${color}0D` } : {}}
        >
          <h4 className="text-[14px] font-semibold text-text-body">{item.label}</h4>
          {item.desc && <p className="text-[12px] text-text-muted mt-0.5">{item.desc}</p>}
        </div>
      ))}
    </div>
  );
}

/* ─── 공통: 단일 선택 버튼 ─── */
function OptionButtons({ options, selected, onSelect, color }: {
  options: string[];
  selected: string | null;
  onSelect: (val: string) => void;
  color: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onSelect(opt)}
          className={clsx(
            "px-4 py-2.5 rounded-full text-sm font-medium border transition-all",
            selected === opt ? "text-white" : "border-border text-text-body hover:border-text-dim"
          )}
          style={selected === opt ? { backgroundColor: color, borderColor: color } : {}}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

/* ─── 공통: 멀티 선택 체크리스트 ─── */
function CheckList({ options, selected, onToggle, color }: {
  options: string[];
  selected: string[];
  onToggle: (val: string) => void;
  color: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((opt) => (
        <label
          key={opt}
          className={clsx(
            "flex items-center gap-3 px-4 py-3 rounded-[var(--radius-card)] border cursor-pointer transition-all",
            selected.includes(opt) ? "" : "border-border hover:border-text-dim"
          )}
          style={selected.includes(opt) ? { borderColor: color, backgroundColor: `${color}0D` } : {}}
        >
          <input
            type="checkbox"
            checked={selected.includes(opt)}
            onChange={() => onToggle(opt)}
            className="w-4.5 h-4.5 accent-[#171717] shrink-0"
          />
          <span className="text-sm text-text-body">{opt}</span>
        </label>
      ))}
    </div>
  );
}

/* ─── AI 분석 결과 (시설 파손) ─── */
function FacilityAIResult({ damageType, location, onReady }: {
  damageType: string;
  location: string;
  onReady: () => void;
}) {
  const [phase, setPhase] = useState(0);

  useState(() => {
    const timer = setTimeout(() => { setPhase(1); onReady(); }, 2500);
    return () => clearTimeout(timer);
  });

  const est = FACILITY_ESTIMATION[damageType];
  const label = FACILITY_DAMAGE_TYPES.find(d => d.id === damageType)?.label ?? damageType;

  if (phase === 0) {
    return (
      <div className="card border p-6 text-center">
        <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-[#00854A] border-t-transparent rounded-full animate-[spin_1s_linear_infinite]" />
        </div>
        <h3 className="text-base font-bold text-text-heading mb-1">AI 공용부 적산 중</h3>
        <p className="text-sm text-text-muted">사진과 정보를 분석하고 있습니다...</p>
      </div>
    );
  }

  return (
    <div className="card border p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-[#00854A] flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <h3 className="text-base font-bold text-text-heading">AI 적산 결과</h3>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center py-2 border-b border-border-subtle">
          <span className="text-sm text-text-muted">파손 유형</span>
          <span className="text-sm font-semibold text-text-heading">{label}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-border-subtle">
          <span className="text-sm text-text-muted">위치</span>
          <span className="text-sm font-semibold text-text-heading">{location}</span>
        </div>
      </div>

      <div className="bg-bg-secondary rounded-[var(--radius-card)] p-4 mb-4">
        <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">공종별 적산 (공용부 단가)</h4>
        <div className="space-y-2">
          {est.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <div className="flex-1">
                <span className="text-text-body">{item.name}</span>
                <span className="text-text-muted ml-1.5 text-xs">{item.qty} × @{fmt(item.unitPrice)}</span>
              </div>
              <span className="font-medium text-text-heading tabular-nums">{fmt(item.total)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2 pt-2 border-t border-border">
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">손해액 합계</span>
          <span className="font-semibold text-text-heading">{fmt(est.damageTotal)}원</span>
        </div>
        <div className="flex justify-between text-base pt-2 border-t border-border">
          <span className="font-bold text-text-heading">예상 보험금</span>
          <span className="font-bold text-[#00854A] text-lg">{fmt(est.insurance)}원</span>
        </div>
      </div>

      <p className="text-xs text-text-muted mt-4 text-center">※ 현장조사 후 최종 확정됩니다</p>
    </div>
  );
}

/* ─── AI 적산 결과 (누수) ─── */
function LeakAIResult({ leakDamages }: { leakDamages: string[] }) {
  const allItems: { name: string; qty: string; unitPrice: number; total: number }[] = [];
  let damageTotal = 0;
  for (const dmg of leakDamages) {
    const cost = LEAK_DAMAGE_COSTS[dmg];
    if (cost) { allItems.push(...cost.items); damageTotal += cost.subtotal; }
  }

  return (
    <div className="card border p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-[#0061AF] flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <h3 className="text-base font-bold text-text-heading">AI 피해 산정 결과</h3>
      </div>

      <div className="bg-bg-secondary rounded-[var(--radius-card)] p-4 mb-4">
        <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">피해범위별 적산</h4>
        <div className="space-y-2">
          {allItems.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <div className="flex-1">
                <span className="text-text-body">{item.name}</span>
                <span className="text-text-muted ml-1.5 text-xs">{item.qty} × @{fmt(item.unitPrice)}</span>
              </div>
              <span className="font-medium text-text-heading tabular-nums">{fmt(item.total)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2 pt-2 border-t border-border">
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">손해액 합계</span>
          <span className="font-semibold text-text-heading">{fmt(damageTotal)}원</span>
        </div>
        <div className="flex justify-between text-base pt-2 border-t border-border">
          <span className="font-bold text-text-heading">예상 보험금</span>
          <span className="font-bold text-[#0061AF] text-lg">{fmt(damageTotal)}원</span>
        </div>
      </div>

      <p className="text-xs text-text-muted mt-4 text-center">※ 현장 누수원인 조사 후 최종 확정됩니다</p>
    </div>
  );
}

/* ═══════════════════════════════════════
   메인 NewClaimPage
   ═══════════════════════════════════════ */
export default function NewClaimPage() {
  const navigate = useNavigate();

  const [claimType, setClaimType] = useState<ClaimType | null>(null);
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  // 시설 파손
  const [facilityLocation, setFacilityLocation] = useState<string | null>(null);
  const [facilityDamageType, setFacilityDamageType] = useState<string | null>(null);
  const [facilityPhotos, setFacilityPhotos] = useState<(string | null)[]>([null, null, null]);
  const [facilityDesc, setFacilityDesc] = useState("");
  const [aiDone, setAiDone] = useState(false);

  // 누수
  const [leakLocation, setLeakLocation] = useState<string | null>(null);
  const [leakDamages, setLeakDamages] = useState<string[]>([]);
  const [leakPhotos, setLeakPhotos] = useState<(string | null)[]>([null, null, null]);

  // 안전사고
  const [safetyType, setSafetyType] = useState<string | null>(null);
  const [safetyPlace, setSafetyPlace] = useState<string | null>(null);
  const [victimName, setVictimName] = useState("");
  const [victimPhone, setVictimPhone] = useState("");
  const [isResident, setIsResident] = useState<boolean | null>(null);
  const [injuryDocs, setInjuryDocs] = useState<(string | null)[]>([null, null]);

  // 화재
  const [fireType, setFireType] = useState<string | null>(null);
  const [fireReported, setFireReported] = useState<boolean | null>(null);
  const [fireDamageScope, setFireDamageScope] = useState<string | null>(null);
  const [firePhotos, setFirePhotos] = useState<(string | null)[]>([null, null, null]);
  const [fireCertDoc, setFireCertDoc] = useState<(string | null)[]>([null]);

  const [claimNumber] = useState(() => `HC-2026-${String(Date.now()).slice(-4)}`);

  const isAICalculable = claimType === "facility" || claimType === "leak";
  const currentType = CLAIM_TYPES.find((t) => t.type === claimType);
  const totalSteps = isAICalculable ? 3 : 2;
  const scrollTop = () => window.scrollTo(0, 0);

  function getInsuranceAmount(): number | null {
    if (claimType === "facility" && facilityDamageType) {
      return FACILITY_ESTIMATION[facilityDamageType]?.insurance ?? null;
    }
    if (claimType === "leak" && leakDamages.length > 0) {
      let total = 0;
      for (const dmg of leakDamages) total += LEAK_DAMAGE_COSTS[dmg]?.subtotal ?? 0;
      return total;
    }
    return null;
  }

  function resetAll() {
    setClaimType(null); setStep(0); setSubmitted(false);
    setFacilityLocation(null); setFacilityDamageType(null);
    setFacilityPhotos([null, null, null]); setFacilityDesc(""); setAiDone(false);
    setLeakLocation(null); setLeakDamages([]); setLeakPhotos([null, null, null]);
    setSafetyType(null); setSafetyPlace(null); setVictimName(""); setVictimPhone("");
    setIsResident(null); setInjuryDocs([null, null]);
    setFireType(null); setFireReported(null); setFireDamageScope(null);
    setFirePhotos([null, null, null]); setFireCertDoc([null]);
  }

  function goBack() {
    if (step === 0) navigate("/");
    else if (step === 2) setStep(1);
    else { setStep(0); setClaimType(null); }
  }

  // ═══ 접수 완료 ═══
  if (submitted) {
    const insuranceAmt = getInsuranceAmount();
    const steps = claimType ? NEXT_STEPS[claimType] : [];
    const color = currentType?.color ?? "#00854A";

    return (
      <div className="animate-[fadeIn_0.25s_ease] pb-24">
        <div className="text-center pt-8 pb-6">
          <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ backgroundColor: color }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <h2 className="text-[22px] font-bold text-text-heading mb-1">접수 완료</h2>
          <p className="text-sm text-text-muted">공용부 사고가 정상적으로 접수되었습니다</p>
        </div>

        <div className="card border p-5 mb-5">
          <div className="space-y-3">
            <div className="flex justify-between items-center py-1.5">
              <span className="text-sm text-text-muted">접수번호</span>
              <span className="text-sm font-bold text-text-heading">{claimNumber}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-t border-border-subtle">
              <span className="text-sm text-text-muted">유형</span>
              <span className="text-sm font-semibold" style={{ color }}>{currentType?.symbol} {currentType?.title}</span>
            </div>
            {isAICalculable && insuranceAmt !== null && (
              <div className="flex justify-between items-center py-1.5 border-t border-border-subtle">
                <span className="text-sm text-text-muted">예상 보험금</span>
                <span className="text-base font-bold" style={{ color }}>{fmt(insuranceAmt)}원</span>
              </div>
            )}
          </div>
        </div>

        <div className="card border p-5 mb-8">
          <h3 className="text-sm font-bold text-text-heading mb-4">다음 단계</h3>
          <div className="relative pl-6">
            {steps.map((s, i) => (
              <div key={i} className="relative pb-4 last:pb-0">
                {i < steps.length - 1 && (
                  <div className="absolute left-[-16px] top-[22px] w-[2px] h-[calc(100%-8px)] bg-border" />
                )}
                <div
                  className="absolute left-[-22px] top-[2px] w-[14px] h-[14px] rounded-full border-2 flex items-center justify-center text-[8px] font-bold"
                  style={i === 0
                    ? { backgroundColor: color, borderColor: color, color: "#fff" }
                    : { backgroundColor: "var(--color-bg)", borderColor: "var(--color-border)", color: "var(--color-text-muted)" }
                  }
                >
                  {i + 1}
                </div>
                <p className={clsx("text-sm", i === 0 ? "font-semibold text-text-heading" : "text-text-muted")}>{s}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <button
            className="btn btn-full !rounded-full text-white !py-4 !text-base !font-bold"
            style={{ backgroundColor: color }}
            onClick={() => { resetAll(); navigate("/claims"); }}
          >
            접수 현황 확인하기
          </button>
          <button
            className="btn btn-full !rounded-full !py-4 !text-base !font-bold border-border text-text-body"
            onClick={() => { resetAll(); navigate("/"); }}
          >
            홈으로
          </button>
        </div>
      </div>
    );
  }

  // ═══ Step 0: 유형 선택 ═══
  if (step === 0) {
    return (
      <div className="animate-[fadeIn_0.25s_ease] pb-24">
        <BackHeader onBack={() => navigate("/")} title="공용부 사고 접수" />
        <StepIndicator total={3} current={0} />
        <h2 className="text-[22px] font-bold text-text-heading mb-2 tracking-[-0.02em]">어떤 사고가 발생했나요?</h2>
        <p className="text-sm text-text-muted mb-6">해당하는 사고 유형을 선택해주세요</p>

        <div className="flex flex-col gap-2.5 mb-5">
          {CLAIM_TYPES.map((opt) => (
            <div
              key={opt.type}
              onClick={() => setClaimType(opt.type)}
              className={clsx(
                "card border py-4.5 px-5 cursor-pointer transition-all flex items-start gap-3.5",
                claimType === opt.type ? "bg-[rgba(0,0,0,0.02)]" : "border-border hover:border-text-dim"
              )}
              style={claimType === opt.type ? { borderColor: opt.color } : {}}
            >
              <div
                className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 text-base"
                style={claimType === opt.type
                  ? { backgroundColor: opt.color, color: "#fff" }
                  : { backgroundColor: "var(--color-bg-secondary)", color: "var(--color-text-muted)" }
                }
              >
                {opt.symbol}
              </div>
              <div>
                <h4 className="text-[15px] font-semibold text-text-body mb-0.5">{opt.title}</h4>
                <p className="text-[13px] text-text-muted leading-snug">{opt.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          className="btn btn-primary btn-full !rounded-full !py-4 !text-base !font-bold"
          disabled={!claimType}
          onClick={() => { setStep(1); scrollTop(); }}
        >
          다음
        </button>
      </div>
    );
  }

  // ═══ Step 1: 유형별 상세 ═══
  if (step === 1) {
    return (
      <div className="animate-[fadeIn_0.25s_ease] pb-24">
        <BackHeader onBack={goBack} title="공용부 사고 접수" />
        <StepIndicator total={totalSteps} current={1} />

        {/* 시설 파손 */}
        {claimType === "facility" && (
          <>
            <h2 className="text-[22px] font-bold text-text-heading mb-2 tracking-[-0.02em]">어떤 파손이 발생했나요?</h2>
            <p className="text-sm text-text-muted mb-6">공용부 위치와 파손 유형을 선택해주세요</p>

            <div className="mb-5">
              <SectionLabel>위치</SectionLabel>
              <OptionButtons options={FACILITY_LOCATIONS} selected={facilityLocation} onSelect={setFacilityLocation} color="#00854A" />
            </div>

            <div className="mb-5">
              <SectionLabel>파손 유형</SectionLabel>
              <SelectGrid
                items={FACILITY_DAMAGE_TYPES.map(d => ({ id: d.id, label: d.label, desc: d.desc }))}
                selected={facilityDamageType}
                onSelect={setFacilityDamageType}
                color="#00854A"
              />
            </div>

            <div className="mb-5">
              <SectionLabel>피해 사진 (3장)</SectionLabel>
              <div className="flex gap-2.5 mb-1">
                <PhotoCapture label="전경" onCapture={(url) => setFacilityPhotos(p => { const n = [...p]; n[0] = url; return n; })} />
                <PhotoCapture label="근접" onCapture={(url) => setFacilityPhotos(p => { const n = [...p]; n[1] = url; return n; })} />
                <PhotoCapture label="주변" onCapture={(url) => setFacilityPhotos(p => { const n = [...p]; n[2] = url; return n; })} />
              </div>
            </div>

            <div className="mb-5">
              <SectionLabel>상세 설명</SectionLabel>
              <textarea
                className="input !min-h-[100px] !resize-y"
                placeholder="파손 상황을 상세히 설명해주세요 (발생 위치, 범위, 시기 등)"
                value={facilityDesc}
                onChange={(e) => setFacilityDesc(e.target.value)}
              />
            </div>

            <button
              className="btn btn-full !rounded-full text-white !py-4 !text-base !font-bold"
              style={{ backgroundColor: "#00854A" }}
              disabled={!facilityLocation || !facilityDamageType}
              onClick={() => { setStep(2); setAiDone(false); scrollTop(); }}
            >
              AI 적산 시작
            </button>
          </>
        )}

        {/* 누수·침수 */}
        {claimType === "leak" && (
          <>
            <h2 className="text-[22px] font-bold text-text-heading mb-2 tracking-[-0.02em]">누수·침수 상세</h2>
            <p className="text-sm text-text-muted mb-6">누수 위치와 피해 범위를 입력해주세요</p>

            <div className="mb-5">
              <SectionLabel>누수 발생 위치</SectionLabel>
              <OptionButtons options={LEAK_LOCATIONS} selected={leakLocation} onSelect={setLeakLocation} color="#0061AF" />
            </div>

            <div className="mb-5">
              <SectionLabel>피해 범위 (복수 선택)</SectionLabel>
              <CheckList
                options={LEAK_DAMAGES}
                selected={leakDamages}
                onToggle={(val) => setLeakDamages(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val])}
                color="#0061AF"
              />
            </div>

            <div className="mb-5">
              <SectionLabel>피해 사진 (3장)</SectionLabel>
              <div className="flex gap-2.5">
                <PhotoCapture label="전경" onCapture={(url) => setLeakPhotos(p => { const n = [...p]; n[0] = url; return n; })} />
                <PhotoCapture label="근접" onCapture={(url) => setLeakPhotos(p => { const n = [...p]; n[1] = url; return n; })} />
                <PhotoCapture label="주변" onCapture={(url) => setLeakPhotos(p => { const n = [...p]; n[2] = url; return n; })} />
              </div>
            </div>

            <button
              className="btn btn-full !rounded-full text-white !py-4 !text-base !font-bold"
              style={{ backgroundColor: "#0061AF" }}
              disabled={!leakLocation || leakDamages.length === 0}
              onClick={() => { setStep(2); scrollTop(); }}
            >
              AI 피해 산정
            </button>
          </>
        )}

        {/* 안전사고 */}
        {claimType === "injury" && (
          <>
            <h2 className="text-[22px] font-bold text-text-heading mb-2 tracking-[-0.02em]">안전사고 상세</h2>
            <p className="text-sm text-text-muted mb-6">사고 정보와 피해자 정보를 입력해주세요</p>

            <div className="mb-5">
              <SectionLabel>사고 유형</SectionLabel>
              <OptionButtons options={SAFETY_TYPES} selected={safetyType} onSelect={setSafetyType} color="#C9252C" />
            </div>

            <div className="mb-5">
              <SectionLabel>사고 장소</SectionLabel>
              <OptionButtons options={SAFETY_PLACES} selected={safetyPlace} onSelect={setSafetyPlace} color="#C9252C" />
            </div>

            <div className="mb-5">
              <SectionLabel>피해자 정보</SectionLabel>
              <div className="space-y-2.5">
                <input className="input" placeholder="이름" value={victimName} onChange={(e) => setVictimName(e.target.value)} />
                <input className="input" placeholder="연락처" value={victimPhone} onChange={(e) => setVictimPhone(e.target.value)} />
                <div className="flex gap-2.5">
                  <button
                    onClick={() => setIsResident(true)}
                    className={clsx(
                      "flex-1 py-2.5 rounded-full text-sm font-medium border transition-all",
                      isResident === true ? "text-white" : "border-border text-text-body"
                    )}
                    style={isResident === true ? { backgroundColor: "#C9252C", borderColor: "#C9252C" } : {}}
                  >
                    입주민
                  </button>
                  <button
                    onClick={() => setIsResident(false)}
                    className={clsx(
                      "flex-1 py-2.5 rounded-full text-sm font-medium border transition-all",
                      isResident === false ? "text-white" : "border-border text-text-body"
                    )}
                    style={isResident === false ? { backgroundColor: "#C9252C", borderColor: "#C9252C" } : {}}
                  >
                    방문자
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-5">
              <SectionLabel>진단서 첨부</SectionLabel>
              <div className="flex gap-2.5">
                <PhotoCapture label="진단서" onCapture={(url) => setInjuryDocs(p => { const n = [...p]; n[0] = url; return n; })} />
                <PhotoCapture label="현장사진" onCapture={(url) => setInjuryDocs(p => { const n = [...p]; n[1] = url; return n; })} />
              </div>
            </div>

            <div className="card border border-[#C9252C20] p-4 mb-5 rounded-[var(--radius-card)]">
              <div className="flex gap-2.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9252C" strokeWidth="2" className="shrink-0 mt-0.5">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="text-xs text-text-muted leading-relaxed">
                  안전사고는 <strong className="text-text-body">현장조사 후 산정</strong>됩니다. 진단서가 있으면 첨부해주세요.
                </p>
              </div>
            </div>

            <button
              className="btn btn-full !rounded-full text-white !py-4 !text-base !font-bold"
              style={{ backgroundColor: "#C9252C" }}
              disabled={!safetyType || !safetyPlace || !victimName}
              onClick={() => { setSubmitted(true); scrollTop(); }}
            >
              접수하기
            </button>
          </>
        )}

        {/* 화재·폭발 */}
        {claimType === "fire" && (
          <>
            <h2 className="text-[22px] font-bold text-text-heading mb-2 tracking-[-0.02em]">화재·폭발 상세</h2>
            <p className="text-sm text-text-muted mb-6">사고 유형과 피해 범위를 입력해주세요</p>

            <div className="mb-5">
              <SectionLabel>사고 유형</SectionLabel>
              <OptionButtons options={FIRE_TYPES} selected={fireType} onSelect={setFireType} color="#F47920" />
            </div>

            <div className="mb-5">
              <SectionLabel>소방서 신고 여부</SectionLabel>
              <div className="flex gap-2.5">
                <button
                  onClick={() => setFireReported(true)}
                  className={clsx(
                    "flex-1 py-3 rounded-full text-sm font-semibold border transition-all",
                    fireReported === true ? "text-white" : "border-border text-text-body"
                  )}
                  style={fireReported === true ? { backgroundColor: "#F47920", borderColor: "#F47920" } : {}}
                >
                  예
                </button>
                <button
                  onClick={() => setFireReported(false)}
                  className={clsx(
                    "flex-1 py-3 rounded-full text-sm font-semibold border transition-all",
                    fireReported === false ? "text-white" : "border-border text-text-body"
                  )}
                  style={fireReported === false ? { backgroundColor: "#F47920", borderColor: "#F47920" } : {}}
                >
                  아니오
                </button>
              </div>
            </div>

            <div className="mb-5">
              <SectionLabel>피해 범위</SectionLabel>
              <OptionButtons options={FIRE_DAMAGE_SCOPE} selected={fireDamageScope} onSelect={setFireDamageScope} color="#F47920" />
            </div>

            <div className="mb-5">
              <SectionLabel>피해 사진</SectionLabel>
              <div className="flex gap-2.5 mb-1">
                <PhotoCapture label="전경" onCapture={(url) => setFirePhotos(p => { const n = [...p]; n[0] = url; return n; })} />
                <PhotoCapture label="근접" onCapture={(url) => setFirePhotos(p => { const n = [...p]; n[1] = url; return n; })} />
                <PhotoCapture label="주변" onCapture={(url) => setFirePhotos(p => { const n = [...p]; n[2] = url; return n; })} />
              </div>
            </div>

            <div className="mb-5">
              <SectionLabel>화재증명원 (선택)</SectionLabel>
              <div className="flex gap-2.5">
                <PhotoCapture label="화재증명원" onCapture={(url) => setFireCertDoc([url])} />
              </div>
              <p className="text-xs text-text-muted mt-1">소방서 발급 화재증명원이 있으면 첨부해주세요</p>
            </div>

            <div className="card border border-[#F4792020] p-4 mb-5 rounded-[var(--radius-card)]">
              <div className="flex gap-2.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F47920" strokeWidth="2" className="shrink-0 mt-0.5">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="text-xs text-text-muted leading-relaxed">
                  화재·폭발은 <strong className="text-text-body">화재증명원 + 현장 감정 후 산정</strong>됩니다.
                </p>
              </div>
            </div>

            <button
              className="btn btn-full !rounded-full text-white !py-4 !text-base !font-bold"
              style={{ backgroundColor: "#F47920" }}
              disabled={!fireType || fireReported === null || !fireDamageScope}
              onClick={() => { setSubmitted(true); scrollTop(); }}
            >
              접수하기
            </button>
          </>
        )}
      </div>
    );
  }

  // ═══ Step 2: AI 분석 (시설 파손) ═══
  if (step === 2 && claimType === "facility") {
    return (
      <div className="animate-[fadeIn_0.25s_ease] pb-24">
        <BackHeader onBack={goBack} title="공용부 사고 접수" />
        <StepIndicator total={3} current={2} />
        <FacilityAIResult
          damageType={facilityDamageType!}
          location={facilityLocation!}
          onReady={() => setAiDone(true)}
        />
        {aiDone && (
          <button
            className="btn btn-full !rounded-full text-white mt-5 !py-4 !text-base !font-bold"
            style={{ backgroundColor: "#00854A" }}
            onClick={() => { setSubmitted(true); scrollTop(); }}
          >
            접수하기
          </button>
        )}
      </div>
    );
  }

  // ═══ Step 2: AI 분석 (누수) ═══
  if (step === 2 && claimType === "leak") {
    return (
      <div className="animate-[fadeIn_0.25s_ease] pb-24">
        <BackHeader onBack={goBack} title="공용부 사고 접수" />
        <StepIndicator total={3} current={2} />
        <LeakAIResult leakDamages={leakDamages} />
        <button
          className="btn btn-full !rounded-full text-white mt-5 !py-4 !text-base !font-bold"
          style={{ backgroundColor: "#0061AF" }}
          onClick={() => { setSubmitted(true); scrollTop(); }}
        >
          접수하기
        </button>
      </div>
    );
  }

  return null;
}
