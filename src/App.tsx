import "./App.css";
import { useEffect, useState } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Home } from "./components/Home";
import { Settings } from "./components/Settings";
import { PlayerOverlay } from "./components/PlayerOverlay";
import { useWebviews } from "./hooks/useWebviews";
import { initialServices } from "./data/services";

function useIsFullscreen() {
  const [fullscreen, setFullscreen] = useState(false);
  useEffect(() => {
    const win = getCurrentWindow();
    win.isFullscreen().then(setFullscreen);
    let unlisten: (() => void) | undefined;
    win.onResized(async () => {
      setFullscreen(await win.isFullscreen());
    }).then((fn) => { unlisten = fn; });
    return () => { unlisten?.(); };
  }, []);
  return fullscreen;
}

function MainApp() {
  const {
    services,
    activeServiceId,
    overlayVisible,
    settingsOpen,
    setSettingsOpen,
    openService,
    closeService,
    addCustomService,
    removeCustomService,
  } = useWebviews();

  const isFullscreen = useIsFullscreen();
  const activeService = services.find((s) => s.id === activeServiceId) || null;

  return (
    <div className="app-shell">
      {!isFullscreen && (
        <div className="custom-titlebar" data-tauri-drag-region>
          <img src="/icons/smarthub.png" alt="" className="titlebar-logo" draggable={false} />
          <span className="titlebar-name">smarthub</span>
        </div>
      )}
      <Home services={services} onLaunch={openService} onOpenSettings={() => setSettingsOpen(true)} hidden={!!activeServiceId} fullscreen={isFullscreen} />
      <Settings visible={settingsOpen} onClose={() => setSettingsOpen(false)} customServices={services.filter((s) => !initialServices.find((d) => d.id === s.id))} onAddService={addCustomService} onRemoveService={removeCustomService} />
      <PlayerOverlay activeServiceName={activeService?.name ?? null} visible={!!activeServiceId && overlayVisible} onBack={closeService} />
      {activeServiceId && <div className="hotspot-corner" aria-hidden="true" />}
    </div>
  );
}

function App() {
  return <MainApp />;
}

export default App;
