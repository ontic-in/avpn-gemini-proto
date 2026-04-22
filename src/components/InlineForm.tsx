"use client";

import { useState } from "react";
import FormModal from "@/components/FormModal";
import type { FormComponent, FormResponse } from "@/types/chat-component";

interface InlineFormProps {
  form: FormComponent;
  onSubmit: (response: FormResponse) => void;
  submitted?: boolean;
}

export default function InlineForm({ form, onSubmit, submitted = false }: InlineFormProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="mt-3 rounded-xl border border-[var(--teal)]/30 bg-[var(--teal-ice)]/40 p-4">
        <p className="text-[13px] font-semibold text-[var(--navy)]">{form.title}</p>
        <p className="text-[12px] text-[var(--slate)] mt-1 mb-3">
          {form.description}
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          disabled={submitted}
          className="inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-[var(--navy)] text-white text-[13px] font-semibold hover:bg-[var(--navy-light)] transition-colors disabled:opacity-50 cursor-pointer"
        >
          {submitted ? "Submitted" : form.ctaLabel}
          {!submitted && (
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </div>

      {open && !submitted && (
        <FormModal
          form={form}
          onSubmit={(response) => {
            setOpen(false);
            onSubmit(response);
          }}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
