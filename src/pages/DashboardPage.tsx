import { useApp } from "@/contexts/AppContext";
import Badge from "@/components/common/Badge";
import Card from "@/components/common/Card";
import List from "@/components/common/List";
import StatusBadge from "@/components/common/StatusBadge";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const { aptName, userName } = useApp();
  const navigate = useNavigate();

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[11px] font-semibold text-[#737373] tracking-wide uppercase">관리사무소</span>
        </div>
        <div className="text-[24px] font-extrabold text-[#0a0a0a] tracking-tight">{aptName}</div>
        <div className="text-sm text-[#a3a3a3] mt-0.5">{userName}</div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <KPIBox num={3} label="금일 접수" dotColor="bg-[#3b82f6]" />
        <KPIBox num={8} label="처리중" dotColor="bg-[#a3a3a3]" />
        <KPIBox num={2} label="현장조사 요청" dotColor="bg-[#0a0a0a]" highlight />
      </div>

      {/* TYPE 현황 */}
      <div className="section-title">TYPE별 현황</div>
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="text-center py-4 px-2 rounded-[var(--radius-card)] border border-[#e5e5e5] bg-white">
          <div className="text-[11px] font-bold text-[#a3a3a3] mb-1">TYPE A</div>
          <div className="text-xl font-extrabold text-[#0a0a0a]">5</div>
        </div>
        <div className="text-center py-4 px-2 rounded-[var(--radius-card)] border border-[#e5e5e5] bg-white">
          <div className="text-[11px] font-bold text-[#a3a3a3] mb-1">TYPE B</div>
          <div className="text-xl font-extrabold text-[#0a0a0a]">12</div>
        </div>
        <div className="text-center py-4 px-2 rounded-[var(--radius-card)] border border-[#e5e5e5] bg-[#171717]">
          <div className="text-[11px] font-bold text-[#a3a3a3] mb-1">TYPE C</div>
          <div className="text-xl font-extrabold text-white">41</div>
        </div>
      </div>

      {/* AI 알림 */}
      <div className="section-title">AI 알림</div>
      <div className="border border-[#e5e5e5] border-l-[3px] border-l-[#0a0a0a] rounded-r-[var(--radius-card)] bg-[#f5f5f5] px-4 py-3 mb-2.5">
        <div className="text-[13px] leading-relaxed text-[#171717]">
          <strong className="font-bold">현장조사 요청 2건</strong> — 101동 1204호(누수), 103동 802호(파손)
        </div>
      </div>
      <div className="border border-[#e5e5e5] border-l-[3px] border-l-[#3b82f6] rounded-r-[var(--radius-card)] bg-[rgba(59,130,246,0.04)] px-4 py-3 mb-2.5">
        <div className="text-[13px] leading-relaxed text-[#171717]">
          <strong className="text-[#3b82f6] font-bold">긴급:</strong> 지하주차장 배달사고 대리접수 필요
        </div>
      </div>

      {/* 최근 접수 */}
      <div className="mt-6">
        <div className="section-title">최근 접수</div>
        <List>
          <ListItem type="누수" location="101동 1204호" source="입주민 접수" typeClass="C" status="received" statusLabel="접수" onClick={() => navigate("/claims")} />
          <ListItem type="파손" location="103동 802호" source="입주민 접수" typeClass="A" status="review" statusLabel="검토" onClick={() => navigate("/claims")} />
          <ListItem type="결로" location="105동 501호" source="입주민 접수" typeClass="B" status="assess" statusLabel="산정" onClick={() => navigate("/claims")} />
          <ListItem type="배관" location="지하주차장 B2" source="관리사무소 접수" typeClass="C" status="received" statusLabel="접수" onClick={() => navigate("/claims")} />
          <ListItem type="사고" location="지하주차장 B1" source="관리사무소 접수" typeClass="C" status="review" statusLabel="검토" onClick={() => navigate("/claims")} />
        </List>
      </div>
    </div>
  );
}

function KPIBox({ num, label, dotColor, highlight }: { num: number; label: string; dotColor: string; highlight?: boolean }) {
  return (
    <div className="kpi-card text-center">
      <div className="flex items-center justify-center gap-1.5 mb-1">
        <span className={`w-2 h-2 rounded-full ${dotColor}`} />
        <span className="kpi-label !mt-0">{label}</span>
      </div>
      <div className={`text-[28px] font-extrabold tracking-tight ${highlight ? "text-[#0a0a0a]" : "text-[#0a0a0a]"}`}>{num}</div>
    </div>
  );
}

function ListItem({
  type, location, source, typeClass, status, statusLabel, onClick,
}: {
  type: string; location: string; source: string;
  typeClass: string; status: "received" | "review" | "assess" | "complete"; statusLabel: string;
  onClick: () => void;
}) {
  return (
    <List.Item onClick={onClick}>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-[#0a0a0a] truncate">
          <Badge variant="gray" className="mr-1 !text-[11px]">{type}</Badge>
          {location}
        </div>
        <div className="text-xs text-[#a3a3a3] mt-0.5">{source}</div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <Badge
          variant={typeClass === "C" ? "primary" : typeClass === "A" ? "black" : "gray"}
          className="!text-[10px]"
        >
          {typeClass}
        </Badge>
        <StatusBadge status={status} label={statusLabel} />
      </div>
    </List.Item>
  );
}