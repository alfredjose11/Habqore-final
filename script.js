/* ═══════════════════════════════════════════════════════════
   HABQORE — script.js
   Loader · Backdrop System · Navigation · Reveal · Counters
   Smooth Scroll · Form · Back-to-Top
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────────────────────
   1. BACKDROP / BACKGROUND IMAGE SYSTEM
   ─────────────────────────────────────────────────────────
   HOW TO ADD A BACKGROUND IMAGE TO ANY SECTION:
   In index.html, find the relevant .section-backdrop div
   and change: data-bg-src=""
   to:         data-bg-src="path/to/your-image.jpg"

   Example:
     <div class="section-backdrop" data-bg-src="images/hero-bg.jpg" data-bg-overlay="0.55">

   The overlay value (0.0 – 1.0) controls how dark the
   overlay is on top of the image. Lower = more visible image.
   ───────────────────────────────────────────────────────── */
function initBackdrops() {
  const backdrops = document.querySelectorAll('[data-bg-src]');
  backdrops.forEach(el => {
    const src = el.getAttribute('data-bg-src');
    const overlay = parseFloat(el.getAttribute('data-bg-overlay') || '0.6');
    if (!src) return; // No image set yet — skip

    // Build overlay color based on whether it's a navy or light section
    const isNavy = el.classList.contains('navy-backdrop');
    const overlayColor = isNavy
      ? `rgba(8, 20, 54, ${overlay})`
      : `rgba(255, 255, 255, ${overlay})`;

    el.style.backgroundImage = `linear-gradient(${overlayColor}, ${overlayColor}), url('${src}')`;
    el.style.backgroundSize = 'cover';
    el.classList.add('has-image');
  });
}

/* ─────────────────────────────────────────────────────────
   2. PAGE LOADER
   ───────────────────────────────────────────────────────── */
function initLoader() {
  const loader = document.getElementById('pageLoader');
  const fill = document.getElementById('loaderFill');
  if (!loader || !fill) return;

  document.body.classList.add('is-loading');

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 20 + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      fill.style.width = '100%';
      setTimeout(() => {
        loader.classList.add('hide');
        document.body.classList.remove('is-loading');
      }, 350);
    } else {
      fill.style.width = progress + '%';
    }
  }, 150);
}

/* ─────────────────────────────────────────────────────────
   3. SCROLL PROGRESS BAR
   ───────────────────────────────────────────────────────── */
function updateScrollBar() {
  const bar = document.getElementById('progressBar');
  if (!bar) return;
  const scrollTop = window.scrollY;
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  bar.style.width = (docH > 0 ? (scrollTop / docH) * 100 : 0) + '%';
}

/* ─────────────────────────────────────────────────────────
   4. STICKY HEADER
   ───────────────────────────────────────────────────────── */
function updateHeader() {
  const header = document.getElementById('siteHeader');
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 70);
}

/* ─────────────────────────────────────────────────────────
   5. ACTIVE NAV LINK
   ───────────────────────────────────────────────────────── */
function updateActiveNav() {
  const links = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 160;

  sections.forEach(sec => {
    if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
      const id = sec.getAttribute('id');
      links.forEach(l => {
        l.classList.toggle('active', l.getAttribute('href') === '#' + id);
      });
    }
  });
}

/* ─────────────────────────────────────────────────────────
   6. MOBILE HAMBURGER
   ───────────────────────────────────────────────────────── */
function initHamburger() {
  const btn = document.getElementById('navToggle');
  const nav = document.getElementById('mainNav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    nav.classList.toggle('open');
  });

  // Close on nav link click
  nav.querySelectorAll('.nav-item, .nav-btn').forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('open');
      nav.classList.remove('open');
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!nav.contains(e.target) && !btn.contains(e.target)) {
      btn.classList.remove('open');
      nav.classList.remove('open');
    }
  });
}

/* ─────────────────────────────────────────────────────────
   7. REVEAL ANIMATIONS (IntersectionObserver)
   ───────────────────────────────────────────────────────── */
function initReveal() {
  const els = document.querySelectorAll('[data-aos]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.getAttribute('data-aos-delay') || '0');
        setTimeout(() => el.classList.add('aos-in'), delay);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

  els.forEach(el => obs.observe(el));
}

/* ─────────────────────────────────────────────────────────
   8. COUNT-UP NUMBERS
   ───────────────────────────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('.count-up[data-target]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-target'));
      const duration = 2200;
      const start = performance.now();

      function tick(now) {
        const t = Math.min((now - start) / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.floor(eased * target);
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      }
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => obs.observe(el));
}

/* ─────────────────────────────────────────────────────────
   9. SMOOTH SCROLL FOR ANCHOR LINKS
   ───────────────────────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ─────────────────────────────────────────────────────────
   10. BACK TO TOP
   ───────────────────────────────────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('bttBtn');
  if (!btn) return;

  function update() {
    btn.classList.toggle('visible', window.scrollY > 450);
  }
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ─────────────────────────────────────────────────────────
   11. HERO CHART ANIMATION (bar growth delay)
   ───────────────────────────────────────────────────────── */
function initHeroParallax() {
  const hero = document.getElementById('home');
  const tablet = document.querySelector('.tablet-mockup');
  const chipA = document.querySelector('.chip-a');
  const chipB = document.querySelector('.chip-b');
  const chipC = document.querySelector('.chip-c');
  if (!hero || !tablet) return;

  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Rotate tablet slightly based on mouse coordinates
    const rotY = -18 + (x / rect.width) * 16;
    const rotX = 10 - (y / rect.height) * 10;
    tablet.style.transform = `rotateY(${rotY}deg) rotateX(${rotX}deg) rotateZ(3deg)`;
    
    // Translate hexagons
    if (chipA) chipA.style.transform = `translate(${x * 0.05}px, ${y * 0.05}px) translateY(0px)`;
    if (chipB) chipB.style.transform = `translate(${x * -0.04}px, ${y * -0.04}px) translateY(0px)`;
    if (chipC) chipC.style.transform = `translate(${x * 0.03}px, ${y * -0.05}px) translateY(0px)`;
  });

  hero.addEventListener('mouseleave', () => {
    tablet.style.transform = '';
    if (chipA) chipA.style.transform = '';
    if (chipB) chipB.style.transform = '';
    if (chipC) chipC.style.transform = '';
  });
}

/* ─────────────────────────────────────────────────────────
   12. THROTTLED SCROLL HANDLER
   ───────────────────────────────────────────────────────── */
let scrollTick = false;
function onScroll() {
  if (!scrollTick) {
    requestAnimationFrame(() => {
      updateScrollBar();
      updateHeader();
      updateActiveNav();
      scrollTick = false;
    });
    scrollTick = true;
  }
}

/* ─────────────────────────────────────────────────────────
   13. FORM SUBMISSION
   ───────────────────────────────────────────────────────── */
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('formSubmitBtn');
  const label = btn.querySelector('.btn-label');
  const loading = btn.querySelector('.btn-loading');
  const svg = btn.querySelector('svg');
  const success = document.getElementById('formSuccess');
  const form = document.getElementById('contactForm');

  // Loading state
  label.style.display = 'none';
  if (svg) svg.style.display = 'none';
  loading.style.display = 'inline-flex';
  btn.disabled = true;

  // Simulate async send
  setTimeout(() => {
    // Hide form fields
    [...form.elements].forEach(el => {
      if (el !== btn) el.closest('.form-field, .form-row-2') && (el.closest('.form-field, .form-row-2').style.display = 'none');
    });
    form.querySelectorAll('.form-field, .form-row-2, .form-intro, h3').forEach(el => el.style.display = 'none');
    btn.style.display = 'none';
    success.style.display = 'block';
  }, 1600);
}

// Expose to global for inline onsubmit
window.handleFormSubmit = handleFormSubmit;

/* ─────────────────────────────────────────────────────────
   14. SERVICE CARD — subtle tilt on hover (optional)
   ───────────────────────────────────────────────────────── */
function initCardTilt() {
  const cards = document.querySelectorAll('.svc-card:not(.svc-card--wide)');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const tiltX = (y / rect.height) * 4;
      const tiltY = -(x / rect.width) * 4;
      card.style.transform = `translateY(-5px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ─────────────────────────────────────────────────────────
   INIT ALL
   ───────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initBackdrops();     // Backdrop image system
  initLoader();        // Page loader
  initHamburger();     // Mobile menu
  initReveal();        // Scroll reveal
  initCounters();      // Count-up numbers
  initSmoothScroll();  // Anchor smooth scroll
  initBackToTop();     // Back-to-top button
  initHeroParallax();  // Hero visual parallax
  initCardTilt();      // Service card tilt

  // Scroll listeners
  window.addEventListener('scroll', onScroll, { passive: true });
  updateScrollBar();
  updateHeader();
  updateActiveNav();
});
// Add this inside your DOMContentLoaded listener in script.j
// ─── ENTERPRISE ADVISORY SUITE DISPATCH ROUTER ────────────
function triggerCorporateBriefingEmail(event) {
    event.preventDefault();

    // Pull form parameters including the new mobile data element[cite: 2]
    const fullName = document.getElementById("meet-name").value;
    const companyName = document.getElementById("meet-company").value;
    const clientEmail = document.getElementById("meet-email").value;
    const clientPhone = document.getElementById("meet-phone").value; // Added Target
    const focusArea = document.getElementById("meet-objective").value;
    const strategicConcern = document.getElementById("meet-concern").value;
    
    // UI Elements for animation
    const actionBtn = document.getElementById("miniScheduleBtn");
    const successOverlay = document.getElementById("miniScheduleSuccess");
    const textFeedback = document.getElementById("successMeetTimeText");

    // Email Target Configuration[cite: 2]
    const coreInbox = "Info@habiqon.life";
    const subjectLine = encodeURIComponent(`Executive Briefing Request: ${companyName} (${fullName})`);
    
    const structuredBody = encodeURIComponent(
`DEAR HABQORE advisory board,

A corporate consultation discovery briefing request has been initialized via the digital web terminal. 

Below is the verified corporate lead metadata payload:

1. CLIENT ENTERPRISE PROFILE
• Executive Representative: ${fullName}
• Organization / Corporate Entity: ${companyName}
• Direct Corporate Email: ${clientEmail}
• Primary Contact Number: ${clientPhone}

2. BRIEFING ENGAGEMENT SPECIFICATIONS
• Strategic Core Focus: ${focusArea}
• Key Concerns & Objectives: ${strategicConcern}

Please verify panel calendar availability for this enterprise slot and forward a secure virtual calendar invite credentials token.

Best regards,
${fullName}
${companyName}`
    );

    // Transform button to loading spinner state[cite: 3]
    actionBtn.innerHTML = '<div class="spin-ring"></div> <span style="margin-left:8px">Connecting...</span>';
    actionBtn.style.pointerEvents = "none";

    // Launch native platform communication agent[cite: 2]
    setTimeout(() => {
        window.location.href = `mailto:${coreInbox}?subject=${subjectLine}&body=${structuredBody}`;
    }, 400);

    // Display confirmation splash text card overlay[cite: 3]
    setTimeout(() => {
        textFeedback.innerHTML = `Thank you, <strong>${fullName}</strong>. Your strategic overview has been packaged. Please forward the opened mail draft to our consulting panel to finalize connection channels.`;
        successOverlay.style.display = "flex";
    }, 1000);
}