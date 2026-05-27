"use client";

import Image from "next/image";
import PremiumHero from "@/components/PremiumHero";
import ScrollEffects from "@/components/ScrollEffects";
import { site } from "@/lib/site";

export default function Page() {
  return (
    <>
      <ScrollEffects />

      <div className="scroll-progress" aria-hidden="true" />
      <div className="glow-orb" aria-hidden="true" />
      <div className="glow-orb" aria-hidden="true" />

      <header className="navbar" role="banner">
        <div className="nav-inner">
          <a href="#home" className="logo" aria-label={site.name}>
            <Image
              src="/images/logo.png"
              alt={site.name}
              width={160}
              height={48}
              className="logo-img"
              priority
            />
            <span className="logo-text">
              Coclí <span>Hotel</span>
            </span>
          </a>
          <nav className="nav-links" aria-label="Navegación principal">
            <a href="#menu">Menú</a>
            <a href="#about">Hotel</a>
            <a href="#gallery">Galería</a>
            <a href="#reviews">Reseñas</a>
            <a href="#contact">Contacto</a>
          </nav>
          <a href={site.whatsapp} className="nav-cta" target="_blank" rel="noopener noreferrer">
            Reservar
          </a>
          <button
            className="menu-toggle"
            aria-label="Abrir menú"
            aria-expanded="false"
            type="button"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <PremiumHero />

      <section className="menu" id="menu" aria-labelledby="menu-heading">
        <div className="container">
          <header className="section-header reveal">
            <p className="section-label">Restaurante & bar</p>
            <h2 className="section-title" id="menu-heading" data-reveal-title>
              Menú digital
            </h2>
          </header>
          <p className="menu-intro reveal">
            Explora nuestro menú completo con precios actualizados. Pide desde la
            mesa o reserva tu experiencia gastronómica en Coclí Hotel.
          </p>
          <div className="menu-grid">
            <article className="menu-card reveal">
              <div className="menu-card-img">
                <img
                  src="/images/gallery-1.jpg"
                  alt="Platos del restaurante Coclí Hotel"
                  width={600}
                  height={450}
                  loading="lazy"
                />
              </div>
              <div className="menu-card-body">
                <span className="menu-card-tag">Restaurante</span>
                <h3>Cocina de la región</h3>
                <p>
                  Sabores del Valle con ingredientes frescos, preparaciones de
                  autor y el sello Coclí Mágica.
                </p>
                <div className="menu-card-footer">
                  <a
                    href={site.menuUrl}
                    className="btn-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver menú
                  </a>
                </div>
              </div>
            </article>

            <article className="menu-card reveal">
              <div className="menu-card-img">
                <img
                  src="/images/gallery-2.jpg"
                  alt="Habitaciones y confort en Coclí Hotel"
                  width={600}
                  height={450}
                  loading="lazy"
                />
              </div>
              <div className="menu-card-body">
                <span className="menu-card-tag">Hospedaje</span>
                <h3>Habitaciones premium</h3>
                <p>
                  Baño privado, productos eco-amigables, aire acondicionado,
                  Netflix, minibar y cajilla de seguridad.
                </p>
                <div className="menu-card-footer">
                  <a href={site.website} className="btn-sm" target="_blank" rel="noopener noreferrer">
                    Ver habitaciones
                  </a>
                </div>
              </div>
            </article>

            <article className="menu-card reveal">
              <div className="menu-card-img">
                <img
                  src="/images/hero-hotel.jpg"
                  alt="Experiencias en Coclí Hotel"
                  width={600}
                  height={450}
                  loading="lazy"
                />
              </div>
              <div className="menu-card-body">
                <span className="menu-card-tag">Experiencias</span>
                <h3>Mr. Coffee & más</h3>
                <p>
                  Disfruta café de especialidad, eventos y la magia de nuestros
                  espacios en el centro de Roldanillo.
                </p>
                <div className="menu-card-footer">
                  <a
                    href={site.instagram}
                    className="btn-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Instagram
                  </a>
                </div>
              </div>
            </article>
          </div>
          <div className="menu-cta-wrap reveal">
            <a
              href={site.menuUrl}
              className="btn btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Abrir menú en Menüpp
            </a>
          </div>
        </div>
      </section>

      <section className="about" id="about" aria-labelledby="about-heading">
        <div className="about-parallax-bg" aria-hidden="true" />
        <div className="container">
          <div className="about-grid">
            <div className="about-image-wrap reveal-left">
              <img
                src="/images/gallery-2.jpg"
                alt="Instalaciones de Coclí Hotel"
                width={600}
                height={750}
                loading="lazy"
              />
              <div className="about-float" data-parallax="0.2">
                <img
                  src="/images/logo.png"
                  alt="Logo Coclí Hotel"
                  width={280}
                  height={280}
                  loading="lazy"
                />
              </div>
            </div>
            <div className="about-content reveal-right">
              <p className="section-label">Nuestro hotel</p>
              <h2 id="about-heading">
                Descanso boutique en el <em>corazón</em> de Roldanillo
              </h2>
              <p>
                Coclí Hotel combina hospedaje cómodo, restaurante y espacios para
                vivir la cultura del Valle del Cauca. Estamos en el centro, cerca
                de todo lo que necesitas para tu viaje.
              </p>
              <p>
                Cada habitación incluye baño privado, productos eco-amigables,
                agua caliente, aire acondicionado, Netflix, minibar, cajilla de
                seguridad y cafetera.
              </p>
              <div className="stats">
                <div className="stat-item reveal">
                  <div className="stat-num" data-count="24">
                    0
                  </div>
                  <div className="stat-label">Horas recepción</div>
                </div>
                <div className="stat-item reveal">
                  <div className="stat-num" data-count="100">
                    0
                  </div>
                  <div className="stat-label">% confort</div>
                </div>
                <div className="stat-item reveal">
                  <div className="stat-num" data-count="1">
                    0
                  </div>
                  <div className="stat-label">Ubicación céntrica</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="promo" aria-label="Reserva directa">
        <div className="promo-inner promo-cocli">
          <div className="promo-bg" role="img" aria-label="Ambiente del hotel" />
          <div className="promo-overlay" />
          <div className="promo-content reveal">
            <p className="section-label">Reserva ahora</p>
            <h2>Tu estadía perfecta en Roldanillo</h2>
            <p>
              Escríbenos por WhatsApp o visita nuestro sitio oficial para
              disponibilidad, habitaciones y promociones.
            </p>
            <a href={site.whatsapp} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="gallery" id="gallery" aria-labelledby="gallery-heading">
        <div className="container">
          <header className="section-header reveal">
            <p className="section-label">Galería</p>
            <h2 className="section-title" id="gallery-heading" data-reveal-title>
              Nuestros espacios
            </h2>
          </header>
          <div className="gallery-masonry">
            <figure className="gallery-item tall reveal">
              <img
                src="/images/hero-hotel.jpg"
                alt="Fachada y ambiente Coclí Hotel"
                width={500}
                height={700}
                loading="lazy"
              />
            </figure>
            <figure className="gallery-item reveal">
              <img
                src="/images/gallery-1.jpg"
                alt="Interior habitación"
                width={500}
                height={400}
                loading="lazy"
              />
            </figure>
            <figure className="gallery-item reveal">
              <img
                src="/images/gallery-2.jpg"
                alt="Detalle hotel boutique"
                width={500}
                height={400}
                loading="lazy"
              />
            </figure>
          </div>
        </div>
      </section>

      <section className="testimonials" id="reviews" aria-labelledby="reviews-heading">
        <div className="container">
          <header className="section-header reveal">
            <p className="section-label">Huéspedes</p>
            <h2 className="section-title" id="reviews-heading" data-reveal-title>
              Reseñas
            </h2>
          </header>
        </div>
        <div className="testimonials-track-wrap">
          <div className="testimonials-track" aria-label="Reseñas">
            <blockquote className="testimonial-card">
              <div className="testimonial-stars" aria-label="5 estrellas">★★★★★</div>
              <p>
                &ldquo;Excelente ubicación en el centro. Habitaciones limpias,
                personal amable y muy buen restaurante.&rdquo;
              </p>
              <footer className="testimonial-author">
                <div className="testimonial-avatar" aria-hidden="true">MV</div>
                <div>
                  <strong>María V.</strong>
                  <span>Huésped · Google</span>
                </div>
              </footer>
            </blockquote>
            <blockquote className="testimonial-card">
              <div className="testimonial-stars" aria-label="5 estrellas">★★★★★</div>
              <p>
                &ldquo;Perfecto para descansar en Roldanillo. Buen precio,
                confort y la comida del restaurante es deliciosa.&rdquo;
              </p>
              <footer className="testimonial-author">
                <div className="testimonial-avatar" aria-hidden="true">JR</div>
                <div>
                  <strong>Juan R.</strong>
                  <span>Viajero</span>
                </div>
              </footer>
            </blockquote>
            <blockquote className="testimonial-card" aria-hidden="true">
              <div className="testimonial-stars" aria-hidden="true">★★★★★</div>
              <p>
                &ldquo;Excelente ubicación en el centro. Habitaciones limpias y
                personal amable.&rdquo;
              </p>
              <footer className="testimonial-author">
                <div className="testimonial-avatar">MV</div>
                <div><strong>María V.</strong><span>Huésped</span></div>
              </footer>
            </blockquote>
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
                Reserva tu habitación o mesa. Estamos en el centro de Roldanillo.
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
                    <p>
                      {site.address}
                      <br />
                      {site.city}
                    </p>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 4h3l2 5-2 1a11 11 0 0 0 5 5l1-2 5 2v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h4>Teléfono</h4>
                    <p>
                      <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a>
                    </p>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M4 6h16v12H4z" />
                      <path d="M4 6l8 7 8-7" />
                    </svg>
                  </div>
                  <div>
                    <h4>Correo</h4>
                    <p>
                      <a href={`mailto:${site.email}`}>{site.email}</a>
                    </p>
                  </div>
                </div>
              </div>
              <form className="contact-form" aria-label="Formulario de contacto">
                <input type="text" name="name" placeholder="Tu nombre" required autoComplete="name" />
                <input type="email" name="email" placeholder="Correo electrónico" required autoComplete="email" />
                <textarea name="message" placeholder="Tu mensaje o reserva" required />
                <button type="submit" className="btn btn-primary">Enviar mensaje</button>
              </form>
            </div>
            <div className="map-container reveal-right" aria-label="Mapa">
              <iframe
                title={`Ubicación de ${site.name}`}
                src={site.mapsEmbed}
                allowFullScreen
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
              <Image src="/images/logo.png" alt={site.name} width={140} height={42} className="logo-img" />
              <p>{site.tagline}. Hospedaje, gastronomía y experiencias en Roldanillo.</p>
              <div className="social-links" aria-label="Redes sociales">
                <a href={site.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  IG
                </a>
                <a href={site.website} target="_blank" rel="noopener noreferrer" aria-label="Sitio web">
                  Web
                </a>
                <a href={site.menuUrl} target="_blank" rel="noopener noreferrer" aria-label="Menú digital">
                  Menú
                </a>
              </div>
            </div>
            <div className="footer-col">
              <h4>Enlaces</h4>
              <ul>
                <li><a href="#menu">Menú digital</a></li>
                <li><a href="#about">El hotel</a></li>
                <li><a href="#contact">Contacto</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 {site.name}. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      <a
        href={site.whatsapp}
        className="whatsapp-float"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
      >
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </>
  );
}
