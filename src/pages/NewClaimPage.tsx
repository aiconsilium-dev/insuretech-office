import { useState } from "react";
import SubTabs from "@/components/common/SubTabs";
import Card from "@/components/common/Card";
import Modal from "@/components/common/Modal";
import clsx from "clsx";

type NewTab = "common" | "proxy";

export default function NewClaimPage() {
  const [activeNewTab, setActiveNewTab] = useState<NewTab>("common");
  const [accType, setAccType] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [resultType, setResultType] = useState<"A" | "B" | "C">("C");

  function submitClaim(type: "common" | "proxy") {
    setShowLoading(true);
    setLoadingStep(0);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setLoadingStep(step);
      if (step >= 4) {
        clearInterval(interval);
        setTimeout(() => {
          setShowLoading(false);
          const types: ("A" | "B" | "C")[] = ["A", "B", "C"];
          setResultType(type === "proxy" ? "C" : types[Math.floor(Math.random() * 3)]);
          setShowResult(true);
        }, 600);
      }
    }, 900);
  }

  return (
    <div>
      <div className="text-[22px] font-extrabold mb-4">신규 접수</div>

      {/* SubTabs compound */}
      <SubTabs className="mb-4">
        <SubTabs.Tab active={activeNewTab === "common"} onClick={() => setActiveNewTab("common")}>
          공용부 사고접수
        </SubTabs.Tab>
        <SubTabs.Tab active={activeNewTab === "proxy"} onClick={() => setActiveNewTab("proxy")}>
          비입주민 대리접수
        </SubTabs.Tab>
      </SubTabs>

      {activeNewTab === "common" ? (
        <CommonForm accType={accType} setAccType={setAccType} onSubmit={() => submitClaim("common")} />
      ) : (
        <ProxyForm onSubmit={() => submitClaim("proxy")} />
      )}

      {/* Loading Overlay */}
      {showLoading && (
        <div className="fixed inset-0 bg-white/95 z-[var(--z-tab-bar)] flex flex-col items-center justify-center gap-5">
          <div className="w-10 h-10 border-3 border-gray-200 border-t-primary rounded-full animate-spin" />
          <div className="text-center">
            {["사고 정보 분석 중...", "하자 유형 판별 중...", "약관/보증기간 대조 중...", "TYPE 분류 완료"].map((text, i) => (
              <div key={i} className={clsx("text-[13px] my-1.5 transition-colors duration-300",
                i < loadingStep ? "text-gray-500" : i === loadingStep ? "text-primary font-semibold" : "text-gray-300"
              )}>{text}</div>
            ))}
          </div>
        </div>
      )}

      {/* Result Modal — compound */}
      <Modal open={showResult} center onClose={() => setShowResult(false)}>
        <Modal.Body className="!p-7 text-center">
          <ResultContent type={resultType} />
          <button className="btn btn-primary btn-full !rounded-[var(--radius-pill)] mt-4" onClick={() => setShowResult(false)}>확인</button>
        </Modal.Body>
      </Modal>
    </div>
  );
}

function CommonForm({ accType, setAccType, onSubmit }: { accType: string; setAccType: (v: string) => void; onSubmit: () => void }) {
  return (
    <div>
      <FormGroup label="사고유형">
        <select className="input !appearance-none !bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239ca3af%22%20stroke-width%3D%222%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')] !bg-no-repeat !bg-[position:right_12px_center]"
          value={accType} onChange={(e) => setAccType(e.target.value)}>
          <option value="">선택하세요</option>
          <option>공용배관 누수</option>
          <option>공용시설 파손</option>
          <option>엘리베이터 사고</option>
          <option>주차장 사고</option>
          <option>기타</option>
        </select>
      </FormGroup>
      <FormGroup label="위치 - 동">
        <input className="input" placeholder="예: 101동" />
      </FormGroup>
      <FormGroup label="위치 - 층/공용시설명">
        <input className="input" placeholder="예: B2 주차장, 1층 로비" />
      </FormGroup>
      <FormGroup label="사진 촬영 (3종)">
        <PhotoGrid />
      </FormGroup>
      {accType.includes("누수") && (
        <FormGroup label="누수 기술 소견서 첨부">
          <div className="photo-slot !aspect-[3/1] !rounded-[var(--radius-card)]">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
            </svg>
            소견서 파일 첨부
          </div>
        </FormGroup>
      )}
      <FormGroup label="상세 설명">
        <textarea className="input !min-h-[80px] !resize-y" placeholder="사고 경위 및 상세 내용을 입력하세요" />
      </FormGroup>
      <button className="btn btn-primary btn-full !rounded-[var(--radius-pill)] mt-2" onClick={onSubmit}>접수 제출</button>
    </div>
  );
}

function ProxyForm({ onSubmit }: { onSubmit: () => void }) {
  const [toggleOn, setToggleOn] = useState(false);

  return (
    <div>
      <Card variant="outlined" className="!border-primary !bg-primary-light !p-4 mb-5">
        <div className="text-sm text-gray-700 leading-relaxed">
          배달원, 택배기사, 방문객 등 앱 접근 권한이 없는 <strong className="text-primary">비입주민 사고</strong>를 대리 접수합니다.
        </div>
      </Card>

      <div className="section-title">피해자 정보</div>
      <FormGroup label="이름">
        <input className="input" placeholder="피해자 성명" />
      </FormGroup>
      <FormGroup label="연락처">
        <input className="input" type="tel" placeholder="010-0000-0000" />
      </FormGroup>
      <FormGroup label="관계">
        <select className="input !appearance-none">
          <option value="">선택하세요</option>
          <option>배달원</option>
          <option>택배기사</option>
          <option>방문객</option>
          <option>기타</option>
        </select>
      </FormGroup>

      <div className="section-title mt-5">사고 정보</div>
      <FormGroup label="사고유형">
        <select className="input !appearance-none">
          <option value="">선택하세요</option>
          <option>넘어짐/미끄러짐</option>
          <option>차량 접촉</option>
          <option>시설물 낙하/파손</option>
          <option>기타</option>
        </select>
      </FormGroup>
      <FormGroup label="위치">
        <input className="input" placeholder="예: 지하주차장 B1, 정문 앞" />
      </FormGroup>
      <FormGroup label="사고 일시">
        <input className="input" type="datetime-local" />
      </FormGroup>
      <FormGroup label="사고 경위">
        <textarea className="input !min-h-[80px] !resize-y" placeholder="사고 발생 경위를 상세히 기록해 주세요" />
      </FormGroup>
      <FormGroup label="사진 촬영 (3종)">
        <PhotoGrid />
      </FormGroup>

      {/* Toggle */}
      <Card variant="outlined" className="!px-4">
        <div className="flex items-center justify-between py-3.5">
          <div>
            <div className="text-sm font-semibold">도급업체 관련 여부</div>
            <div className="text-xs text-gray-500 mt-0.5">책임 경합 시 도급업체 보험 동시 접수</div>
          </div>
          <div className={clsx("w-11 h-6 rounded-xl relative cursor-pointer transition-colors", toggleOn ? "bg-primary" : "bg-gray-200")} onClick={() => setToggleOn(!toggleOn)}>
            <div className={clsx("w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-[left]", toggleOn ? "left-[22px]" : "left-0.5")} />
          </div>
        </div>
      </Card>

      <button className="btn btn-primary btn-full !rounded-[var(--radius-pill)] mt-5" onClick={onSubmit}>대리 접수 제출</button>
    </div>
  );
}

function FormGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4.5">
      <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function PhotoGrid() {
  return (
    <div className="photo-grid">
      {["전체", "주변", "상세"].map((label) => (
        <div key={label} className="photo-slot !aspect-[4/3] !rounded-[var(--radius-card)] !text-[13px]">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          {label}
        </div>
      ))}
    </div>
  );
}

function ResultContent({ type }: { type: "A" | "B" | "C" }) {
  if (type === "A") {
    return (
      <>
        <div className="text-[40px] font-extrabold text-black mb-2">TYPE A</div>
        <div className="text-base font-bold mb-2">시공사 하자</div>
        <div className="text-[15px] text-gray-600 leading-relaxed mb-4">하자보수 청구 대상으로 분류되었습니다.<br />시공사에 보수 청구가 진행됩니다.</div>
      </>
    );
  }
  if (type === "B") {
    return (
      <>
        <div className="text-[40px] font-extrabold text-gray-500 mb-2">TYPE B</div>
        <div className="text-base font-bold mb-2">면책 대상</div>
        <div className="text-[15px] text-gray-600 leading-relaxed mb-4">약관 면책 사유에 해당합니다.<br />입주자 관리 부주의 또는 자연 마모로 판단됩니다.</div>
      </>
    );
  }
  return (
    <>
      <div className="text-[40px] font-extrabold text-primary mb-2">TYPE C</div>
      <div className="text-base font-bold mb-2">보험금 산출 대상</div>
      <div className="text-[15px] text-gray-600 leading-relaxed mb-4">AI 적산 금액: <strong>1,850,000원</strong><br />소유자: 1,480,000원 / 임차인: 370,000원</div>
    </>
  );
}
