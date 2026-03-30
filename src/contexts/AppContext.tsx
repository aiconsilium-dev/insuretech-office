import { createContext, useContext, useState, type ReactNode } from "react";
import type { TabId, Claim, SubPage } from "@/lib/types";
import { INITIAL_CLAIMS, STATUS_ORDER, STATUS_LABELS } from "@/lib/types";

interface AppContextType {
  userName: string;
  aptName: string;
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  claims: Claim[];
  cycleStatus: (id: string) => void;
  subPage: SubPage;
  setSubPage: (page: SubPage) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const params = new URLSearchParams(window.location.search);
  const userName = params.get("name") || "김관리";
  const aptName = params.get("apt") || "헬리오시티";

  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [claims, setClaims] = useState<Claim[]>(INITIAL_CLAIMS);
  const [subPage, setSubPage] = useState<SubPage>(null);

  function handleTabChange(tab: TabId) {
    setActiveTab(tab);
    setSubPage(null);
  }

  function cycleStatus(id: string) {
    setClaims((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const idx = STATUS_ORDER.indexOf(c.status);
        const next = STATUS_ORDER[(idx + 1) % STATUS_ORDER.length];
        return { ...c, status: next, statusLabel: STATUS_LABELS[next] };
      })
    );
  }

  return (
    <AppContext.Provider
      value={{ userName, aptName, activeTab, setActiveTab: handleTabChange, claims, cycleStatus, subPage, setSubPage }}
    >
      {children}
    </AppContext.Provider>
  );
}
