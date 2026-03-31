import { useNavigate } from "react-router-dom";
import Card from "@/components/common/Card";
import Badge from "@/components/common/Badge";

function SubHeader({ title }: { title: string }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-2 mb-4">
      <button className="btn btn-outline btn-sm !rounded-[var(--radius-pill)]" onClick={() => navigate(-1)}>‹ 뒤로</button>
      <span className="text-lg font-bold text-white">{title}</span>
    </div>
  );
}

export default function IndemnityPage() {
  return (
    <div>
      <SubHeader title="구상권 현황" />
      <Card variant="outlined" className="!p-4 mb-3">
        <div className="flex justify-between items-start mb-1.5">
          <div>
            <div className="font-bold text-[15px] text-white">지하주차장 B2 배관 파열</div>
            <div className="text-xs text-[#737373] mt-0.5">2026.03.15 | 관리사무소 접수</div>
          </div>
          <Badge variant="primary" className="!text-[10px]">경합</Badge>
        </div>
        <div className="text-[13px] text-[#a3a3a3] leading-relaxed mt-2">
          도급업체: (주)한성설비 | 보험: 흥국화재<br />상태: 도급업체 보험사 접수 완료, 책임비율 협의 중
        </div>
      </Card>
      <Card variant="outlined" className="!p-4 mb-3">
        <div className="flex justify-between items-start mb-1.5">
          <div>
            <div className="font-bold text-[15px] text-white">엘리베이터 도어 파손</div>
            <div className="text-xs text-[#737373] mt-0.5">2026.02.28 | 입주민 접수</div>
          </div>
          <Badge variant="gray" className="!text-[10px]">완료</Badge>
        </div>
        <div className="text-[13px] text-[#a3a3a3] leading-relaxed mt-2">
          도급업체: 현대엘리베이터 | 보험: 삼성화재<br />상태: 구상 완료 (도급업체 70% 부담)
        </div>
      </Card>
    </div>
  );
}
