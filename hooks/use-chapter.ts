import { create } from "zustand";

interface ChapterState {
  open: boolean;
  id: string;
  courseId: string;
  onOpen: (id: string, courseId: string) => void;
  onClose: () => void;
}

export const useChapter = create<ChapterState>()((set) => ({
  open: false,
  id: "",
  courseId: "",
  onOpen: (id, courseId) => set({ open: true, id, courseId }),
  onClose: () => set({ open: false, id: "", courseId: "" }),
}));
