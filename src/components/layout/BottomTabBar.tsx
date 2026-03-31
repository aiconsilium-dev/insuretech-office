import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { LayoutDashboard, Files, PlusCircle, MoreHorizontal } from 'lucide-react';

const TABS = [
  { path: '/', label: '대시보드', icon: <LayoutDashboard /> },
  { path: '/claims', label: '접수관리', icon: <Files /> },
  { path: '/new', label: '신규접수', icon: <PlusCircle /> },
  { path: '/more', label: '더보기', icon: <MoreHorizontal /> },
];

export default function BottomTabBar() {
  const location = useLocation();

  return (
    <div className="tab-bar">
      {TABS.map((tab) => (
        <Link
          key={tab.path}
          to={tab.path}
          className={clsx('tab-item', { 'active': location.pathname === tab.path })}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </Link>
      ))}
    </div>
  );
}