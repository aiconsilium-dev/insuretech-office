import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import Badge from "@/components/common/Badge";
import Card from "@/components/common/Card";
import StatusBadge from "@/components/common/StatusBadge";
import StatusSteps from "@/components/common/StatusSteps";
import type { TypeClass, ClaimSource, Claim, ClaimStatus } from "@/lib/types";
import { STATUS_ORDER } from "@/lib/types";
import clsx from "clsx";

const STATUS_LABELS = ["접수", "검토", "산정", "완료"];

export default function ClaimsPage() {
  const { claims, cycleStatus } = useApp();
  const [typeFilter, setTypeFilter] = useState<TypeClass | "all">("all");
  const [sourceFilter, setSourceFilter] = useState<ClaimSource | "all">("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = claims.filter((c) => {
    if (typeFilter !== "all" && c.typeClass !== typeFilter) return false;
    if (sourceFilter !== "all" && c.source !== sourceFilter) return false;
    return true;
  });

  return (
    <div>
      <div className="text-[24px] font-extrabold mb-5 text-[#0a0a0a] tracking-tight">접수 관리</div>

      {/* Type filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-hide">
        {(["all", "A", "B", "C"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setTypeFilter(f)}
            className={clsx(
              "btn btn-sm !rounded-[var(--radius-pill)] whitespace-nowrap",
              typeFilter === f
                ? "!bg-[#171717] !text-white"
                : "!bg-[#f5f5f5] !text-[#737373]"
            )}
          >
            {f === "all" ? "전체" : `TYPE ${f}`}
          </button>
        ))}
      </div>

      {/* Source filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {(["all", "resident", "office"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setSourceFilter(f)}
            className={clsx(
              "btn btn-sm !rounded-[var(--radius-pill)] whitespace-nowrap",
              sourceFilter === f
                ? "!bg-[#171717] !text-white"
                : "!bg-[#f5f5f5] !text-[#737373]"
            )}
          >
            {f === "all" ? "전체" : f === "resident" ? "입주민 접수" : "관리사무소 접수"}
          </button>
        ))}
      </div>

      {/* Claims */}
      {filtered.map((claim) => (
        <ClaimCard
          key={claim.id}
          claim={claim}
          isOpen={openId === claim.id}
          onToggle={() => setOpenId(openId === claim.id ? null : claim.id)}
          onCycleStatus={() => cycleStatus(claim.id)}
        />
      ))}
    </div>
  );
}

function ClaimCard({
  claim, isOpen, onToggle, onCycleStatus,
}: {
  claim: Claim; isOpen: boolean; onToggle: () => void; onCycleStatus: () => void;
}) {
  const loc = claim.dong + (claim.ho.includes("주차장") || claim.ho.includes("B") ? " " : "동 ") + claim.ho;
  const sourceLabel = claim.source === "resident" ? "입주민 접수" : "관리사무소 접수";

  function getStepStatus(i: number, status: ClaimStatus): "done" | "current" | "pending" {
    const idx = STATUS_ORDER.indexOf(status);
    if (i < idx) return "done";
    if (i === idx) return "current";
    return "pending";
  }

  return (
    <Card variant="outlined" className="!p-4 mb-3" onClick={onToggle}>
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <div className="text-xs text-[#a3a3a3] mb-1">{claim.id}</div>
          <div className="text-[15px] font-bold text-[#0a0a0a]">{loc}</div>
          <div className="flex gap-1.5 items-center mt-1.5 flex-wrap">
            <Badge variant="gray">{claim.type}</Badge>
            <span className="text-xs text-[#a3a3a3]">{sourceLabel}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <Badge
            variant={claim.typeClass === "C" ? "primary" : claim.typeClass === "A" ? "black" : "gray"}
            className="!text-[10px]"
          >
            {claim.typeClass}
          </Badge>
          <StatusBadge status={claim.status} label={claim.statusLabel} />
          <span className="text-[11px] text-[#a3a3a3]">{claim.date}</span>
        </div>
      </div>

      {isOpen && (
        <div className="pt-4 mt-3 border-t border-[#e5e5e5]" onClick={(e) => e.stopPropagation()}>
          <ClaimDetail claim={claim} />

          {/* Photos */}
          <div className="mb-3">
            <div className="section-title !mb-1">현장 사진</div>
            <div className="photo-grid">
              {["전체", "주변", "상세"].map((label) => (
                <div key={label} className="photo-slot">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-1">
            <button className="btn btn-primary btn-sm flex-1 !rounded-[var(--radius-pill)]">현장조사 배정</button>
            <button className="btn btn-secondary btn-sm flex-1 !rounded-[var(--radius-pill)]" onClick={onCycleStatus}>상태 변경</button>
          </div>

          {/* StatusSteps */}
          <StatusSteps className="my-3">
            {STATUS_LABELS.map((label, i) => (
              <StatusSteps.Step key={label} label={label} status={getStepStatus(i, claim.status)} />
            ))}
          </StatusSteps>
        </div>
      )}
    </Card>
  );
}

function ClaimDetail({ claim }: { claim: Claim }) {
  const d = claim.detail;

  if (claim.typeClass === "A") {
    return (
      <>
        <div className="bg-[#f5f5f5] rounded-[var(--radius-card)] p-4 mb-3 border-l-[3px] border-l-[#171717]">
          <div className="text-sm font-bold mb-1.5 text-[#0a0a0a]">시공사 하자 — 하자보수 청구 대상</div>
          <div className="text-[13px] text-[#737373] leading-relaxed">{d.defectDetail || d.desc}</div>
        </div>
        <DetailRow label="하자 상세" value={d.desc} />
        <DetailRow label="보증기간" value={d.warranty || "-"} />
      </>
    );
  }

  if (claim.typeClass === "B") {
    return (
      <>
        <div className="bg-[#f5f5f5] rounded-[var(--radius-card)] p-4 mb-3 border-l-[3px] border-l-[#a3a3a3]">
          <div className="text-sm font-bold mb-1.5 text-[#0a0a0a]">면책 대상</div>
          <div className="text-[13px] text-[#737373] leading-relaxed">{d.exemptReason}</div>
        </div>
        <DetailRow label="면책 사유" value={d.exemptReason || "-"} />
        <DetailRow label="약관 조항" value={d.clauseRef || "-"} />
      </>
    );
  }

  return (
    <>
      <div className="bg-[#f5f5f5] rounded-[var(--radius-card)] p-4 mb-3 border-l-[3px] border-l-[#3b82f6]">
        <div className="text-sm font-bold mb-1.5 text-[#0a0a0a]">보험금 산출</div>
        <div className="text-[13px] text-[#737373] leading-relaxed">
          AI 적산 금액: <strong className="text-[#0a0a0a]">{d.aiAmount || "-"}</strong>
        </div>
      </div>
      <DetailRow label="소유자 부담" value={d.ownerAmount || "-"} />
      <DetailRow label="임차인 부담" value={d.tenantAmount || "-"} />
      <DetailRow label="보증기간" value={d.warranty || "-"} />
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-3">
      <div className="section-title !mb-1">{label}</div>
      <div className="text-sm text-[#171717] leading-relaxed">{value}</div>
    </div>
  );
}