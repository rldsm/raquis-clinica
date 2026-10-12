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

    render() {
      this.shadowRoot.innerHTML = `
        <style>
          :host{
            --orange:#E84A05;
            --ink:#25211f;
            --muted:#6f6761;
            --line:#eadbd1;
            --soft:#fff8f4;
            display:block;
            color:var(--ink);
            text-align:left;
            background:#fff;
            font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
            -webkit-font-smoothing:antialiased;
          }
          *{box-sizing:border-box}
          .page{overflow:hidden;background:#fff}
          .wrap{width:min(1180px,calc(100% - 48px));margin:auto}
          .hero{padding:72px 0;background:linear-gradient(180deg,#fff 0%,#fff8f4 100%)}
          .hero-grid{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(340px,.95fr);gap:52px;align-items:center}
          .eyebrow{display:inline-flex;padding:7px 12px;border:1px solid var(--orange);border-radius:999px;color:var(--orange);font-weight:800;font-size:.8rem;letter-spacing:.04em}
          h1{margin:18px 0 16px;font-size:clamp(3.1rem,6vw,5.8rem);line-height:.95;letter-spacing:-.055em}
          .hero p{max-width:720px;margin:0;color:var(--muted);font-size:1.15rem;line-height:1.6}
          .hero-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:28px}
          .btn{min-height:54px;padding:0 22px;border-radius:12px;display:inline-flex;align-items:center;justify-content:center;font-weight:800;text-decoration:none}
          .btn-primary{background:var(--orange);color:#fff}
          .btn-secondary{border:1px solid #e7cabc;color:var(--orange);background:#fff}
          .hero-note{margin-top:14px;color:#5d5550;font-size:.92rem}
          .placeholder{min-height:420px;border:1px dashed #d9bcae;border-radius:24px;background:linear-gradient(135deg,#fff5ef,#f6ebe5);display:grid;place-items:center;text-align:center;color:#8c786d;padding:24px}
          .trust{border-top:1px solid var(--line);border-bottom:1px solid var(--line);background:#fff}
          .trust-grid{display:grid;grid-template-columns:repeat(4,1fr)}
          .trust-item{padding:22px 16px;text-align:center}
          .trust-item strong{display:block;color:var(--orange);font-size:1.35rem}
          .trust-item span{display:block;margin-top:4px;color:var(--muted);font-size:.86rem}
          .section{padding:68px 0}
          .section.alt{background:var(--soft)}
          .section-head{max-width:760px;margin-bottom:28px}
          .section-head h2{margin:0 0 10px;font-size:clamp(2rem,4vw,3.2rem);letter-spacing:-.04em}
          .section-head p{margin:0;color:var(--muted);font-size:1.05rem;line-height:1.6}
          .grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
          .card{background:#fff;border:1px solid var(--line);border-radius:18px;padding:24px;box-shadow:0 10px 30px rgba(57,39,29,.05)}
          .card h3{margin:0 0 8px;font-size:1.18rem}
          .card p{margin:0;color:var(--muted);line-height:1.55}
          .first-visit{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:40px;align-items:start}
          .steps{display:grid;gap:12px}
          .step{display:grid;grid-template-columns:44px 1fr;gap:14px;padding:18px;border:1px solid var(--line);border-radius:16px;background:#fff}
          .step-num{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:#fff0e8;color:var(--orange);font-weight:900}
          .step h3{margin:1px 0 5px;font-size:1.05rem}
          .step p{margin:0;color:var(--muted);line-height:1.5}
          .highlight{color:var(--orange)}
          @media(max-width:900px){
            .hero-grid,.first-visit{grid-template-columns:1fr}
            .trust-grid{grid-template-columns:repeat(2,1fr)}
            .grid-3{grid-template-columns:1fr}
          }
          @media(max-width:640px){
            .wrap{width:calc(100% - 28px)}
            .hero{padding:44px 0}
            h1{font-size:clamp(2.8rem,14vw,4.2rem)}
            .hero-actions{display:grid}
            .btn{width:100%}
            .trust-grid{grid-template-columns:1fr 1fr}
          }
        </style>

        <main class="page">
          <section class="hero">
            <div class="wrap hero-grid">
              <div>
                <span class="eyebrow">CLÍNICA RAQUIS</span>
                <h1>Una alternativa <span class="highlight">no invasiva</span> para volver a moverte mejor</h1>
                <p>Quiropráctica personalizada para abordar molestias musculoesqueléticas con un enfoque conservador, sin depender del uso prolongado de medicamentos ni recurrir de entrada a procedimientos invasivos.</p>
                <div class="hero-actions">
                  <a class="btn btn-primary js-first-visit" href="#primera-sesion">AGENDAR PRIMERA SESIÓN</a>
                  <a class="btn btn-secondary" href="https://wa.me/" target="_blank" rel="noopener noreferrer">HABLAR POR WHATSAPP</a>
                </div>
                <div class="hero-note">Evaluación e inicio del tratamiento en la primera sesión, si corresponde a tu caso.</div>
              </div>
              <div class="placeholder">IMAGEN HERO<br><small>La agregaremos al final</small></div>
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
                <h2>Un enfoque conservador antes de pensar en alternativas más invasivas</h2>
                <p>La quiropráctica utiliza técnicas manuales y ajustes específicos para abordar problemas del sistema musculoesquelético. En Raquis, cada atención comienza con una evaluación para determinar si la quiropráctica es adecuada para tu caso.</p>
              </div>
              <div class="grid-3">
                <article class="card"><h3>Sin medicamentos como eje del tratamiento</h3><p>Un enfoque manual que puede formar parte del manejo de molestias musculoesqueléticas sin depender del uso prolongado de analgésicos.</p></article>
                <article class="card"><h3>No invasiva</h3><p>La atención quiropráctica utiliza técnicas manuales y forma parte de las alternativas conservadoras para distintos cuadros musculoesqueléticos.</p></article>
                <article class="card"><h3>Antes de pensar en cirugía</h3><p>En determinados cuadros, las alternativas conservadoras pueden evaluarse antes de recurrir a procedimientos quirúrgicos, según cada caso clínico.</p></article>
              </div>
            </div>
          </section>

          <section class="section alt" id="primera-sesion">
            <div class="wrap first-visit">
              <div class="section-head">
                <h2>Tu primera sesión no es solo una conversación</h2>
                <p>Evaluamos tu caso y, si corresponde, comenzamos el tratamiento en esa misma primera sesión.</p>
              </div>
              <div class="steps">
                <div class="step"><div class="step-num">1</div><div><h3>Conocemos tu caso</h3><p>Revisamos síntomas, antecedentes e historial clínico.</p></div></div>
                <div class="step"><div class="step-num">2</div><div><h3>Evaluamos tu movilidad</h3><p>Realizamos las pruebas clínicas necesarias según tu motivo de consulta.</p></div></div>
                <div class="step"><div class="step-num">3</div><div><h3>Definimos qué necesitas</h3><p>Determinamos si la quiropráctica es apropiada para ti o si necesitas otro tipo de atención.</p></div></div>
                <div class="step"><div class="step-num">4</div><div><h3>Comenzamos el tratamiento</h3><p>Si corresponde a tu caso, el tratamiento comienza en esa misma primera sesión.</p></div></div>
              </div>
            </div>
          </section>
        </main>
      `;
    }

    bind() {
      const link = this.shadowRoot.querySelector('.js-first-visit');
      if (link) {
        link.addEventListener('click', event => {
          event.preventDefault();
          const target = this.shadowRoot.getElementById('primera-sesion');
          if (target) target.scrollIntoView({ behavior:'smooth', block:'start' });
        });
      }
    }
  }

  if (!customElements.get('raquis-clinica')) {
    customElements.define('raquis-clinica', RaquisClinica);
  }
})();