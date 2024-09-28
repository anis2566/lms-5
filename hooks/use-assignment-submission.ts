import { create } from "zustand";

interface AssignmentSubmissionState {
  open: boolean;
  assignmentId: string;
  chapterId: string;
  onOpen: (assignmentId: string, chapterId: string) => void;
  onClose: () => void;
}

export const useAssignmentSubmission = create<AssignmentSubmissionState>()(
  (set) => ({
    open: false,
    assignmentId: "",
    chapterId: "",
    onOpen: (assignmentId, chapterId) =>
      set({ open: true, assignmentId, chapterId }),
    onClose: () => set({ open: false, assignmentId: "", chapterId: "" }),
  }),
);

interface FeedbackSubmissionState {
  open: boolean;
  id: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}

export const useFeedbackSubmission = create<FeedbackSubmissionState>()(
  (set) => ({
    open: false,
    id: "",
    onOpen: (id) => set({ open: true, id }),
    onClose: () => set({ open: false, id: "" }),
  }),
);
