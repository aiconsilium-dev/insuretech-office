import { createContext, useContext, useState, type ReactNode } from "react";
import type { Claim, ClaimStatus } from "@/lib/types";
import { INITIAL_CLAIMS, STATUS_ORDER, STATUS_LABELS } from "@/lib/types";

interface AppContextType {
  userName: string;
  aptName: string;
  claims: Claim[];
  cycleStatus: (id: string) => void;
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

  const [claims, setClaims] = useState<Claim[]>(INITIAL_CLAIMS);

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
    <AppContext.Provider value={{ userName, aptName, claims, cycleStatus }}>
      {children}
    </AppContext.Provider>
  );
}
