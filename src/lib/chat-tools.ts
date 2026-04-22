import type Anthropic from "@anthropic-ai/sdk";

/**
 * The one tool Claude has in this chat: ask a structured question via a form.
 * When the model invokes this, `/api/chat` passes the tool's input straight
 * through to the UI as a `FormComponent`.
 */
export const DISPLAY_FORM_TOOL: Anthropic.Tool = {
  name: "display_form",
  description:
    "Display a small interactive form in the chat for the learner to fill. " +
    "Use this when you need structured info from them (role, country, goals, " +
    "preferences) and asking one-by-one in chat would be tedious. " +
    "The form renders as a card with a CTA button; clicking it opens a modal " +
    "with the fields. Keep forms short — ideally 2 to 5 fields. " +
    "After you emit this tool call, STOP. Do not also write a text message " +
    "— the card IS your reply.",
  input_schema: {
    type: "object",
    properties: {
      id: {
        type: "string",
        description:
          "A short unique id for this form, e.g. 'intake', 'role-check'. " +
          "Used to match the user's response back to this prompt.",
      },
      title: {
        type: "string",
        description: "Short heading, shown on the card and the modal.",
      },
      description: {
        type: "string",
        description:
          "One sentence explaining why you're asking. Shown on the card above the button.",
      },
      ctaLabel: {
        type: "string",
        description:
          "Button text, e.g. 'Start', 'Tell me about you', 'Pick your options'.",
      },
      fields: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description:
                "Short snake_case id, e.g. 'role', 'country', 'weekly_hours'.",
            },
            label: { type: "string", description: "User-facing question." },
            type: {
              type: "string",
              enum: [
                "single_choice",
                "multi_choice",
                "dropdown",
                "checkbox",
                "text",
                "textarea",
              ],
              description:
                "single_choice = radio group (pick one, best for 2–6 options); dropdown = select menu (pick one, best when you have 7+ options and want to save vertical space, e.g. country lists); multi_choice = checkbox group (pick many); checkbox = single yes/no toggle; text = short free text; textarea = longer free text.",
            },
            options: {
              type: "array",
              items: { type: "string" },
              description:
                "Required for single_choice, multi_choice, and dropdown. 2-6 options for radio/checkbox; dropdowns can handle 7+.",
            },
            helpText: {
              type: "string",
              description: "Optional hint shown under the field.",
            },
            placeholder: {
              type: "string",
              description: "Optional placeholder for text / textarea fields.",
            },
            required: {
              type: "boolean",
              description: "Defaults to true.",
            },
          },
          required: ["id", "label", "type"],
        },
        description:
          "2 to 5 fields. Don't over-ask — pick the minimum needed to answer the learner's real question.",
      },
    },
    required: ["id", "title", "description", "ctaLabel", "fields"],
  },
};
