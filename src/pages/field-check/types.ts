export interface InspectionForm {
  severity: "mild" | "moderate" | "severe" | null;
  cause: string;
  needsAction: boolean | null;
  photos: (string | null)[];
  notes: string;
}

export const SEVERITY_OPTIONS = [
  { value: "mild" as const, label: "경미", color: "#00854A" },
  { value: "moderate" as const, label: "보통", color: "#F47920" },
  { value: "severe" as const, label: "심각", color: "#C9252C" },
];
