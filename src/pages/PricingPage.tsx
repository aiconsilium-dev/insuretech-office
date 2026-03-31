import { useNavigate } from "react-router-dom";
import Card from "@/components/common/Card";

function SubHeader({ title }: { title: string }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-2 mb-5">
      <button className="btn btn-secondary btn-sm !rounded-[var(--radius-pill)]" onClick={() => navigate(-1)}>‹ 뒤로</button>
      <span className="text-lg font-bold text-[#0a0a0a]">{title}</span>
    </div>
  );
}

function CostRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2.5 border-b border-[#e5e5e5] last:border-b-0 text-sm">
      <span className="text-[#737373]">{label}</span>
      <span className="font-semibold text-[#0a0a0a]">{value}</span>
    </div>
  );
}

export default function PricingPage() {
  return (
    <div>
      <SubHeader title="품셈 확인" />
      <div className="bg-[#f5f5f5] border border-[#e5e5e5] rounded-[var(--radius-card)] p-4 mb-4">
        <div className="text-sm font-bold text-[#0a0a0a] mb-1">2026년 3월 기준 최신 품셈 적용 중</div>
        <div className="text-xs text-[#a3a3a3] leading-relaxed">대한건설협회 고시 기준 / 분기별 자동 업데이트</div>
      </div>
      <Card variant="outlined" className="!p-4 mt-3">
        <div className="text-sm font-bold mb-3 text-[#0a0a0a]">주요 공종 단가 미리보기</div>
        <CostRow label="도배 (벽지)" value="28,500원/m²" />
        <CostRow label="장판 (바닥재)" value="35,200원/m²" />
        <CostRow label="타일 보수" value="52,800원/m²" />
        <CostRow label="배관 보수" value="185,000원/개소" />
        <CostRow label="방수 공사" value="67,500원/m²" />
        <CostRow label="도장 (페인트)" value="18,300원/m²" />
        <CostRow label="창호 보수" value="320,000원/개소" />
      </Card>
    </div>
  );
}