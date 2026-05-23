import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, BookOpen, Plus, Settings, Sun, Moon } from "lucide-react";
import useThemeStore from "../store/themeStore";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useThemeStore();

  const navItems = [
    { icon: Home, label: "Home", path: "/dashboard" },
    { icon: BookOpen, label: "History", path: "/history" },
    { isAdd: true, icon: Plus, label: "New", path: "/notes/new" },
    { icon: isDark ? Sun : Moon, label: isDark ? "Light" : "Dark", isTheme: true },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const handleNav = (item) => {
    if (item.isTheme) { toggleTheme(); return; }
    if (item.path) navigate(item.path);
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 21,
        left: 0,
        right: 0,
        // width: "95%",
        // maxWidth: 480,
        display: "flex",
        justifyContent: "center",
        zIndex: 50,
        pointerEvents: "none",
      }}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          background: isDark ? "#1C1C1E" : "#F5F5F5",
          width: "95%",
          borderRadius: 999,
          padding: "10px 20px",
          gap: 4,
          boxShadow: isDark
            ? "0 8px 32px rgba(0,0,0,0.4)"
            : "0 8px 32px rgba(0,0,0,0.12)",
          pointerEvents: "all",
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.path && location.pathname === item.path;

          if (item.isAdd) {
            return (
              <motion.button
                key="add"
                onClick={() => navigate(item.path)}
                whileTap={{ scale: 0.88 }}
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 20,
                  background: "rgba(255,255,255,0.07)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  gap: 3,
                  marginTop: -20,
                  marginBottom: -20,
                  marginLeft: 8,
                  marginRight: 8,
                  boxShadow:
                    "0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 10,
                    background: "linear-gradient(135deg, #F95E08, #FE8118)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 8px rgba(249,94,8,0.5)",
                  }}
                >
                  <Icon size={18} color="white" strokeWidth={2.5} />
                </div>
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    color: isActive
                      ? "#F95E08"
                      : isDark
                        ? "rgba(255,255,255,0.55)"
                        : "rgba(0,0,0,0.45)",
                  }}
                >
                  {item.label}
                </span>
              </motion.button>
            );
          }

          return (
            <motion.button
              key={item.label}
              onClick={() => handleNav(item)}
              whileTap={{ scale: 0.82 }}
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                background: isActive ? "rgba(249,94,8,0.15)" : "transparent",
                border: "none",
                cursor: "pointer",
                flexShrink: 0,
                transition: "background 0.2s",
              }}
            >
              <Icon
                size={20}
                color={
                  isActive
                    ? "#F95E08"
                    : isDark
                      ? "rgba(255,255,255,0.55)"
                      : "rgba(0,0,0,0.45)"
                }
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 600,
                  color: isActive
                    ? "#F95E08"
                    : isDark
                      ? "rgba(255,255,255,0.45)"
                      : "rgba(0,0,0,0.35)",
                  transition: "color 0.2s",
                }}
              >
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
};

export default Navbar;