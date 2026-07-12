import { Check, Download, MapPin, Play, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

import type { MemoryPageState } from '../types/memory';
import './Memory.css';
import { createNarration } from '../services/createNarration';
import { downloadMemoryPdf } from '../services/downloadMemoryPdf';

export const MemoryPage = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const [audioUrl, setAudioUrl] = useState('');
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState('');

  const routeLocation = useLocation();
  const memoryState = routeLocation.state as MemoryPageState | null;

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  if (!memoryState) {
    return <Navigate to="/create-memory" replace />;
  }

  const { generatedMemory, imageUrl, location, meaning, voiceStyle } =
    memoryState;
  const createdAt = new Date();
  const passionProfile = generatedMemory.passionProfile ?? {
    title: 'Your Passion',
    reflection: generatedMemory.photographerInsight,
    direction:
      'As your collection grows, Passion Lens can reveal the themes you return to again and again.',
  };

  const handleNarration = async () => {
    try {
      setAudioError('');

      if (audioUrl && audioRef.current) {
        if (audioRef.current.paused) {
          await audioRef.current.play();
        } else {
          audioRef.current.pause();
        }

        return;
      }

      setIsGeneratingAudio(true);

      const audioBlob = await createNarration(generatedMemory.story);

      const nextAudioUrl = URL.createObjectURL(audioBlob);

      setAudioUrl(nextAudioUrl);

      requestAnimationFrame(async () => {
        if (audioRef.current) {
          await audioRef.current.play();
        }
      });
    } catch (error) {
      setAudioError(
        error instanceof Error
          ? error.message
          : 'The narration could not be played.',
      );
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      setDownloadError('');
      await downloadMemoryPdf({
        imageUrl,
        location,
        memory: generatedMemory,
      });
    } catch (error) {
      setDownloadError(
        error instanceof Error
          ? error.message
          : 'Your memory could not be downloaded.',
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <main id="main-content" className="memory-page" tabIndex={-1}>
      <article className="memory-story" aria-labelledby="memory-title">
        <section
          className={`memory-hero ${isPlaying ? 'memory-hero--playing' : ''}`}
        >
          <div className="memory-hero__image-wrapper">
            <img
              className="memory-hero__image"
              src={imageUrl}
              alt="The photograph selected for this memory"
            />

            <div className="memory-hero__overlay" aria-hidden="true" />
          </div>

          <div className="memory-hero__content">
            <p className="memory-hero__eyebrow">Your memory</p>

            <div className="memory-hero__meta">
              <span className="memory-hero__location">
                <MapPin aria-hidden="true" size={17} />
                {location || 'Location not provided'}
              </span>

              <span aria-hidden="true">·</span>

              <time dateTime={createdAt.toISOString()}>
                {new Intl.DateTimeFormat('en', {
                  month: 'long',
                  year: 'numeric',
                }).format(createdAt)}
              </time>
            </div>

            <h1 id="memory-title" className="memory-hero__title">
              {generatedMemory.title}
            </h1>

            <ul className="memory-moods" aria-label="Memory moods">
              {generatedMemory.moods.map((mood) => (
                <li className="memory-moods__item" key={mood}>
                  {mood}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {meaning && (
          <section
            className="memory-reflection"
            aria-labelledby="reflection-title"
          >
            <p className="memory-reflection__eyebrow">Your words</p>

            <h2 id="reflection-title" className="memory-reflection__title">
              What this moment meant to you
            </h2>

            <blockquote className="memory-reflection__quote">
              <p>“{meaning}”</p>
            </blockquote>
          </section>
        )}

        <section
          className="memory-story__content"
          aria-labelledby="story-title"
        >
          <p className="memory-story__eyebrow">
            {voiceStyle.replace('-', ' ')} reflection
          </p>

          <h2 id="story-title" className="memory-story__title">
            The story behind the moment
          </h2>

          <p className="memory-story__text">{generatedMemory.story}</p>

          <button
            className="memory-audio-button"
            type="button"
            onClick={handleNarration}
            disabled={isGeneratingAudio}
            aria-pressed={isPlaying}
          >
            <span className="memory-audio-button__icon">
              <Play aria-hidden="true" size={17} fill="currentColor" />
            </span>

            {isGeneratingAudio
              ? 'Giving your memory a voice…'
              : isPlaying
                ? 'Pause this memory'
                : audioUrl
                  ? 'Play this memory again'
                  : 'Listen to this memory'}
          </button>
          {audioError && (
            <p className="memory-audio-error" role="alert">
              {audioError}
            </p>
          )}
          {audioUrl && (
            <audio
              ref={audioRef}
              src={audioUrl}
              preload="metadata"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
            >
              Your browser does not support audio playback.
            </audio>
          )}
        </section>

        {generatedMemory.visualDetails.length > 0 && (
          <motion.section
            className="visual-observations"
            aria-labelledby="visual-observations-title"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
          >
            <p className="visual-observations__eyebrow">Composition analysis</p>

            <h2
              id="visual-observations-title"
              className="visual-observations__title"
            >
              What Passion Lens noticed
            </h2>

            <motion.ul
              className="visual-observations__list"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: prefersReducedMotion ? 0 : 0.12,
                  },
                },
              }}
            >
              {generatedMemory.visualDetails.map((detail) => (
                <motion.li
                  className="visual-observations__item"
                  key={detail}
                  variants={{
                    hidden: prefersReducedMotion
                      ? { opacity: 1 }
                      : { opacity: 0, x: -18 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  <span className="visual-observations__check">
                    <Check aria-hidden="true" size={16} strokeWidth={2.5} />
                  </span>
                  <span>{detail}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.section>
        )}

        <aside className="photographer-insight" aria-labelledby="insight-title">
          <span className="photographer-insight__icon">
            <Sparkles aria-hidden="true" size={22} />
          </span>

          <div>
            <p className="photographer-insight__eyebrow">Through your lens</p>

            <h2 id="insight-title" className="photographer-insight__title">
              Composition Notes
            </h2>

            <p className="photographer-insight__text">
              {generatedMemory.photographerInsight}
            </p>
          </div>
        </aside>

        <motion.section
          className="passion-reveal"
          aria-labelledby="passion-reveal-title"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
        >
          <p className="passion-reveal__eyebrow">A glimpse through your lens</p>

          <h2 id="passion-reveal-title" className="passion-reveal__question">
            What does this photograph reveal about you?
          </h2>

          <div className="passion-reveal__answer">
            <p className="passion-reveal__label">Your Passion</p>
            <h3 className="passion-reveal__title">{passionProfile.title}</h3>
            <p>{passionProfile.reflection}</p>
            <p>{passionProfile.direction}</p>
          </div>

          <button
            className="memory-download-button"
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            <Download aria-hidden="true" size={18} />
            {isDownloading ? 'Preparing your memory…' : 'Download Memory'}
          </button>

          {downloadError && (
            <p className="memory-download-error" role="alert">
              {downloadError}
            </p>
          )}
        </motion.section>
      </article>
    </main>
  );
};
