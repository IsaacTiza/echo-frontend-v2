import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Brain, Zap, Download, FileText } from "lucide-react";
import useNoteStore from "../store/noteStore";
import api from "../lib/api";
import toast from "react-hot-toast";
import PageTransition from "../components/pageTransition";

const ModeSelect = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentNote, fetchNote, isLoading } = useNoteStore();
  const [downloading, setDownloading] = useState(false);
  const [downloadingExplanation, setDownloadingExplanation] = useState(false);

  useEffect(() => {
    fetchNote(id);
  }, [id]);

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

  const handleDownloadExplanation = () => {
    if (!currentNote?.explanation) {
      toast.error("No explanation yet. Go to Understand mode first.");
      return;
    }

    setDownloadingExplanation(true);
    try {
      const content = `${currentNote.title}\n${"=".repeat(currentNote.title.length)}\n\n${currentNote.explanation}`;
      const blob = new Blob([content], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${currentNote.title} - Explanation.txt`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Explanation downloaded");
    } catch {
      toast.error("Failed to download explanation");
    } finally {
      setDownloadingExplanation(false);
    }
  };

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
                {["Flashcards", "MCQ Quiz", "12 Questions"].map((t) => (
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
                  onClick={handleDownloadExplanation}
                  disabled={downloadingExplanation || !currentNote?.explanation}
                  className="w-full flex items-center gap-3 bg-card rounded-xl p-4 active:scale-95 transition-transform disabled:opacity-60"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${currentNote?.explanation ? "gradient-primary" : "bg-muted"}`}
                  >
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-foreground">
                      {downloadingExplanation
                        ? "Downloading..."
                        : "Download AI Explanation"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {currentNote?.explanation
                        ? "Explanation ready"
                        : "Generate explanation first"}
                    </p>
                  </div>
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default ModeSelect;
