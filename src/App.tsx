import { AppProvider, useApp } from "@/contexts/AppContext";
import BottomTabBar from "@/components/layout/BottomTabBar";
import DashboardPage from "@/pages/DashboardPage";
import ClaimsPage from "@/pages/ClaimsPage";
import NewClaimPage from "@/pages/NewClaimPage";
import MorePage from "@/pages/MorePage";

function AppContent() {
  const { activeTab } = useApp();

  return (
    <div className="max-w-[430px] mx-auto h-full flex flex-col bg-white relative">
      <div className="flex-1 overflow-y-auto px-4 pt-5 pb-[100px] [&::-webkit-scrollbar]:w-0">
        {activeTab === "dashboard" && <DashboardPage />}
        {activeTab === "claims" && <ClaimsPage />}
        {activeTab === "new" && <NewClaimPage />}
        {activeTab === "more" && <MorePage />}
      </div>
      <BottomTabBar />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
