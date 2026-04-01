import { useState } from "react";
import Card from "@/components/common/Card";
import { useApp } from "@/contexts/AppContext";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { ChevronRight } from "lucide-react";

/* ─── 구상권 목업 데이터 ─── */
const SUBROGATION_ITEMS = [
  { id: "SB-001", target: "(주)한성건설", type: "공용배관 파손", amount: "4,800,000원", status: "청구중", color: "#0061AF" },
  { id: "SB-002", target: "(주)대림도장", type: "주차장 도장 불량", amount: "850,000원", status: "회수완료", color: "#00854A" },
  { id: "SB-003", target: "(주)세원설비", type: "놀이터 시설 하자", amount: "1,200,000원", status: "협의중", color: "#F47920" },
];

/* ─── 품셈 목업 데이터 ─── */
const PRICING_ITEMS = [
  { name: "도배 (벽지)", unit: "㎡", price: "12,000원", note: "실크벽지 기준" },
  { name: "장판 교체", unit: "㎡", price: "18,000원", note: "PVC 장판 기준" },
  { name: "방수 시공", unit: "㎡", price: "32,000원", note: "우레탄 방수" },
  { name: "타일 재시공", unit: "㎡", price: "35,000원", note: "포설+줄눈 포함" },
  { name: "균열 보수", unit: "m", price: "22,000원", note: "V커팅+에폭시" },
  { name: "도장 재시공", unit: "㎡", price: "15,000원", note: "수성페인트" },
  { name: "배관 교체", unit: "m", price: "45,000원", note: "스테인리스 기준" },
  { name: "바닥 포장", unit: "㎡", price: "45,000원", note: "아스팔트 기준" },
];

type Section = "main" | "subrogation" | "pricing" | "complex" | "settings";

export default function MorePage() {
  const { aptName } = useApp();
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>("main");

  /* ─── 구상권 관리 ─── */
  if (section === "subrogation") {
    return (
      <div className="animate-[fadeIn_0.25s_ease] pb-24">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setSection("main")} className="btn btn-icon bg-bg-secondary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <h2 className="text-xl font-bold text-text-heading">구상권 관리</h2>
        </div>

        <p className="text-sm text-text-muted mb-5">시공사·도급업체 대상 구상권 현황</p>

        {SUBROGATION_ITEMS.map((item) => (
          <div key={item.id} className="card border p-4 mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] text-text-muted font-medium">{item.id}</span>
              <span className="text-[12px] font-semibold" style={{ color: item.color }}>{item.status}</span>
            </div>
            <div className="text-[15px] font-semibold text-text-heading mb-1">{item.target}</div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">{item.type}</span>
              <span className="font-bold text-text-heading">{item.amount}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  /* ─── 품셈 조회 ─── */
  if (section === "pricing") {
    return (
      <div className="animate-[fadeIn_0.25s_ease] pb-24">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setSection("main")} className="btn btn-icon bg-bg-secondary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <h2 className="text-xl font-bold text-text-heading">품셈 조회</h2>
        </div>

        <p className="text-sm text-text-muted mb-5">공용부 수선 공종별 단가 기준</p>

        <div className="card border overflow-hidden">
          {/* 헤더 */}
          <div className="grid grid-cols-[1fr_50px_80px] gap-2 px-4 py-3 bg-[#f5f5f5] text-[11px] font-bold text-text-dim uppercase tracking-wider">
            <span>공종</span>
            <span className="text-center">단위</span>
            <span className="text-right">단가</span>
          </div>
          {PRICING_ITEMS.map((item, i) => (
            <div
              key={i}
              className={clsx(
                "grid grid-cols-[1fr_50px_80px] gap-2 px-4 py-3 items-center",
                i < PRICING_ITEMS.length - 1 && "border-b border-border-subtle"
              )}
            >
              <div>
                <div className="text-sm font-medium text-text-body">{item.name}</div>
                <div className="text-[11px] text-text-dim">{item.note}</div>
              </div>
              <span className="text-[13px] text-text-muted text-center">{item.unit}</span>
              <span className="text-[13px] font-semibold text-text-heading text-right">{item.price}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ─── 단지 정보 ─── */
  if (section === "complex") {
    return (
      <div className="animate-[fadeIn_0.25s_ease] pb-24">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setSection("main")} className="btn btn-icon bg-bg-secondary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <h2 className="text-xl font-bold text-text-heading">단지 정보</h2>
        </div>

        <div className="card border p-5 mb-4">
          <h3 className="text-base font-bold text-text-heading mb-4">{aptName}</h3>
          <div className="space-y-3">
            <InfoRow label="소재지" value="서울특별시 송파구 올림픽로 300" />
            <InfoRow label="세대수" value="9,510세대 (84개동)" />
            <InfoRow label="사용승인" value="2023.06.15" />
            <InfoRow label="시공사" value="(주)현대건설" />
            <InfoRow label="관리업체" value="(주)한국관리" />
          </div>
        </div>

        <div className="card border p-5">
          <h3 className="text-base font-bold text-text-heading mb-4">보험 현황</h3>
          <div className="space-y-3">
            <InfoRow label="보험사" value="DB손해보험" />
            <InfoRow label="상품" value="화재·배상책임보험" />
            <InfoRow label="계약기간" value="2025.07.15 ~ 2026.07.14" />
            <InfoRow label="하자담보 만료" value="2028.07.15 (구조체 5년)" />
          </div>
        </div>
      </div>
    );
  }

  /* ─── 설정 ─── */
  if (section === "settings") {
    return (
      <div className="animate-[fadeIn_0.25s_ease] pb-24">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setSection("main")} className="btn btn-icon bg-bg-secondary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <h2 className="text-xl font-bold text-text-heading">설정</h2>
        </div>

        <div className="card border overflow-hidden">
          <SettingItem label="알림 설정" desc="접수·조사 알림" />
          <SettingItem label="담당자 관리" desc="현장조사 담당자" />
          <SettingItem label="앱 정보" desc="버전 1.0.0" />
          <SettingItem label="로그아웃" desc="" isLast />
        </div>
      </div>
    );
  }

  /* ─── 메인 메뉴 ─── */
  return (
    <div className="animate-[fadeIn_0.25s_ease] pb-24">
      <div className="mb-5">
        <h1 className="text-[22px] font-bold text-text-heading tracking-[-0.02em]">더보기</h1>
      </div>

      {/* 현장조사 바로가기 */}
      <Card className="mb-3 cursor-pointer transition-all hover:-translate-y-0.5" onClick={() => navigate("/field-check")}>
        <Card.Body className="!py-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0 text-lg" style={{ color: "#F47920" }}>
            ▲
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[15px] font-bold text-text-heading">현장조사</h3>
            <p className="text-[12px] text-text-muted mt-0.5">대기중인 현장조사를 확인합니다</p>
          </div>
          <ChevronRight size={18} className="text-text-dim" />
        </Card.Body>
      </Card>

      <div className="text-[11px] font-semibold text-text-dim uppercase tracking-[0.06em] mb-2.5 mt-5">관리 메뉴</div>
      <div className="card border overflow-hidden mb-4">
        <MenuItem label="구상권 관리" desc="시공사·도급업체 대상" icon="■" color="#00854A" onClick={() => setSection("subrogation")} />
        <MenuItem label="품셈 조회" desc="공종별 단가 기준" icon="●" color="#0061AF" onClick={() => setSection("pricing")} />
        <MenuItem label="단지 정보" desc="보험·시설 현황" icon="◆" color="#C9252C" onClick={() => setSection("complex")} />
        <MenuItem label="설정" desc="알림, 담당자, 앱 정보" icon="─" color="#737373" onClick={() => setSection("settings")} isLast />
      </div>
    </div>
  );
}

/* ─── 메뉴 아이템 ─── */
function MenuItem({ label, desc, icon, color, onClick, isLast }: {
  label: string; desc: string; icon: string; color: string; onClick: () => void; isLast?: boolean;
}) {
  return (
    <div
      className={clsx(
        "flex items-center gap-3.5 px-4 py-4 cursor-pointer hover:bg-[var(--color-surface-hover)] transition-colors",
        !isLast && "border-b border-border-subtle"
      )}
      onClick={onClick}
    >
      <div className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 text-sm" style={{ color }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-semibold text-text-body">{label}</div>
        <div className="text-[12px] text-text-muted">{desc}</div>
      </div>
      <ChevronRight size={16} className="text-text-dim" />
    </div>
  );
}

/* ─── 정보 행 ─── */
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-1.5 text-sm border-b border-border-subtle last:border-0">
      <span className="text-text-muted">{label}</span>
      <span className="font-medium text-text-body text-right">{value}</span>
    </div>
  );
}

/* ─── 설정 아이템 ─── */
function SettingItem({ label, desc, isLast }: { label: string; desc: string; isLast?: boolean }) {
  return (
    <div className={clsx(
      "flex items-center justify-between px-4 py-4",
      !isLast && "border-b border-border-subtle"
    )}>
      <div>
        <div className="text-[14px] font-semibold text-text-body">{label}</div>
        {desc && <div className="text-[12px] text-text-muted">{desc}</div>}
      </div>
      <ChevronRight size={16} className="text-text-dim" />
    </div>
  );
}
