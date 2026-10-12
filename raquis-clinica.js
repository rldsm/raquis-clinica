(() => {
  'use strict';

  class RaquisClinica extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
      this.render();
      this.bind();
      this.mountGoogleReviews();
      if (!this.hasAttribute('contained')) {
        this.fullBleed();
        this._resize = () => this.fullBleed();
        window.addEventListener('resize', this._resize, { passive: true });
      }
    }

    disconnectedCallback() {
      if (this._resize) window.removeEventListener('resize', this._resize);
    }

    fullBleed() {
      const w = document.documentElement.clientWidth || window.innerWidth;
      const s = this.style;
      s.setProperty('display', 'block', 'important');
      s.setProperty('position', 'relative', 'important');
      s.setProperty('left', `calc(50% - ${w / 2}px)`, 'important');
      s.setProperty('width', `${w}px`, 'important');
      s.setProperty('max-width', 'none', 'important');
      s.setProperty('margin-left', '0', 'important');
      s.setProperty('margin-right', '0', 'important');
    }

    bookingUrl() {
      return this.getAttribute('booking-url') || '#agenda';
    }

    specialtyUrl(key) {
      return this.getAttribute(`booking-${key}`) || this.bookingUrl();
    }

    whatsappUrl() {
      return this.getAttribute('whatsapp-url') || '#contacto';
    }

    render() {
      this.shadowRoot.innerHTML = `
        <style>
          :host{
            --orange:#E84A05;--orange-dark:#C83D00;--ink:#241F1D;--muted:#6D655F;--line:#E9DED7;
            --soft:#FBF7F4;--cream:#FFF9F5;
            display:block;background:#fff;color:var(--ink);text-align:left;
            font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
            -webkit-font-smoothing:antialiased
          }
          *{box-sizing:border-box}
          .page{overflow:hidden;background:#fff}
          .wrap{width:min(100% - 28px,1180px);margin:0 auto}
          .section{padding:48px 0}
          .section.alt{background:var(--soft)}
          .kicker{margin:0 0 8px;color:var(--orange);font-size:.74rem;font-weight:850;letter-spacing:.07em;text-transform:uppercase}
          .section-head{max-width:760px;margin-bottom:24px}
          .section-head.center{text-align:center;margin-left:auto;margin-right:auto}
          .section-head h2{margin:0 0 10px;font-size:clamp(2rem,9vw,3.35rem);line-height:1.03;letter-spacing:-.045em}
          .section-head p{margin:0;color:var(--muted);font-size:1rem;line-height:1.6}
          .btn{min-height:52px;padding:0 18px;border-radius:12px;display:flex;align-items:center;justify-content:center;text-align:center;text-decoration:none;font-size:.9rem;font-weight:850}
          .btn-primary{background:var(--orange);color:#fff}.btn-primary:hover{background:var(--orange-dark)}
          .btn-secondary{background:#fff;border:1px solid #e3cfc3;color:var(--orange)}

          .hero{padding:28px 0 0;background:linear-gradient(180deg,#fff 0%,var(--cream) 100%)}
          .hero-card{min-height:520px;border-radius:24px;overflow:hidden;position:relative;background:linear-gradient(135deg,#f2e7e0,#fff);border:1px solid var(--line)}
          .hero-media{position:absolute;inset:0;display:grid;place-items:center;text-align:center;color:#8f7b70;font-size:.82rem}
          .hero-media:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(27,22,20,.76) 0%,rgba(27,22,20,.54) 48%,rgba(27,22,20,.08) 100%)}
          .hero-media-placeholder{position:relative;z-index:0}
          .hero-content{position:relative;z-index:2;min-height:520px;display:flex;flex-direction:column;justify-content:flex-end;padding:28px 22px 118px;color:#fff}
          .eyebrow{display:inline-flex;align-self:flex-start;padding:7px 11px;border:1px solid rgba(255,255,255,.45);border-radius:999px;font-size:.75rem;font-weight:800;letter-spacing:.05em}
          .hero h1{margin:14px 0 12px;font-size:clamp(2.65rem,13vw,4.9rem);line-height:.96;letter-spacing:-.052em;max-width:720px}
          .hero-lead{margin:0;max-width:650px;color:#f1eae6;font-size:1rem;line-height:1.58}
          .hero-actions{display:grid;gap:10px;margin-top:22px}
          .hero-note{margin:12px 0 0;color:#f0e8e4;font-size:.84rem;line-height:1.45}

          .quick-panel{position:relative;z-index:3;margin:-82px 14px 0;background:#fff;border:1px solid var(--line);border-radius:18px;box-shadow:0 18px 44px rgba(46,35,29,.12);display:grid;grid-template-columns:1fr 1fr}
          .quick-item{padding:17px 12px;text-align:center;min-height:88px;display:flex;flex-direction:column;justify-content:center}
          .quick-item:nth-child(odd){border-right:1px solid var(--line)}.quick-item:nth-child(-n+2){border-bottom:1px solid var(--line)}
          .quick-item strong{display:block;color:var(--orange);font-size:1.2rem;line-height:1}.quick-item span{display:block;margin-top:6px;color:var(--muted);font-size:.76rem;line-height:1.25}

          .specialty-grid{display:grid;gap:14px}
          .specialty-card{border:1px solid var(--line);border-radius:18px;background:#fff;overflow:hidden}
          .specialty-media{min-height:220px;background:#f2e8e2;display:grid;place-items:center;text-align:center;color:#927c71;font-size:.8rem}
          .specialty-body{padding:20px}
          .specialty-body h3{margin:0 0 7px;font-size:1.2rem}
          .specialty-body p{margin:0 0 16px;color:var(--muted);font-size:.92rem;line-height:1.52}
          .specialty-card.primary{border-color:#efc1aa}
          .specialty-tag{display:inline-flex;margin-bottom:10px;padding:5px 9px;border-radius:999px;background:#fff0e8;color:var(--orange);font-size:.71rem;font-weight:850}

          .process{display:grid;gap:26px}
          .steps{display:grid;gap:0;border-top:1px solid var(--line)}
          .step{display:grid;grid-template-columns:42px 1fr;gap:14px;padding:15px 0;border-bottom:1px solid var(--line)}
          .step-num{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;background:#fff0e8;color:var(--orange);font-weight:900}
          .step h3{margin:1px 0 4px;font-size:1rem}.step p{margin:0;color:var(--muted);font-size:.91rem;line-height:1.48}

          .team-grid{display:grid;gap:14px}
          .person-card{border:1px solid var(--line);border-radius:18px;background:#fff;overflow:hidden}
          .person-media{min-height:260px;background:#f5ebe5;display:grid;place-items:center;text-align:center;color:#917c71;font-size:.8rem}
          .person-body{padding:18px}.person-body h3{margin:0 0 5px;font-size:1.08rem}.person-body p{margin:0;color:var(--muted);line-height:1.48;font-size:.9rem}
          .person-body .btn{margin-top:14px;width:100%}

          .video-grid{display:grid;gap:14px}
          .video-card{border:1px solid var(--line);border-radius:18px;background:#fff;overflow:hidden}
          .video-thumb{min-height:360px;background:#f1e7e1;display:grid;place-items:center;text-align:center;color:#907a70;font-size:.8rem;position:relative}
          .play{width:58px;height:58px;border-radius:50%;display:grid;place-items:center;background:var(--orange);color:#fff;font-size:1.2rem;margin:0 auto 10px}
          .video-body{padding:16px}.video-body strong{display:block}.video-body span{display:block;margin-top:4px;color:var(--muted);font-size:.86rem}

          .reviews-frame{min-height:190px;border:1px solid var(--line);border-radius:18px;background:#fff;padding:16px;box-shadow:0 10px 30px rgba(57,39,29,.05)}
          ::slotted([slot="google-reviews"]){display:block;width:100%}.reviews-loading{min-height:150px;display:grid;place-items:center;text-align:center;color:var(--muted);font-size:.9rem}

          .clinic-grid{display:grid;gap:14px}
          .clinic-card{border:1px solid var(--line);border-radius:18px;background:#fff;overflow:hidden}
          .clinic-media{min-height:250px;background:#f5ebe5;display:grid;place-items:center;text-align:center;color:#917c71;font-size:.8rem}
          .clinic-body{padding:18px}.clinic-body h3{margin:0 0 6px;font-size:1.1rem}.clinic-body p{margin:0 0 8px;color:var(--muted);line-height:1.48;font-size:.9rem}
          .clinic-actions{display:grid;gap:9px;margin-top:14px}

          .faq-list{display:grid;gap:10px}
          .faq-list details{border:1px solid var(--line);border-radius:13px;background:#fff;padding:15px 16px}
          .faq-list summary{cursor:pointer;font-weight:750}.faq-list p{margin:10px 0 0;color:var(--muted);line-height:1.5;font-size:.92rem}

          .final-cta{padding:48px 0;background:var(--orange);color:#fff}
          .final-cta h2{margin:0 0 10px;font-size:clamp(2rem,9vw,3.1rem);line-height:1.04;letter-spacing:-.04em}
          .final-cta p{margin:0;max-width:720px;color:#fff2eb;line-height:1.55}
          .final-actions{display:grid;gap:10px;margin-top:20px}
          .final-cta .btn-primary{background:#fff;color:var(--orange)}
          .final-cta .btn-secondary{border-color:rgba(255,255,255,.5);background:transparent;color:#fff}

          @media(min-width:720px){
            .wrap{width:min(100% - 48px,1180px)}
            .hero-content{padding:44px 44px 126px}
            .hero-actions,.final-actions{display:flex}.btn{width:auto;min-width:190px}
            .quick-panel{grid-template-columns:repeat(4,1fr);margin:-72px 28px 0}
            .quick-item{border-bottom:0!important;border-right:1px solid var(--line)!important}.quick-item:last-child{border-right:0!important}
            .specialty-grid{grid-template-columns:repeat(3,1fr)}
            .process{grid-template-columns:.9fr 1.1fr;gap:48px;align-items:start}
            .team-grid{grid-template-columns:repeat(2,1fr)}
            .video-grid{grid-template-columns:repeat(3,1fr)}
            .clinic-grid{grid-template-columns:repeat(2,1fr)}
            .clinic-actions{grid-template-columns:1fr 1fr}
          }
          @media(min-width:980px){
            .hero{padding-top:38px}.hero-card{min-height:580px}.hero-content{min-height:580px;padding:64px 64px 138px}.hero h1{font-size:4.8rem}
            .section{padding:72px 0}
            .team-grid{grid-template-columns:repeat(4,1fr)}
          }
        </style>

        <main class="page">
          <section class="hero">
            <div class="wrap">
              <div class="hero-card">
                <div class="hero-media"><div class="hero-media-placeholder">FOTO HERO REAL DE QUIROPRÁCTICA</div></div>
                <div class="hero-content">
                  <span class="eyebrow">CLÍNICA RAQUIS</span>
                  <h1>Quiropráctica para volver a moverte mejor</h1>
                  <p class="hero-lead">Evaluamos tu caso y definimos una atención personalizada según tus necesidades.</p>
                  <div class="hero-actions">
                    <a class="btn btn-primary" href="${this.bookingUrl()}">AGENDAR HORA</a>
                    <a class="btn btn-secondary" href="${this.whatsappUrl()}">HABLAR POR WHATSAPP</a>
                  </div>
                  <p class="hero-note">Evaluación + tratamiento desde la primera sesión, si corresponde a tu caso.</p>
                </div>
              </div>
              <div class="quick-panel">
                <div class="quick-item"><strong>+40.000</strong><span>pacientes atendidos</span></div>
                <div class="quick-item"><strong>+9 años</strong><span>de trayectoria</span></div>
                <div class="quick-item"><strong>+15 años</strong><span>de experiencia clínica</span></div>
                <div class="quick-item"><strong>2 clínicas</strong><span>en Santiago</span></div>
              </div>
            </div>
          </section>

          <section class="section">
            <div class="wrap">
              <div class="section-head center">
                <p class="kicker">Especialidades</p>
                <h2>Encuentra la atención adecuada para tu caso</h2>
                <p>La quiropráctica es nuestra atención principal. Kinesiología y masoterapia pueden complementar el proceso cuando corresponde.</p>
              </div>
              <div class="specialty-grid">
                <article class="specialty-card primary">
                  <div class="specialty-media">FOTO QUIROPRÁCTICA</div>
                  <div class="specialty-body"><span class="specialty-tag">ATENCIÓN PRINCIPAL</span><h3>Quiropráctica</h3><p>Para molestias musculoesqueléticas, movilidad y evaluación del sistema musculoesquelético mediante un enfoque manual y conservador.</p><a class="btn btn-primary" href="${this.specialtyUrl('quiropractica')}">AGENDAR EVALUACIÓN</a></div>
                </article>
                <article class="specialty-card">
                  <div class="specialty-media">FOTO KINESIOLOGÍA</div>
                  <div class="specialty-body"><h3>Kinesiología</h3><p>Puede apoyar procesos de recuperación, movilidad, ejercicio terapéutico y terapia manual.</p><a class="btn btn-secondary" href="${this.specialtyUrl('kinesiologia')}">VER DISPONIBILIDAD</a></div>
                </article>
                <article class="specialty-card">
                  <div class="specialty-media">FOTO MASOTERAPIA</div>
                  <div class="specialty-body"><h3>Masoterapia</h3><p>Atención complementaria orientada a tensión muscular y bienestar corporal.</p><a class="btn btn-secondary" href="${this.specialtyUrl('masoterapia')}">VER DISPONIBILIDAD</a></div>
                </article>
              </div>
            </div>
          </section>

          <section class="section alt">
            <div class="wrap process">
              <div class="section-head">
                <p class="kicker">Cómo funciona la atención</p>
                <h2>Desde la reserva hasta tu plan de atención</h2>
                <p>El proceso está pensado para que sepas qué ocurrirá antes de llegar a la clínica.</p>
              </div>
              <div class="steps">
                <div class="step"><div class="step-num">1</div><div><h3>Reserva en Medilink</h3><p>Elige especialidad, profesional, sucursal y horario disponible.</p></div></div>
                <div class="step"><div class="step-num">2</div><div><h3>Evaluación inicial</h3><p>Revisamos antecedentes, síntomas y movilidad según tu motivo de consulta.</p></div></div>
                <div class="step"><div class="step-num">3</div><div><h3>Explicamos lo que encontramos</h3><p>Te contamos los hallazgos de la evaluación y los próximos pasos.</p></div></div>
                <div class="step"><div class="step-num">4</div><div><h3>Definimos un plan</h3><p>Cuando corresponde, definimos un plan de atención acorde a tu caso.</p></div></div>
              </div>
            </div>
          </section>

          <section class="section">
            <div class="wrap">
              <div class="section-head center">
                <p class="kicker">Profesionales</p>
                <h2>Conoce a quienes te van a atender</h2>
                <p>Mostraremos fotografía real, formación, especialidad y área de atención de cada profesional.</p>
              </div>
              <div class="team-grid">
                ${[1,2,3,4].map(i => `<article class="person-card"><div class="person-media">FOTO PROFESIONAL ${i}</div><div class="person-body"><h3>Nombre profesional</h3><p>Especialidad · formación principal · área de atención.</p><a class="btn btn-secondary" href="${this.bookingUrl()}">AGENDAR CON ESTE PROFESIONAL</a></div></article>`).join('')}
              </div>
            </div>
          </section>

          <section class="section alt">
            <div class="wrap">
              <div class="section-head center">
                <p class="kicker">Testimonios</p>
                <h2>Experiencias de pacientes reales</h2>
                <p>Tres videos breves, con subtítulos y carga optimizada para celular.</p>
              </div>
              <div class="video-grid">
                ${[1,2,3].map(i => `<article class="video-card"><div class="video-thumb"><div><div class="play">▶</div>VIDEO TESTIMONIO ${i}</div></div><div class="video-body"><strong>Paciente Raquis</strong><span>Especialidad o sucursal relacionada</span></div></article>`).join('')}
              </div>
            </div>
          </section>

          <section class="section">
            <div class="wrap">
              <div class="section-head center">
                <p class="kicker">Reseñas de Google</p>
                <h2>Lo que dicen nuestros pacientes</h2>
                <p>Reseñas reales y verificables de pacientes de Raquis.</p>
              </div>
              <div class="reviews-frame"><slot name="google-reviews"><div class="reviews-loading">Cargando reseñas de Google…</div></slot></div>
            </div>
          </section>

          <section class="section alt">
            <div class="wrap">
              <div class="section-head center">
                <p class="kicker">Sucursales</p>
                <h2>Elige la clínica que más te acomode</h2>
                <p>Consulta ubicación, horario y agenda directamente en Medilink.</p>
              </div>
              <div class="clinic-grid">
                <article class="clinic-card">
                  <div class="clinic-media">FOTO SANTIAGO CENTRO</div>
                  <div class="clinic-body"><h3>Santiago Centro</h3><p>Nueva York 57, Of. 603 · Metro Universidad de Chile.</p><p>Horario y especialidades: por completar.</p><div class="clinic-actions"><a class="btn btn-secondary" href="https://www.google.com/maps/search/?api=1&query=Nueva+York+57+Oficina+603+Santiago+Centro+Chile" target="_blank" rel="noopener noreferrer">VER EN MAPS</a><a class="btn btn-primary" href="${this.specialtyUrl('santiago')}">AGENDAR AQUÍ</a></div></div>
                </article>
                <article class="clinic-card">
                  <div class="clinic-media">FOTO PROVIDENCIA</div>
                  <div class="clinic-body"><h3>Providencia</h3><p>Dr. Manuel Barros Borgoño 71, Of. 806 · Metro Manuel Montt.</p><p>Horario y especialidades: por completar.</p><div class="clinic-actions"><a class="btn btn-secondary" href="https://www.google.com/maps/search/?api=1&query=Dr+Manuel+Barros+Borgono+71+Oficina+806+Providencia+Chile" target="_blank" rel="noopener noreferrer">VER EN MAPS</a><a class="btn btn-primary" href="${this.specialtyUrl('providencia')}">AGENDAR AQUÍ</a></div></div>
                </article>
              </div>
            </div>
          </section>

          <section class="section">
            <div class="wrap">
              <div class="section-head center">
                <p class="kicker">Preguntas frecuentes</p>
                <h2>Resuelve tus dudas antes de agendar</h2>
              </div>
              <div class="faq-list">
                <details><summary>¿Cómo sé qué especialidad elegir?</summary><p>Si tienes dudas, puedes escribirnos por WhatsApp para orientarte antes de reservar.</p></details>
                <details><summary>¿Qué incluye la primera evaluación?</summary><p>Revisión de antecedentes, síntomas, movilidad y las pruebas clínicas necesarias según tu motivo de consulta.</p></details>
                <details><summary>¿Qué debo llevar?</summary><p>Información por confirmar con el equipo de Raquis.</p></details>
                <details><summary>¿Cuánto dura aproximadamente la atención?</summary><p>Información por confirmar con el equipo de Raquis.</p></details>
                <details><summary>¿Tienen convenios, reembolsos o distintos medios de pago?</summary><p>Información por confirmar con el equipo de Raquis.</p></details>
                <details><summary>¿Cuál es la política de cambio o cancelación de horas?</summary><p>Información por confirmar con el equipo de Raquis.</p></details>
              </div>
            </div>
          </section>

          <section class="final-cta" id="agenda">
            <div class="wrap">
              <h2>Agenda tu hora en Raquis</h2>
              <p>La reserva se realiza directamente en Medilink. Si tienes dudas antes de reservar, puedes escribirnos por WhatsApp.</p>
              <div class="final-actions">
                <a class="btn btn-primary" href="${this.bookingUrl()}">AGENDAR HORA EN MEDILINK</a>
                <a class="btn btn-secondary" href="${this.whatsappUrl()}">HABLAR POR WHATSAPP</a>
              </div>
            </div>
          </section>
        </main>
      `;
    }

    mountGoogleReviews() {
      if (this.querySelector('[data-raquis-google-reviews]')) return;

      const host = document.createElement('div');
      host.setAttribute('slot', 'google-reviews');
      host.setAttribute('data-raquis-google-reviews', '');
      host.style.width = '100%';

      const script = document.createElement('script');
      script.src = 'https://cdn.trustindex.io/loader.js?cc33fc47993d918046660850d56';
      script.defer = true;
      script.async = true;

      host.appendChild(script);
      this.appendChild(host);
    }

    bind() {
      this.shadowRoot.querySelectorAll('.js-scroll').forEach(link => {
        link.addEventListener('click', event => {
          const targetId = link.dataset.target;
          const target = targetId ? this.shadowRoot.getElementById(targetId) : null;
          if (!target) return;
          event.preventDefault();
          target.scrollIntoView({ behavior:'smooth', block:'start' });
        });
      });
    }
  }

  if (!customElements.get('raquis-clinica')) {
    customElements.define('raquis-clinica', RaquisClinica);
  }
})();