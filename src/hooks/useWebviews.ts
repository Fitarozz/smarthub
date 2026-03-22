import { useCallback, useEffect, useRef, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { Webview } from "@tauri-apps/api/webview";
import { getCurrentWindow, PhysicalSize, PhysicalPosition } from "@tauri-apps/api/window";
import { Store } from "@tauri-apps/plugin-store";
import { initialServices, Service } from "../data/services";

const PERSISTENCE_FILE = "config.json";
const STORE_KEY = "customServices";
const OVERLAY_LABEL = "tv-overlay";
const OVERLAY_WIDTH = 200;
const OVERLAY_HEIGHT = 200;

export function useWebviews() {
  const webviewsRef = useRef<Map<string, Webview>>(new Map());

  const [customServices, setCustomServices] = useState<Service[]>([]);
  const [services, setServices] = useState<Service[]>(initialServices);
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const storeRef = useRef<Store | null>(null);

  useEffect(() => {
    const newServices = [...initialServices, ...customServices];
    setServices(newServices);
  }, [customServices]);

  const persistCustomServices = useCallback(async (servicesToSave: Service[]) => {
    if (!storeRef.current) return;
    storeRef.current.set(STORE_KEY, servicesToSave);
    await storeRef.current.save();
  }, []);

  useEffect(() => {
    let resizeUnlisten: (() => void) | null = null;
    let backUnlisten: (() => void) | null = null;
    let keydownHandler: ((event: KeyboardEvent) => void) | null = null;

    async function init() {
      const store = await Store.load(PERSISTENCE_FILE);
      storeRef.current = store;
      const persisted = await store.get<Service[]>(STORE_KEY);
      if (persisted && Array.isArray(persisted)) {
        setCustomServices(persisted);
      }

      const appWindow = getCurrentWindow();
      setOverlayVisible(false);

      const onResize = async () => {
        const size = await appWindow.innerSize();
        for (const [label, webview] of webviewsRef.current.entries()) {
          // Don't resize the overlay webview — it stays small
          if (label === OVERLAY_LABEL) continue;
          await safeWebviewOp(webview, (w) => w.setSize(new PhysicalSize(size.width, size.height)));
        }
      };

      const unlisten = await listen("tauri://resize", onResize);
      resizeUnlisten = unlisten;

      backUnlisten = await listen("smart-tv-back", () => {
        closeService();
      });

      keydownHandler = async (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          if (activeServiceId) {
            await closeService();
          }
        }

        if (event.key === "F11") {
          event.preventDefault();
          const window = getCurrentWindow();
          const should = !(await window.isFullscreen());
          await window.setFullscreen(should);
        }

        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "q") {
          await getCurrentWindow().close();
        }
      };
      window.addEventListener("keydown", keydownHandler);

      await onResize();
    }

    init();

    return () => {
      if (resizeUnlisten) resizeUnlisten();
      if (backUnlisten) backUnlisten();
      if (keydownHandler) window.removeEventListener("keydown", keydownHandler);
    };
  }, [activeServiceId]);

  const safeWebviewOp = useCallback(async (webview: Webview | null | undefined, op: (wv: Webview) => Promise<void>) => {
    if (!webview) return;
    try {
      await op(webview);
    } catch (error) {
      console.warn("Webview operation failed", error);
    }
  }, []);

  const createServiceWebview = useCallback(async (service: Service) => {
    const label = `service-${service.id}`;
    if (webviewsRef.current.has(label)) {
      return webviewsRef.current.get(label)!;
    }

    const appWindow = getCurrentWindow();
    const size = await appWindow.innerSize();

    // Kick off creation (constructor fires async IPC, non-blocking)
    const handle = new Webview(appWindow, label, {
      url: service.url,
      x: 0,
      y: 0,
      width: size.width,
      height: size.height,
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      dragDropEnabled: false,
      focus: false,
    });

    // Capture initialization errors for logging
    handle.once("tauri://error", (e) => {
      console.error("Webview creation error for", label, JSON.stringify(e));
    });

    // Poll via getByLabel until Rust confirms registration (up to 10 seconds)
    let webview: Webview | null = null;
    for (let i = 0; i < 100; i++) {
      await new Promise((r) => setTimeout(r, 100));
      webview = await Webview.getByLabel(label).catch(() => null);
      if (webview) break;
    }

    if (!webview) {
      console.error("Webview timed out:", label);
      return null;
    }

    webviewsRef.current.set(label, webview);
    return webview;
  }, []);

  const closeService = useCallback(async () => {
    // Close and remove all service webviews (including overlay) when returning to main menu.
    for (const [label, webview] of webviewsRef.current.entries()) {
      await safeWebviewOp(webview, (w) => w.hide());
      await safeWebviewOp(webview, (w) => w.close());
      webviewsRef.current.delete(label);
    }

    setActiveServiceId(null);
    setOverlayVisible(false);
  }, [safeWebviewOp]);

  const openService = useCallback(
    async (serviceId: string) => {
      console.log("openService click", serviceId);
      const service = services.find((s) => s.id === serviceId);
      if (!service) {
        console.warn("service not found", serviceId);
        return;
      }

      let webview: Webview | null;
      try {
        webview = await createServiceWebview(service);
      } catch (err) {
        console.error("webview creation failed for", serviceId, err);
        return;
      }

      if (!webview) {
        console.error("webview creation returned null for", serviceId);
        return;
      }

      console.log("show webview", serviceId, service.url);

      // Hide all other service webviews (not the main UI webview — React handles that via activeServiceId)
      for (const [lbl, other] of webviewsRef.current.entries()) {
        if (lbl === `service-${serviceId}`) continue;
        await safeWebviewOp(other, (w) => w.hide());
      }

      const appSize = await getCurrentWindow().innerSize();
      await safeWebviewOp(webview, (w) => w.setPosition(new PhysicalPosition(0, 0)));
      await safeWebviewOp(webview, (w) => w.setSize(new PhysicalSize(appSize.width, appSize.height)));
      await safeWebviewOp(webview, (w) => w.show());
      await safeWebviewOp(webview, (w) => w.setFocus());

      // Create the overlay webview on top of the service webview
      const existingOverlay = await Webview.getByLabel(OVERLAY_LABEL).catch(() => null);
      if (!existingOverlay) {
        const mainWindow = getCurrentWindow();
        const overlayHandle = new Webview(mainWindow, OVERLAY_LABEL, {
          url: "/index.html?overlay=true",
          x: 0,
          y: 0,
          width: OVERLAY_WIDTH,
          height: OVERLAY_HEIGHT,
          transparent: true,
          focus: false,
        });

        overlayHandle.once("tauri://error", (e) => {
          console.error("Overlay webview error", JSON.stringify(e));
        });

        // Wait for registration
        let overlayWv: Webview | null = null;
        for (let i = 0; i < 50; i++) {
          await new Promise((r) => setTimeout(r, 100));
          overlayWv = await Webview.getByLabel(OVERLAY_LABEL).catch(() => null);
          if (overlayWv) break;
        }

        if (overlayWv) {
          webviewsRef.current.set(OVERLAY_LABEL, overlayWv);
          await safeWebviewOp(overlayWv, (w) => w.show());
        } else {
          console.error("Overlay webview creation timed out");
        }
      } else {
        await safeWebviewOp(existingOverlay, (w) => w.show());
      }

      setActiveServiceId(serviceId);
      setOverlayVisible(true);
    },
    [createServiceWebview, services]
  );

  const addCustomService = useCallback(
    async (service: { name: string; url: string; accent: string; tile: string; id?: string }) => {
      const id = service.id
        ? service.id.trim().toLowerCase().replace(/\s+/g, "-")
        : service.name.trim().toLowerCase().replace(/\s+/g, "-");
      const newService: Service = {
        id,
        name: service.name.trim(),
        url: service.url,
        logo: "/logos/custom.svg",
        accent: service.accent || "#5a79ff",
        tile: service.tile || "#161616",
      };

      const already = services.find((s) => s.id === newService.id);
      if (already) return;

      const next = [...customServices, newService];
      setCustomServices(next);
      await persistCustomServices(next);
    },
    [customServices, persistCustomServices, services]
  );

  const removeCustomService = useCallback(
    async (serviceId: string) => {
      const next = customServices.filter((s) => s.id !== serviceId);
      setCustomServices(next);
      await persistCustomServices(next);

      const label = `service-${serviceId}`;
      const webview = webviewsRef.current.get(label);
      if (webview) {
        await safeWebviewOp(webview, (w) => w.hide());
      }

      if (activeServiceId === serviceId) {
        await closeService();
      }
    },
    [activeServiceId, closeService, customServices, persistCustomServices]
  );

  return {
    services,
    activeServiceId,
    overlayVisible,
    settingsOpen,
    setSettingsOpen,
    openService,
    closeService,
    addCustomService,
    removeCustomService,
  };
}
