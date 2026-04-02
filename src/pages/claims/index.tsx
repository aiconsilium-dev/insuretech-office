import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import StatusSteps from "@/components/common/StatusSteps";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import type { Claim, ClaimSource } from "@/lib/types";

const STEPS = ["접수", "검토", "산정", "완료"];
const STATUS_STEP_MAP: Record<string, number> = {
  received: 1, review: 2, assess: 3, complete: 4,
};

type Tab = "all" | "resident" | "office" | "visit";

/* ─── 배지 스타일 ─── */
function typeBadge(tc: "A" | "B" | "C") {
  const map = {
    A: "border-[#C9252C] text-[#C9252C] bg-white",
    B: "border-[#888] text-[#888] bg-white",
    C: "border-[#00854A] text-[#00854A] bg-white",
  } as const;
  const label = { A: "TYPE A", B: "TYPE B", C: "TYPE C" } as const;
  return (
    <span className={clsx("inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border", map[tc])}>
      {label[tc]}
    </span>
  );
}

/* ─── 소스 배지 ─── */
function SourceBadge({ source }: { source: ClaimSource }) {
  if (source === "resident") return <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold border border-[#0061AF33] text-[#0061AF]">입주민</span>;
  if (source === "visit") return <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold border border-[#F4792033] text-[#F47920]">방문요청</span>;
  return <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold border border-[#00854A33] text-[#00854A]">공용부</span>;
}

/* ─── 액션 버튼 ─── */
function ActionBtn({ label, color, onClick }: { label: string; color: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      className="px-3 py-1.5 rounded-full text-[12px] font-semibold border bg-white active:scale-95 transition-transform"
      style={{ borderColor: color, color }}
    >
      {label}
    </button>
  );
}

/* ─── 필터 ─── */
function filterClaims(claims: Claim[], tab: Tab): Claim[] {
  if (tab === "all") return claims;
  return claims.filter((c) => c.source === tab);
}

/* ─── 메인 ─── */
export default function ClaimsPage() {
  const { claims } = useApp();
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [tab, setTab] = useState<Tab>("all");

  const filtered = filterClaims(claims, tab);

  return (
    <div className="animate-[fadeIn_0.25s_ease] pb-24">
      {/* 헤더 */}
      <div className="mb-5">
        <h1 className="text-[22px] font-bold text-text-heading tracking-[-0.02em]">접수 현황</h1>
        <p className="text-sm text-text-muted mt-1">총 {claims.length}건</p>
      </div>

      {/* 탭 필터 */}
      <div className="flex gap-2 mb-5 overflow-x-auto">
        {([["all", "전체"], ["resident", "입주민접수"], ["office", "공용부"], ["visit", "방문요청"]] as const).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => { setTab(key); setOpenIdx(null); }}
            className={clsx(
              "px-4 py-1.5 rounded-full text-[13px] font-semibold border transition-colors whitespace-nowrap shrink-0",
              tab === key
                ? "bg-[#0061AF] text-white border-[#0061AF]"
                : "bg-white text-text-muted border-[#ddd]"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 카드 리스트 */}
      {filtered.length === 0 && (
        <p className="text-center text-text-muted text-sm py-12">해당 내역이 없습니다.</p>
      )}

      {filtered.map((claim, idx) => {
        const isOpen = openIdx === idx;
        const stepNum = STATUS_STEP_MAP[claim.status] ?? 1;

        return (
          <div
            key={claim.id}
            className="mb-3.5 rounded-[var(--radius-card)] border border-[#e5e5e5] bg-[var(--color-surface)] shadow-[var(--shadow-card)] cursor-pointer active:scale-[0.98] transition-transform overflow-hidden"
            onClick={() => setOpenIdx(isOpen ? null : idx)}
          >
            <div className="p-5">
              {/* 상단: 아이콘 + 정보 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-[10px] flex items-center justify-center text-[18px]"
                    style={{ color: claim.typeColor }}
                  >
                    {claim.typeIcon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[13px] text-text-muted font-medium">{claim.id}</span>
                      <SourceBadge source={claim.source} />
                    </div>
                    <div className="text-[15px] font-semibold text-text-body">
                      {claim.dong}동 {claim.ho} — {claim.type}
                    </div>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-1.5">
                  {typeBadge(claim.typeClass)}
                  <div className="text-xs text-text-dim">{claim.date}</div>
                </div>
              </div>

              {/* 진행 상태 스텝 */}
              <div className="mt-3.5 pt-3.5 border-t border-border-subtle">
                <StatusSteps>
                  {STEPS.map((label, i) => (
                    <StatusSteps.Step
                      key={label}
                      label={label}
                      status={
                        i + 1 < stepNum ? "done" :
                        i + 1 === stepNum ? "current" : "pending"
                      }
                    />
                  ))}
                </StatusSteps>
              </div>

              {/* 현재 상태 */}
              <div className="mt-2.5 flex items-center justify-between">
                <span className="text-[13px] text-text-muted">{claim.statusLabel}</span>
                <ChevronDown size={16} className={clsx("text-text-dim transition-transform", isOpen && "rotate-180")} />
              </div>

              {/* 펼쳐지는 상세 */}
              {isOpen && (
                <div className="mt-3 pt-3 border-t border-border-subtle animate-[fadeIn_0.15s_ease]">
                  <DetailRow label="위치" value={claim.location} />
                  <DetailRow label="피해 내용" value={claim.detail.desc} />
                  {claim.detail.warranty && <DetailRow label="보증기간" value={claim.detail.warranty} />}

                  {/* TYPE C: AI 산출액 */}
                  {claim.typeClass === "C" && (
                    <>
                      {claim.detail.aiAmount && (
                        <DetailRow
                          label="AI 산출액"
                          value={claim.detail.aiAmount}
                          valueStyle={{
                            color: claim.status === "complete" ? "#00854A" : "#0061AF",
                            fontWeight: 700,
                          }}
                        />
                      )}
                      {claim.status === "complete" && (
                        <div className="mt-2 px-3 py-2 rounded-lg text-[#00854A] text-[13px] font-semibold text-center border border-[#00854A33]">
                          ✓ 처리 완료
                        </div>
                      )}
                      {claim.status === "assess" && claim.detail.aiAmount && (
                        <div className="mt-2 px-3 py-2 rounded-lg text-[#0061AF] text-[13px] font-medium text-center border border-[#0061AF33]">
                          보험금 지급 대기 — {claim.detail.aiAmount}
                        </div>
                      )}
                    </>
                  )}

                  {/* TYPE A: 하자소송 */}
                  {claim.typeClass === "A" && (
                    <div className="mt-3 p-3 rounded-lg border border-[#C9252C33]">
                      <p className="text-[12px] text-[#C9252C] leading-relaxed">
                        ⚠ 본 건은 시공상 하자 가능성이 있습니다. 추가 확인이 필요합니다.
                      </p>
                      {claim.detail.defectDetail && (
                        <p className="text-[12px] text-text-muted mt-1.5">{claim.detail.defectDetail}</p>
                      )}
                    </div>
                  )}

                  {/* TYPE B: 면책 */}
                  {claim.typeClass === "B" && (
                    <div className="mt-3 p-3 rounded-lg border border-[#ddd]">
                      <p className="text-[12px] text-text-muted leading-relaxed">
                        면책 통보 — {claim.detail.exemptReason ?? "사유 확인 필요"}
                      </p>
                      {claim.detail.clauseRef && (
                        <p className="text-[12px] text-text-dim mt-1">{claim.detail.clauseRef}</p>
                      )}
                    </div>
                  )}

                  {/* 액션 버튼 */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {claim.typeClass === "A" && (
                      <>
                        <ActionBtn label="추가 질의" color="#0061AF" />
                        <ActionBtn label="변호사 의견서 요청" color="#00854A" />
                      </>
                    )}
                    {claim.typeClass === "B" && (
                      <>
                        <ActionBtn label="이의신청" color="#C9252C" />
                        <ActionBtn label="변호사 의견서 요청" color="#00854A" />
                      </>
                    )}
                    {claim.typeClass === "C" && claim.status !== "complete" && (
                      <ActionBtn label="현장조사 배정" color="#0061AF" />
                    )}
                    {claim.source === "visit" && (
                      <>
                        <ActionBtn label="방문 수락" color="#00854A" />
                        <ActionBtn label="현장조사 보고" color="#0061AF" />
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── 상세 행 ─── */
function DetailRow({ label, value, valueStyle }: {
  label: string; value: string; valueStyle?: React.CSSProperties;
}) {
  return (
    <div className="flex justify-between py-1.5 text-sm">
      <span className="text-text-muted shrink-0">{label}</span>
      <span className="font-medium text-text-body text-right ml-4" style={valueStyle}>{value}</span>
    </div>
  );
}
