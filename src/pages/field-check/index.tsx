import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import PhotoCapture from "@/components/common/PhotoCapture";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";

/* ─── 현장조사 대기 목록 (claims 에서 received/review 필터) ─── */
interface FieldItem {
  id: string;
  type: string;
  typeIcon: string;
  typeColor: string;
  dong: string;
  ho: string;
  location: string;
  desc: string;
  date: string;
}

/* ─── 소견서 폼 ─── */
interface InspectionForm {
  severity: "mild" | "moderate" | "severe" | null;
  cause: string;
  needsAction: boolean | null;
  photos: (string | null)[];
  notes: string;
}

const SEVERITY_OPTIONS = [
  { value: "mild" as const, label: "경미", color: "#00854A" },
  { value: "moderate" as const, label: "보통", color: "#F47920" },
  { value: "severe" as const, label: "심각", color: "#C9252C" },
];

export default function FieldCheckPage() {
  const { claims } = useApp();
  const navigate = useNavigate();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  const [form, setForm] = useState<InspectionForm>({
    severity: null,
    cause: "",
    needsAction: null,
    photos: [null, null, null],
    notes: "",
  });

  // 현장조사 대기 목록 (received 또는 review 상태)
  const fieldItems: FieldItem[] = claims
    .filter((c) => c.status === "received" || c.status === "review")
    .filter((c) => !completed.includes(c.id))
    .map((c) => ({
      id: c.id,
      type: c.type,
      typeIcon: c.typeIcon,
      typeColor: c.typeColor,
      dong: c.dong,
      ho: c.ho,
      location: c.location,
      desc: c.detail.desc,
      date: c.date,
    }));

  function resetForm() {
    setForm({ severity: null, cause: "", needsAction: null, photos: [null, null, null], notes: "" });
  }

  function handleComplete() {
    if (activeId) {
      setCompleted((prev) => [...prev, activeId]);
      setActiveId(null);
      resetForm();
    }
  }

  // ═══ 현장조사 진행 중 ═══
  if (activeId) {
    const item = claims.find((c) => c.id === activeId);
    if (!item) return null;

    return (
      <div className="animate-[fadeIn_0.25s_ease] pb-24">
        {/* 뒤로가기 */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => { setActiveId(null); resetForm(); }} className="btn btn-icon bg-bg-secondary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <h2 className="text-xl font-bold text-text-heading">현장조사</h2>
        </div>

        {/* 접수 정보 */}
        <div className="card border p-4 mb-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-[10px] flex items-center justify-center text-lg" style={{ color: item.typeColor }}>
              {item.typeIcon}
            </div>
            <div>
              <div className="text-[13px] text-text-muted font-medium">{item.id}</div>
              <div className="text-[15px] font-semibold text-text-body">{item.dong}동 {item.ho} — {item.type}</div>
            </div>
          </div>
          <div className="text-sm text-text-muted">{item.detail.desc}</div>
        </div>

        {/* 현장 사진 */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-text-body mb-2">현장 사진 촬영</label>
          <div className="flex gap-2.5">
            <PhotoCapture label="전경" onCapture={(url) => setForm(f => { const p = [...f.photos]; p[0] = url; return { ...f, photos: p }; })} />
            <PhotoCapture label="근접" onCapture={(url) => setForm(f => { const p = [...f.photos]; p[1] = url; return { ...f, photos: p }; })} />
            <PhotoCapture label="주변" onCapture={(url) => setForm(f => { const p = [...f.photos]; p[2] = url; return { ...f, photos: p }; })} />
          </div>
        </div>

        {/* 소견서 */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-text-body mb-2">손상 정도</label>
          <div className="flex gap-2.5">
            {SEVERITY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setForm(f => ({ ...f, severity: opt.value }))}
                className={clsx(
                  "flex-1 py-3 rounded-full text-sm font-semibold border transition-all",
                  form.severity === opt.value ? "text-white" : "border-border text-text-body"
                )}
                style={form.severity === opt.value ? { backgroundColor: opt.color, borderColor: opt.color } : {}}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-semibold text-text-body mb-2">원인 추정</label>
          <input
            className="input"
            placeholder="추정 원인을 입력해주세요"
            value={form.cause}
            onChange={(e) => setForm(f => ({ ...f, cause: e.target.value }))}
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm font-semibold text-text-body mb-2">추가 조치 필요</label>
          <div className="flex gap-2.5">
            <button
              onClick={() => setForm(f => ({ ...f, needsAction: true }))}
              className={clsx(
                "flex-1 py-3 rounded-full text-sm font-semibold border transition-all",
                form.needsAction === true ? "text-white bg-[#0061AF] border-[#0061AF]" : "border-border text-text-body"
              )}
            >
              예
            </button>
            <button
              onClick={() => setForm(f => ({ ...f, needsAction: false }))}
              className={clsx(
                "flex-1 py-3 rounded-full text-sm font-semibold border transition-all",
                form.needsAction === false ? "text-white bg-[#00854A] border-[#00854A]" : "border-border text-text-body"
              )}
            >
              아니오
            </button>
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-semibold text-text-body mb-2">조사 소견</label>
          <textarea
            className="input !min-h-[120px] !resize-y"
            placeholder="현장 조사 소견을 작성해주세요"
            value={form.notes}
            onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
          />
        </div>

        <button
          className="btn btn-full !rounded-full text-white !py-4 !text-base !font-bold bg-[#00854A]"
          disabled={!form.severity || !form.cause || form.needsAction === null}
          onClick={handleComplete}
        >
          조사 완료
        </button>
      </div>
    );
  }

  // ═══ 대기 목록 ═══
  return (
    <div className="animate-[fadeIn_0.25s_ease] pb-24">
      <div className="mb-5">
        <h1 className="text-[22px] font-bold text-text-heading tracking-[-0.02em]">현장조사</h1>
        <p className="text-sm text-text-muted mt-1">현장조사 대기 {fieldItems.length}건</p>
      </div>

      {completed.length > 0 && (
        <div className="card border p-4 mb-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#00854A] flex items-center justify-center shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <span className="text-sm text-[#00854A] font-semibold">{completed.length}건 조사 완료</span>
        </div>
      )}

      {fieldItems.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full border-2 border-[#e5e5e5] mx-auto mb-4 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a3a3a3" strokeWidth="1.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-text-heading mb-1">현장조사 대기 건이 없습니다</h3>
          <p className="text-sm text-text-muted">모든 현장조사가 완료되었습니다</p>
        </div>
      )}

      {fieldItems.map((item) => (
        <div
          key={item.id}
          className="mb-3.5 rounded-[var(--radius-card)] border border-[#e5e5e5] bg-[var(--color-surface)] shadow-[var(--shadow-card)] overflow-hidden"
        >
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[10px] flex items-center justify-center text-lg" style={{ color: item.typeColor }}>
                  {item.typeIcon}
                </div>
                <div>
                  <div className="text-[13px] text-text-muted font-medium">{item.id}</div>
                  <div className="text-[15px] font-semibold text-text-body">{item.dong}동 {item.ho}</div>
                </div>
              </div>
              <div className="text-xs text-text-dim">{item.date}</div>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-[13px] font-medium" style={{ color: item.typeColor }}>{item.type}</span>
              <span className="text-[12px] text-text-dim">· {item.location}</span>
            </div>

            <p className="text-[13px] text-text-muted mb-4 leading-relaxed">{item.desc}</p>

            <button
              className="btn btn-full !rounded-full text-white !py-3 !text-sm !font-bold"
              style={{ backgroundColor: item.typeColor }}
              onClick={() => setActiveId(item.id)}
            >
              현장조사 시작
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
