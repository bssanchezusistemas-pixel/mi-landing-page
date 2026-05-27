"use client";

import "./page.module.css";
import ScrollExpansionHero from "@/components/ui/scroll-expansion-hero";
import ScrollEffects from "@/components/ScrollEffects";

import { useEffect, useMemo } from "react";

export default function Page() {
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    // No-op: placeholder to ensure client rendering
  }, []);

  return (
    <div>
      <ScrollEffects />

      <div className="scroll-progress" aria-hidden="true" />
      <div className="glow-orb" aria-hidden="true" />
      <div className="glow-orb" aria-hidden="true" />

      <header className="navbar" role="banner">
        <div className="nav-inner">
          <a href="#" className="logo">
            Flavor <span>House</span>
          </a>

          <nav className="nav-links" aria-label="Navegación principal">
            <a href="#menu">Menú</a>
            <a href="#about">Experiencia</a>
            <a href="#gallery">Galería</a>
            <a href="#reviews">Reseñas</a>
            <a href="#contact">Contacto</a>
          </nav>

          <a href="#contact" className="nav-cta">
            Reservar mesa
          </a>

          <button
            className="menu-toggle"
            aria-label="Abrir menú"
            aria-expanded="false"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      <ScrollExpansionHero
        mediaSrc="/images/signature-burger.png"
        bgImageSrc="/images/hero-burger.png"
        titleFirstWord="COCLÍ"
        titleSecondWord="MÁGICA"
        subtitle="EXPERIENCIA SENSORIAL"
        scrollToExpand="Descubre la magia"
      >
        {/* Expandido: reutiliza secciones del landing original */}
        <div className="hero-expanded">
          <section className="menu" id="menu" aria-labelledby="menu-heading">
            <div className="container">
              <header className="section-header reveal">
                <p className="section-label">Selección exclusiva</p>
                <h2
                  className="section-title"
                  id="menu-heading"
                  data-reveal-title
                >
                  Menú destacado
                </h2>
              </header>

              <div className="menu-grid">
                <article className="menu-card reveal">
                  <div className="menu-card-img">
                    <img
                      src="/images/hero-burger.png"
                      alt="Burger doble Black Fire con queso derretido y salsa de la casa"
                      width="600"
                      height="450"
                      loading="lazy"
                    />
                  </div>
                  <div className="menu-card-body">
                    <span className="menu-card-tag">Insignia</span>
                    <h3>Black Fire Doble</h3>
                    <p>
                      Dos carnes selladas, cheddar madurado, glaseado BBQ de la
                      casa y brioche artesanal.
                    </p>
                    <div className="menu-card-footer">
                      <span className="menu-price">$45.900</span>
                      <a href="#contact" className="btn-sm">
                        Agregar
                      </a>
                    </div>
                  </div>
                </article>

                <article className="menu-card reveal">
                  <div className="menu-card-img">
                    <img
                      src="/images/signature-burger.png"
                      alt="Burger Midnight Classic premium sobre pizarra de piedra"
                      width="600"
                      height="450"
                      loading="lazy"
                    />
                  </div>
                  <div className="menu-card-body">
                    <span className="menu-card-tag">Del chef</span>
                    <h3>Midnight Classic</h3>
                    <p>
                      Carne premium, tomate en rama, lechuga mantecosa y
                      cheddar fundido.
                    </p>
                    <div className="menu-card-footer">
                      <span className="menu-price">$39.900</span>
                      <a href="#contact" className="btn-sm">
                        Agregar
                      </a>
                    </div>
                  </div>
                </article>

                <article className="menu-card reveal">
                  <div className="menu-card-img">
                    <img
                      src="/images/meat-platter.png"
                      alt="Tabla Loaded Hunter con carnes premium variadas"
                      width="600"
                      height="450"
                      loading="lazy"
                    />
                  </div>
                  <div className="menu-card-body">
                    <span className="menu-card-tag">Tabla</span>
                    <h3>Tabla Loaded Hunter</h3>
                    <p>
                      Chicharrón crocante, tiras de lomo grillado, chimichurri y
                      chorizos artesanales.
                    </p>
                    <div className="menu-card-footer">
                      <span className="menu-price">$78.900</span>
                      <a href="#contact" className="btn-sm">
                        Agregar
                      </a>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </section>

          <section className="about" id="about" aria-labelledby="about-heading">
            <div className="about-parallax-bg" aria-hidden="true" />
            <div className="container">
              <div className="about-grid">
                <div className="about-image-wrap reveal-left">
                  <img
                    src="/images/signature-burger.png"
                    alt="Presentación de la burger insignia"
                    width="600"
                    height="750"
                    loading="lazy"
                  />
                  <div className="about-float" data-parallax="0.2">
                    <img
                      src="/images/hero-burger.png"
                      alt="Detalle"
                      width="280"
                      height="280"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="about-content reveal-right">
                  <p className="section-label">Nuestra historia</p>
                  <h2 id="about-heading">
                    Creado para <em>sabores audaces</em> y noches inolvidables
                  </h2>
                  <p>
                    En Coclí Mágica, cada bocado es una experiencia cinematográfica:
                    carnes a la brasa, panes artesanales e ingredientes
                    seleccionados.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="promo" aria-label="Promoción especial">
            <div className="promo-inner">
              <div
                className="promo-bg"
                role="img"
                aria-label="Promoción de tabla"
              />
              <div className="promo-overlay" />
              <div className="promo-content reveal">
                <p className="section-label">Oferta limitada</p>
                <h2>Smokehouse Feast &mdash; 20% de descuento</h2>
                <p>
                  Disfruta nuestras tablas cargadas. Reserva tu mesa y vive la
                  experiencia.
                </p>
                <a href="#contact" className="btn btn-primary">
                  Aprovechar oferta
                </a>
              </div>
            </div>
          </section>

          <section className="gallery" id="gallery" aria-labelledby="gallery-heading">
            <div className="container">
              <header className="section-header reveal">
                <p className="section-label">Recorrido visual</p>
                <h2 className="section-title" id="gallery-heading" data-reveal-title>
                  Galería
                </h2>
              </header>

              <div className="gallery-masonry">
                <figure className="gallery-item tall reveal">
                  <img
                    src="/images/hero-burger.png"
                    alt="Galería"
                    width="500"
                    height="700"
                    loading="lazy"
                  />
                </figure>
                <figure className="gallery-item reveal">
                  <img
                    src="/images/signature-burger.png"
                    alt="Galería"
                    width="500"
                    height="400"
                    loading="lazy"
                  />
                </figure>
                <figure className="gallery-item reveal">
                  <img
                    src="/images/meat-platter.png"
                    alt="Galería"
                    width="500"
                    height="400"
                    loading="lazy"
                  />
                </figure>
              </div>
            </div>
          </section>

          <section className="contact" id="contact" aria-labelledby="contact-heading">
            <div className="container">
              <div className="contact-grid">
                <div className="contact-info reveal-left">
                  <p className="section-label">Visítanos</p>
                  <h2 id="contact-heading">Contáctanos</h2>
                  <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>
                    Reserva tu mesa o pide para llevar.
                  </p>

                  <div className="contact-details">
                    <div className="contact-item">
                      <div className="contact-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z" />
                          <circle cx="12" cy="10" r="2.5" />
                        </svg>
                      </div>
                      <div>
                        <h4>Dirección</h4>
                        <p>Colombia</p>
                      </div>
                    </div>
                  </div>

                  <form className="contact-form" aria-label="Formulario de contacto">
                    <input
                      type="text"
                      name="name"
                      placeholder="Tu nombre"
                      required
                      autoComplete="name"
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Correo electrónico"
                      required
                      autoComplete="email"
                    />
                    <textarea name="message" placeholder="Tu mensaje" required />
                    <button type="submit" className="btn btn-primary">
                      Enviar mensaje
                    </button>
                  </form>
                </div>

                <div className="map-container reveal-right" aria-label="Mapa">
                  <iframe
                    title="Ubicación"
                    src="https://www.google.com/maps?q=Roldanillo,+Valle+del+Cauca,+Colombia&hl=es&z=15&output=embed"
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </section>

          <footer className="footer" role="contentinfo">
            <div className="container">
              <div className="footer-grid">
                <div className="footer-brand">
                  <div className="logo">
                    Flavor <span>House</span>
                  </div>
                  <p>
                    Burgers artesanales premium en un ambiente cinematográfico de
                    lujo oscuro.
                  </p>
                </div>
              </div>
            </div>
          </footer>

          <a
            href="https://wa.me/573163446919?text=Hola%20Flavor%20House%2C%20quiero%20hacer%20un%20pedido."
            className="whatsapp-float"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Pedir por WhatsApp"
          >
            <svg
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </a>
        </div>
      </ScrollExpansionHero>
    </div>
  );
}

