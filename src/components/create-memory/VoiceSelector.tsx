import type { VoiceStyle } from '../../types/memory';
import './VoiceSelector.css';

const voiceStyles: {
  value: VoiceStyle;
  label: string;
  description: string;
}[] = [
  { value: 'documentary', label: 'Documentary', description: 'Clear, grounded, and observant.' },
  { value: 'cinematic', label: 'Cinematic', description: 'Atmospheric, emotional, and immersive.' },
  { value: 'poetic', label: 'Poetic', description: 'Expressive, lyrical, and reflective.' },
  { value: 'travel-journal', label: 'Travel journal', description: 'Personal, curious, and conversational.' },
];

type VoiceSelectorProps = {
  value: VoiceStyle;
  onChange: (value: VoiceStyle) => void;
};

export const VoiceSelector = ({ value, onChange }: VoiceSelectorProps) => (
  <fieldset
    className="memory-form-section voice-selector"
    aria-labelledby="voice-selector-title"
  >
    <p className="memory-form-section__step">Step 03</p>
    <h2 id="voice-selector-title" className="memory-form-section__title">
      Choose your photographer&apos;s voice
    </h2>
    <p className="memory-form-section__description">
      How should this memory feel when it becomes a story?
    </p>

    <div className="voice-selector__options">
      {voiceStyles.map((style) => (
        <label
          className={`voice-option ${value === style.value ? 'voice-option--selected' : ''}`}
          key={style.value}
        >
          <input
            className="voice-option__input"
            type="radio"
            name="voiceStyle"
            value={style.value}
            checked={value === style.value}
            onChange={() => onChange(style.value)}
          />
          <span className="voice-option__content">
            <strong>{style.label}</strong>
            <span>{style.description}</span>
          </span>
        </label>
      ))}
    </div>
  </fieldset>
);
