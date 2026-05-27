import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Image, File, Clock, Trash2, RotateCcw } from "lucide-react";
import useNoteStore from "../store/noteStore";
import Navbar from "../components/Navbar";
import PageTransition from "../components/pageTransition";
import toast from "react-hot-toast";

const typeConfig = {
  text: { color: "bg-accent-sage", label: "Text", icon: FileText },
  pdf: { color: "bg-accent-lavender", label: "PDF", icon: File },
  image: { color: "bg-accent-teal", label: "Image", icon: Image },
  docx: { color: "bg-accent-green", label: "Word", icon: FileText },
  txt: { color: "bg-accent-sage", label: "Text", icon: FileText },
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const ProcessingBadge = () => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      fontSize: 10,
      fontWeight: 600,
      color: "#fff",
      background: "linear-gradient(to right, #FBBF24, #F97316)",
      padding: "2px 8px",
      borderRadius: 999,
    }}
  >
    <span
      style={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: "#fff",
        animation: "pulse 1.5s infinite",
        display: "inline-block",
      }}
    />
    Processing
  </span>
);

const FailedBadge = () => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      fontSize: 10,
      fontWeight: 600,
      color: "#fff",
      background: "linear-gradient(to right, #EF4444, #F43F5E)",
      padding: "2px 8px",
      borderRadius: 999,
    }}
  >
    Failed
  </span>
);

const ReadyBadge = () => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      fontSize: 10,
      fontWeight: 600,
      color: "#fff",
      background: "linear-gradient(to right, #4ADE80, #10B981)",
      padding: "2px 8px",
      borderRadius: 999,
    }}
  >
    Ready
  </span>
);

const HistoryCardSkeleton = () => (
  <div
    style={{
      background: "var(--color-card)",
      borderRadius: 16,
      padding: 16,
      display: "flex",
      alignItems: "center",
      gap: 16,
    }}
  >
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        background: "var(--color-muted)",
        flexShrink: 0,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
          animation: "shimmer 1.5s infinite",
        }}
      />
    </div>
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
      <div
        style={{
          height: 14,
          borderRadius: 6,
          width: "60%",
          background: "var(--color-muted)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
            animation: "shimmer 1.5s infinite",
          }}
        />
      </div>
      <div
        style={{
          height: 10,
          borderRadius: 6,
          width: "30%",
          background: "var(--color-muted)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
            animation: "shimmer 1.5s infinite",
          }}
        />
      </div>
    </div>
  </div>
);

const History = () => {
  const {
    notes,
    isLoading,
    fetchNotes,
    updateNoteStatus,
    retryNote,
    deleteNote,
  } = useNoteStore();
  const navigate = useNavigate();

  const getToken = () => {
    try {
      const raw = localStorage.getItem("auth-storage");
      return JSON.parse(raw)?.state?.token ?? null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    const processingNotes = notes.filter(
      (n) =>
        n.processingStatus === "pending" || n.processingStatus === "processing",
    );

    if (processingNotes.length === 0) return;

    const token = getToken();
    const baseUrl = import.meta.env.VITE_API_URL;

    const sources = processingNotes.map((note) => {
      const source = new EventSource(
        `${baseUrl}/ai/status/stream/${note._id}?token=${token}`,
      );

      source.onmessage = (event) => {
        try {
          const { status } = JSON.parse(event.data);
          updateNoteStatus(note._id, status);
          if (status === "complete" || status === "failed") {
            source.close();
          }
        } catch {
          source.close();
        }
      };

      source.onerror = () => source.close();

      return source;
    });

    return () => sources.forEach((s) => s.close());
  }, [notes.length]);

  const handleRetry = async (e, id) => {
    e.stopPropagation();
    try {
      await retryNote(id);
      toast.success("Reprocessing started");
    } catch {
      toast.error("Failed to retry");
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteNote(id);
      toast.success("Note deleted");
    } catch {
      toast.error("Failed to delete note");
    }
  };

  const grouped = notes.reduce((acc, note) => {
    const date = formatDate(note.createdAt);
    if (!acc[date]) acc[date] = [];
    acc[date].push(note);
    return acc;
  }, {});

  return (
    <PageTransition>
      <div className="min-h-dvh bg-muted pb-24">
        {/* Header */}
        <div className="bg-card px-6 pt-14 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">History</h1>
              <p className="text-xs text-muted-foreground">
                {notes.length} notes uploaded
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 mt-6">
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2].map((g) => (
                <div key={g}>
                  <div
                    style={{
                      height: 10,
                      width: 80,
                      borderRadius: 6,
                      background: "var(--color-muted)",
                      marginBottom: 12,
                    }}
                  />
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <HistoryCardSkeleton key={i} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-accent-sage rounded-2xl flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="font-semibold text-foreground">No history yet</p>
              <p className="text-muted-foreground text-sm mt-1">
                Your uploaded notes will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(grouped).map(([date, dateNotes], groupIndex) => (
                <motion.div
                  key={date}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: groupIndex * 0.1 }}
                >
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    {date}
                  </p>
                  <div className="space-y-3">
                    {dateNotes.map((note, i) => {
                      const config = typeConfig[note.type] || typeConfig.text;
                      const Icon = config.icon;
                      const isProcessing =
                        note.processingStatus === "pending" ||
                        note.processingStatus === "processing";
                      const isFailed = note.processingStatus === "failed";
                      const isExplained =
                        note.explanations &&
                        Object.values(note.explanations).some(
                          (v) => v?.length > 0,
                        );

                      return (
                        <motion.div
                          key={note._id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="bg-card rounded-2xl flex items-center card-shadow overflow-hidden"
                        >
                          {/* Clickable area — only this animates on tap */}
                          <motion.div
                            whileTap={{ scale: 0.97 }}
                            onClick={() => navigate(`/notes/${note._id}/mode`)}
                            className="flex items-center gap-4 flex-1 min-w-0 p-4 cursor-pointer"
                          >
                            <div
                              className={`w-12 h-12 ${config.color} rounded-xl flex items-center justify-center flex-shrink-0`}
                            >
                              <Icon className="w-6 h-6 text-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-foreground truncate">
                                {note.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <span className="text-xs text-muted-foreground">
                                  {config.label}
                                </span>
                                {note.tags?.length > 0 && (
                                  <>
                                    <span className="text-muted-foreground">
                                      ·
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      #{note.tags[0]}
                                    </span>
                                  </>
                                )}
                                {isProcessing && (
                                  <>
                                    <span className="text-muted-foreground">
                                      ·
                                    </span>
                                    <ProcessingBadge />
                                  </>
                                )}
                                {isFailed && (
                                  <>
                                    <span className="text-muted-foreground">
                                      ·
                                    </span>
                                    <FailedBadge />
                                  </>
                                )}
                                {!isProcessing && !isFailed && isExplained && (
                                  <>
                                    <span className="text-muted-foreground">
                                      ·
                                    </span>
                                    <ReadyBadge />
                                  </>
                                )}
                              </div>
                            </div>
                          </motion.div>

                          {/* Buttons — sibling of animated area, completely isolated */}
                          <div className="flex items-center gap-2 flex-shrink-0 pr-4">
                            {isFailed && (
                              <motion.button
                                type="button"
                                whileTap={{ scale: 0.8 }}
                                onClick={(e) => handleRetry(e, note._id)}
                                style={{ cursor: "pointer" }}
                                className="w-9 h-9 flex items-center justify-center rounded-xl bg-muted"
                              >
                                <RotateCcw className="w-4 h-4 text-muted-foreground" />
                              </motion.button>
                            )}
                            <motion.button
                              type="button"
                              whileTap={{ scale: 0.8 }}
                              onClick={(e) => handleDelete(e, note._id)}
                              style={{ cursor: "pointer" }}
                              className="w-9 h-9 flex items-center justify-center rounded-xl bg-muted"
                            >
                              <Trash2 className="w-4 h-4 text-muted-foreground" />
                            </motion.button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <style>{`
          @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        `}</style>

        <Navbar />
      </div>
    </PageTransition>
  );
};

export default History;
