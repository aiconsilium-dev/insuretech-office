import clsx from "clsx";
import type { ClaimStatus } from "@/lib/types";

interface Props {
  status: ClaimStatus;
  label: string;
}

const STATUS_STYLES: Record<ClaimStatus, string> = {
  received: "bg-[#f5f5f5] text-[#737373]",
  review: "bg-[rgba(59,130,246,0.08)] text-[#3b82f6]",
  assess: "bg-[#f5f5f5] text-[#171717]",
  complete: "bg-[rgba(16,185,129,0.08)] text-[#059669]",
};

export default function StatusBadge({ status, label }: Props) {
  return (
    <span className={clsx("text-[11px] font-semibold px-2 py-0.5 rounded-[10px]", STATUS_STYLES[status])}>
      {label}
    </span>
  );
}