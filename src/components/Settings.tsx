import { FormEvent, useMemo, useState } from "react";
import { Service } from "../data/services";

type Props = {
  visible: boolean;
  onClose: () => void;
  customServices: Service[];
  onAddService: (service: { name: string; url: string; accent: string; tile: string; id?: string }) => Promise<void> | void;
  onRemoveService: (id: string) => void;
};

export function Settings({ visible, onClose, customServices, onAddService, onRemoveService }: Props) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [accent, setAccent] = useState("#5a79ff");
  const [tile, setTile] = useState("#121212");

  const canSubmit = useMemo(() => name.trim().length > 0 && url.trim().length > 0, [name, url]);

  if (!visible) return null;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;
    onAddService({ name: name.trim(), url: url.trim(), accent, tile });
    setName("");
    setUrl("");
  };

  return (
    <div className="settings-screen">
      <div className="settings-panel">
        <button className="close-settings" onClick={onClose}>
          Back
        </button>
        <h2>Custom Services</h2>

        <form className="settings-form" onSubmit={onSubmit}>
          <label>
            Name
            <input value={name} onChange={(e) => setName(e.currentTarget.value)} placeholder="Service name" />
          </label>
          <label>
            URL
            <input value={url} onChange={(e) => setUrl(e.currentTarget.value)} placeholder="https://..." />
          </label>
          <label>
            Accent
            <input type="color" value={accent} onChange={(e) => setAccent(e.currentTarget.value)} />
          </label>
          <label>
            Tile
            <input type="color" value={tile} onChange={(e) => setTile(e.currentTarget.value)} />
          </label>
          <button type="submit" disabled={!canSubmit} className="add-service">
            Add Service
          </button>
        </form>

        <div className="service-list">
          {customServices.length === 0 ? (
            <p>No custom services yet.</p>
          ) : (
            customServices.map((service) => (
              <div key={service.id} className="custom-service-item">
                <span>{service.name}</span>
                <button onClick={() => onRemoveService(service.id)}>Delete</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
