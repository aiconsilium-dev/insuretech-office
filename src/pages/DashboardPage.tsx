import { useApp } from "@/contexts/AppContext";
import Card from "@/components/common/Card";
import Badge from "@/components/common/Badge";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const { userName, aptName, claims } = useApp();
  const navigate = useNavigate();

  // KPI 계산
  const newCount = claims.filter((c) => c.status === "received").length;
  const fieldWait = claims.filter((c) => c.status === "received" || c.status === "review").length;
  const doneCount = claims.filter((c) => c.status === "complete").length;
  const recentClaims = claims.slice(0, 3);

  return (
    <div className="animate-[fadeIn_0.25s_ease] pb-24">
      {/* 상단 인사말 + 알림 아이콘 */}
      <div className="flex items-start justify-between mb-1">
        <div>
          <p className="text-[13px] text-text-muted mb-0.5">{aptName} 관리사무소</p>
          <h1 className="text-[20px] font-bold text-text-heading tracking-[-0.02em]">
            {userName}님, 안녕하세요
          </h1>
        </div>
        <div className="w-10 h-10 rounded-full border border-[var(--color-border)] flex items-center justify-center mt-1 relative">
          <span className="text-text-muted text-sm">●</span>
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#C9252C] border-2 border-white" />
        </div>
      </div>

      <div className="pt-3">
        {/* KPI 카드 3칸 */}
        <div className="grid grid-cols-3 gap-2.5 mb-4">
          <KpiBox label="신규접수" count={newCount} color="#C9252C" />
          <KpiBox label="현장조사 대기" count={fieldWait} color="#0061AF" />
          <KpiBox label="처리완료" count={doneCount} color="#00854A" />
        </div>

        {/* 바로가기 4칸 */}
        <div className="text-[11px] font-semibold text-text-dim uppercase tracking-[0.06em] mb-2.5 mt-5">
          바로가기
        </div>
        <div className="grid grid-cols-4 gap-3 mb-4">
          <QuickMenuItem symbol="■" label="공용부 접수" onClick={() => navigate("/new")} color="#00854A" />
          <QuickMenuItem symbol="●" label="방문요청" onClick={() => navigate("/claims")} color="#0061AF" />
          <QuickMenuItem symbol="◆" label="접수현황" onClick={() => navigate("/claims")} color="#C9252C" />
          <QuickMenuItem symbol="▲" label="현장조사" onClick={() => navigate("/field-check")} color="#F47920" />
        </div>

        {/* 최근 접수 */}
        <div className="text-[11px] font-semibold text-text-dim uppercase tracking-[0.06em] mb-2.5 mt-2">
          최근 접수
        </div>
        {recentClaims.map((claim) => (
          <Card
            key={claim.id}
            className="mb-3 cursor-pointer transition-all hover:-translate-y-0.5"
            onClick={() => navigate("/claims")}
          >
            <Card.Body className="!py-4 flex items-center gap-3.5">
              <div
                className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 text-base"
                style={{ color: claim.typeColor }}
              >
                {claim.typeIcon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[13px] font-medium text-text-muted">{claim.id}</span>
                  <SourceBadge source={claim.source} />
                </div>
                <h3 className="text-[14px] font-semibold text-text-body truncate">
                  {claim.dong}동 {claim.ho}호 — {claim.type}
                </h3>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[12px] text-text-dim">{claim.date}</div>
                <div className="text-[12px] font-semibold mt-0.5" style={{ color: claim.typeColor }}>
                  {claim.statusLabel}
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}

        {/* 우리 단지 정보 */}
        <div className="text-[11px] font-semibold text-text-dim uppercase tracking-[0.06em] mb-2.5 mt-5">
          우리 단지
        </div>
        <div className="grid grid-cols-2 gap-2.5 mb-3">
          <Card variant="outlined">
            <Card.Body className="!py-3.5 !px-3.5">
              <div className="text-[11px] text-text-dim mb-1">가입 보험</div>
              <div className="text-[15px] font-bold text-text-heading">화재·배상</div>
              <div className="text-[11px] text-text-muted mt-0.5">DB손해보험</div>
            </Card.Body>
          </Card>
          <Card variant="outlined">
            <Card.Body className="!py-3.5 !px-3.5">
              <div className="text-[11px] text-text-dim mb-1">하자담보 만료</div>
              <div className="text-[15px] font-bold text-text-heading">D-847</div>
              <div className="text-[11px] text-[#C9252C] mt-0.5 font-medium">2028.07.15 만료</div>
            </Card.Body>
          </Card>
        </div>

        {/* 알림 */}
        <Card variant="outlined" className="mb-3">
          <Card.Body className="!py-3 flex items-center gap-3">
            <span className="shrink-0 w-2 h-2 rounded-full bg-[#0061AF]" />
            <span className="text-[13px] text-text-muted leading-relaxed truncate">
              101동 1502호 <b className="text-[#0061AF]">방문 요청</b> 접수 — 누수 의심
            </span>
            <span className="text-[11px] text-text-dim shrink-0 ml-auto">03.25</span>
          </Card.Body>
        </Card>

        <Card variant="outlined" className="mb-3">
          <Card.Body className="!py-3 flex items-center gap-3">
            <Badge variant="primary" className="shrink-0 !text-[10px]">공지</Badge>
            <span className="text-[13px] text-text-body truncate">2026년 상반기 공용부 하자점검 일정 안내</span>
            <span className="text-[11px] text-text-dim shrink-0 ml-auto">03.28</span>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

/* ── KPI 박스 ── */
function KpiBox({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className="rounded-[10px] border border-[var(--color-border)] py-3 text-center">
      <div
        className="text-[20px] font-bold tracking-[-0.5px]"
        style={{ color: count > 0 ? color : "var(--color-text-dim)" }}
      >
        {count}
      </div>
      <div className="text-[11px] text-text-muted mt-0.5">{label}</div>
    </div>
  );
}

/* ── 바로가기 메뉴 ── */
function QuickMenuItem({ symbol, label, onClick, color }: { symbol: string; label: string; onClick: () => void; color: string }) {
  return (
    <div className="text-center cursor-pointer" onClick={onClick}>
      <div
        className="w-12 h-12 rounded-[14px] border border-[var(--color-border)] flex items-center justify-center text-lg mx-auto mb-1.5 bg-white transition-transform hover:scale-105"
        style={{ color }}
      >
        {symbol}
      </div>
      <span className="block text-[11px] font-medium text-text-muted">{label}</span>
    </div>
  );
}

/* ── 소스 배지 ── */
function SourceBadge({ source }: { source: string }) {
  if (source === "resident") {
    return (
      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold border border-[#0061AF33] text-[#0061AF]">
        입주민
      </span>
    );
  }
  if (source === "visit") {
    return (
      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold border border-[#F4792033] text-[#F47920]">
        방문요청
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold border border-[#00854A33] text-[#00854A]">
      공용부
    </span>
  );
}
