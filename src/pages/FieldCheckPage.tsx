import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/common/Card";
import Badge from "@/components/common/Badge";
import SubTabs from "@/components/common/SubTabs";

function SubHeader({ title }: { title: string }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-2 mb-5">
      <button className="btn btn-secondary btn-sm !rounded-[var(--radius-pill)]" onClick={() => navigate(-1)}>‹ 뒤로</button>
      <span className="text-lg font-bold text-[#0a0a0a]">{title}</span>
    </div>
  );
}

function InspectionCard({ location, type, date, status }: { location: string; type: string; date: string; status: string }) {
  const [dispatched, setDispatched] = useState(false);

  return (
    <Card variant="outlined" className="!p-4 mb-3">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="font-bold text-[15px] text-[#0a0a0a]">{location}</div>
          <div className="text-xs text-[#a3a3a3] mt-0.5">{type} | 요청일 {date}</div>
        </div>
        <Badge variant={dispatched ? "primary" : "warning"} className="!text-[11px]">
          {dispatched ? "진행" : status}
        </Badge>
      </div>
      <button
        className="btn btn-primary btn-sm btn-full !rounded-[var(--radius-pill)]"
        disabled={dispatched}
        onClick={() => setDispatched(true)}
      >
        {dispatched ? "진행 중..." : "현장 출동"}
      </button>
    </Card>
  );
}

function CountBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="badge badge-primary !text-[10px] !font-bold ml-1">{children}</span>
  );
}

export default function FieldCheckPage() {
  const [inspTab, setInspTab] = useState<"wait" | "progress" | "done">("wait");

  return (
    <div>
      <SubHeader title="현장조사 관리" />

      <SubTabs className="mb-4">
        <SubTabs.Tab active={inspTab === "wait"} onClick={() => setInspTab("wait")}>
          대기<CountBadge>2</CountBadge>
        </SubTabs.Tab>
        <SubTabs.Tab active={inspTab === "progress"} onClick={() => setInspTab("progress")}>
          진행<CountBadge>1</CountBadge>
        </SubTabs.Tab>
        <SubTabs.Tab active={inspTab === "done"} onClick={() => setInspTab("done")}>
          완료
        </SubTabs.Tab>
      </SubTabs>

      {inspTab === "wait" && (
        <>
          <InspectionCard location="101동 1204호" type="누수" date="2026.03.27" status="대기" />
          <InspectionCard location="103동 802호" type="파손" date="2026.03.28" status="대기" />
        </>
      )}
      {inspTab === "progress" && (
        <Card variant="outlined" className="!p-4 mb-3">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="font-bold text-[15px] text-[#0a0a0a]">102동 305호</div>
              <div className="text-xs text-[#a3a3a3] mt-0.5">곰팡이 | 요청일 2026.03.25</div>
            </div>
            <Badge variant="primary" className="!text-[11px]">진행</Badge>
          </div>
          <div className="mt-3 mb-3">
            <label className="block text-[13px] font-semibold text-[#171717] mb-1.5">현장 사진 촬영</label>
            <div className="photo-grid">
              {["전체", "주변", "상세"].map((label) => (
                <div key={label} className="photo-slot !rounded-[var(--radius-card)] !text-[10px]">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" />
                  </svg>
                  {label}
                </div>
              ))}
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-[13px] font-semibold text-[#171717] mb-1.5">현장 소견서</label>
            <textarea className="input !min-h-[60px] !resize-y" placeholder="현장 조사 결과를 작성하세요" />
          </div>
          <button className="btn btn-primary btn-sm btn-full !rounded-[var(--radius-pill)]">조사 완료 제출</button>
        </Card>
      )}
      {inspTab === "done" && (
        <div className="text-center py-10 text-[#a3a3a3] text-sm">완료된 조사 건이 없습니다</div>
      )}
    </div>
  );
}