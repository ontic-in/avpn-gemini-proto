import { Course } from "@/types/course";
import type { FormComponent } from "@/types/chat-component";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  courses?: Course[];
  component?: FormComponent;
  formSubmitted?: boolean;
  suggestions?: string[];
}
