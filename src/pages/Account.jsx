import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Shield } from "lucide-react";
import useAuthStore from "../store/authStore";
import PageTransition from "../components/PageTransition";
const Account = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <PageTransition>
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
          <h1
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "var(--color-foreground)",
              margin: 0,
            }}
          >
            Account
          </h1>
        </div>

        <div
          style={{
            padding: "0 24px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {/* Avatar */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "24px 0",
            }}
          >
            <img
              src={user?.avatar}
              alt={user?.name}
              style={{
                width: 88,
                height: 88,
                borderRadius: 24,
                objectFit: "cover",
                marginBottom: 12,
              }}
            />
            <p
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "var(--color-foreground)",
                margin: 0,
              }}
            >
              {user?.name}
            </p>
            <p
              style={{
                fontSize: 14,
                color: "var(--color-muted-foreground)",
                margin: "4px 0 0",
              }}
            >
              {user?.email}
            </p>
          </div>

          {/* Info Cards */}
          {[
            { icon: User, label: "Full Name", value: user?.name },
            { icon: Mail, label: "Email Address", value: user?.email },
            {
              icon: Shield,
              label: "Sign-in Method",
              value: `${user?.provider?.charAt(0).toUpperCase()}${user?.provider?.slice(1)} OAuth`,
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                style={{
                  background: "var(--color-muted)",
                  borderRadius: 20,
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
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
                  <Icon size={18} color="white" />
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 11,
                      color: "var(--color-muted-foreground)",
                      margin: 0,
                      fontWeight: 500,
                    }}
                  >
                    {item.label}
                  </p>
                  <p
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: "var(--color-foreground)",
                      margin: "2px 0 0",
                    }}
                  >
                    {item.value}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Note */}
          <div
            style={{
              background: "var(--color-accent-sage)",
              borderRadius: 16,
              padding: 16,
            }}
          >
            <p
              style={{
                fontSize: 13,
                color: "var(--color-foreground)",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              Your account details are managed by{" "}
              {user?.provider === "google" ? "Google" : "Facebook"}. To update
              your name or profile picture, update it on your{" "}
              {user?.provider === "google" ? "Google" : "Facebook"} account and
              sign in again.
            </p>
          </div>
          {/* Privacy Policy */}
          <button
            onClick={() => navigate("/privacy")}
            style={{
              width: "100%",
              background: "var(--color-muted)",
              padding: 16,
              borderRadius: 16,
              border: "none",
              cursor: "pointer",
              color: "var(--color-muted-foreground)",
              fontWeight: 600,
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Shield size={16} />
            Privacy Policy
          </button>
          {/* Sign Out */}
          <button
            onClick={logout}
            style={{
              width: "100%",
              background: "rgba(239, 68, 68, 0.12)",
              padding: 16,
              borderRadius: 16,
              border: "none",
              cursor: "pointer",
              color: "#EF4444",
              fontWeight: 700,
              fontSize: 15,
              marginTop: 8,
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </PageTransition>
  );
};

export default Account;
