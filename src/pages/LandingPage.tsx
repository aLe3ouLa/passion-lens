import { LensReveal } from '../components/landing/LensReveal';
import { Hero } from '../components/landing/Hero';
import { HowItWorks } from '../components/landing/HowItWorks';
import './LandingPage.css';

export const LandingPage = () => {
  return (
    <main id="main-content" tabIndex={-1}>
      <Hero />
      <LensReveal />
      <HowItWorks />
    </main>
  );
};
