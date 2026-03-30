import clsx from "clsx";
import type { ClaimStatus } from "@/lib/types";

interface Props {
  status: ClaimStatus;
  label: string;
}

const STATUS_STYLES: Record<ClaimStatus, string> = {
  received: "bg-[#fef3c7] text-[#92400e]",
  review: "bg-[#dbeafe] text-[#1e40af]",
  assess: "bg-[#fce7f3] text-[#9d174d]",
  complete: "bg-[#d1fae5] text-[#065f46]",
};

export default function StatusBadge({ status, label }: Props) {
  return (
    <span className={clsx("text-[11px] font-semibold px-2 py-0.5 rounded-[10px]", STATUS_STYLES[status])}>
      {label}
    </span>
  );
}
