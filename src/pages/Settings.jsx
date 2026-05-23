import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, User, Shield, ChevronRight, Zap } from "lucide-react";
import useAuthStore from "../store/authStore";
import Navbar from "../components/Navbar";
import PageTransition from "../components/pageTransition";
import useSettingsStore, { fontSizeMap } from "../store/settingsStore";

const Settings = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { fontSize, setFontSize } = useSettingsStore();

  const dailyUsage = user?.dailyUsage || 0;
  const dailyLimit = 10;
  const remaining = dailyLimit - dailyUsage;
  const usagePercent = (dailyUsage / dailyLimit) * 100;

  return (
    <PageTransition>
      <div className="min-h-dvh bg-muted pb-24">
        {/* Header */}
        <div className="bg-card px-6 pt-14 pb-6">
          <h1 className="text-xl font-bold text-foreground">Settings</h1>
        </div>

        <div className="px-6 mt-6 space-y-4">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => navigate("/account")}
            className="bg-card rounded-2xl p-5 flex items-center gap-4 card-shadow cursor-pointer active:scale-95 transition-transform"
          >
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-16 h-16 rounded-2xl object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-foreground text-lg truncate">
                {user?.name}
              </p>
              <p className="text-sm text-muted-foreground truncate">
                {user?.email}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-2 h-2 rounded-full bg-success" />
                <p className="text-xs text-muted-foreground capitalize">
                  {user?.provider} account
                </p>
              </div>
            </div>
          </motion.div>

          {/* AI Usage Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-card rounded-2xl p-5 card-shadow"
          >
            <div className="flex items-center gap-3 mb-4 ">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-foreground">AI Credits</p>
                <p className="text-xs text-muted-foreground">
                  Resets every midnight
                </p>
              </div>
            </div>

            <div className="w-full h-3 bg-muted rounded-full mb-3 theme-transition overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${usagePercent}%` }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className={`h-full rounded-full ${usagePercent >= 80 ? "bg-destructive" : "gradient-primary"}`}
              />
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {dailyUsage} of {dailyLimit} used today
              </p>
              <p
                className={`text-sm font-bold ${remaining === 0 ? "text-destructive" : "text-primary"}`}
              >
                {remaining} left
              </p>
            </div>

            {remaining === 0 && (
              <div className="mt-3 bg-destructive/10 rounded-xl p-3">
                <p className="text-xs text-destructive font-medium">
                  Daily limit reached. Credits refill at midnight.
                </p>
              </div>
            )}
          </motion.div>

          {/* Font Size Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-card rounded-2xl p-5 card-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: "var(--color-foreground)",
                  }}
                >
                  A
                </span>
              </div>
              <div>
                <p className="font-bold text-foreground">Reading Font Size</p>
                <p className="text-xs text-muted-foreground">
                  For explanations and study content
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              {Object.entries(fontSizeMap).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setFontSize(key)}
                  style={{
                    flex: 1,
                    padding: "10px 4px",
                    borderRadius: 12,
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: val.size - 4,
                    background:
                      fontSize === key
                        ? "linear-gradient(135deg, #F95E08, #FE8118)"
                        : "var(--color-muted)",
                    color:
                      fontSize === key
                        ? "white"
                        : "var(--color-muted-foreground)",
                    transition: "all 0.2s",
                  }}
                >
                  A
                  <p
                    style={{
                      fontSize: 9,
                      fontWeight: 600,
                      marginTop: 2,
                      opacity: 0.8,
                    }}
                  >
                    {val.label}
                  </p>
                </button>
              ))}
            </div>

            <p
              style={{
                marginTop: 12,
                fontSize: fontSizeMap[fontSize].size,
                color: "var(--color-muted-foreground)",
                lineHeight: 1.6,
              }}
            >
              This is how your explanations will look.
            </p>
          </motion.div>

          {/* Menu Items */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-card rounded-2xl overflow-hidden card-shadow"
          >
            {[
              {
                icon: User,
                label: "Account",
                sub: "Manage your account details",
                action: () => navigate("/account"),
              },
              {
                icon: Shield,
                label: "Privacy Policy",
                sub: "How we handle your data",
                action: () => navigate("/privacy"),
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <button
                  key={i}
                  onClick={item.action}
                  className="w-full flex items-center gap-4 px-5 py-4 border-b border-border last:border-0 active:bg-muted transition-colors"
                >
                  <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-foreground text-sm">
                      {item.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.sub}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              );
            })}
          </motion.div>

          {/* App Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-card rounded-2xl p-5 card-shadow"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Version</p>
              <p className="text-sm font-semibold text-foreground">1.0.0</p>
            </div>
            <div className="flex items-center justify-between mt-3">
              <p className="text-sm text-muted-foreground">Made with</p>
              <p className="text-sm font-semibold text-foreground">
                ❤️ for students
              </p>
            </div>
          </motion.div>

          {/* Logout */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            onClick={logout}
            className="w-full flex items-center justify-center gap-3 bg-destructive/10 py-4 rounded-2xl active:scale-95 transition-transform"
          >
            <LogOut className="w-5 h-5 text-destructive" />
            <span className="font-bold text-destructive">Sign Out</span>
          </motion.button>
        </div>
        <Navbar />
      </div>
    </PageTransition>
  );
};

export default Settings;
