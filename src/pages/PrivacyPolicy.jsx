import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";
import PageTransition from "../components/pageTransition";

const sections = [
  {
    title: "Information We Collect",
    body: `When you sign in to Echo, we collect your name, email address, and profile picture from your Google account via OAuth. We do not collect passwords or payment information. When you upload notes, we store the content and any files you provide in order to generate AI-powered study material.`,
  },
  {
    title: "How We Use Your Information",
    body: `Your information is used solely to provide Echo's core features: generating explanations, flashcards, and quizzes from your uploaded notes. We use your email to identify your account and track daily AI credit usage. We do not sell, rent, or share your personal data with third parties for marketing purposes.`,
  },
  {
    title: "AI Processing",
    body: `Echo uses Google Gemini to process your note content and generate study material. When you upload a note, its content is sent to Google's Gemini API for AI generation. This processing is governed by Google's data usage policies. We do not use your note content to train any models.`,
  },
  {
    title: "Third-Party Services",
    body: `Echo relies on the following third-party services to operate:\n\n• Google OAuth — for secure sign-in\n• Google Gemini — for AI content generation\n• Cloudinary — for file storage and delivery\n• MongoDB Atlas — for database storage\n\nEach service operates under its own privacy policy. We encourage you to review them.`,
  },
  {
    title: "Data Storage & Retention",
    body: `Your notes and generated content are stored securely in our database. You can delete any note at any time from your dashboard, which permanently removes it and all associated AI-generated content. If you wish to delete your account entirely, contact us and we will remove all your data within 7 days.`,
  },
  {
    title: "Cookies & Local Storage",
    body: `Echo uses your browser's local storage to keep you signed in via a secure token. We do not use advertising cookies or tracking cookies of any kind. No third-party trackers are embedded in the app.`,
  },
  {
    title: "Children's Privacy",
    body: `Echo is intended for students and general users. We do not knowingly collect personal information from children under the age of 13. If you believe a child has provided us with personal data, please contact us and we will delete it promptly.`,
  },
  {
    title: "Changes to This Policy",
    body: `We may update this privacy policy from time to time. When we do, the updated version will be reflected in the app. Continued use of Echo after changes means you accept the revised policy.`,
  },
  {
    title: "Contact",
    body: `If you have any questions about this privacy policy or how your data is handled, please reach out to us. We are committed to being transparent and responsive about any privacy concerns.`,
  },
];

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div
        style={{
          minHeight: "100dvh",
          background: "var(--color-background)",
          fontFamily: "Onest Variable, sans-serif",
          paddingBottom: 48,
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
          <div>
            <p
              style={{
                fontSize: 11,
                color: "var(--color-muted-foreground)",
                margin: 0,
              }}
            >
              Legal
            </p>
            <h1
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "var(--color-foreground)",
                margin: 0,
              }}
            >
              Privacy Policy
            </h1>
          </div>
        </div>

        <div
          style={{
            padding: "0 24px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {/* Intro card */}
          <div
            style={{
              background: "var(--color-muted)",
              borderRadius: 20,
              padding: 20,
              display: "flex",
              gap: 14,
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "linear-gradient(135deg, #F95E08, #FE8118)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Shield size={18} color="white" />
            </div>
            <div>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--color-foreground)",
                  margin: "0 0 4px",
                }}
              >
                Your privacy matters
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--color-muted-foreground)",
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                Echo is built for students. We keep your data minimal, secure,
                and never sell it. Last updated: June 2025.
              </p>
            </div>
          </div>

          {/* Policy sections */}
          {sections.map((section, i) => (
            <div
              key={i}
              style={{
                background: "var(--color-muted)",
                borderRadius: 20,
                padding: 20,
              }}
            >
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--color-foreground)",
                  margin: "0 0 8px",
                }}
              >
                {section.title}
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--color-muted-foreground)",
                  margin: 0,
                  lineHeight: 1.7,
                  whiteSpace: "pre-line",
                }}
              >
                {section.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default PrivacyPolicy;
