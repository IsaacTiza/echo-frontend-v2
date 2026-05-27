import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Brain, Zap, Download, FileText } from "lucide-react";
import useNoteStore from "../store/noteStore";
import api from "../lib/api";
import toast from "react-hot-toast";
import PageTransition from "../components/pageTransition";

const ModeSelect = () => {
  const { id } = useParams();
  const navigate = useNavigate();
const {
  currentNote,
  fetchNote,
  isLoading,
  fetchExplanation,
  processingStatus,
  pollProcessingStatus,
  updateNoteStatus,
} = useNoteStore();
  const [downloading, setDownloading] = useState(false);
  const [showToneModal, setShowToneModal] = useState(false);
  const [selectedTones, setSelectedTones] = useState([]);
  const [isDownloadingExplanation, setIsDownloadingExplanation] =
    useState(false);

  useEffect(() => {
    fetchNote(id);
  }, [id]);

  useEffect(() => {
    if (processingStatus === "processing" || processingStatus === "pending") {
      const cleanup = pollProcessingStatus(id, (finalStatus) => {
        updateNoteStatus(id, finalStatus);
      });
      return cleanup;
    }
  }, [processingStatus, id]);

  const tones = [
    { value: "simple", label: "Simple" },
    { value: "detailed", label: "Detailed" },
    { value: "eli5", label: "ELI5" },
    { value: "academic", label: "Academic" },
    { value: "bullet", label: "Bullets" },
  ];

  const toggleTone = (toneValue) => {
    setSelectedTones((prev) =>
      prev.includes(toneValue)
        ? prev.filter((t) => t !== toneValue)
        : [...prev, toneValue],
    );
  };

  const handleDownloadNote = async () => {
    setDownloading(true);
    try {
      const response = await api.get(`/notes/${id}/download`, {
        responseType: "blob",
      });

      const contentDisposition = response.headers["content-disposition"];
      let filename =
        currentNote?.originalFilename || currentNote?.title || "note";

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) filename = match[1];
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Note downloaded");
    } catch {
      toast.error("Failed to download note");
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadExplanation = async () => {
    if (selectedTones.length === 0) return;
    setIsDownloadingExplanation(true);
    try {
      const sections = await Promise.all(
        selectedTones.map(async (t) => {
          const label = tones.find((x) => x.value === t)?.label || t;
          const text = await fetchExplanation(id, t);
          return `=== ${label.toUpperCase()} ===\n\n${text}`;
        }),
      );
      const content = `${currentNote?.title || "Note"}\nDownloaded from Echo\n\n${sections.join("\n\n" + "─".repeat(40) + "\n\n")}`;
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${currentNote?.title || "explanation"}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      setShowToneModal(false);
      setSelectedTones([]);
      toast.success("Explanation downloaded");
    } catch {
      toast.error("Download failed. Please try again.");
    } finally {
      setIsDownloadingExplanation(false);
    }
  };

const isProcessingComplete = processingStatus === "complete";
const isProcessingFailed = processingStatus === "failed";

  return (
    <PageTransition>
      <div className="min-h-dvh bg-background px-6 pt-14 pb-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">Selected Note</p>
            <h1 className="text-lg font-bold text-foreground truncate">
              {isLoading ? "Loading..." : currentNote?.title}
            </h1>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-2">
            How do you want to study?
          </h2>
          <p className="text-muted-foreground text-sm mb-8">
            Choose a mode to get started with your note.
          </p>

          <div className="space-y-4">
            {/* Understand Mode */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              onClick={() => navigate(`/notes/${id}/explain`)}
              className="w-full text-left gradient-primary rounded-2xl p-6 active:scale-95 transition-transform"
            >
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Understand</h3>
              <p className="text-white/80 text-sm">
                Get a clear AI explanation of your note in your preferred tone.
                Perfect for when the material feels confusing.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {["Simple", "Detailed", "ELI5", "Academic", "Bullets"].map(
                  (t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium"
                    >
                      {t}
                    </span>
                  ),
                )}
              </div>
            </motion.button>

            {/* Study Mode */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              onClick={() => navigate(`/notes/${id}/study`)}
              className="w-full text-left bg-[#1C1B19] dark:bg-[#2C2B28] rounded-2xl p-6 active:scale-95 transition-transform"
            >
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Study</h3>
              <p className="text-white/80 text-sm">
                Test yourself with flashcards or a quiz generated from your
                note. See how much you actually know.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {["Flashcards", "MCQ Quiz", "25 Questions"].map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.button>

            {/* Download Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-muted rounded-2xl p-5"
            >
              <p className="text-sm font-bold text-foreground mb-3">
                Downloads
              </p>
              <div className="space-y-3">
                {/* Download Original */}
                <button
                  onClick={handleDownloadNote}
                  disabled={downloading}
                  className="w-full flex items-center gap-3 bg-card rounded-xl p-4 active:scale-95 transition-transform disabled:opacity-60"
                >
                  <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                    <Download className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-foreground">
                      {downloading
                        ? "Downloading..."
                        : "Download Original Note"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {currentNote?.type?.toUpperCase()} file
                    </p>
                  </div>
                </button>

                {/* Download Explanation */}
                <button
                  onClick={() => {
                    setSelectedTones([]);
                    setShowToneModal(true);
                  }}
                  disabled={!isProcessingComplete}
                  className="w-full flex items-center gap-3 bg-card rounded-xl p-4 active:scale-95 transition-transform disabled:opacity-60"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isProcessingComplete ? "gradient-primary" : "bg-muted"}`}
                  >
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-foreground">
                      Download AI Explanation
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {isProcessingComplete
                        ? "Choose which versions to save"
                        : isProcessingFailed
                          ? "Note failed to process"
                          : "Processing note..."}
                    </p>
                  </div>
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Tone Selection Modal */}
      <AnimatePresence>
        {showToneModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowToneModal(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.5)",
                zIndex: 50,
              }}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
              style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                background: "var(--color-background)",
                borderRadius: "24px 24px 0 0",
                padding: "24px 24px 40px",
                zIndex: 51,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 4,
                  borderRadius: 2,
                  background: "var(--color-muted)",
                  margin: "0 auto 24px",
                }}
              />

              <h2 className="text-lg font-bold text-foreground mb-1">
                Download Explanations
              </h2>
              <p className="text-sm text-muted-foreground mb-5">
                Select the versions you want to save.
              </p>

              <div className="flex flex-col gap-3 mb-6">
                {tones.map((t) => {
                  const selected = selectedTones.includes(t.value);
                  return (
                    <button
                      key={t.value}
                      onClick={() => toggleTone(t.value)}
                      className="flex items-center justify-between p-4 rounded-2xl transition-all active:scale-95"
                      style={{
                        border: `1.5px solid ${selected ? "#F95E08" : "var(--color-muted)"}`,
                        background: selected
                          ? "rgba(249, 94, 8, 0.08)"
                          : "var(--color-muted)",
                      }}
                    >
                      <span className="font-semibold text-sm text-foreground">
                        {t.label}
                      </span>
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 6,
                          background: selected
                            ? "linear-gradient(135deg, #F95E08, #FE8118)"
                            : "transparent",
                          border: `2px solid ${selected ? "#F95E08" : "var(--color-muted-foreground)"}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {selected && (
                          <span
                            style={{
                              color: "white",
                              fontSize: 11,
                              fontWeight: 800,
                            }}
                          >
                            ✓
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleDownloadExplanation}
                disabled={
                  selectedTones.length === 0 || isDownloadingExplanation
                }
                className="w-full py-4 rounded-2xl font-bold text-sm active:scale-95 disabled:opacity-60"
                style={{
                  background:
                    selectedTones.length === 0
                      ? "var(--color-muted)"
                      : "linear-gradient(135deg, #F95E08, #FE8118)",
                  color:
                    selectedTones.length === 0
                      ? "var(--color-muted-foreground)"
                      : "white",
                  border: "none",
                  cursor:
                    selectedTones.length === 0 || isDownloadingExplanation
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {isDownloadingExplanation
                  ? "Downloading..."
                  : `Download${selectedTones.length > 0 ? ` (${selectedTones.length})` : ""}`}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </PageTransition>
  );
};

export default ModeSelect;
