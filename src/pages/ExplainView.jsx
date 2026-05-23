import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";
import useNoteStore from "../store/noteStore";
import toast from "react-hot-toast";
import useSettingsStore, { fontSizeMap } from "../store/settingsStore";

const tones = [
  { value: "simple", label: "Simple" },
  { value: "detailed", label: "Detailed" },
  { value: "eli5", label: "ELI5" },
  { value: "academic", label: "Academic" },
  { value: "bullet", label: "Bullets" },
];

// Skeleton loader component
const SkeletonBlock = ({ width = "100%", height = 16, style = {} }) => (
  <div
    style={{
      width,
      height,
      borderRadius: 8,
      background: "var(--color-muted)",
      position: "relative",
      overflow: "hidden",
      ...style,
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)",
        animation: "shimmer 1.5s infinite",
      }}
    />
  </div>
);

const ExplanationSkeleton = () => (
  <div
    style={{
      background: "var(--color-muted)",
      borderRadius: 20,
      padding: 20,
      display: "flex",
      flexDirection: "column",
      gap: 12,
    }}
  >
    {/* Header */}
    <div
      style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          background: "linear-gradient(135deg, #F95E08, #FE8118)",
          opacity: 0.4,
        }}
      />
      <SkeletonBlock width={140} height={14} />
    </div>

    {/* Processing message */}
    <div
      style={{
        padding: "12px 16px",
        borderRadius: 12,
        background: "rgba(249, 94, 8, 0.08)",
        border: "1px solid rgba(249, 94, 8, 0.2)",
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 4,
      }}
    >
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          border: "2px solid #F95E08",
          borderTop: "2px solid transparent",
          animation: "spin 1s linear infinite",
          flexShrink: 0,
        }}
      />
      <p style={{ fontSize: 13, color: "#F95E08", fontWeight: 600, margin: 0 }}>
        Echo is preparing your explanation...
      </p>
    </div>

    {/* Skeleton lines */}
    <SkeletonBlock height={14} />
    <SkeletonBlock height={14} width="90%" />
    <SkeletonBlock height={14} width="95%" />
    <SkeletonBlock height={14} width="80%" />
    <div style={{ marginTop: 8 }} />
    <SkeletonBlock height={14} />
    <SkeletonBlock height={14} width="85%" />
    <SkeletonBlock height={14} width="92%" />
    <div style={{ marginTop: 8 }} />
    <SkeletonBlock height={14} width="70%" />
    <SkeletonBlock height={14} />
    <SkeletonBlock height={14} width="88%" />
  </div>
);

const ExplainView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentNote,
    fetchNote,
    fetchExplanation,
    pollProcessingStatus,
    processingStatus,
  } = useNoteStore();

  const [explanation, setExplanation] = useState("");
  const [tone, setTone] = useState("simple");
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [isNoteLoading, setIsNoteLoading] = useState(true);
  const { fontSize, setFontSize } = useSettingsStore();

useEffect(() => {
  let cleanup;

  const load = async () => {
    try {
      const note = await fetchNote(id);
      if (!note) return;

      if (
        note.processingStatus === "pending" ||
        note.processingStatus === "processing"
      ) {
        cleanup = pollProcessingStatus(id, async (status) => {
          if (status === "complete" || status === "failed") {
            await loadExplanation("simple");
          }
          setIsNoteLoading(false);
        });
      } else {
        await loadExplanation("simple");
        setIsNoteLoading(false);
      }
    } catch {
      toast.error("Failed to load note");
      setIsNoteLoading(false);
    }
  };

  load();

  return () => {
    if (cleanup) cleanup();
  };
}, [id]);

  const loadExplanation = async (selectedTone) => {
    setIsLoadingExplanation(true);
    setExplanation("");
    try {
      const result = await fetchExplanation(id, selectedTone);
      setExplanation(result);
    } catch (error) {
      const status = error.response?.status;
      const msg = error.response?.data?.message;

      if (msg?.includes("Daily limit")) {
        toast.error("Daily AI limit reached. Come back tomorrow.", {
          duration: 5000,
          icon: "🔒",
        });
      } else if (status === 429) {
        toast.error("AI is busy right now. Please wait a moment.", {
          duration: 5000,
          icon: "⏳",
        });
      } else {
        toast.error("Could not load explanation. Please try again.");
      }
    } finally {
      setIsLoadingExplanation(false);
    }
  };

  const handleToneChange = (newTone) => {
    if (isLoadingExplanation || isNoteLoading) return;
    setTone(newTone);
    loadExplanation(newTone);
  };

  const isProcessing =
    processingStatus === "pending" || processingStatus === "processing";

  const showSkeleton = isNoteLoading || isProcessing || isLoadingExplanation;

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--color-background)",
        fontFamily: "Onest Variable, sans-serif",
        paddingBottom: 40,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "56px 24px 16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: "var(--color-muted)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ArrowLeft size={20} color="var(--color-foreground)" />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontSize: 11,
              color: "var(--color-muted-foreground)",
              margin: 0,
            }}
          >
            Understand
          </p>
          {isNoteLoading ? (
            <SkeletonBlock width={160} height={16} style={{ marginTop: 4 }} />
          ) : (
            <h1
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: "var(--color-foreground)",
                margin: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {currentNote?.title}
            </h1>
          )}
        </div>
      </div>

      {/* Tone Selector */}
      <div
        style={{
          padding: "0 24px 20px",
          display: "flex",
          gap: 8,
          overflowX: "auto",
        }}
      >
        {tones.map((t) => (
          <button
            key={t.value}
            onClick={() => handleToneChange(t.value)}
            disabled={showSkeleton}
            style={{
              flexShrink: 0,
              padding: "8px 16px",
              borderRadius: 999,
              border: "none",
              cursor: showSkeleton ? "not-allowed" : "pointer",
              fontWeight: 600,
              fontSize: 13,
              opacity: showSkeleton && tone !== t.value ? 0.5 : 1,
              background:
                tone === t.value
                  ? "linear-gradient(135deg, #F95E08, #FE8118)"
                  : "var(--color-muted)",
              color:
                tone === t.value ? "white" : "var(--color-muted-foreground)",
              transition: "all 0.2s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      {/* Font size control */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 6,
          marginBottom: 12,
          marginRight: 26,
        }}
      >
        {Object.entries(fontSizeMap).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setFontSize(key)}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontWeight: 800,
              fontSize: val.size - 6,
              background:
                fontSize === key
                  ? "linear-gradient(135deg, #F95E08, #FE8118)"
                  : "var(--color-muted)",
              color:
                fontSize === key ? "white" : "var(--color-muted-foreground)",
            }}
          >
            A
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "0 24px" }}>
        <AnimatePresence mode="wait">
          {showSkeleton ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ExplanationSkeleton />
            </motion.div>
          ) : explanation ? (
            <motion.div
              key="explanation"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div
                style={{
                  background: "var(--color-muted)",
                  borderRadius: 20,
                  padding: 20,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      background: "linear-gradient(135deg, #F95E08, #FE8118)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <BookOpen size={16} color="white" />
                  </div>
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: fontSizeMap[fontSize].size,
                      color: "var(--color-foreground)",
                    }}
                  >
                    Echo's Explanation
                  </span>
                </div>
                <div
                  style={{
                    fontSize: fontSizeMap[fontSize].size,
                    color: "var(--color-foreground)",
                    lineHeight: 1.7,
                  }}
                >
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => (
                        <h1
                          style={{
                            fontSize: fontSizeMap[fontSize].size,
                            fontWeight: 800,
                            color: "var(--color-foreground)",
                            margin: "16px 0 8px",
                          }}
                        >
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2
                          style={{
                            fontSize: fontSizeMap[fontSize].size,
                            fontWeight: 700,
                            color: "var(--color-foreground)",
                            margin: "14px 0 6px",
                          }}
                        >
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3
                          style={{
                            fontSize: fontSizeMap[fontSize].size,
                            fontWeight: 700,
                            color: "#F95E08",
                            margin: "12px 0 6px",
                          }}
                        >
                          {children}
                        </h3>
                      ),
                      p: ({ children }) => (
                        <p
                          style={{
                            margin: "8px 0",
                            lineHeight: 1.7,
                            color: "var(--color-foreground)",
                            fontSize: fontSizeMap[fontSize].size,
                          }}
                        >
                          {children}
                        </p>
                      ),
                      strong: ({ children }) => (
                        <strong
                          style={{
                            fontWeight: 700,
                            color: "var(--color-foreground)",
                          }}
                        >
                          {children}
                        </strong>
                      ),
                      ul: ({ children }) => (
                        <ul style={{ margin: "8px 0", paddingLeft: 20 }}>
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol style={{ margin: "8px 0", paddingLeft: 20 }}>
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li
                          style={{
                            margin: "4px 0",
                            color: "var(--color-foreground)",
                            lineHeight: 1.6,
                          }}
                        >
                          {children}
                        </li>
                      ),
                      hr: () => (
                        <hr
                          style={{
                            border: "none",
                            borderTop: "1px solid var(--color-border)",
                            margin: "16px 0",
                          }}
                        />
                      ),
                      blockquote: ({ children }) => (
                        <blockquote
                          style={{
                            borderLeft: "3px solid #F95E08",
                            paddingLeft: 12,
                            margin: "12px 0",
                            color: "var(--color-muted-foreground)",
                          }}
                        >
                          {children}
                        </blockquote>
                      ),
                    }}
                  >
                    {explanation}
                  </ReactMarkdown>
                </div>
              </div>

              <button
                onClick={() => navigate(`/notes/${id}/study`)}
                style={{
                  width: "100%",
                  marginTop: 16,
                  background: "var(--color-foreground)",
                  padding: "16px",
                  borderRadius: 16,
                  border: "none",
                  cursor: "pointer",
                  color: "var(--color-background)",
                  fontWeight: 700,
                  fontSize: 15,
                }}
              >
                Test Yourself →
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default ExplainView;
