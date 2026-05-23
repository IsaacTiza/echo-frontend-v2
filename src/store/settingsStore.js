import { create } from "zustand";
import { persist } from "zustand/middleware";

const useSettingsStore = create(
  persist(
    (set) => ({
      fontSize: "medium", // small, medium, large, xlarge
      setFontSize: (size) => set({ fontSize: size }),
    }),
    { name: "echo-settings" },
  ),
);

export const fontSizeMap = {
  small: { label: "Small", size: 13 },
  medium: { label: "Medium", size: 15 },
  large: { label: "Large", size: 17 },
  xlarge: { label: "X-Large", size: 20 },
};

export default useSettingsStore;
