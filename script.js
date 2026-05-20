/* ============================================================
   WEDDING INVITATION — SCRIPT.JS
   Features: Particles, Navbar, Countdown, Scroll Reveal,
             Gallery Lightbox, RSVP Form, Smooth Scroll
   ============================================================ */

'use strict';

/* ──────────────────────────────────────────────
   1. PARTICLE CANVAS BACKGROUND
   Creates floating gold sparkle particles
   ────────────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  const COUNT = 70;

  // Resize canvas to fill viewport
  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // Particle factory
  function createParticle() {
    return {
      x:       Math.random() * canvas.width,
      y:       Math.random() * canvas.height,
      r:       Math.random() * 2.2 + 0.4,
      dx:      (Math.random() - 0.5) * 0.35,
      dy:      -(Math.random() * 0.5 + 0.15),
      alpha:   Math.random() * 0.6 + 0.1,
      dAlpha:  (Math.random() * 0.004 + 0.001) * (Math.random() < 0.5 ? 1 : -1),
    };
  }

  // Populate initial particles
  for (let i = 0; i < COUNT; i++) particles.push(createParticle());

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      // Draw gold circle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 168, 76, ${p.alpha})`;
      ctx.fill();

      // Move
      p.x     += p.dx;
      p.y     += p.dy;
      p.alpha += p.dAlpha;

      // Bounce alpha
      if (p.alpha <= 0.05 || p.alpha >= 0.8) p.dAlpha *= -1;

      // Recycle if off-screen
      if (p.y < -10 || p.x < -10 || p.x > canvas.width + 10) {
        particles[i] = createParticle();
        particles[i].y = canvas.height + 5;
      }
    });

    requestAnimationFrame(animate);
  }
  animate();
})();


/* ──────────────────────────────────────────────
   2. NAVBAR — scroll effect & mobile toggle
   ────────────────────────────────────────────── */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const toggle    = document.getElementById('nav-toggle');
  const navLinks  = document.getElementById('nav-links');
  const links     = navLinks ? navLinks.querySelectorAll('a') : [];

  // Add 'scrolled' class after 60px scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile hamburger toggle
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      // Animate hamburger → X
      toggle.classList.toggle('active');
    });

    // Close menu when a link is clicked
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggle.classList.remove('active');
      });
    });
  }
})();


/* ──────────────────────────────────────────────
   3. SMOOTH SCROLL for all anchor links
   ────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH   = document.getElementById('navbar')?.offsetHeight || 72;
      const top    = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


/* ──────────────────────────────────────────────
   4. SCROLL REVEAL ANIMATION
   Adds 'visible' class when elements enter viewport
   ────────────────────────────────────────────── */
(function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        // Stagger each card slightly
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => observer.observe(el));
})();


/* ──────────────────────────────────────────────
   5. COUNTDOWN TIMER
   Target: 21 February 2026 at 11:00 AM
   ────────────────────────────────────────────── */
(function initCountdown() {
  // Wedding date: 29 May 2026 at 4:30 AM
  const WEDDING_DATE = new Date('2026-05-29T04:30:00');

  const elDays    = document.getElementById('cd-days');
  const elHours   = document.getElementById('cd-hours');
  const elMinutes = document.getElementById('cd-minutes');
  const elSeconds = document.getElementById('cd-seconds');

  if (!elDays) return;

  // Pad single digits with leading zero
  function pad(n) { return String(n).padStart(2, '0'); }

  // Flip animation on value change
  function flipUpdate(el, newVal) {
    if (el.textContent !== newVal) {
      el.classList.remove('flip');
      void el.offsetWidth; // reflow to restart animation
      el.classList.add('flip');
      el.textContent = newVal;
    }
  }

  function tick() {
    const now  = new Date();
    const diff = WEDDING_DATE - now;

    if (diff <= 0) {
      // Wedding day has arrived!
      elDays.textContent    = '00';
      elHours.textContent   = '00';
      elMinutes.textContent = '00';
      elSeconds.textContent = '00';
      document.querySelector('.countdown-subtext').textContent =
        '🎉 Today is the Auspicious Day! Congratulations Shanmuga Priya & Kirubanandham! 🎉';
      return;
    }

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60))      / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60))           / 1000);

    flipUpdate(elDays,    pad(days));
    flipUpdate(elHours,   pad(hours));
    flipUpdate(elMinutes, pad(minutes));
    flipUpdate(elSeconds, pad(seconds));
  }

  tick();
  setInterval(tick, 1000);
})();


/* ──────────────────────────────────────────────
   6. GALLERY LIGHTBOX
   Click any gallery image to view full-screen
   ────────────────────────────────────────────── */
(function initLightbox() {
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  if (!lightbox) return;

  // Open lightbox on gallery item click
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (!img) return; // No real image yet — placeholder
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || 'Gallery photo';
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close lightbox
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImg.src = ''; }, 300);
  }

  lightboxClose.addEventListener('click', closeLightbox);

  // Click outside image to close
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Escape key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
  });
})();


/* ──────────────────────────────────────────────
   7. RSVP FORM SUBMISSION
   Handles validation and success state
   ────────────────────────────────────────────── */
(function initRSVP() {
  const form      = document.getElementById('rsvp-form');
  const success   = document.getElementById('rsvp-success');
  const btnText   = document.getElementById('rsvp-btn-text');
  const submitBtn = document.getElementById('rsvp-submit');

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Basic validation
    const name       = document.getElementById('rsvp-name').value.trim();
    const phone      = document.getElementById('rsvp-phone').value.trim();
    const attendance = document.querySelector('input[name="attendance"]:checked');

    if (!name) {
      shakeField(document.getElementById('rsvp-name'));
      return;
    }
    if (!phone) {
      shakeField(document.getElementById('rsvp-phone'));
      return;
    }
    if (!attendance) {
      shakeField(document.querySelector('.attendance-options'));
      return;
    }

    // Simulate sending — show loading state
    submitBtn.disabled = true;
    btnText.textContent = 'Sending…';

    setTimeout(() => {
      // Show success message
      form.style.display    = 'none';
      success.style.display = 'block';

      // Scroll to success
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 1200);
  });

  // Shake animation for invalid fields
  function shakeField(el) {
    el.classList.remove('shake');
    void el.offsetWidth;
    el.classList.add('shake');
    el.focus?.();
  }
})();


/* ──────────────────────────────────────────────
   8. ACTIVE NAV LINK on scroll (highlight current section)
   ────────────────────────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function onScroll() {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      if (
        scrollPos >= section.offsetTop &&
        scrollPos < section.offsetTop + section.offsetHeight
      ) {
        navLinks.forEach(link => {
          link.classList.remove('active-link');
          if (link.getAttribute('href') === `#${section.id}`) {
            link.classList.add('active-link');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ──────────────────────────────────────────────
   9. MOBILE NAV HAMBURGER animation styles (injected)
   ────────────────────────────────────────────── */
(function addDynamicStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* Active nav link underline */
    .nav-link.active-link {
      color: var(--gold-light) !important;
    }
    .nav-link.active-link::after {
      width: 100% !important;
    }

    /* Hamburger → X transform */
    .nav-toggle.active span:nth-child(1) {
      transform: translateY(7px) rotate(45deg);
    }
    .nav-toggle.active span:nth-child(2) {
      opacity: 0;
      transform: scaleX(0);
    }
    .nav-toggle.active span:nth-child(3) {
      transform: translateY(-7px) rotate(-45deg);
    }
    .nav-toggle span {
      transition: transform 0.3s ease, opacity 0.3s ease;
    }

    /* Shake animation for form validation */
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%       { transform: translateX(-8px); }
      40%       { transform: translateX(8px); }
      60%       { transform: translateX(-5px); }
      80%       { transform: translateX(5px); }
    }
    .shake {
      animation: shake 0.45s ease;
      border-color: #e05555 !important;
      box-shadow: 0 0 0 3px rgba(224, 85, 85, 0.2) !important;
    }

    /* Glow on countdown numbers */
    .countdown-num {
      text-shadow: 0 0 30px rgba(201, 168, 76, 0.25);
    }

    /* Ensure nav links visible in scrolled state on desktop */
    @media (min-width: 769px) {
      .navbar .nav-links { display: flex !important; }
    }
  `;
  document.head.appendChild(style);
})();
