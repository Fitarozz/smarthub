export type Service = {
  id: string;
  name: string;
  url: string;
  logo: string;
  accent: string;
  tile: string;
  logoFit?: "contain" | "cover" | "scale-down" | "none";
  logoPadding?: string;
  logoMax?: string;
};

export const initialServices: Service[] = [
  {
    id: "netflix",
    name: "Netflix",
    url: "https://www.netflix.com",
    logo: "/logos/netflix-wordmark.jpg",
    accent: "#e50914",
    tile: "#1f1f1f",
    logoFit: "cover",
    logoPadding: "0",
    logoMax: "100%",
  },
  {
    id: "disneyplus",
    name: "Disney+",
    url: "https://www.disneyplus.com",
    logo: "/logos/disneyplus-wordmark.png",
    accent: "#1f78d1",
    tile: "#02142c",
    logoFit: "cover",
    logoPadding: "0",
    logoMax: "100%",
  },
  {
    id: "primevideo",
    name: "Prime Video",
    url: "https://www.primevideo.com",
    logo: "/logos/primevideo-wordmark.png",
    accent: "#00a8e1",
    tile: "#050505",
    logoFit: "contain",
    logoPadding: "24px",
    logoMax: "80%",
  },
  {
    id: "youtube",
    name: "YouTube",
    url: "https://www.youtube.com",
    logo: "/logos/youtube-wordmark.png",
    accent: "#ff0000",
    tile: "#181818",
    logoFit: "cover",
    logoPadding: "0",
    logoMax: "100%",
  },
  {
    id: "crunchyroll",
    name: "Crunchyroll",
    url: "https://www.crunchyroll.com",
    logo: "/logos/crunchyroll-wordmark.jpg",
    accent: "#f47f1c",
    tile: "#1c1f22",
    logoFit: "cover",
    logoPadding: "0",
    logoMax: "100%",
  },
  {
    id: "hbomax",
    name: "HBO Max",
    url: "https://www.hbomax.com",
    logo: "/logos/hbomax-lens.png",
    accent: "#8a18a5",
    tile: "#111111",
    logoFit: "cover",
    logoPadding: "0",
    logoMax: "100%",
  },
];
