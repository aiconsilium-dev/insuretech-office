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
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1.5">
          <Badge variant="primary">관리사무소</Badge>
        </div>
        <div className="text-[22px] font-extrabold text-black">{aptName}</div>
        <div className="text-sm text-gray-500 mt-0.5">{userName}</div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-3 gap-2.5 mb-4">
        <KPIBox num={3} label="금일 접수" />
        <KPIBox num={8} label="처리중" />
        <KPIBox num={2} label="현장조사 요청" highlight />
      </div>

      {/* TYPE 현황 */}
      <div className="section-title">TYPE별 현황</div>
      <div className="grid grid-cols-3 gap-2.5 mb-4">
        <div className="text-center py-3 px-2 rounded-[var(--radius-card)] border border-gray-200 bg-black text-white">
          <div className="text-xs font-bold mb-0.5">TYPE A</div>
          <div className="text-xl font-bold">5</div>
        </div>
        <div className="text-center py-3 px-2 rounded-[var(--radius-card)] border border-gray-200 bg-gray-200 text-gray-700">
          <div className="text-xs font-bold mb-0.5">TYPE B</div>
          <div className="text-xl font-bold">12</div>
        </div>
        <div className="text-center py-3 px-2 rounded-[var(--radius-card)] border border-gray-200 bg-primary text-white">
          <div className="text-xs font-bold mb-0.5">TYPE C</div>
          <div className="text-xl font-bold">41</div>
        </div>
      </div>

      {/* AI 알림 */}
      <div className="section-title">AI 알림</div>
      <Card variant="outlined" className="!border-l-4 !border-l-primary !bg-primary-light !rounded-l-none mb-2.5">
        <Card.Body className="!py-3.5 !px-3.5 text-[13px] leading-relaxed text-gray-700">
          <strong className="text-primary font-bold">현장조사 요청 2건</strong> — 101동 1204호(누수), 103동 802호(파손)
        </Card.Body>
      </Card>
      <Card variant="outlined" className="!border-l-4 !border-l-primary !bg-primary-light !rounded-l-none mb-2.5">
        <Card.Body className="!py-3.5 !px-3.5 text-[13px] leading-relaxed text-gray-700">
          <strong className="text-primary font-bold">긴급:</strong> 지하주차장 배달사고 대리접수 필요
        </Card.Body>
      </Card>

      {/* 최근 접수 */}
      <div className="mt-5">
        <div className="section-title">최근 접수</div>
        <List className="border border-gray-200">
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

function KPIBox({ num, label, highlight }: { num: number; label: string; highlight?: boolean }) {
  return (
    <div className={`kpi-card text-center ${highlight ? "!border !border-primary" : ""}`}>
      <div className={`kpi-value ${highlight ? "!text-primary" : ""}`}>{num}</div>
      <div className="kpi-label">{label}</div>
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
        <div className="text-sm font-semibold text-black truncate">
          <Badge variant="gray" className="mr-1 !text-[11px]">{type}</Badge>
          {location}
        </div>
        <div className="text-xs text-gray-500 mt-0.5">{source}</div>
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
