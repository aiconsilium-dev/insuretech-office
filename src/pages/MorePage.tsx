import { useNavigate } from "react-router-dom";
import clsx from "clsx";

function MenuItem({ iconBg, iconColor, icon, title, badge, desc, onClick }: {
  iconBg: string; iconColor: string; icon: React.ReactNode;
  title: string; badge?: number; desc: string; onClick: () => void;
}) {
  return (
    <div className="flex items-center gap-3 py-4 border-b border-[#262626] last:border-b-0 cursor-pointer" onClick={onClick}>
      <div className={clsx("w-9 h-9 rounded-[10px] flex items-center justify-center [&_svg]:w-[18px] [&_svg]:h-[18px] [&_svg]:stroke-current [&_svg]:fill-none [&_svg]:stroke-[1.8]", iconBg, iconColor)}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-[15px] font-semibold text-white">
          {title}
          {badge != null && (
            <span className="badge badge-primary !text-[10px] !font-bold ml-1">{badge}</span>
          )}
        </div>
        <div className="text-xs text-[#737373] mt-0.5">{desc}</div>
      </div>
      <div className="text-[#737373] text-sm">›</div>
    </div>
  );
}

export default function MorePage() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="text-[22px] font-extrabold mb-4 text-white tracking-tight">더보기</div>

      <MenuItem
        iconBg="bg-primary-light" iconColor="text-primary"
        icon={<svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>}
        title="현장조사 관리" badge={3}
        desc="입주민 요청 건 확인 및 현장 출동"
        onClick={() => navigate("/field-check")}
      />
      <MenuItem
        iconBg="bg-[rgba(255,255,255,0.06)]" iconColor="text-[#a3a3a3]"
        icon={<svg viewBox="0 0 24 24"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>}
        title="품셈 확인"
        desc="2026년 3월 기준 최신 품셈"
        onClick={() => navigate("/pricing")}
      />
      <MenuItem
        iconBg="bg-warning-light" iconColor="text-warning"
        icon={<svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>}
        title="구상권 현황"
        desc="도급업체 책임 경합 건"
        onClick={() => navigate("/indemnity")}
      />
      <MenuItem
        iconBg="bg-[rgba(255,255,255,0.06)]" iconColor="text-[#737373]"
        icon={<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></svg>}
        title="설정"
        desc="알림, 계정, 앱 정보"
        onClick={() => {}}
      />
    </div>
  );
}
