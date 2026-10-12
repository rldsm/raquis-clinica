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

    whatsappUrl() {
      return this.getAttribute('whatsapp-url') || '#contacto';
    }

    render() {
      this.shadowRoot.innerHTML = `
        <style>
          :host{
            --orange:#E84A05;--orange-dark:#C83D00;--ink:#241F1D;--muted:#6D655F;--line:#E9DED7;
            --soft:#FBF7F4;--cream:#FFF9F5;--dark:#201C1A;
            display:block;background:#fff;color:var(--ink);text-align:left;
            font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
            -webkit-font-smoothing:antialiased
          }
          *{box-sizing:border-box}
          .page{overflow:hidden;background:#fff}
          .wrap{width:min(100% - 28px,1180px);margin:0 auto}
          .kicker{margin:0 0 8px;color:var(--orange);font-size:.74rem;font-weight:850;letter-spacing:.07em;text-transform:uppercase}
          .section{padding:48px 0}
          .section.alt{background:var(--soft)}#primera-sesion{padding-top:44px;padding-bottom:44px}
          .section-head{max-width:760px;margin-bottom:24px}
          .section-head.center{text-align:center;margin-left:auto;margin-right:auto}
          .section-head h2{margin:0 0 10px;font-size:clamp(2rem,9vw,3.35rem);line-height:1.03;letter-spacing:-.045em}
          .section-head p{margin:0;color:var(--muted);font-size:1rem;line-height:1.6}
          .btn{min-height:52px;padding:0 18px;border-radius:12px;display:flex;align-items:center;justify-content:center;text-align:center;text-decoration:none;font-size:.9rem;font-weight:850}
          .btn-primary{background:var(--orange);color:#fff}
          .btn-primary:hover{background:var(--orange-dark)}
          .btn-secondary{background:#fff;border:1px solid #e3cfc3;color:var(--orange)}

          /* Hero inspired by the reference: strong image + utility panel overlapping */
          .hero{padding:28px 0 0;background:linear-gradient(180deg,#fff 0%,var(--cream) 100%)}
          .hero-shell{position:relative}
          .hero-card{min-height:520px;border-radius:24px;overflow:hidden;position:relative;background:linear-gradient(135deg,#f2e7e0,#fff);border:1px solid var(--line)}
          .hero-media{position:absolute;inset:0;display:grid;place-items:center;text-align:center;color:#8f7b70;font-size:.82rem}
          .hero-media:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(27,22,20,.76) 0%,rgba(27,22,20,.56) 46%,rgba(27,22,20,.08) 100%)}
          .hero-media-placeholder{position:relative;z-index:0}
          .hero-content{position:relative;z-index:2;min-height:520px;display:flex;flex-direction:column;justify-content:flex-end;padding:28px 22px 118px;color:#fff}
          .eyebrow{display:inline-flex;align-self:flex-start;padding:7px 11px;border:1px solid rgba(255,255,255,.45);border-radius:999px;font-size:.75rem;font-weight:800;letter-spacing:.05em}
          .hero h1{margin:14px 0 12px;font-size:clamp(2.65rem,13vw,4.9rem);line-height:.96;letter-spacing:-.052em;max-width:720px}
          .hero-lead{margin:0;max-width:650px;color:#f1eae6;font-size:1rem;line-height:1.58}
          .hero-actions{display:grid;gap:10px;margin-top:22px}
          .hero-note{margin:12px 0 0;color:#f0e8e4;font-size:.84rem;line-height:1.45}

          .quick-panel{position:relative;z-index:3;margin:-82px 14px 0;background:#fff;border:1px solid var(--line);border-radius:18px;box-shadow:0 18px 44px rgba(46,35,29,.12);display:grid;grid-template-columns:1fr 1fr}
          .quick-item{padding:17px 12px;text-align:center;min-height:88px;display:flex;flex-direction:column;justify-content:center}
          .quick-item:nth-child(odd){border-right:1px solid var(--line)}
          .quick-item:nth-child(-n+2){border-bottom:1px solid var(--line)}
          .quick-item strong{display:block;color:var(--orange);font-size:1.2rem;line-height:1}
          .quick-item span{display:block;margin-top:6px;color:var(--muted);font-size:.76rem;line-height:1.25}

          /* Symptoms as visual categories */
          .symptom-scroll{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
          .symptom-card{min-height:148px;border:1px solid var(--line);border-radius:16px;background:#fff;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-start;padding:22px 18px;position:relative}
          .symptom-card:before{content:"";position:absolute;inset:0;background:linear-gradient(180deg,#fbf2ec 0%,#fff 70%)}
          .symptom-card strong{position:relative;z-index:1;display:block;min-height:2.45em;font-size:1rem;line-height:1.22}
          .symptom-card span{position:relative;z-index:1;margin-top:8px;color:var(--muted);font-size:.78rem;line-height:1.4}

          /* First visit: no generic cards, more editorial */
          .first-visit{display:grid;gap:22px}
          .steps{display:grid;gap:0;border-top:1px solid var(--line);align-self:start}
          .step{display:grid;grid-template-columns:44px 1fr;gap:14px;padding:14px 0;border-bottom:1px solid var(--line)}
          .step-num{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;background:#fff0e8;color:var(--orange);font-weight:900}
          .step h3{margin:1px 0 4px;font-size:1rem}
          .step p{margin:0;color:var(--muted);font-size:.91rem;line-height:1.48}
          .step:last-child h3{color:var(--orange)}

          /* Services like highlighted specialties in reference */
          .service-grid{display:grid;gap:14px}
          .service-card{border:1px solid var(--line);border-radius:18px;background:#fff;overflow:hidden}
          .service-card.main{border-color:#efc1aa}
          .service-media{min-height:220px;background:#f2e8e2;display:grid;place-items:center;text-align:center;color:#927c71;font-size:.8rem}
          .service-body{padding:20px}
          .service-body h3{margin:0 0 8px;font-size:1.25rem}
          .service-body p{margin:0;color:var(--muted);line-height:1.52;font-size:.93rem}
          .service-tag{display:inline-flex;margin-bottom:10px;padding:5px 9px;border-radius:999px;background:#fff0e8;color:var(--orange);font-size:.72rem;font-weight:850}

          /* Reasons */
          .reason-grid{display:grid;gap:12px}
          .reason{padding:22px 0;border-top:1px solid var(--line)}
          .reason:first-child{border-top:0}
          .reason h3{margin:0 0 7px;font-size:1.08rem}
          .reason p{margin:0;color:var(--muted);line-height:1.54;font-size:.92rem}

          /* Dark institutional section inspired by reference */
          .about-dark{padding:54px 0;background:linear-gradient(180deg,#E84A05 0%,#D94300 100%);color:#fff}
          .about-grid{display:grid;gap:28px}
          .about-collage{display:grid;grid-template-columns:1fr 1fr;gap:10px}
          .about-photo{min-height:150px;border-radius:14px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.18);display:grid;place-items:center;text-align:center;color:#fff3ec;font-size:.75rem}
          .about-photo.large{grid-row:span 2;min-height:310px}
          .about-copy h2{margin:0 0 12px;font-size:clamp(2rem,9vw,3.2rem);line-height:1.04;letter-spacing:-.04em}
          .about-copy p{margin:0;color:#fff0e8;line-height:1.6}
          .about-points{margin-top:20px;display:grid;gap:10px}
          .about-point{padding:14px 0;border-top:1px solid rgba(255,255,255,.22)}
          .about-point strong{display:block;margin-bottom:4px}
          .about-point span{color:#fff0e8;font-size:.9rem;line-height:1.45}

          /* Reviews / team */
          .reviews-frame{min-height:190px;border:1px solid var(--line);border-radius:18px;background:#fff;padding:16px;box-shadow:0 10px 30px rgba(57,39,29,.05)}::slotted([slot="google-reviews"]){display:block;width:100%}.reviews-loading{min-height:150px;display:grid;place-items:center;text-align:center;color:var(--muted);font-size:.9rem}
          .team-grid,.clinic-grid{display:grid;gap:14px}
          .person-card,.clinic-card{border:1px solid var(--line);border-radius:18px;background:#fff;overflow:hidden}
          .person-media,.clinic-media{min-height:260px;background:#f5ebe5;display:grid;place-items:center;text-align:center;color:#917c71;font-size:.8rem}
          .person-body,.clinic-body{padding:18px}
          .person-body h3,.clinic-body h3{margin:0 0 5px;font-size:1.08rem}
          .person-body p,.clinic-body p{margin:0;color:var(--muted);line-height:1.48;font-size:.9rem}

          /* FAQ */
          .faq-list{display:grid;gap:10px}
          .faq-list details{border:1px solid var(--line);border-radius:13px;background:#fff;padding:15px 16px}
          .faq-list summary{cursor:pointer;font-weight:750}
          .faq-list p{margin:10px 0 0;color:var(--muted);line-height:1.5;font-size:.92rem}

          .final-cta{padding:48px 0;background:var(--orange);color:#fff}
          .final-cta h2{margin:0 0 10px;font-size:clamp(2rem,9vw,3.1rem);line-height:1.04;letter-spacing:-.04em}
          .final-cta p{margin:0;max-width:720px;color:#fff2eb;line-height:1.55}
          .final-actions{display:grid;gap:10px;margin-top:20px}
          .final-cta .btn-primary{background:#fff;color:var(--orange)}
          .final-cta .btn-secondary{border-color:rgba(255,255,255,.5);background:transparent;color:#fff}

          @media(min-width:720px){
            .wrap{width:min(100% - 48px,1180px)}
            .hero-content{padding:44px 44px 126px}
            .hero-actions,.final-actions{display:flex}
            .btn{width:auto;min-width:190px}
            .quick-panel{grid-template-columns:repeat(4,1fr);margin:-72px 28px 0}
            .quick-item{border-bottom:0!important;border-right:1px solid var(--line)!important}
            .quick-item:last-child{border-right:0!important}
            .symptom-scroll{grid-template-columns:repeat(4,1fr)}
            .service-grid{grid-template-columns:2fr 1fr 1fr}
            .service-card.main .service-media{min-height:320px}
            .reason-grid{grid-template-columns:repeat(3,1fr);gap:24px}
            .reason{border-top:0;border-left:1px solid var(--line);padding:0 0 0 24px}
            .reason:first-child{border-left:0;padding-left:0}
            .trust-cards{grid-template-columns:repeat(3,1fr)}
            .team-grid{grid-template-columns:repeat(2,1fr)}
            .clinic-grid{grid-template-columns:repeat(2,1fr)}
          }
          @media(min-width:980px){
            .hero{padding-top:38px}
            .hero-card{min-height:580px}
            .hero-content{min-height:580px;padding:64px 64px 138px}
            .hero h1{font-size:4.8rem}
            .section{padding:72px 0}
            .first-visit{grid-template-columns:.84fr 1.16fr;gap:38px;align-items:start}
            .about-grid{grid-template-columns:1fr 1fr;gap:52px;align-items:center}
            .team-grid{grid-template-columns:repeat(4,1fr)}
          }
        </style>

        <main class="page">
          <section class="hero">
            <div class="wrap hero-shell">
              <div class="hero-card">
                <div class="hero-media"><div class="hero-media-placeholder">FOTO HERO REAL DE QUIROPRÁCTICA</div></div>
                <div class="hero-content">
                  <span class="eyebrow">CLÍNICA RAQUIS</span>
                  <h1>Quiropráctica para volver a moverte mejor</h1>
                  <p class="hero-lead">Atención personalizada para molestias musculoesqueléticas con un enfoque conservador y no invasivo.</p>
                  <div class="hero-actions">
                    <a class="btn btn-primary js-scroll" href="#primera-sesion" data-target="primera-sesion">AGENDAR PRIMERA SESIÓN</a>
                    <a class="btn btn-secondary" href="${this.whatsappUrl()}">HABLAR POR WHATSAPP</a>
                  </div>
                  <p class="hero-note"><strong>Evaluación + tratamiento desde la primera sesión</strong>, si corresponde a tu caso.</p>
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
                <p class="kicker">Motivos de consulta</p>
                <h2>¿Dónde sientes molestias?</h2>
                <p>No necesitas saber qué tratamiento necesitas antes de venir. Primero evaluamos tu caso.</p>
              </div>
              <div class="symptom-scroll">
                <article class="symptom-card"><strong>Cuello</strong><span>Rigidez, tensión y molestias cervicales</span></article>
                <article class="symptom-card"><strong>Espalda y zona lumbar</strong><span>Molestias que afectan tu movilidad diaria</span></article>
                <article class="symptom-card"><strong>Hombros</strong><span>Tensión y limitación de movimiento</span></article>
                <article class="symptom-card"><strong>Rodillas y extremidades</strong><span>Molestias musculoesqueléticas y movilidad</span></article>
              </div>
            </div>
          </section>

          <section class="section alt" id="primera-sesion">
            <div class="wrap first-visit">
              <div class="section-head">
                <p class="kicker">Tu primera visita</p>
                <h2>Sabes qué haremos desde el primer día</h2>
                <p>La primera sesión incluye evaluación clínica y, si corresponde, el inicio del tratamiento.</p>
              </div>
              <div class="steps">
                <div class="step"><div class="step-num">1</div><div><h3>Conocemos tu caso</h3><p>Revisamos síntomas, antecedentes e historial clínico.</p></div></div>
                <div class="step"><div class="step-num">2</div><div><h3>Evaluamos tu movilidad</h3><p>Realizamos las pruebas clínicas necesarias según tu motivo de consulta.</p></div></div>
                <div class="step"><div class="step-num">3</div><div><h3>Definimos qué necesitas</h3><p>Determinamos si la quiropráctica es apropiada para ti o si necesitas otro tipo de atención.</p></div></div>
                <div class="step"><div class="step-num">4</div><div><h3>Comenzamos el tratamiento</h3><p>Si corresponde a tu caso, comenzamos en esa misma sesión.</p></div></div>
              </div>
            </div>
          </section>

          <section class="section">
            <div class="wrap">
              <div class="section-head center">
                <p class="kicker">Nuestro modelo de atención</p>
                <h2>Quiropráctica como atención principal</h2>
                <p>La quiropráctica es el eje de nuestro modelo de atención. Kinesiología y masoterapia pueden complementar el proceso cuando cada caso lo requiere.</p>
              </div>
              <div class="service-grid">
                <article class="service-card main">
                  <div class="service-media">FOTO QUIROPRÁCTICA</div>
                  <div class="service-body"><span class="service-tag">ATENCIÓN PRINCIPAL</span><h3>Quiropráctica</h3><p>Evaluación individual, técnicas manuales y ajustes específicos según las necesidades de cada paciente.</p></div>
                </article>
                <article class="service-card">
                  <div class="service-media">FOTO KINESIOLOGÍA</div>
                  <div class="service-body"><h3>Kinesiología</h3><p>Atención complementaria que puede apoyar el proceso con movilidad, ejercicio terapéutico y terapia manual.</p></div>
                </article>
                <article class="service-card">
                  <div class="service-media">FOTO MASOTERAPIA</div>
                  <div class="service-body"><h3>Masoterapia</h3><p>Atención complementaria orientada a trabajar tensión muscular y bienestar corporal.</p></div>
                </article>
              </div>
            </div>
          </section>

          <section class="section alt">
            <div class="wrap">
              <div class="section-head center">
                <p class="kicker">Por qué elegir Raquis</p>
                <h2>Un tratamiento pensado para tu caso</h2>
              </div>
              <div class="reason-grid">
                <article class="reason"><h3>Enfoque no invasivo</h3><p>La atención se realiza mediante técnicas manuales y alternativas conservadoras.</p></article>
                <article class="reason"><h3>Evaluamos antes de tratar</h3><p>Revisamos antecedentes, movilidad y posibles contraindicaciones antes de comenzar.</p></article>
                <article class="reason"><h3>Quiroprácticos universitarios</h3><p>Las atenciones de quiropráctica son realizadas por profesionales con formación universitaria.</p></article>
              </div>
            </div>
          </section>

          <section class="about-dark">
            <div class="wrap about-grid">
              <div class="about-collage">
                <div class="about-photo large">FOTO AJUSTE REAL</div>
                <div class="about-photo">FOTO EVALUACIÓN</div>
                <div class="about-photo">FOTO MOVILIDAD</div>
              </div>
              <div class="about-copy">
                <p class="kicker">Seguridad y criterio clínico</p>
                <h2>La seguridad comienza antes del ajuste</h2>
                <p>No todos los pacientes necesitan lo mismo. Si la quiropráctica no corresponde a tu caso, podemos recomendar otro tipo de atención o derivación.</p>
                <div class="about-points">
                  <div class="about-point"><strong>Evaluación clínica previa</strong><span>Antes de tratar revisamos tu caso y las posibles contraindicaciones.</span></div>
                  <div class="about-point"><strong>Plan según cada paciente</strong><span>No aplicamos el mismo enfoque a todos.</span></div>
                  <div class="about-point"><strong>Trabajo complementario</strong><span>Cuando corresponde, integramos kinesiología o masoterapia.</span></div>
                </div>
              </div>
            </div>
          </section>

          <section class="section alt">
            <div class="wrap">
              <div class="section-head center">
                <p class="kicker">Experiencias reales</p>
                <h2>Lo que dicen nuestros pacientes</h2>
                <p>Aquí integraremos reseñas reales de Google y testimonios de pacientes de Raquis.</p>
              </div>
              <div class="reviews-frame">
                <slot name="google-reviews">
                  <div class="reviews-loading">Cargando reseñas de Google…</div>
                </slot>
              </div>
            </div>
          </section>

          <section class="section">
            <div class="wrap">
              <div class="section-head center">
                <p class="kicker">Nuestro equipo</p>
                <h2>Conoce a quienes te van a atender</h2>
                <p>Fotos reales, formación universitaria y experiencia clínica de cada profesional.</p>
              </div>
              <div class="team-grid">
                <article class="person-card"><div class="person-media">FOTO PROFESIONAL 1</div><div class="person-body"><h3>Quiropráctico/a</h3><p>Nombre, formación y experiencia.</p></div></article>
                <article class="person-card"><div class="person-media">FOTO PROFESIONAL 2</div><div class="person-body"><h3>Quiropráctico/a</h3><p>Nombre, formación y experiencia.</p></div></article>
                <article class="person-card"><div class="person-media">FOTO PROFESIONAL 3</div><div class="person-body"><h3>Quiropráctico/a</h3><p>Nombre, formación y experiencia.</p></div></article>
                <article class="person-card"><div class="person-media">FOTO PROFESIONAL 4</div><div class="person-body"><h3>Quiropráctico/a</h3><p>Nombre, formación y experiencia.</p></div></article>
              </div>
            </div>
          </section>

          <section class="section alt">
            <div class="wrap">
              <div class="section-head center">
                <p class="kicker">Nuestras clínicas</p>
                <h2>Atiéndete donde más te acomode</h2>
                <p>Dos ubicaciones en Santiago.</p>
              </div>
              <div class="clinic-grid">
                <article class="clinic-card"><div class="clinic-media">FOTO SANTIAGO CENTRO</div><div class="clinic-body"><h3>Santiago Centro</h3><p>Nueva York 57, Of. 603 · Metro Universidad de Chile.</p></div></article>
                <article class="clinic-card"><div class="clinic-media">FOTO PROVIDENCIA</div><div class="clinic-body"><h3>Providencia</h3><p>Dr. Manuel Barros Borgoño 71, Of. 806 · Metro Manuel Montt.</p></div></article>
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
                <details><summary>¿Qué hacen en la primera sesión?</summary><p>Revisamos tu caso, evaluamos movilidad y realizamos las pruebas necesarias. Si corresponde, comenzamos el tratamiento en esa misma sesión.</p></details>
                <details><summary>¿La quiropráctica es invasiva?</summary><p>No. La atención se realiza mediante técnicas manuales dentro de un enfoque conservador.</p></details>
                <details><summary>¿Necesito saber qué tratamiento necesito?</summary><p>No. Primero evaluamos tu caso y definimos el enfoque más adecuado para ti.</p></details>
                <details><summary>¿Qué pasa si la quiropráctica no corresponde a mi caso?</summary><p>Podemos recomendar otro tipo de atención o una derivación según lo que encontremos en la evaluación.</p></details>
              </div>
            </div>
          </section>

          <section class="final-cta" id="contacto">
            <div class="wrap">
              <h2>¿No sabes qué atención necesitas?</h2>
              <p>Agenda tu primera sesión o conversa con nuestro equipo. Te orientaremos según tu motivo de consulta.</p>
              <div class="final-actions">
                <a class="btn btn-primary" href="${this.bookingUrl()}">AGENDAR PRIMERA SESIÓN</a>
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