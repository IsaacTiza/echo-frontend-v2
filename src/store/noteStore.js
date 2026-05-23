import { create } from "zustand";
import api from "../lib/api";

const useNoteStore = create((set, get) => ({
  notes: [],
  currentNote: null,
  isLoading: false,
  error: null,
  processingStatus: null,

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

  fetchNote: async (id) => {
    // Already loaded — don't refetch
    const current = get().currentNote;
    if (current && current._id === id) {
      set({ isLoading: false });
      return current;
    }

    set({ isLoading: true, error: null });
    try {
      const res = await api.get(`/notes/${id}`);
      set({ currentNote: res.data.note, isLoading: false });
      return res.data.note;
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

  // Poll processing status until complete or failed
  pollProcessingStatus: (noteId, onComplete) => {
    set({ processingStatus: "pending" });

    const interval = setInterval(async () => {
      try {
        const res = await api.get(`/ai/status/${noteId}`);
        const status = res.data.status;
        set({ processingStatus: status });

        if (status === "complete" || status === "failed") {
          clearInterval(interval);
          if (onComplete) onComplete(status);
        }
      } catch {
        clearInterval(interval);
      }
    }, 3000);

    // Stop after 3 minutes regardless
    const timeout = setTimeout(() => clearInterval(interval), 180000);

    // Return cleanup function so components can stop polling on unmount
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  },

  // Fetch explanation for a specific tone
  fetchExplanation: async (noteId, tone) => {
    try {
      const res = await api.post(`/ai/explain/${noteId}`, { tone });
      return res.data.explanation;
    } catch (error) {
      throw error;
    }
  },

  setCurrentNote: (note) => set({ currentNote: note }),
  clearCurrentNote: () => set({ currentNote: null }),
  clearError: () => set({ error: null }),
}));

export default useNoteStore;
