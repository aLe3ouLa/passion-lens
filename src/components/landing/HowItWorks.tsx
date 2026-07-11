import { Camera, Headphones, Sparkles } from 'lucide-react';

import './HowItWorks.css';

const steps = [
  {
    number: '01',
    title: 'Capture a moment',
    description:
      'Choose a photograph that carries a memory. Add where it happened and why it matters to you.',
    icon: Camera,
  },
  {
    number: '02',
    title: 'Discover the story',
    description:
      'Passion Lens combines what the camera captured with the meaning behind your own words.',
    icon: Sparkles,
  },
  {
    number: '03',
    title: 'Relive the memory',
    description:
      'Read your personalized story and listen as your photograph becomes a narrated memory.',
    icon: Headphones,
  },
];

export const HowItWorks = () => {
  return (
    <section className="how-it-works" aria-labelledby="how-it-works-title">
      <header className="how-it-works__header">
        <p className="how-it-works__eyebrow">Your journey</p>

        <h2 id="how-it-works-title" className="how-it-works__title">
          From photograph to memory.
        </h2>

        <p className="how-it-works__description">
          Passion Lens combines what your camera captured with what only you
          remember.
        </p>
      </header>

      <ol className="how-it-works__steps">
        {steps.map(({ number, title, description, icon: Icon }) => (
          <li className="how-it-works__step" key={number}>
            <span className="how-it-works__number">{number}</span>

            <span className="how-it-works__icon">
              <Icon aria-hidden="true" size={24} strokeWidth={1.5} />
            </span>

            <div className="how-it-works__content">
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
};
