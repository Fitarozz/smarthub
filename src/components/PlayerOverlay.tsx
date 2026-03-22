type Props = {
  activeServiceName: string | null;
  visible: boolean;
  onBack: () => void;
};

export function PlayerOverlay({ activeServiceName, visible, onBack }: Props) {
  if (!activeServiceName || !visible) return null;

  return (
    <div className="player-overlay">
      <div className="player-overlay__content">
        <button className="player-back" onClick={onBack}>
          ← Menu
        </button>
        <span className="player-title">{activeServiceName}</span>
        <span className="player-hint">Déplacez la souris ici pour revenir</span>
      </div>
    </div>
  );
}
