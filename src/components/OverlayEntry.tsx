import { useEffect, useState, useRef } from "react";
import { emit } from "@tauri-apps/api/event";
import { motion, AnimatePresence } from "framer-motion";
import "../App.css";

export function OverlayEntry() {
  const [visible, setVisible] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    document.documentElement.classList.add("overlay-mode");
    document.documentElement.style.background = "transparent";
    document.body.style.background = "transparent";
    const root = document.getElementById("root");
    if (root) root.style.background = "transparent";
  }, []);

  const handleBack = async () => {
    try {
      await emit("smart-tv-back", null);
    } catch (e) {
      console.error("OverlayEntry: emit failed", e);
    }
  };

  const showOverlay = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setVisible(true);
  };

  const scheduleHide = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setVisible(false), 800);
  };

  return (
    <div
      className="overlay-trigger-zone"
      onMouseEnter={showOverlay}
      onMouseLeave={scheduleHide}
    >
      <AnimatePresence>
        {visible && (
          <motion.button
            className="overlay-back-btn"
            onClick={handleBack}
            onMouseEnter={showOverlay}
            initial={{ opacity: 0, x: -16, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -12, scale: 0.92 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            ← Menu
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
