import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import PageTransition from "../components/pageTransition";
import api from "../lib/api";
import toast from "react-hot-toast";

const MarkdownContent = ({ content }) => (
  <ReactMarkdown
    components={{
      h1: ({ children }) => (
        <h1 className="text-lg font-extrabold text-foreground mt-3 mb-1">
          {children}
        </h1>
      ),
      h2: ({ children }) => (
        <h2 className="text-base font-bold text-foreground mt-2 mb-1">
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className="text-sm font-bold text-primary mt-2 mb-1">{children}</h3>
      ),
      p: ({ children }) => (
        <p className="text-sm text-foreground leading-relaxed my-1">
          {children}
        </p>
      ),
      strong: ({ children }) => (
        <strong className="font-bold text-foreground">{children}</strong>
      ),
      ul: ({ children }) => <ul className="my-1 pl-4 list-disc">{children}</ul>,
      ol: ({ children }) => (
        <ol className="my-1 pl-4 list-decimal">{children}</ol>
      ),
      li: ({ children }) => (
        <li className="text-sm text-foreground leading-relaxed my-0.5">
          {children}
        </li>
      ),
      hr: () => <hr className="border-border my-3" />,
    }}
  >
    {content}
  </ReactMarkdown>
);

const Results = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { answers = [] } = state || {};

  const [failedExplanation, setFailedExplanation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const correct = answers.filter((a) => a.isCorrect).length;
  const total = answers.length;
  const score = total > 0 ? Math.round((correct / total) * 100) : 0;
  const failed = answers.filter((a) => !a.isCorrect);
  const passed = failed.length === 0;

  useEffect(() => {
    if (!passed && failed.length > 0) fetchFailedExplanation();
  }, []);

  const fetchFailedExplanation = async () => {
    setIsLoading(true);
    try {
      const failedTopics = failed.map((a) => a.question);
      const res = await api.post(`/ai/explain-failed/${id}`, { failedTopics });
      setFailedExplanation(res.data.explanation);
    } catch (error) {
      const msg = error.response?.data?.message;
      const status = error.response?.status;

      if (msg?.includes("Daily limit")) {
        toast.error("Daily AI limit reached. Review explanation unavailable.", {
          duration: 5000,
          icon: "🔒",
        });
      } else if (status === 429) {
        toast.error("AI is busy. Review explanation unavailable this time.", {
          duration: 4000,
          icon: "⏳",
        });
      } else {
        toast.error("Could not load review. Try again later.", {
          duration: 4000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreMessage = () => {
    if (score === 100) return "Perfect score! 🎉";
    if (score >= 80) return "Great job! 🔥";
    if (score >= 50) return "Good effort! 💪";
    return "Keep studying! 📚";
  };

  return (
    <PageTransition>
      <div className="min-h-dvh bg-background pb-10">
        {/* Header */}
        <div className="px-6 pt-14 pb-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Quiz Results</h1>
        </div>

        <div className="px-6">
          {/* Score Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="gradient-primary rounded-3xl p-8 flex flex-col items-center text-center mb-5"
          >
            <p className="text-white/80 text-sm mb-1">Your Score</p>
            <p className="text-7xl font-extrabold text-white leading-none">
              {score}%
            </p>
            <p className="text-white font-semibold text-lg mt-2">
              {getScoreMessage()}
            </p>
            <div className="flex gap-8 mt-5">
              {[
                { label: "Correct", value: correct },
                { label: "Wrong", value: failed.length },
                { label: "Total", value: total },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-white text-2xl font-extrabold">
                    {s.value}
                  </p>
                  <p className="text-white/70 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Passed */}
          {passed && (
            <div className="bg-accent-sage rounded-2xl p-5 text-center mb-5">
              <p className="text-2xl mb-2">🎯</p>
              <p className="font-bold text-foreground">
                You passed everything!
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                Try again for different questions.
              </p>
            </div>
          )}

          {/* Failed Explanation */}
          {!passed && (
            <div className="mb-5">
              <h2 className="text-base font-bold text-foreground mb-3">
                Areas to Review
              </h2>
              {isLoading ? (
                <div className="bg-muted rounded-2xl p-8 flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
                  <p className="text-muted-foreground text-sm">
                    Echo is reviewing your mistakes...
                  </p>
                </div>
              ) : failedExplanation ? (
                <div className="bg-muted rounded-2xl p-5">
                  <MarkdownContent content={failedExplanation} />
                </div>
              ) : null}
            </div>
          )}

          {/* Answer Breakdown */}
          <div className="mb-5">
            <h2 className="text-base font-bold text-foreground mb-3">
              Answer Breakdown
            </h2>
            <div className="space-y-3">
              {answers.map((answer, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-muted rounded-2xl p-4 flex items-start gap-3"
                >
                  {answer.isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground leading-snug">
                      {answer.question}
                    </p>
                    {!answer.isCorrect && (
                      <p className="text-xs text-success mt-1 font-semibold">
                        ✓ {answer.correct}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => navigate(`/notes/${id}/study`)}
              className="w-full gradient-primary py-4 rounded-2xl text-white font-bold active:scale-95 transition-transform"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-muted py-4 rounded-2xl text-foreground font-bold active:scale-95 transition-transform"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Results;
