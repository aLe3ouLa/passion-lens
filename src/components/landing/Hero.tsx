import { Link } from 'react-router-dom';
import './Hero.css';

export const Hero = () => {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__content">
        <p className="hero__eyebrow">Photography, memory and storytelling</p>

        <h1 id="hero-title" className="hero__title">
          Every photo
          <span> holds a story.</span>
        </h1>

        <p className="hero__description">
          Some memories deserve more than a folder on your computer. Passion
          Lens transforms the moments you captured into stories you can
          experience again.
        </p>

        <div className="hero__actions">
          <Link className="button button--primary" to="/create-memory">
            Upload a memory
            <span aria-hidden="true">→</span>
          </Link>

          <a className="hero__secondary-link" href="#lens-reveal">
            See what your lens reveals
          </a>
        </div>
      </div>

      <div className="hero__decorative-text" aria-hidden="true">
        Stories hidden in light
      </div>
    </section>
  );
};
