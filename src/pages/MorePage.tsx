import { useNavigate } from "react-router-dom";

function MenuItem({ indicator, title, badge, desc, onClick }: {
  indicator: React.ReactNode;
  title: string; badge?: number; desc: string; onClick: () => void;
}) {
  return (
    <div className="flex items-center gap-3.5 py-4 border-b border-[#e5e5e5] last:border-b-0 cursor-pointer" onClick={onClick}>
      <div className="w-9 h-9 rounded-[10px] flex items-center justify-center bg-[#f5f5f5]">
        {indicator}
      </div>
      <div className="flex-1">
        <div className="text-[15px] font-semibold text-[#0a0a0a]">
          {title}
          {badge != null && (
            <span className="badge badge-primary !text-[10px] !font-bold ml-1.5">{badge}</span>
          )}
        </div>
        <div className="text-xs text-[#a3a3a3] mt-0.5">{desc}</div>
      </div>
      <div className="text-[#a3a3a3] text-sm">›</div>
    </div>
  );
}

export default function MorePage() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="text-[24px] font-extrabold mb-5 text-[#0a0a0a] tracking-tight">더보기</div>

      <MenuItem
        indicator={<span className="w-3 h-3 rounded-full bg-[#3b82f6]" />}
        title="현장조사 관리" badge={3}
        desc="입주민 요청 건 확인 및 현장 출동"
        onClick={() => navigate("/field-check")}
      />
      <MenuItem
        indicator={<span className="w-3 h-3 rounded-sm bg-[#171717]" />}
        title="품셈 확인"
        desc="2026년 3월 기준 최신 품셈"
        onClick={() => navigate("/pricing")}
      />
      <MenuItem
        indicator={<span className="w-3 h-3 rotate-45 bg-[#a3a3a3]" />}
        title="구상권 현황"
        desc="도급업체 책임 경합 건"
        onClick={() => navigate("/indemnity")}
      />
      <MenuItem
        indicator={<span className="w-3 h-0.5 bg-[#a3a3a3] rounded-full" />}
        title="설정"
        desc="알림, 계정, 앱 정보"
        onClick={() => {}}
      />
    </div>
  );
}