import { create } from "zustand";
import api from "../lib/api";

const getToken = () => {
  try {
    const raw = localStorage.getItem("auth-storage");
    return JSON.parse(raw)?.state?.token ?? null;
  } catch {
    return null;
  }
};
const useNoteStore = create((set, get) => ({
  notes: [],
  currentNote: null,
  isLoading: false,
  error: null,
  processingStatus: null,

  usedQuizIds: [],

  addUsedQuizIds: (ids) =>
    set((state) => ({
      usedQuizIds: [...new Set([...state.usedQuizIds, ...ids.map(String)])],
    })),

  resetUsedQuizIds: () => set({ usedQuizIds: [] }),

  fetchNotes: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get("/notes");
      set({ notes: res.data.notes, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch notes",
        isLoading: false,
      });
    }
  },

  retryNote: async (noteId) => {
    await api.post(`/ai/retry/${noteId}`);
    set((state) => ({
      notes: state.notes.map((n) =>
        n._id === noteId ? { ...n, processingStatus: "pending" } : n,
      ),
    }));
  },

  fetchNote: async (id) => {
    // Already loaded — sync processingStatus from cached note and return
    const current = get().currentNote;
    if (current && current._id === id) {
      set({
        isLoading: false,
        processingStatus: current.processingStatus ?? null,
      });
      return current;
    }

    set({ isLoading: true, error: null });
    try {
      const res = await api.get(`/notes/${id}`);
      const note = res.data.note;
      set({
        currentNote: note,
        processingStatus: note.processingStatus ?? null,
        isLoading: false,
      });
      return note;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch note",
        isLoading: false,
      });
    }
  },

  createNote: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post("/notes", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({
        notes: [res.data.note, ...state.notes],
        isLoading: false,
      }));
      return res.data.note;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to create note",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteNote: async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      set((state) => ({
        notes: state.notes.filter((note) => note._id !== id),
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || "Failed to delete note" });
      throw error;
    }
  },
  updateNoteStatus: (noteId, status) =>
    set((state) => ({
      notes: state.notes.map((n) =>
        n._id === noteId ? { ...n, processingStatus: status } : n,
      ),
    })),

  // Poll processing status until complete or failed
  pollProcessingStatus: (noteId, onComplete) => {
    set({ processingStatus: "pending" });

    const token = getToken();
    const baseUrl = import.meta.env.VITE_API_URL;
    const source = new EventSource(
      `${baseUrl}/ai/status/stream/${noteId}?token=${token}`,
    );

    source.onmessage = (event) => {
      try {
        const { status } = JSON.parse(event.data);
        set({ processingStatus: status });

        if (status === "complete" || status === "failed") {
          source.close();
          if (onComplete) onComplete(status);
        }
      } catch {
        source.close();
      }
    };

    source.onerror = () => {
      source.close();
    };

    return () => source.close();
  },

  // Fetch explanation for a specific tone
  fetchExplanation: async (noteId, tone) => {
    const res = await api.post(`/ai/explain/${noteId}`, { tone });
    return res.data.explanation;
  },

  setCurrentNote: (note) => set({ currentNote: note }),
  clearCurrentNote: () => set({ currentNote: null }),
  clearError: () => set({ error: null }),
}));

export default useNoteStore;
