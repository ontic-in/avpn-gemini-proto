"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type {
  FormComponent,
  FormAnswer,
  FormResponse,
} from "@/types/chat-component";

interface FormModalProps {
  form: FormComponent;
  onSubmit: (response: FormResponse) => void;
  onClose: () => void;
}

function buildSummary(
  form: FormComponent,
  answers: Record<string, FormAnswer>,
): string {
  const lines: string[] = [];
  for (const field of form.fields) {
    const v = answers[field.id];
    if (v === undefined || v === "" || (Array.isArray(v) && v.length === 0)) {
      continue;
    }
    if (Array.isArray(v)) {
      lines.push(`${field.label}: ${v.join(", ")}`);
    } else if (typeof v === "boolean") {
      lines.push(`${field.label}: ${v ? "Yes" : "No"}`);
    } else {
      lines.push(`${field.label}: ${v}`);
    }
  }
  return lines.join("\n");
}

export default function FormModal({ form, onSubmit, onClose }: FormModalProps) {
  const [answers, setAnswers] = useState<Record<string, FormAnswer>>({});
  const [mounted, setMounted] = useState(false);

  // Only render on the client — createPortal needs document
  useEffect(() => setMounted(true), []);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Lock body scroll while the modal is open
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  const setField = (id: string, value: FormAnswer) =>
    setAnswers((prev) => ({ ...prev, [id]: value }));

  const missingRequired = form.fields.some((f) => {
    if (f.required === false) return false;
    const v = answers[f.id];
    if (f.type === "checkbox") return false; // a boolean always has a value
    if (v === undefined || v === "" || (Array.isArray(v) && v.length === 0))
      return true;
    return false;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (missingRequired) return;
    onSubmit({
      componentId: form.id,
      summary: buildSummary(form, answers),
      answers,
    });
  };

  if (!mounted) return null;

  const modalMarkup = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--navy)]/40 backdrop-blur-sm animate-in p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-[0_24px_64px_rgba(0,41,68,0.25)] w-[min(520px,92vw)] max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-6 pb-4 border-b border-[var(--slate-light)]/15 flex items-start gap-4">
          <div className="flex-1">
            <h2 className="text-[18px] font-bold text-[var(--navy)]">
              {form.title}
            </h2>
            <p className="text-[13px] text-[var(--slate)] mt-1">
              {form.description}
            </p>
          </div>
          <button
            aria-label="Close"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--slate)] hover:bg-[var(--gray-light)] transition-colors cursor-pointer flex-shrink-0"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 py-5 space-y-6"
        >
          {form.fields.map((field) => (
            <FieldRenderer
              key={field.id}
              field={field}
              value={answers[field.id]}
              onChange={(v) => setField(field.id, v)}
            />
          ))}
        </form>

        <div className="px-6 py-4 border-t border-[var(--slate-light)]/15 bg-[var(--gray-light)] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="h-10 px-4 rounded-xl text-[14px] font-medium text-[var(--slate)] hover:text-[var(--navy)] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={missingRequired}
            className="h-10 px-5 rounded-xl bg-[var(--red)] text-white text-[14px] font-semibold hover:bg-[var(--red-dark)] transition-colors disabled:opacity-40 cursor-pointer"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalMarkup, document.body);
}

// ── Per-field renderers ────────────────────────────────────────────────────────
interface FieldRendererProps {
  field: FormComponent["fields"][number];
  value: FormAnswer | undefined;
  onChange: (v: FormAnswer) => void;
}

function FieldRenderer({ field, value, onChange }: FieldRendererProps) {
  const labelEl = (
    <label className="block text-[14px] font-semibold text-[var(--navy)] mb-2">
      {field.label}
      {field.required === false && (
        <span className="ml-2 text-[11px] font-normal text-[var(--slate-light)]">
          (optional)
        </span>
      )}
    </label>
  );
  const helpEl = field.helpText ? (
    <p className="text-[12px] text-[var(--slate)] mt-1.5">{field.helpText}</p>
  ) : null;

  if (field.type === "single_choice") {
    const current = (value as string) || "";
    return (
      <div>
        {labelEl}
        <div className="space-y-2">
          {(field.options || []).map((opt) => (
            <label
              key={opt}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border cursor-pointer transition-all ${
                current === opt
                  ? "border-[var(--teal)] bg-[var(--teal-ice)]"
                  : "border-[var(--slate-light)]/25 hover:border-[var(--slate-light)]/50"
              }`}
            >
              <input
                type="radio"
                name={field.id}
                value={opt}
                checked={current === opt}
                onChange={() => onChange(opt)}
                className="accent-[var(--teal)] w-4 h-4"
              />
              <span className="text-[14px] text-[var(--navy)]">{opt}</span>
            </label>
          ))}
        </div>
        {helpEl}
      </div>
    );
  }

  if (field.type === "multi_choice") {
    const current = (value as string[]) || [];
    const toggle = (opt: string) => {
      if (current.includes(opt)) {
        onChange(current.filter((x) => x !== opt));
      } else {
        onChange([...current, opt]);
      }
    };
    return (
      <div>
        {labelEl}
        <div className="space-y-2">
          {(field.options || []).map((opt) => {
            const checked = current.includes(opt);
            return (
              <label
                key={opt}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border cursor-pointer transition-all ${
                  checked
                    ? "border-[var(--teal)] bg-[var(--teal-ice)]"
                    : "border-[var(--slate-light)]/25 hover:border-[var(--slate-light)]/50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(opt)}
                  className="accent-[var(--teal)] w-4 h-4"
                />
                <span className="text-[14px] text-[var(--navy)]">{opt}</span>
              </label>
            );
          })}
        </div>
        {helpEl}
      </div>
    );
  }

  if (field.type === "dropdown") {
    const current = (value as string) || "";
    return (
      <div>
        {labelEl}
        <select
          value={current}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-11 px-4 rounded-xl border border-[var(--slate-light)]/30 focus:outline-none focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/20 text-[14px] text-[var(--navy)] bg-white cursor-pointer appearance-none bg-no-repeat bg-[right_14px_center] pr-10"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
          }}
        >
          <option value="" disabled>
            Select an option…
          </option>
          {(field.options || []).map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {helpEl}
      </div>
    );
  }

  if (field.type === "checkbox") {
    const checked = (value as boolean) || false;
    return (
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="accent-[var(--teal)] w-5 h-5"
          />
          <span className="text-[14px] text-[var(--navy)]">{field.label}</span>
        </label>
        {helpEl}
      </div>
    );
  }

  if (field.type === "text") {
    return (
      <div>
        {labelEl}
        <input
          type="text"
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="w-full h-11 px-4 rounded-xl border border-[var(--slate-light)]/30 focus:outline-none focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/20 text-[14px] text-[var(--navy)]"
        />
        {helpEl}
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div>
        {labelEl}
        <textarea
          rows={4}
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="w-full px-4 py-3 rounded-xl border border-[var(--slate-light)]/30 focus:outline-none focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/20 text-[14px] text-[var(--navy)] resize-none"
        />
        {helpEl}
      </div>
    );
  }

  return null;
}
