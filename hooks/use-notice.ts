import { create } from "zustand";

interface CreateNoticeState {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useNoticeCreate = create<CreateNoticeState>()((set) => ({
  open: false,
  onOpen: () => set({ open: true }),
  onClose: () => set({ open: false }),
}));


interface DeleteNoticeState {
    open: boolean;
    id: string;
    onOpen: (id: string) => void;
    onClose: () => void;
}

export const useNoticeDelete = create<DeleteNoticeState>()((set) => ({
    open: false,
    id: "",
    onOpen: (id: string) => set({ open: true, id }),
    onClose: () => set({ open: false, id: "" }),
}))
