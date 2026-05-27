"use client";

import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { site } from "@/lib/site";
import styles from "./premium-hero.module.css";

const ease = [0.16, 1, 0.3, 1] as const;

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease },
  },
};

export default function PremiumHero() {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], [0, reduceMotion ? 0 : 90]);
  const contentOpacity = useTransform(scrollY, [0, 400], [1, reduceMotion ? 1 : 0.55]);

  return (
    <section className={styles.hero} id="home" aria-label="Inicio">
      <motion.div className={styles.bg} style={{ y: bgY }} aria-hidden="true">
        <Image
          src="/images/hero-hotel.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.bgImg}
        />
      </motion.div>

      <div className={styles.overlay} aria-hidden="true" />
      <motion.div className={styles.glow} aria-hidden="true" />

      <motion.div
        className={styles.inner}
        style={{ opacity: contentOpacity }}
        variants={container}
        initial="hidden"
        animate="show"
      >
        <div className={styles.copy}>
          <motion.p className={styles.eyebrow} variants={fadeUp}>
            {site.tagline}
          </motion.p>

          <motion.h1 className={styles.title} variants={fadeUp}>
            <span className={styles.titleLine}>Bienvenido a</span>
            <span className={styles.titleLine}>
              <span className={styles.accent}>Coclí</span> Hotel
            </span>
          </motion.h1>

          <motion.p className={styles.subtitle} variants={fadeUp}>
            Hospedaje boutique, restaurante y experiencias en Roldanillo.
            Habitaciones con confort premium, cocina de la región y atención
            cálida.
          </motion.p>

          <motion.div className={styles.actions} variants={fadeUp}>
            <a
              href={site.menuUrl}
              className="btn btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver menú digital
            </a>
            <a href="#contact" className="btn btn-outline">
              Reservar
            </a>
          </motion.div>

          <motion.ul className={styles.highlights} variants={fadeUp}>
            <li>Habitaciones premium</li>
            <li>Restaurante & bar</li>
            <li>Ubicación céntrica</li>
          </motion.ul>
        </div>

        <motion.div
          className={styles.visual}
          variants={fadeUp}
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96, x: 40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1, ease, delay: 0.35 }}
        >
          <div className={styles.visualFrame}>
            <Image
              src="/images/gallery-1.jpg"
              alt="Habitación y ambiente de Coclí Hotel"
              width={520}
              height={650}
              priority
              className={styles.visualImg}
            />
          </div>
          <span className={styles.visualBadge}>Roldanillo · Valle</span>
        </motion.div>
      </motion.div>

      <motion.a
        href="#menu"
        className={styles.scroll}
        aria-label="Explorar el sitio"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <span>Explorar</span>
        <motion.span
          className={styles.scrollLine}
          animate={reduceMotion ? undefined : { scaleY: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        />
      </motion.a>
    </section>
  );
}
