import { motion } from "framer-motion";
import { Service } from "../data/services";

type Props = {
  service: Service;
  onClick: (id: string) => void;
  index: number;
};

export function ServiceTile({ service, onClick, index }: Props) {
  return (
    <motion.button
      className="service-tile"
      style={{ backgroundColor: service.tile }}
      onClick={() => onClick(service.id)}
      aria-label={`Launch ${service.name}`}
      title={`Launch ${service.name}`}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.45,
        delay: index * 0.07,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        scale: 1.06,
        boxShadow: `0 12px 40px rgba(0,0,0,0.7), 0 0 20px ${service.accent}22`,
        borderColor: `${service.accent}40`,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      whileTap={{ scale: 0.96, transition: { duration: 0.1 } }}
    >
      <div
        className="service-tile-glow"
        style={{
          background: `radial-gradient(ellipse at center, ${service.accent}18 0%, transparent 70%)`,
        }}
      />
      <div className="service-logo-container">
        <img
          src={service.logo}
          alt={`${service.name} logo`}
          className="service-logo"
          style={{
            objectFit: service.logoFit ?? "contain",
            objectPosition: "center",
            padding: service.logoPadding ?? "0",
            width: service.logoFit === "cover" ? "100%" : "auto",
            height: service.logoFit === "cover" ? "100%" : "auto",
            maxWidth: service.logoFit === "cover" ? "100%" : service.logoMax ?? "95%",
            maxHeight: service.logoFit === "cover" ? "100%" : service.logoMax ?? "95%",
          }}
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            target.src = "/logos/custom.svg";
          }}
        />
      </div>
    </motion.button>
  );
}
