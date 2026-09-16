import { Background, BackgroundType, CountdownConfig, TITLE_MAX_LENGTH, createBackground } from './config';

const BACKGROUND_OPTIONS: { type: BackgroundType; label: string }[] = [
  { type: 'solid', label: 'Solid color' },
  { type: 'gradient', label: 'Gradient' },
  { type: 'image', label: 'Image' },
];

interface CountdownFormProps {
  config: CountdownConfig;
  onChange: (config: CountdownConfig) => void;
}

function CountdownForm({ config, onChange }: CountdownFormProps) {
  const { background } = config;

  function update(changes: Partial<CountdownConfig>) {
    onChange({ ...config, ...changes });
  }

  function updateBackground(changes: Partial<Background>) {
    update({ background: { ...background, ...changes } as Background });
  }

  return (
    <form className="card countdown-form" onSubmit={(event) => event.preventDefault()}>
      <div className="field">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          placeholder="Trip to Lisbon"
          maxLength={TITLE_MAX_LENGTH}
          value={config.title}
          onChange={(event) => update({ title: event.target.value })}
        />
      </div>

      <div className="field">
        <label htmlFor="finish-date">Finish date</label>
        <input
          id="finish-date"
          type="datetime-local"
          value={config.finishDate}
          onChange={(event) => update({ finishDate: event.target.value })}
        />
      </div>

      <fieldset className="field">
        <legend>Background</legend>
        <div className="segmented">
          {BACKGROUND_OPTIONS.map(({ type, label }) => (
            <label key={type} className="segmented__option">
              <input
                type="radio"
                name="background-type"
                value={type}
                checked={background.type === type}
                onChange={() => update({ background: createBackground(type) })}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>

        {background.type === 'solid' && (
          <div className="color-row">
            <label className="color-field">
              <input
                type="color"
                value={background.color}
                onChange={(event) => updateBackground({ color: event.target.value })}
              />
              <span>Color</span>
            </label>
          </div>
        )}

        {background.type === 'gradient' && (
          <div className="color-row">
            <label className="color-field">
              <input
                type="color"
                value={background.from}
                onChange={(event) => updateBackground({ from: event.target.value })}
              />
              <span>Start</span>
            </label>
            <label className="color-field">
              <input
                type="color"
                value={background.to}
                onChange={(event) => updateBackground({ to: event.target.value })}
              />
              <span>End</span>
            </label>
          </div>
        )}

        {background.type === 'image' && (
          <input
            aria-label="Image URL"
            type="url"
            placeholder="https://example.com/beach.jpg"
            value={background.url}
            onChange={(event) => updateBackground({ url: event.target.value })}
          />
        )}
      </fieldset>

      <fieldset className="field">
        <legend>Font colors</legend>
        <div className="color-row">
          <label className="color-field">
            <input
              type="color"
              value={config.titleColor}
              onChange={(event) => update({ titleColor: event.target.value })}
            />
            <span>Title</span>
          </label>
          <label className="color-field">
            <input
              type="color"
              value={config.counterColor}
              onChange={(event) => update({ counterColor: event.target.value })}
            />
            <span>Counter</span>
          </label>
        </div>
      </fieldset>

      <button type="button" className="button button--primary">
        Generate link
      </button>
    </form>
  );
}

export default CountdownForm;
