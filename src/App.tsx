import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@/contexts/AppContext';
import BottomTabBar from '@/components/layout/BottomTabBar';
import LoginPage from '@/pages/login';
import DashboardPage from '@/pages/dashboard';
import ClaimsPage from '@/pages/claims';
import NewClaimPage from '@/pages/new-claim';
import MorePage from '@/pages/more';
import FieldCheckPage from '@/pages/field-check';

function AppContent() {
  return (
    <div className="max-w-[430px] mx-auto h-full flex flex-col bg-white relative">
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-0 px-5 pt-5 pb-24">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/claims" element={<ClaimsPage />} />
          <Route path="/new" element={<NewClaimPage />} />
          <Route path="/more" element={<MorePage />} />
          <Route path="/field-check" element={<FieldCheckPage />} />
        </Routes>
      </div>
      <BottomTabBar />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </AppProvider>
  );
}
