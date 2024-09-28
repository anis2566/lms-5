import { create } from "zustand";

interface QuestionAnswerState {
  open: boolean;
  questionId: string;
  onOpen: (questionId: string) => void;
  onClose: () => void;
}

export const useQuestionAnswer = create<QuestionAnswerState>()((set) => ({
  open: false,
  questionId: "",
  onOpen: (questionId) => set({ open: true, questionId }),
  onClose: () => set({ open: false, questionId: "" }),
}));
