import { Eye, Heart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

import lisbonImage from '../../assets/images/lisbon.jpeg';
import './LensReveal.css';

const revealSteps = [
  {
    icon: Eye,
    step: '01',
    title: 'What the camera captured',
    detail: 'Warm morning light · Empty streets · Layered architecture',
  },
  {
    icon: Heart,
    step: '02',
    title: 'What the moment felt like',
    detail: 'Curious · Hopeful · Adventurous',
  },
  {
    icon: Sparkles,
    step: '03',
    title: 'What it may reveal about you',
    detail: 'You may be drawn to quiet moments of discovery.',
  },
];

export const LensReveal = () => {
  return (
    <section
      id="lens-reveal"
      className="lens-reveal"
      aria-labelledby="lens-reveal-title"
    >
      <div className="lens-reveal__image-wrapper">
        <img
          className="lens-reveal__image"
          src={lisbonImage}
          alt="A quiet Lisbon street illuminated by warm morning light"
        />

        <p className="lens-reveal__image-label">Example analysis</p>
      </div>

      <div className="lens-reveal__content">
        <p className="section-eyebrow">One photograph. More than one story.</p>

        <h2 id="lens-reveal-title" className="lens-reveal__title">
          See what Passion Lens notices.
        </h2>

        <p className="lens-reveal__description">
          Passion Lens combines what is visible in your photograph with what
          the moment means to you.
        </p>

        <ol className="lens-reveal__steps">
          {revealSteps.map(({ icon: Icon, step, title, detail }) => (
            <li className="lens-reveal__step" key={step}>
              <span className="lens-reveal__step-icon">
                <Icon aria-hidden="true" size={18} />
              </span>

              <div>
                <p className="lens-reveal__step-label">
                  {step} · {title}
                </p>
                <p className="lens-reveal__step-detail">{detail}</p>
              </div>
            </li>
          ))}
        </ol>

        <Link className="lens-reveal__action" to="/create-memory">
          Try it with your photograph
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
};
