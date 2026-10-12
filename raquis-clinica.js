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
            --orange:#E84A05;
            --orange-dark:#c83d00;
            --ink:#282321;
            --muted:#6f6762;
            --line:#eadfd8;
            --soft:#fbf7f4;
            --soft-2:#fffaf7;
            display:block;
            background:#fff;
            color:var(--ink);
            text-align:left;
            font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
            -webkit-font-smoothing:antialiased;
          }
          *{box-sizing:border-box}
          a{color:inherit}
          .page{overflow:hidden;background:#fff}
          .wrap{width:min(100% - 28px,1180px);margin:0 auto}

          /* Mobile-first */
          .hero{padding:34px 0 26px;background:linear-gradient(180deg,#fff 0%,var(--soft-2) 100%)}
          .hero-grid{display:grid;gap:24px}
          .eyebrow{display:inline-flex;padding:7px 11px;border:1px solid #efbca3;border-radius:999px;color:var(--orange);font-size:.76rem;font-weight:800;letter-spacing:.045em}
          .hero h1{margin:15px 0 14px;font-size:clamp(2.55rem,13vw,4rem);line-height:.98;letter-spacing:-.052em;max-width:720px}
          .hero h1 .accent{color:var(--orange)}
          .hero-lead{margin:0;color:var(--muted);font-size:1.03rem;line-height:1.58;max-width:720px}
          .hero-actions{display:grid;gap:10px;margin-top:22px}
          .btn{min-height:52px;padding:0 18px;border-radius:11px;display:flex;align-items:center;justify-content:center;text-align:center;text-decoration:none;font-size:.9rem;font-weight:850;letter-spacing:.01em}
          .btn-primary{background:var(--orange);color:#fff}
          .btn-primary:hover{background:var(--orange-dark)}
          .btn-secondary{background:#fff;border:1px solid #e4cfc3;color:var(--orange)}
          .hero-note{margin:12px 0 0;color:#5e5651;font-size:.86rem;line-height:1.45}
          .media-placeholder{min-height:310px;border-radius:18px;border:1px solid #ead9cf;background:linear-gradient(135deg,#f8eee8,#fff);display:grid;place-items:center;padding:24px;text-align:center;color:#968177;font-size:.82rem}
          .media-placeholder strong{display:block;color:#6f5e55;font-size:.9rem}
          .media-placeholder small{display:block;margin-top:6px}

          .trust{border-top:1px solid var(--line);border-bottom:1px solid var(--line);background:#fff}
          .trust-grid{display:grid;grid-template-columns:1fr 1fr}
          .trust-item{padding:18px 10px;text-align:center}
          .trust-item:nth-child(odd){border-right:1px solid var(--line)}
          .trust-item:nth-child(-n+2){border-bottom:1px solid var(--line)}
          .trust-item strong{display:block;color:var(--orange);font-size:1.3rem;line-height:1.05}
          .trust-item span{display:block;margin-top:5px;color:var(--muted);font-size:.78rem;line-height:1.3}

          .section{padding:46px 0}
          .section.alt{background:var(--soft)}
          .section-head{max-width:780px;margin-bottom:22px}
          .kicker{margin:0 0 8px;color:var(--orange);font-size:.76rem;font-weight:850;letter-spacing:.055em;text-transform:uppercase}
          .section-head h2{margin:0 0 10px;font-size:clamp(2rem,9vw,3.4rem);line-height:1.03;letter-spacing:-.043em}
          .section-head p{margin:0;color:var(--muted);font-size:1rem;line-height:1.58}

          .symptom-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
          .symptom{min-height:68px;border:1px solid var(--line);border-radius:14px;background:#fff;padding:15px 14px;display:flex;align-items:center;font-weight:750;line-height:1.2}

          .first-visit{display:grid;gap:24px}
          .steps{display:grid;gap:10px}
          .step{display:grid;grid-template-columns:40px minmax(0,1fr);gap:13px;padding:17px 16px;border:1px solid var(--line);border-radius:15px;background:#fff}
          .step-num{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:#fff0e8;color:var(--orange);font-weight:900}
          .step h3{margin:1px 0 4px;font-size:1rem}
          .step p{margin:0;color:var(--muted);font-size:.91rem;line-height:1.48}
          .step:last-child{border-color:#efb99f;background:#fffaf7}
          .step:last-child h3{color:var(--orange)}

          .principles{display:grid;gap:12px}
          .principle{padding:20px 18px;border-top:1px solid var(--line)}
          .principle:first-child{border-top:0}
          .principle h3{margin:0 0 7px;font-size:1.12rem}
          .principle p{margin:0;color:var(--muted);line-height:1.55;font-size:.94rem}

          .safety-box{border:1px solid var(--line);border-radius:18px;background:#fff;padding:22px}
          .safety-box h3{margin:0 0 9px;font-size:1.25rem}
          .safety-box p{margin:0;color:var(--muted);line-height:1.58}
          .safety-points{margin:18px 0 0;padding:0;list-style:none;display:grid;gap:10px}
          .safety-points li{padding-left:18px;position:relative;color:#4f4945;line-height:1.45}
          .safety-points li:before{content:"";position:absolute;left:0;top:.62em;width:6px;height:6px;border-radius:50%;background:var(--orange)}

          .service-feature{display:grid;gap:20px}
          .service-copy h3{margin:0 0 10px;font-size:1.5rem;letter-spacing:-.025em}
          .service-copy p{margin:0;color:var(--muted);line-height:1.58}
          .service-note{margin-top:16px;padding:14px 15px;border-left:3px solid var(--orange);background:#fff7f2;color:#5a514c;font-size:.92rem;line-height:1.5}
          .support-grid{display:grid;gap:12px;margin-top:18px}
          .support-card{padding:20px;border:1px solid var(--line);border-radius:16px;background:#fff}
          .support-card h3{margin:0 0 7px;font-size:1.08rem}
          .support-card p{margin:0;color:var(--muted);line-height:1.5;font-size:.93rem}

          .proof-grid{display:grid;gap:14px}
          .proof-card{border:1px solid var(--line);border-radius:18px;background:#fff;padding:20px;min-height:150px}
          .proof-card strong{display:block;margin-bottom:7px;font-size:1.05rem}
          .proof-card p{margin:0;color:var(--muted);line-height:1.5;font-size:.92rem}

          .team-grid,.clinic-grid{display:grid;gap:14px}
          .person-card,.clinic-card{border:1px solid var(--line);border-radius:18px;background:#fff;overflow:hidden}
          .person-media,.clinic-media{min-height:280px;background:#f6ece6;display:grid;place-items:center;text-align:center;color:#927d72;font-size:.82rem}
          .person-body,.clinic-body{padding:18px}
          .person-body h3,.clinic-body h3{margin:0 0 6px;font-size:1.12rem}
          .person-body p,.clinic-body p{margin:0;color:var(--muted);line-height:1.5;font-size:.91rem}

          .price-card{border:1px solid var(--line);border-radius:18px;background:#fff;padding:22px}
          .price-card h3{margin:0 0 7px;font-size:1.15rem}
          .price-card .price{display:block;margin:8px 0;color:var(--orange);font-size:2rem;font-weight:900;letter-spacing:-.04em}
          .price-card p{margin:0;color:var(--muted);line-height:1.5;font-size:.91rem}

          .final-cta{padding:50px 0;background:#2c2724;color:#fff}
          .final-cta h2{margin:0 0 10px;font-size:clamp(2rem,9vw,3.3rem);line-height:1.04;letter-spacing:-.04em}
          .final-cta p{margin:0;color:#d8d0cb;line-height:1.55;max-width:720px}
          .final-actions{display:grid;gap:10px;margin-top:22px}
          .final-cta .btn-secondary{border-color:#5d514a;background:transparent;color:#fff}

          @media(min-width:720px){
            .wrap{width:min(100% - 48px,1180px)}
            .hero{padding:54px 0 38px}
            .hero-actions,.final-actions{display:flex}
            .btn{width:auto;min-width:190px}
            .symptom-grid{grid-template-columns:repeat(4,1fr)}
            .principles{grid-template-columns:repeat(3,1fr);gap:18px}
            .principle{border:1px solid var(--line);border-radius:16px;background:#fff}
            .principle:first-child{border-top:1px solid var(--line)}
            .support-grid,.proof-grid,.team-grid,.clinic-grid{grid-template-columns:repeat(2,1fr)}
            .price-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
          }

          @media(min-width:980px){
            .hero{padding:70px 0 44px}
            .hero-grid{grid-template-columns:minmax(0,1.05fr) minmax(360px,.95fr);gap:48px;align-items:center}
            .media-placeholder{min-height:430px}
            .trust-grid{grid-template-columns:repeat(4,1fr)}
            .trust-item{border-right:1px solid var(--line)!important;border-bottom:0!important}
            .trust-item:last-child{border-right:0!important}
            .section{padding:72px 0}
            .first-visit,.service-feature{grid-template-columns:minmax(0,.88fr) minmax(0,1.12fr);gap:48px;align-items:start}
            .proof-grid{grid-template-columns:repeat(3,1fr)}
            .team-grid{grid-template-columns:repeat(4,1fr)}
          }
        </style>

        <main class="page">
          <section class="hero">
            <div class="wrap hero-grid">
              <div>
                <span class="eyebrow">CLÍNICA RAQUIS</span>
                <h1>Quiropráctica para volver a <span class="accent">moverte mejor</span></h1>
                <p class="hero-lead">Atención personalizada para molestias musculoesqueléticas con un enfoque conservador y no invasivo.</p>
                <div class="hero-actions">
                  <a class="btn btn-primary js-scroll" href="#primera-sesion" data-target="primera-sesion">AGENDAR PRIMERA SESIÓN</a>
                  <a class="btn btn-secondary" href="${this.whatsappUrl()}">HABLAR POR WHATSAPP</a>
                </div>
                <p class="hero-note"><strong>Evaluación + tratamiento desde la primera sesión</strong>, si corresponde a tu caso.</p>
              </div>
              <div class="media-placeholder"><div><strong>FOTO REAL DE ATENCIÓN QUIROPRÁCTICA</strong><small>La incorporaremos al final</small></div></div>
            </div>
          </section>

          <section class="trust">
            <div class="wrap trust-grid">
              <div class="trust-item"><strong>+40.000</strong><span>pacientes atendidos</span></div>
              <div class="trust-item"><strong>+9 años</strong><span>de trayectoria</span></div>
              <div class="trust-item"><strong>+15 años</strong><span>de experiencia clínica</span></div>
              <div class="trust-item"><strong>2 clínicas</strong><span>en Santiago</span></div>
            </div>
          </section>

          <section class="section">
            <div class="wrap">
              <div class="section-head">
                <p class="kicker">Motivos de consulta</p>
                <h2>¿Dónde sientes molestias?</h2>
                <p>No necesitas saber qué tratamiento necesitas antes de venir. Primero evaluamos tu caso y determinamos el enfoque más adecuado.</p>
              </div>
              <div class="symptom-grid">
                <div class="symptom">Cuello</div>
                <div class="symptom">Espalda</div>
                <div class="symptom">Zona lumbar</div>
                <div class="symptom">Hombros</div>
                <div class="symptom">Caderas</div>
                <div class="symptom">Rodillas</div>
                <div class="symptom">Tobillos</div>
                <div class="symptom">Molestias irradiadas</div>
              </div>
            </div>
          </section>

          <section class="section alt" id="primera-sesion">
            <div class="wrap first-visit">
              <div class="section-head">
                <p class="kicker">Tu primera visita</p>
                <h2>Tu primera sesión no es solo una conversación</h2>
                <p>Evaluamos tu caso y, si corresponde, comenzamos el tratamiento en esa misma primera sesión.</p>
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
              <div class="section-head">
                <p class="kicker">Por qué quiropráctica</p>
                <h2>Un enfoque conservador antes de pensar en alternativas más invasivas</h2>
                <p>La quiropráctica utiliza técnicas manuales y ajustes específicos para abordar problemas del sistema musculoesquelético.</p>
              </div>
              <div class="principles">
                <article class="principle"><h3>No invasiva</h3><p>La atención se realiza mediante técnicas manuales y forma parte de las alternativas conservadoras para distintos cuadros musculoesqueléticos.</p></article>
                <article class="principle"><h3>Sin medicamentos como eje</h3><p>Puede formar parte del manejo de molestias musculoesqueléticas sin depender del uso prolongado de analgésicos.</p></article>
                <article class="principle"><h3>Antes de pensar en cirugía</h3><p>En determinados cuadros, las alternativas conservadoras pueden evaluarse antes de recurrir a procedimientos quirúrgicos, según cada caso clínico.</p></article>
              </div>
            </div>
          </section>

          <section class="section alt">
            <div class="wrap">
              <div class="section-head">
                <p class="kicker">Seguridad</p>
                <h2>La seguridad comienza antes del ajuste</h2>
                <p>No todos los pacientes necesitan lo mismo. Antes de tratar, evaluamos antecedentes, movilidad y posibles contraindicaciones.</p>
              </div>
              <div class="safety-box">
                <h3>Evaluamos primero. Tratamos después.</h3>
                <p>Si la quiropráctica no corresponde a tu caso, podemos recomendar otro tipo de atención o derivación.</p>
                <ul class="safety-points">
                  <li>Atenciones realizadas por quiroprácticos universitarios.</li>
                  <li>Evaluación clínica previa al tratamiento.</li>
                  <li>Plan de atención según cada paciente.</li>
                </ul>
              </div>
            </div>
          </section>

          <section class="section">
            <div class="wrap service-feature">
              <div class="media-placeholder"><div><strong>FOTO DE AJUSTE / EVALUACIÓN</strong><small>Imagen real de Raquis</small></div></div>
              <div class="service-copy">
                <p class="kicker">Nuestro foco</p>
                <h3>Quiropráctica: el centro de nuestro modelo de atención</h3>
                <p>Nuestros quiroprácticos universitarios realizan una evaluación individual y utilizan técnicas manuales y ajustes según las necesidades de cada paciente.</p>
                <div class="service-note">Cuando el caso lo requiere, el tratamiento puede complementarse con kinesiología, ejercicio terapéutico o masoterapia.</div>
                <div class="support-grid">
                  <article class="support-card"><h3>Kinesiología</h3><p>Puede complementar la recuperación con ejercicio terapéutico, movilidad y terapia manual según la evaluación.</p></article>
                  <article class="support-card"><h3>Masoterapia</h3><p>Puede complementar la atención trabajando tensión muscular y bienestar corporal.</p></article>
                </div>
              </div>
            </div>
          </section>

          <section class="section alt">
            <div class="wrap">
              <div class="section-head">
                <p class="kicker">Confianza</p>
                <h2>Lo que dicen nuestros pacientes</h2>
                <p>Esta sección mostrará reseñas reales de Google y testimonios de pacientes de Raquis.</p>
              </div>
              <div class="proof-grid">
                <div class="proof-card"><strong>Reseñas de Google</strong><p>Aquí integraremos el widget real de reseñas, no testimonios inventados.</p></div>
                <div class="proof-card"><strong>Testimonio real</strong><p>Espacio para un testimonio breve, idealmente acompañado por video o fotografía autorizada.</p></div>
                <div class="proof-card"><strong>Testimonio real</strong><p>Segundo testimonio destacado para reforzar confianza antes del CTA.</p></div>
              </div>
            </div>
          </section>

          <section class="section">
            <div class="wrap">
              <div class="section-head">
                <p class="kicker">Equipo</p>
                <h2>Conoce a quienes te van a atender</h2>
                <p>Mostraremos profesionales reales, con su formación, especialidad y experiencia clínica.</p>
              </div>
              <div class="team-grid">
                <article class="person-card"><div class="person-media">FOTO PROFESIONAL 1</div><div class="person-body"><h3>Quiropráctico/a</h3><p>Nombre, formación universitaria y experiencia.</p></div></article>
                <article class="person-card"><div class="person-media">FOTO PROFESIONAL 2</div><div class="person-body"><h3>Quiropráctico/a</h3><p>Nombre, formación universitaria y experiencia.</p></div></article>
                <article class="person-card"><div class="person-media">FOTO PROFESIONAL 3</div><div class="person-body"><h3>Quiropráctico/a</h3><p>Nombre, formación universitaria y experiencia.</p></div></article>
                <article class="person-card"><div class="person-media">FOTO PROFESIONAL 4</div><div class="person-body"><h3>Quiropráctico/a</h3><p>Nombre, formación universitaria y experiencia.</p></div></article>
              </div>
            </div>
          </section>

          <section class="section alt">
            <div class="wrap">
              <div class="section-head">
                <p class="kicker">Nuestras clínicas</p>
                <h2>Atiéndete donde más te acomode</h2>
                <p>Dos ubicaciones en Santiago para continuar tu atención.</p>
              </div>
              <div class="clinic-grid">
                <article class="clinic-card"><div class="clinic-media">FOTO CLÍNICA SANTIAGO CENTRO</div><div class="clinic-body"><h3>Santiago Centro</h3><p>Nueva York 57, Of. 603 · Metro Universidad de Chile.</p></div></article>
                <article class="clinic-card"><div class="clinic-media">FOTO CLÍNICA PROVIDENCIA</div><div class="clinic-body"><h3>Providencia</h3><p>Dr. Manuel Barros Borgoño 71, Of. 806 · Metro Manuel Montt.</p></div></article>
              </div>
            </div>
          </section>

          <section class="section" id="agenda">
            <div class="wrap">
              <div class="section-head">
                <p class="kicker">Valores</p>
                <h2>Conoce el valor de tu primera atención</h2>
                <p>Dejamos la estructura lista para incorporar los valores vigentes y qué incluye cada atención.</p>
              </div>
              <div class="price-grid">
                <article class="price-card"><h3>Quiropráctica</h3><span class="price">Valor por definir</span><p>Evaluación clínica y tratamiento, si corresponde.</p></article>
                <article class="price-card"><h3>Kinesiología</h3><span class="price">Valor por definir</span><p>Evaluación y atención según indicación profesional.</p></article>
                <article class="price-card"><h3>Masoterapia</h3><span class="price">Valor por definir</span><p>Sesión individual según disponibilidad.</p></article>
              </div>
            </div>
          </section>

          <section class="final-cta" id="contacto">
            <div class="wrap">
              <h2>¿No sabes qué atención necesitas?</h2>
              <p>Agenda tu primera sesión o conversa con nuestro equipo. Podemos orientarte para elegir el siguiente paso según tu motivo de consulta.</p>
              <div class="final-actions">
                <a class="btn btn-primary" href="${this.bookingUrl()}">AGENDAR PRIMERA SESIÓN</a>
                <a class="btn btn-secondary" href="${this.whatsappUrl()}">HABLAR POR WHATSAPP</a>
              </div>
            </div>
          </section>
        </main>
      `;
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