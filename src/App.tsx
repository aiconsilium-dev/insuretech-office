import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@/contexts/AppContext';
import BottomTabBar from '@/components/layout/BottomTabBar';
import DashboardPage from '@/pages/DashboardPage';
import ClaimsPage from '@/pages/ClaimsPage';
import NewClaimPage from '@/pages/NewClaimPage';
import MorePage from '@/pages/MorePage';
import FieldCheckPage from '@/pages/FieldCheckPage';
import PricingPage from '@/pages/PricingPage';
import IndemnityPage from '@/pages/IndemnityPage';

function AppContent() {
  return (
    <div className="max-w-[430px] mx-auto h-full flex flex-col bg-[#0a0a0a] relative">
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-0 px-5 pt-5 pb-24">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/claims" element={<ClaimsPage />} />
          <Route path="/new" element={<NewClaimPage />} />
          <Route path="/more" element={<MorePage />} />
          <Route path="/field-check" element={<FieldCheckPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/indemnity" element={<IndemnityPage />} />
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
