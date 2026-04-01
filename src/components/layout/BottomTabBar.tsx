import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';

const TABS = [
  { path: '/', label: '홈', icon: '●' },
  { path: '/claims', label: '접수관리', icon: '■' },
  { path: '/new', label: '신규접수', icon: '◆' },
  { path: '/more', label: '더보기', icon: '─' },
];

export default function BottomTabBar() {
  const location = useLocation();

  return (
    <div className="tab-bar">
      {TABS.map((tab) => (
        <Link
          key={tab.path}
          to={tab.path}
          className={clsx('tab-item', { active: location.pathname === tab.path })}
        >
          <span className="text-[18px]">{tab.icon}</span>
          <span>{tab.label}</span>
        </Link>
      ))}
    </div>
  );
}
