import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RotateCcw } from "lucide-react";
import useNoteStore from "../store/noteStore";
import api from "../lib/api";
import toast from "react-hot-toast";

// Skeleton block
const SkeletonBlock = ({ width = "100%", height = 16, style = {} }) => (
  <div
    style={{
      width, height, borderRadius: 8,
      background: "var(--color-muted)",
      position: "relative", overflow: "hidden", ...style,
    }}
  >
    <div style={{
      position: "absolute", inset: 0,
      background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)",
      animation: "shimmer 1.5s infinite",
    }} />
  </div>
);

const ContentSkeleton = ({ type }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
    <div style={{
      padding: "12px 16px", borderRadius: 12,
      background: "rgba(249, 94, 8, 0.08)",
      border: "1px solid rgba(249, 94, 8, 0.2)",
      display: "flex", alignItems: "center", gap: 10, marginBottom: 4,
    }}>
      <div style={{
        width: 16, height: 16, borderRadius: "50%",
        border: "2px solid #F95E08", borderTop: "2px solid transparent",
        animation: "spin 1s linear infinite", flexShrink: 0,
      }} />
      <p style={{ fontSize: 13, color: "#F95E08", fontWeight: 600, margin: 0 }}>
        {type === "flashcards" ? "Loading your flashcards..." : "Building your quiz..."}
      </p>
    </div>
    <SkeletonBlock height={120} style={{ borderRadius: 20 }} />
    <SkeletonBlock height={48} style={{ borderRadius: 16 }} />
    <SkeletonBlock height={48} style={{ borderRadius: 16 }} />
    {type === "quiz" && <>
      <SkeletonBlock height={48} style={{ borderRadius: 16 }} />
      <SkeletonBlock height={48} style={{ borderRadius: 16 }} />
    </>}
  </div>
);

const StudySession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentNote, fetchNote, processingStatus, pollProcessingStatus } = useNoteStore();

  const [mode, setMode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [flashcards, setFlashcards] = useState([]);
  const [quiz, setQuiz] = useState([]);
  const [flipped, setFlipped] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [direction, setDirection] = useState(1);
  const [questionCount, setQuestionCount] = useState(12);
  const [isNoteReady, setIsNoteReady] = useState(false);

useEffect(() => {
  let cleanup;

  const load = async () => {
    const note = await fetchNote(id);
    if (!note) return;

    if (
      note.processingStatus === "pending" ||
      note.processingStatus === "processing"
    ) {
      cleanup = pollProcessingStatus(id, () => setIsNoteReady(true));
    } else {
      setIsNoteReady(true);
    }
  };

  load();

  return () => {
    if (cleanup) cleanup();
  };
}, [id]);

  const handleModeSelect = async (selectedMode) => {
    setMode(selectedMode);
    setIsLoading(true);
    try {
      if (selectedMode === "flashcards") {
        const res = await api.post(`/ai/flashcards/${id}`);
        setFlashcards(res.data.flashcards);
      } else {
        const res = await api.post(`/ai/quiz/${id}`, { count: questionCount });
        setQuiz(res.data.quiz);
      }
    } catch (error) {
      const msg = error.response?.data?.message;
      const status = error.response?.status;

      if (msg?.includes("Daily limit")) {
        toast.error("Daily AI limit reached. Come back tomorrow.", { duration: 5000, icon: "🔒" });
      } else if (status === 429) {
        toast.error("AI is busy right now. Wait a moment and try again.", { duration: 5000, icon: "⏳" });
      } else {
        toast.error("Failed to load content. Please try again.", { duration: 4000 });
      }
      setMode(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextCard = () => {
    if (cardIndex < flashcards.length - 1) {
      setDirection(1);
      setFlipped(false);
      setTimeout(() => setCardIndex(cardIndex + 1), 150);
    }
  };

  const handlePrevCard = () => {
    if (cardIndex > 0) {
      setDirection(-1);
      setFlipped(false);
      setTimeout(() => setCardIndex(cardIndex - 1), 150);
    }
  };

  const handleAnswer = (option) => {
    if (selected) return;
    setSelected(option);
    const current = quiz[quizIndex];
    setAnswers([...answers, {
      question: current.question,
      selected: option,
      correct: current.answer,
      isCorrect: option === current.answer,
      explanation: current.explanation,
    }]);
  };

  const handleNextQuestion = () => {
    if (quizIndex < quiz.length - 1) {
      setQuizIndex(quizIndex + 1);
      setSelected(null);
    } else {
      navigate(`/notes/${id}/results`, {
        state: { answers: [...answers], noteId: id },
      });
    }
  };

  // Mode Selection
  if (!mode) {
    const isProcessing = processingStatus === "pending" || processingStatus === "processing";

    return (
      <div className="min-h-dvh bg-background px-6 pt-14 pb-10">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">Study Mode</p>
            <h1 className="text-lg font-bold text-foreground truncate">
              {currentNote?.title}
            </h1>
          </div>
        </div>

        {isProcessing && (
          <div style={{
            padding: "12px 16px", borderRadius: 12, marginBottom: 20,
            background: "rgba(249, 94, 8, 0.08)",
            border: "1px solid rgba(249, 94, 8, 0.2)",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <div style={{
              width: 14, height: 14, borderRadius: "50%",
              border: "2px solid #F95E08", borderTop: "2px solid transparent",
              animation: "spin 1s linear infinite", flexShrink: 0,
            }} />
            <p style={{ fontSize: 13, color: "#F95E08", fontWeight: 600, margin: 0 }}>
              Echo is preparing your content...
            </p>
          </div>
        )}

        <h2 className="text-2xl font-bold text-foreground mb-2">
          Pick a study method
        </h2>
        <p className="text-muted-foreground text-sm mb-8">
          Flashcards and quizzes are ready instantly after your note is processed.
        </p>

        <div className="space-y-4">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => handleModeSelect("flashcards")}
            disabled={isProcessing}
            className="w-full text-left bg-accent-sage rounded-2xl p-6 disabled:opacity-50"
          >
            <p className="text-3xl mb-3">🃏</p>
            <h3 className="text-xl font-bold text-foreground mb-1">Flashcards</h3>
            <p className="text-muted-foreground text-sm">
              Flip through key terms and definitions. Great for memorization.
            </p>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setMode("quiz-setup")}
            disabled={isProcessing}
            className="w-full text-left bg-accent-lavender rounded-2xl p-6 disabled:opacity-50"
          >
            <p className="text-3xl mb-3">📝</p>
            <h3 className="text-xl font-bold text-foreground mb-1">MCQ Quiz</h3>
            <p className="text-muted-foreground text-sm">
              Multiple choice questions to test your understanding.
            </p>
          </motion.button>
        </div>

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        `}</style>
      </div>
    );
  }

  // Quiz Setup
  if (mode === "quiz-setup") {
    return (
      <div className="min-h-dvh bg-background px-6 pt-14 pb-10">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setMode(null)}
            className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Quiz Setup</h1>
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-2">How many questions?</h2>
        <p className="text-muted-foreground text-sm mb-8">Choose how long your quiz should be.</p>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {[5, 10, 12, 15, 20, 25].map((num) => (
            <button
              key={num}
              onClick={() => setQuestionCount(num)}
              className={`py-5 rounded-2xl font-bold text-xl transition-all active:scale-95 ${
                questionCount === num ? "gradient-primary text-white" : "bg-muted text-foreground"
              }`}
            >
              {num}
              <p className="text-xs font-medium mt-1 opacity-80">questions</p>
            </button>
          ))}
        </div>

        <button
          onClick={() => handleModeSelect("quiz")}
          className="w-full gradient-primary py-4 rounded-2xl text-white font-bold active:scale-95 transition-transform"
        >
          Start Quiz →
        </button>
      </div>
    );
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-dvh bg-background px-6 pt-14 pb-10">
        <div className="flex items-center gap-4 mb-8">
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--color-muted)" }} />
          <SkeletonBlock width={160} height={18} />
        </div>
        <ContentSkeleton type={mode} />
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        `}</style>
      </div>
    );
  }

  // Flashcard Mode
  if (mode === "flashcards" && flashcards.length > 0) {
    const card = flashcards[cardIndex];
    return (
      <div className="min-h-dvh bg-muted px-6 pt-14 pb-10">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => { setMode(null); setCardIndex(0); setFlipped(false); }}
            className="w-10 h-10 rounded-xl bg-card flex items-center justify-center active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Flashcards</p>
            <p className="text-sm font-bold text-foreground">{cardIndex + 1} of {flashcards.length}</p>
          </div>
          <button
            onClick={() => { setCardIndex(0); setFlipped(false); }}
            className="w-10 h-10 rounded-xl bg-card flex items-center justify-center"
          >
            <RotateCcw className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="w-full h-1.5 bg-card rounded-full mb-8">
          <motion.div
            className="h-full gradient-primary rounded-full"
            animate={{ width: `${((cardIndex + 1) / flashcards.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <motion.div
          key={cardIndex}
          initial={{ opacity: 0, x: direction * 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setFlipped(!flipped)}
          className="w-full min-h-64 bg-card rounded-3xl p-8 flex flex-col items-center justify-center text-center card-shadow cursor-pointer active:scale-95 transition-transform"
        >
          <AnimatePresence mode="wait">
            {!flipped ? (
              <motion.div key="term" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Term</p>
                <p className="text-2xl font-bold text-foreground">{card.term}</p>
                <p className="text-xs text-muted-foreground mt-6">Tap to reveal definition</p>
              </motion.div>
            ) : (
              <motion.div key="definition" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <p className="text-xs text-primary uppercase tracking-wider mb-4 font-semibold">Definition</p>
                <p className="text-base text-foreground leading-relaxed">{card.definition}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="flex gap-3 mt-6">
          <button onClick={handlePrevCard} disabled={cardIndex === 0} className="flex-1 py-4 rounded-2xl bg-card text-foreground font-semibold disabled:opacity-40 active:scale-95 transition-transform">← Previous</button>
          <button onClick={handleNextCard} disabled={cardIndex === flashcards.length - 1} className="flex-1 py-4 rounded-2xl gradient-primary text-white font-semibold disabled:opacity-40 active:scale-95 transition-transform">Next →</button>
        </div>
      </div>
    );
  }

  // Quiz Mode
  if (mode === "quiz" && quiz.length > 0) {
    const current = quiz[quizIndex];
    return (
      <div className="min-h-dvh bg-background px-6 pt-14 pb-10">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => { setMode(null); setQuizIndex(0); setSelected(null); setAnswers([]); }}
            className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Quiz</p>
            <p className="text-sm font-bold text-foreground">Question {quizIndex + 1} of {quiz.length}</p>
          </div>
        </div>

        <div className="w-full h-1.5 bg-muted rounded-full mb-8">
          <motion.div
            className="h-full gradient-primary rounded-full"
            animate={{ width: `${((quizIndex + 1) / quiz.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <motion.div key={quizIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="bg-muted rounded-2xl p-5 mb-6">
            <p className="text-base font-semibold text-foreground leading-relaxed">{current.question}</p>
          </div>

          <div className="space-y-3">
            {current.options.map((option) => {
              const isSelected = selected === option;
              const isCorrect = option === current.answer;
              const showResult = !!selected;

              let className = "w-full text-left px-5 py-4 rounded-2xl font-medium text-sm transition-colors bg-muted text-foreground";
              if (showResult && isCorrect) className = "w-full text-left px-5 py-4 rounded-2xl font-medium text-sm bg-success text-white";
              else if (showResult && isSelected && !isCorrect) className = "w-full text-left px-5 py-4 rounded-2xl font-medium text-sm bg-destructive text-white";

              return (
                <motion.button key={option} whileTap={{ scale: selected ? 1 : 0.97 }} onClick={() => handleAnswer(option)} className={className}>
                  {option}
                </motion.button>
              );
            })}
          </div>

          {selected && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 bg-muted rounded-2xl p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-1">Explanation</p>
              <p className="text-sm text-foreground leading-relaxed">{current.explanation}</p>
            </motion.div>
          )}

          {selected && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleNextQuestion}
              className="w-full mt-4 gradient-primary py-4 rounded-2xl text-white font-bold active:scale-95 transition-transform"
            >
              {quizIndex < quiz.length - 1 ? "Next Question →" : "See Results →"}
            </motion.button>
          )}
        </motion.div>
      </div>
    );
  }

  return null;
};

export default StudySession;