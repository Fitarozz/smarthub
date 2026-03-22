import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Service } from "../data/services";
import { ServiceTile } from "./ServiceTile";

type Props = {
  services: Service[];
  onLaunch: (id: string) => void;
  onOpenSettings: () => void;
  hidden?: boolean;
  fullscreen?: boolean;
};

function useClock() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);
  return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function Home({ services, onLaunch, onOpenSettings, hidden = false, fullscreen = false }: Props) {
  const clock = useClock();

  return (
    <section className="home-screen" style={{ display: hidden ? "none" : "flex", paddingTop: fullscreen ? "40px" : undefined }}>
      <motion.header
        className="home-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="home-header-left">
          <span className="home-clock">{clock}</span>
        </div>
        <div className="home-header-right">
          <motion.button
            className="settings-button"
            onClick={onOpenSettings}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ⚙ Paramètres
          </motion.button>
        </div>
      </motion.header>

      <div className="services-grid" role="grid" aria-label="Streaming services">
        {services.map((service, i) => (
          <ServiceTile key={service.id} service={service} onClick={onLaunch} index={i} />
        ))}
      </div>

      <motion.p
        className="hint-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        Esc pour revenir · F11 plein écran · Ctrl+Q quitter
      </motion.p>
    </section>
  );
}
