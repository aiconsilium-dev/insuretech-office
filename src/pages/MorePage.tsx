import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import Card from "@/components/common/Card";
import Badge from "@/components/common/Badge";
import SubTabs from "@/components/common/SubTabs";
import clsx from "clsx";

export default function MorePage() {
  const { subPage, setSubPage } = useApp();

  if (subPage === "inspection") return <InspectionPage onBack={() => setSubPage(null)} />;
  if (subPage === "cost") return <CostPage onBack={() => setSubPage(null)} />;
  if (subPage === "subrogation") return <SubrogationPage onBack={() => setSubPage(null)} />;

  return (
    <div>
      <div className="text-[22px] font-extrabold mb-4">더보기</div>

      <MenuItem
        iconBg="bg-primary-light" iconColor="text-primary"
        icon={<svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>}
        title="현장조사 관리" badge={3}
        desc="입주민 요청 건 확인 및 현장 출동"
        onClick={() => setSubPage("inspection")}
      />
      <MenuItem
        iconBg="bg-gray-100" iconColor="text-gray-700"
        icon={<svg viewBox="0 0 24 24"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>}
        title="품셈 확인"
        desc="2026년 3월 기준 최신 품셈"
        onClick={() => setSubPage("cost")}
      />
      <MenuItem
        iconBg="bg-warning-light" iconColor="text-warning"
        icon={<svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>}
        title="구상권 현황"
        desc="도급업체 책임 경합 건"
        onClick={() => setSubPage("subrogation")}
      />
      <MenuItem
        iconBg="bg-gray-100" iconColor="text-gray-600"
        icon={<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></svg>}
        title="설정"
        desc="알림, 계정, 앱 정보"
        onClick={() => {}}
      />
    </div>
  );
}

function MenuItem({ iconBg, iconColor, icon, title, badge, desc, onClick }: {
  iconBg: string; iconColor: string; icon: React.ReactNode;
  title: string; badge?: number; desc: string; onClick: () => void;
}) {
  return (
    <div className="flex items-center gap-3 py-4 border-b border-gray-100 last:border-b-0 cursor-pointer" onClick={onClick}>
      <div className={clsx("w-9 h-9 rounded-[10px] flex items-center justify-center [&_svg]:w-[18px] [&_svg]:h-[18px] [&_svg]:stroke-current [&_svg]:fill-none [&_svg]:stroke-[1.8]", iconBg, iconColor)}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-[15px] font-semibold">
          {title}
          {badge != null && (
            <span className="badge badge-primary !text-[10px] !font-bold ml-1">{badge}</span>
          )}
        </div>
        <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
      </div>
      <div className="text-gray-400 text-sm">›</div>
    </div>
  );
}

function SubHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <button className="btn btn-outline btn-sm !rounded-[var(--radius-pill)] !text-black !border-gray-200" onClick={onBack}>‹ 뒤로</button>
      <span className="text-lg font-bold">{title}</span>
    </div>
  );
}

function InspectionPage({ onBack }: { onBack: () => void }) {
  const [inspTab, setInspTab] = useState<"wait" | "progress" | "done">("wait");

  return (
    <div>
      <SubHeader title="현장조사 관리" onBack={onBack} />

      {/* SubTabs compound */}
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
        <Card variant="outlined" className="!p-4 mb-3 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="font-bold text-[15px]">102동 305호</div>
              <div className="text-xs text-gray-500 mt-0.5">곰팡이 | 요청일 2026.03.25</div>
            </div>
            <Badge variant="info" className="!text-[11px]">진행</Badge>
          </div>
          <div className="mt-3 mb-3">
            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">현장 사진 촬영</label>
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
            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">현장 소견서</label>
            <textarea className="input !min-h-[60px] !resize-y" placeholder="현장 조사 결과를 작성하세요" />
          </div>
          <button className="btn btn-sm btn-full !bg-black !text-white !rounded-[var(--radius-pill)]">조사 완료 제출</button>
        </Card>
      )}
      {inspTab === "done" && (
        <div className="text-center py-10 text-gray-400 text-sm">완료된 조사 건이 없습니다</div>
      )}
    </div>
  );
}

function InspectionCard({ location, type, date, status }: { location: string; type: string; date: string; status: string }) {
  const [dispatched, setDispatched] = useState(false);

  return (
    <Card variant="outlined" className="!p-4 mb-3 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="font-bold text-[15px]">{location}</div>
          <div className="text-xs text-gray-500 mt-0.5">{type} | 요청일 {date}</div>
        </div>
        <Badge variant={dispatched ? "info" : "warning"} className="!text-[11px]">
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

function CostPage({ onBack }: { onBack: () => void }) {
  return (
    <div>
      <SubHeader title="품셈 확인" onBack={onBack} />
      <Card variant="outlined" className="!border-primary !bg-primary-light !p-4 mb-3">
        <div className="text-sm font-bold text-primary mb-1">2026년 3월 기준 최신 품셈 적용 중</div>
        <div className="text-xs text-gray-600 leading-relaxed">대한건설협회 고시 기준 / 분기별 자동 업데이트</div>
      </Card>
      <Card variant="outlined" className="!p-4 shadow-sm mt-3">
        <div className="text-sm font-bold mb-3">주요 공종 단가 미리보기</div>
        <CostRow label="도배 (벽지)" value="28,500원/m2" />
        <CostRow label="장판 (바닥재)" value="35,200원/m2" />
        <CostRow label="타일 보수" value="52,800원/m2" />
        <CostRow label="배관 보수" value="185,000원/개소" />
        <CostRow label="방수 공사" value="67,500원/m2" />
        <CostRow label="도장 (페인트)" value="18,300원/m2" />
        <CostRow label="창호 보수" value="320,000원/개소" />
      </Card>
    </div>
  );
}

function CostRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2.5 border-b border-gray-100 last:border-b-0 text-sm">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function SubrogationPage({ onBack }: { onBack: () => void }) {
  return (
    <div>
      <SubHeader title="구상권 현황" onBack={onBack} />
      <Card variant="outlined" className="!p-4 mb-3 shadow-sm">
        <div className="flex justify-between items-start mb-1.5">
          <div>
            <div className="font-bold text-[15px]">지하주차장 B2 배관 파열</div>
            <div className="text-xs text-gray-500 mt-0.5">2026.03.15 | 관리사무소 접수</div>
          </div>
          <Badge variant="primary" className="!text-[10px]">경합</Badge>
        </div>
        <div className="text-[13px] text-gray-600 leading-relaxed mt-2">
          도급업체: (주)한성설비 | 보험: 흥국화재<br />상태: 도급업체 보험사 접수 완료, 책임비율 협의 중
        </div>
      </Card>
      <Card variant="outlined" className="!p-4 mb-3 shadow-sm">
        <div className="flex justify-between items-start mb-1.5">
          <div>
            <div className="font-bold text-[15px]">엘리베이터 도어 파손</div>
            <div className="text-xs text-gray-500 mt-0.5">2026.02.28 | 입주민 접수</div>
          </div>
          <Badge variant="gray" className="!text-[10px]">완료</Badge>
        </div>
        <div className="text-[13px] text-gray-600 leading-relaxed mt-2">
          도급업체: 현대엘리베이터 | 보험: 삼성화재<br />상태: 구상 완료 (도급업체 70% 부담)
        </div>
      </Card>
    </div>
  );
}
