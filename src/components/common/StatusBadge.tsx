import clsx from "clsx";
import type { ClaimStatus } from "@/lib/types";

interface Props {
  status: ClaimStatus;
  label: string;
}

const STATUS_STYLES: Record<ClaimStatus, string> = {
  received: "bg-[rgba(245,158,11,0.15)] text-[#f59e0b]",
  review: "bg-[rgba(59,130,246,0.15)] text-[#3b82f6]",
  assess: "bg-[rgba(99,102,241,0.15)] text-[#6366f1]",
  complete: "bg-[rgba(16,185,129,0.15)] text-[#10b981]",
};

export default function StatusBadge({ status, label }: Props) {
  return (
    <span className={clsx("text-[11px] font-semibold px-2 py-0.5 rounded-[10px]", STATUS_STYLES[status])}>
      {label}
    </span>
  );
}
