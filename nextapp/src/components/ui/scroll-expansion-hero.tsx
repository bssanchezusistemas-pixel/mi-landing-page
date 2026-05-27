"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  mediaSrc: string;
  bgImageSrc: string;
  titleFirstWord?: string;
  titleSecondWord?: string;
  subtitle?: string;
  scrollToExpand?: string;
  brand?: {
    primary?: string;
    gold?: string;
    text?: string;
  };
  children?: React.ReactNode;
};

export default function ScrollExpansionHero({
  mediaSrc,
  bgImageSrc,
  titleFirstWord = "COCLÍ",
  titleSecondWord = "MÁGICA",
  subtitle = "EXPERIENCIA SENSORIAL",
  scrollToExpand = "Descubre la magia",
  children,
}: Props) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const rafRef = useRef<number | null>(null);
  const nextProgressRef = useRef<number>(0);

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    const prefersReducedMotion =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const applyProgress = () => {
      rafRef.current = null;
      setScrollProgress(nextProgressRef.current);
    };

    const scheduleApply = () => {
      if (prefersReducedMotion) return;
      if (rafRef.current != null) return;
      rafRef.current = window.requestAnimationFrame(applyProgress);
    };

    const setProgressClamped = (p: number) => {
      const next = Math.min(Math.max(p, 0), 1);
      nextProgressRef.current = next;

      if (next >= 1) {
        setMediaFullyExpanded(true);
        setShowContent(true);
      } else if (next < 0.8) {
        setMediaFullyExpanded(false);
        setShowContent(false);
      }

      scheduleApply();
    };

    const handleWheel = (e: WheelEvent) => {
      if (prefersReducedMotion) return;

      // Intercept only if we haven't expanded the cinematic media fully.
      if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollDelta = e.deltaY * 0.0012;
        setProgressClamped(scrollProgress + scrollDelta);
      } else if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
        // Allow expanding reverse when at top.
        e.preventDefault();
        setMediaFullyExpanded(false);
        setShowContent(false);
        setProgressClamped(scrollProgress * 0.7);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (prefersReducedMotion) return;
      if (!touchStartY) return;

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;

      if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollFactor = deltaY < 0 ? 0.008 : 0.005;
        setProgressClamped(scrollProgress + deltaY * scrollFactor);
        setTouchStartY(touchY);
      } else if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
        e.preventDefault();
        setMediaFullyExpanded(false);
        setShowContent(false);
        setProgressClamped(scrollProgress * 0.7);
        setTouchStartY(touchY);
      }
    };

    // Keep page locked at top while media is not fully expanded.
    const handleScroll = () => {
      if (!mediaFullyExpanded) window.scrollTo(0, 0);
    };

    window.addEventListener("wheel", handleWheel, {
      passive: false,
    });
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    window.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });

    return () => {
      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current);
      window.removeEventListener(
        "wheel",
        handleWheel as unknown as EventListener
      );
      window.removeEventListener(
        "scroll",
        handleScroll as unknown as EventListener
      );
      window.removeEventListener(
        "touchstart",
        handleTouchStart as unknown as EventListener
      );
      window.removeEventListener(
        "touchmove",
        handleTouchMove as unknown as EventListener
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollProgress, mediaFullyExpanded, touchStartY]);

  const mediaWidth = useMemo(
    () => 300 + scrollProgress * (isMobile ? 650 : 1400),
    [scrollProgress, isMobile]
  );
  const mediaHeight = useMemo(
    () => 400 + scrollProgress * (isMobile ? 300 : 500),
    [scrollProgress, isMobile]
  );
  const textTranslateX = useMemo(
    () => scrollProgress * (isMobile ? 180 : 250),
    [scrollProgress, isMobile]
  );
  const overlayOpacity = useMemo(
    () => 0.8 - scrollProgress * 0.4,
    [scrollProgress]
  );

  return (
    <div className="hero-cinematic" data-cinematic-hero>
      <section className="hero-cinematic__wrap" aria-label="Hero cinematográfico">
        <motion.div
          className="hero-cinematic__bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 - scrollProgress }}
          transition={{ duration: 0.2 }}
          aria-hidden="true"
        >
          <img
            src={bgImageSrc}
            alt=""
            className="hero-cinematic__bg-img"
            draggable={false}
          />
          <div className="hero-cinematic__bg-overlay" />
        </motion.div>

        <div className="hero-cinematic__stage">
          <div className="hero-cinematic__media" style={{ width: mediaWidth, height: mediaHeight }}>
            <motion.div
              className="hero-cinematic__media-inner"
              style={{ width: mediaWidth, height: mediaHeight }}
              initial={false}
            >
              <div className="hero-cinematic__media-media" aria-hidden="true">
                <img
                  src={mediaSrc}
                  alt=""
                  className="hero-cinematic__media-img"
                  draggable={false}
                />
                <motion.div
                  className="hero-cinematic__media-shade"
                  style={{ opacity: overlayOpacity }}
                />
              </div>
            </motion.div>
          </div>

          <motion.div
            className="hero-cinematic__title-area"
            style={{ opacity: 1 - scrollProgress * 2 }}
          >
            <p className="hero-cinematic__subtitle">{subtitle}</p>
            <div className="hero-cinematic__scrollHint">
              <p className="hero-cinematic__scrollText">{scrollToExpand}</p>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              >
                <ChevronDown size={16} className="hero-cinematic__chev" />
              </motion.div>
            </div>
          </motion.div>

          <div className="hero-cinematic__bigWords" aria-hidden="true">
            <motion.h1
              className="hero-cinematic__word hero-cinematic__word--left"
              style={{ transform: `translateX(-${textTranslateX}px)` }}
            >
              {titleFirstWord}
            </motion.h1>
            <motion.h1
              className="hero-cinematic__word hero-cinematic__word--right"
              style={{ transform: `translateX(${textTranslateX}px)` }}
            >
              {titleSecondWord}
            </motion.h1>
          </div>

          <motion.section
            className="hero-cinematic__expandContent"
            initial={false}
            animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {children}
          </motion.section>
        </div>
      </section>
    </div>
  );
}

