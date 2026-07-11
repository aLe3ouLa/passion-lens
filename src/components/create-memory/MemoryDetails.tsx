import { MapPin } from 'lucide-react';

import './MemoryDetails.css';

type MemoryDetailsProps = {
  location: string;
  meaning: string;
  onLocationChange: (value: string) => void;
  onMeaningChange: (value: string) => void;
};

export const MemoryDetails = ({
  location,
  meaning,
  onLocationChange,
  onMeaningChange,
}: MemoryDetailsProps) => (
  <section className="memory-form-section" aria-labelledby="details-title">
    <header className="memory-form-section__header">
      <p className="memory-form-section__step">Step 02</p>
      <h2 id="details-title" className="memory-form-section__title">
        Share what only you remember
      </h2>
      <p className="memory-form-section__description">
        The image shows what happened. Your words explain why it mattered.
      </p>
    </header>

    <div className="form-field">
      <label className="form-field__label" htmlFor="location">
        <MapPin aria-hidden="true" size={18} />
        Location
      </label>
      <input
        className="form-field__control"
        id="location"
        name="location"
        type="text"
        value={location}
        onChange={(event) => onLocationChange(event.target.value)}
        placeholder="Lisbon, Portugal"
      />
    </div>

    <div className="form-field">
      <label className="form-field__label" htmlFor="meaning">
        What does this moment mean to you?
      </label>
      <textarea
        className="form-field__control form-field__textarea"
        id="meaning"
        name="meaning"
        value={meaning}
        onChange={(event) => onMeaningChange(event.target.value)}
        placeholder="It was the first morning of my solo trip..."
        rows={5}
      />
      <p className="form-field__hint">
        A few honest words are enough. Passion Lens will build around them.
      </p>
    </div>
  </section>
);
