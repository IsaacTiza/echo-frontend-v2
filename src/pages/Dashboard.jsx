import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  FileText,
  Image,
  File,
  Trash2,
  Clock,
} from "lucide-react";
import useAuthStore from "../store/authStore";
import useNoteStore from "../store/noteStore";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import PageTransition from "../components/pageTransition";

const typeConfig = {
  text: { color: "bg-accent-sage", label: "Text", icon: FileText },
  pdf: { color: "bg-accent-lavender", label: "PDF", icon: File },
  image: { color: "bg-accent-teal", label: "Image", icon: Image },
  docx: { color: "bg-accent-green", label: "Word", icon: FileText },
  txt: { color: "bg-accent-sage", label: "Text", icon: FileText },
};

const ProcessingBadge = () => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      fontSize: 10,
      fontWeight: 600,
      color: "#F95E08",
      background: "rgba(249,94,8,0.1)",
      padding: "2px 8px",
      borderRadius: 999,
    }}
  >
    <span
      style={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: "#F95E08",
        animation: "pulse 1.5s infinite",
        display: "inline-block",
      }}
    />
    Processing
  </span>
);

const NoteCardSkeleton = () => (
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

const Dashboard = () => {
  const { user } = useAuthStore();
  const { notes, isLoading, fetchNotes, deleteNote } = useNoteStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await deleteNote(id);
      toast.success("Note deleted");
    } catch {
      toast.error("Failed to delete note");
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const firstName = user?.name?.split(" ")[0] || "there";
  const explainedCount = notes.filter(
    (n) =>
      n.explanations &&
      Object.values(n.explanations).some((v) => v?.length > 0),
  ).length;

  return (
    <PageTransition>
      <div className="min-h-dvh bg-muted pb-24">
        {/* everything inside unchanged */}
        <div className="min-h-dvh bg-muted pb-24">
          <div className="min-h-dvh bg-muted pb-32">
            {/* Header */}
            <div className="bg-card px-6 pt-14 pb-6">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="text-muted-foreground text-sm">
                    {getGreeting()},
                  </p>
                  <h1 className="text-2xl font-bold text-foreground">
                    {firstName} 👋
                  </h1>
                </div>
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-11 h-11 rounded-full object-cover cursor-pointer"
                  onClick={() => navigate("/account")}
                />
              </motion.div>

              {/* Stats Row */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex gap-3 mt-5"
              >
                {isLoading
                  ? [1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex-1 bg-muted rounded-2xl p-4"
                        style={{ position: "relative", overflow: "hidden" }}
                      >
                        <div
                          style={{
                            height: 28,
                            width: "50%",
                            borderRadius: 6,
                            background: "var(--color-card)",
                            marginBottom: 8,
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
                            width: "70%",
                            borderRadius: 6,
                            background: "var(--color-card)",
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
                    ))
                  : [
                      {
                        value: notes.length,
                        label: "Total Notes",
                        color: "text-foreground",
                      },
                      {
                        value: 10 - (user?.dailyUsage || 0),
                        label: "AI Credits",
                        color: "text-primary",
                      },
                      {
                        value: explainedCount,
                        label: "Explained",
                        color: "text-foreground",
                      },
                    ].map((stat, i) => (
                      <div key={i} className="flex-1 bg-muted rounded-2xl p-4">
                        <p className={`text-2xl font-bold ${stat.color}`}>
                          {stat.value}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {stat.label}
                        </p>
                      </div>
                    ))}
              </motion.div>
            </div>

            {/* Quick Action */}
            <div className="px-6 mt-6">
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                onClick={() => navigate("/notes/new")}
                className="w-full gradient-primary rounded-2xl p-5 flex items-center justify-between active:scale-95 transition-transform"
              >
                <div>
                  <p className="text-white font-bold text-lg">Upload a Note</p>
                  <p className="text-white/80 text-sm mt-1">
                    PDF, image, text, DOCX
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <ChevronRight className="w-6 h-6 text-white" />
                </div>
              </motion.button>
            </div>

            {/* Notes List */}
            <div className="px-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground">
                  Your Notes
                </h2>
                <span className="text-sm text-muted-foreground">
                  {notes.length} notes
                </span>
              </div>

              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <NoteCardSkeleton key={i} />
                  ))}
                </div>
              ) : notes.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <div className="w-16 h-16 bg-accent-sage rounded-2xl flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-foreground font-semibold">No notes yet</p>
                  <p className="text-muted-foreground text-sm mt-1">
                    Upload your first note to get started
                  </p>
                </motion.div>
              ) : (
                <AnimatePresence>
                  <div className="space-y-3">
                    {notes.map((note, i) => {
                      const config = typeConfig[note.type] || typeConfig.text;
                      const Icon = config.icon;
                      const isProcessing =
                        note.processingStatus === "pending" ||
                        note.processingStatus === "processing";
                      const isExplained =
                        note.explanations &&
                        Object.values(note.explanations).some(
                          (v) => v?.length > 0,
                        );

                      return (
                        <motion.div
                          key={note._id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{
                            opacity: 0,
                            x: -30,
                            transition: { duration: 0.2 },
                          }}
                          transition={{ duration: 0.3, delay: i * 0.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate(`/notes/${note._id}/mode`)}
                          className="bg-card rounded-2xl p-4 flex items-center gap-4 card-shadow cursor-pointer"
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
                              {isProcessing && (
                                <>
                                  <span className="text-muted-foreground">
                                    ·
                                  </span>
                                  <ProcessingBadge />
                                </>
                              )}
                              {!isProcessing && isExplained && (
                                <>
                                  <span className="text-muted-foreground">
                                    ·
                                  </span>
                                  <span className="text-xs text-primary font-medium">
                                    Ready
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => handleDelete(e, note._id)}
                            onPointerDown={(e) => e.stopPropagation()}
                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-muted flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                </AnimatePresence>
              )}
            </div>

            <Navbar />

            <style>{`
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
