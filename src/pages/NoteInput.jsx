import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, FileText, X, File, Image } from "lucide-react";
import useNoteStore from "../store/noteStore";
import PageTransition from "../components/pageTransition";
import toast from "react-hot-toast";

const tones = [
  { value: "simple", label: "Simple", desc: "Easy to understand" },
  { value: "detailed", label: "Detailed", desc: "In-depth explanation" },
  { value: "eli5", label: "ELI5", desc: "Like I'm 5 years old" },
  { value: "academic", label: "Academic", desc: "Formal and structured" },
  { value: "bullet", label: "Bullets", desc: "Key points only" },
];

const acceptedTypes = ".pdf,.docx,.txt,.jpg,.jpeg,.png,.webp";

const getFileIcon = (file) => {
  if (!file) return null;
  if (file.type.includes("image")) return Image;
  if (file.type.includes("pdf")) return File;
  return FileText;
};

const NoteInput = () => {
  const navigate = useNavigate();
  const { createNote, isLoading } = useNoteStore();
  const fileRef = useRef(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tone, setTone] = useState("simple");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [file, setFile] = useState(null);
  const [inputType, setInputType] = useState("text");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (selected.size > 10 * 1024 * 1024) {
      toast.error("File too large. Maximum size is 10MB", {
        duration: 4000,
        icon: "⚠️",
      });
      e.target.value = "";
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(selected.type)) {
      toast.error("File type not supported. Use PDF, DOCX, TXT, JPG or PNG", {
        duration: 4000,
        icon: "⚠️",
      });
      e.target.value = "";
      return;
    }

    setFile(selected);
    setInputType("file");
    setContent("");
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      if (tags.length >= 5) {
        toast.error("Maximum 5 tags allowed");
        return;
      }
      setTags([...tags, tagInput.trim().toLowerCase()]);
      setTagInput("");
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Please add a title");
      return;
    }

    if (!file && !content.trim()) {
      toast.error("Please add content or upload a file");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("tone", tone);
      formData.append("tags", JSON.stringify(tags));

      if (file) {
        formData.append("file", file);
      } else {
        formData.append("content", content);
      }

      const note = await createNote(formData);
      toast.success("Note created!");
      navigate(`/notes/${note._id}/mode`);
    } catch {
      toast.error("Failed to create note");
    }
  };

  const FileIcon = getFileIcon(file);

  return (
    <PageTransition>
      <div className="min-h-dvh bg-background pb-10">
        {/* Header */}
        <div className="px-6 pt-14 pb-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-xl font-bold text-foreground">New Note</h1>
        </div>

        <div className="px-6 space-y-6">
          {/* Title */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Cell Biology - Chapter 3"
              className="w-full px-4 py-4 rounded-2xl bg-muted text-foreground placeholder:text-muted-foreground text-base outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>

          {/* Input Type Toggle */}
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <button
              onClick={() => {
                setInputType("text");
                setFile(null);
              }}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 14,
                background:
                  inputType === "text"
                    ? "linear-gradient(135deg, #F95E08, #FE8118)"
                    : "var(--color-muted)",
                color:
                  inputType === "text"
                    ? "white"
                    : "var(--color-muted-foreground)",
                boxShadow:
                  inputType === "text"
                    ? "0 4px 12px rgba(249,94,8,0.3)"
                    : "none",
              }}
            >
              ✏️ Type Text
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 14,
                background:
                  inputType === "file"
                    ? "linear-gradient(135deg, #F95E08, #FE8118)"
                    : "var(--color-muted)",
                color:
                  inputType === "file"
                    ? "white"
                    : "var(--color-muted-foreground)",
                boxShadow:
                  inputType === "file"
                    ? "0 4px 12px rgba(249,94,8,0.3)"
                    : "none",
              }}
            >
              📎 Upload File
            </button>
          </div>

          {/* Content Input */}
          <div>
            {inputType === "text" ? (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste or type your notes here..."
                rows={6}
                className="w-full px-4 py-4 rounded-2xl bg-muted text-foreground placeholder:text-muted-foreground text-base outline-none focus:ring-2 focus:ring-primary transition resize-none"
              />
            ) : file ? (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted">
                <div className="w-12 h-12 bg-accent-sage rounded-xl flex items-center justify-center flex-shrink-0">
                  {FileIcon && <FileIcon className="w-6 h-6 text-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => {
                    setFile(null);
                    setInputType("text");
                  }}
                  className="w-8 h-8 rounded-lg bg-card flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            ) : (
              <motion.div
                onClick={() => fileRef.current?.click()}
                whileTap={{ scale: 0.98 }}
                className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer"
              >
                <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
                  <Upload className="w-6 h-6 text-muted-foreground" />
                </div>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--color-foreground)",
                  }}
                >
                  Tap to upload
                </p>
                <p
                  style={{
                    fontSize: 11,
                    color: "var(--color-muted-foreground)",
                    textAlign: "center",
                    lineHeight: 1.5,
                  }}
                >
                  Supported formats:
                </p>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 6,
                    justifyContent: "center",
                    marginTop: 6,
                  }}
                >
                  {["PDF", "DOCX", "TXT", "JPG", "PNG"].map((fmt) => (
                    <span
                      key={fmt}
                      style={{
                        padding: "2px 10px",
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 600,
                        background: "var(--color-muted)",
                        color: "var(--color-muted-foreground)",
                      }}
                    >
                      {fmt}
                    </span>
                  ))}
                </div>
                <p
                  style={{
                    fontSize: 10,
                    color: "var(--color-muted-foreground)",
                    marginTop: 6,
                  }}
                >
                  Max file size: 10MB
                </p>
              </motion.div>
            )}

            <input
              ref={fileRef}
              type="file"
              accept={acceptedTypes}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Tone Selector */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">
              Explanation Tone
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {tones.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTone(t.value)}
                  className={`flex-shrink-0 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                    tone === t.value
                      ? "gradient-primary text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">
              Tags{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
              <span className="block text-xs text-muted-foreground font-normal mt-0.5">
                Tags help you organize notes by subject e.g. biology, math,
                history
              </span>
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Type a tag and press Enter"
              className="w-full px-4 py-4 rounded-2xl bg-muted text-foreground placeholder:text-muted-foreground text-base outline-none focus:ring-2 focus:ring-primary transition"
            />
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-accent-sage text-sm font-medium text-foreground"
                  >
                    #{tag}
                    <button onClick={() => removeTag(i)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full gradient-primary py-4 rounded-2xl text-white font-bold text-base active:scale-95 transition-transform disabled:opacity-60"
          >
            {isLoading ? "Creating Note..." : "Create Note"}
          </button>
        </div>
      </div>
    </PageTransition>
  );
};

export default NoteInput;
