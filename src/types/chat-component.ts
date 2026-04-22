/**
 * Types shared between the agent (server) and the chat UI (client).
 * When Claude returns a `display_form` tool call, its arguments match
 * `FormComponent` and flow through `/api/chat` to the UI.
 */

export type FormFieldType =
  | "single_choice"
  | "multi_choice"
  | "dropdown"
  | "checkbox"
  | "text"
  | "textarea";

export interface FormField {
  id: string;
  label: string;
  type: FormFieldType;
  /** For single_choice, multi_choice, and dropdown only. Each option is user-visible text. */
  options?: string[];
  /** Optional hint shown below the field (e.g. "e.g. Jakarta, Indonesia"). */
  helpText?: string;
  /** For text + textarea — optional placeholder. */
  placeholder?: string;
  /** Default: true. Set false for opt-in booleans etc. */
  required?: boolean;
}

export interface FormComponent {
  kind: "form";
  /** Unique id so the UI can match a response back to the prompt that opened it. */
  id: string;
  /** Short title shown on the in-chat card and as the modal heading. */
  title: string;
  /** One-line description shown on the in-chat card, above the CTA. */
  description: string;
  /** Button label, e.g. "Start" / "Tell me more". */
  ctaLabel: string;
  fields: FormField[];
}

/**
 * The user's answers, keyed by field id.
 * - single_choice → string (the chosen option)
 * - multi_choice  → string[]
 * - checkbox      → boolean
 * - text/textarea → string
 */
export type FormAnswer = string | string[] | boolean;

export interface FormResponse {
  componentId: string;
  /** Populated with human-readable `label: value` pairs for the agent. */
  summary: string;
  answers: Record<string, FormAnswer>;
}
