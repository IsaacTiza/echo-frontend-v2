import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useAuthStore from "../store/authStore";
import PageTransition from "../components/pageTransition";
const features = [
  {
    emoji: "📄",
    title: "Any Format",
    desc: "PDF, DOCX, images or plain text",
    color: "var(--color-accent-sage)",
  },
  {
    emoji: "🧠",
    title: "AI Explanations",
    desc: "Complex notes made simple instantly",
    color: "var(--color-accent-lavender)",
  },
  {
    emoji: "⚡",
    title: "Flashcards & Quizzes",
    desc: "Generated fresh from your notes",
    color: "var(--color-accent-teal)",
  },
  {
    emoji: "🎯",
    title: "Targeted Review",
    desc: "AI explains what you got wrong",
    color: "var(--color-accent-green)",
  },
];

const Landing = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated]);

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`;
  };

  // const handleFacebookLogin = () => {
  //   window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/facebook`;
  // };

  return (
    <PageTransition>
      <div
        style={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          background: "var(--color-background)",
          fontFamily: "Onest Variable, sans-serif",
        }}
      >
        {/* Top Section */}
        <div
          style={{
            flex: 1,
            padding: "60px 24px 24px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "40px",
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                background: "linear-gradient(135deg, #F95E08, #FE8118)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
                boxShadow: "0 8px 24px rgba(249,94,8,0.3)",
              }}
            >
              <span style={{ color: "white", fontSize: 32, fontWeight: 800 }}>
                E
              </span>
            </div>
            <h1
              style={{
                fontSize: 40,
                fontWeight: 800,
                color: "var(--color-foreground)",
                margin: 0,
                letterSpacing: "-1px",
              }}
            >
              Echo
            </h1>
            <p
              style={{
                color: "var(--color-muted-foreground)",
                fontSize: 15,
                margin: "6px 0 0",
                textAlign: "center",
              }}
            >
              Understand more, forget less.
            </p>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 32,
            }}
          >
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                style={{
                  background: f.color,
                  borderRadius: 20,
                  padding: "20px 16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 28 }}>{f.emoji}</span>
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: 13,
                    color: "var(--color-foreground)",
                    margin: 0,
                  }}
                >
                  {f.title}
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--color-muted-foreground)",
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Tagline Banner */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              background: "var(--color-foreground)",
              borderRadius: 20,
              padding: "20px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                flexShrink: 0,
                background: "linear-gradient(135deg, #F95E08, #FE8118)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: 22 }}>🚀</span>
            </div>
            <div>
              <p
                style={{
                  color: "var(--color-background)",
                  fontWeight: 700,
                  fontSize: 15,
                  margin: 0,
                }}
              >
                Study smarter, not harder
              </p>
              <p
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: 12,
                  margin: "4px 0 0",
                }}
              >
                Upload a note and let Echo do the heavy lifting
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom Auth Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            padding: "0 24px 48px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <p
            style={{
              textAlign: "center",
              color: "var(--color-muted-foreground)",
              fontSize: 13,
              marginBottom: 4,
              fontWeight: 500,
            }}
          >
            Get started for free
          </p>

          {/* Google Button — brand color, never changes */}
          <button
            onClick={handleGoogleLogin}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              padding: "16px",
              borderRadius: 16,
              background: "#1C1B19",
              border: "none",
              cursor: "pointer",
              transition: "transform 0.1s",
            }}
            onTouchStart={(e) =>
              (e.currentTarget.style.transform = "scale(0.97)")
            }
            onTouchEnd={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = "scale(0.97)")
            }
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span style={{ color: "white", fontWeight: 700, fontSize: 15 }}>
              Continue with Google
            </span>
          </button>

          {/* Facebook Button — brand color, never changes
        <button
          onClick={handleFacebookLogin}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            padding: "16px",
            borderRadius: 16,
            background: "#1877F2",
            border: "none",
            cursor: "pointer",
            transition: "transform 0.1s",
          }}
          onTouchStart={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
          onTouchEnd={(e) => (e.currentTarget.style.transform = "scale(1)")}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span style={{ color: "white", fontWeight: 700, fontSize: 15 }}>
            Continue with Facebook
          </span>
        </button> */}

          <p
            style={{
              textAlign: "center",
              color: "var(--color-muted-foreground)",
              fontSize: 11,
              margin: "4px 0 0",
            }}
          >
            By continuing you agree to our Terms of Service and Privacy Policy
          </p>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Landing;
