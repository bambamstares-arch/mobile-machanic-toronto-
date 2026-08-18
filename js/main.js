/* GTA Mobile Tire Services — shared interactivity & scroll animation */
(function () {
  document.documentElement.classList.remove('js-off');

  /* ---------------- Mobile nav ---------------- */
  var menuBtn = document.querySelector('.menu-btn');
  var mobileMenu = document.querySelector('.mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function () {
      var open = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!open));
      mobileMenu.classList.toggle('is-open', !open);
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menuBtn.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('is-open');
      });
    });
  }

  /* ---------------- Sticky call bar: hide on scroll down, show on scroll up ---------------- */
  var callBar = document.querySelector('.call-bar');
  if (callBar) {
    var lastY = window.scrollY;
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        if (y > lastY && y > 160) {
          callBar.classList.add('is-hidden');
        } else {
          callBar.classList.remove('is-hidden');
        }
        lastY = y;
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------------- Button "stamp" press feedback (touch + mouse) ---------------- */
  document.querySelectorAll('.btn-primary, .btn-outline').forEach(function (btn) {
    ['pointerdown'].forEach(function (evt) {
      btn.addEventListener(evt, function () { btn.classList.add('is-pressed'); });
    });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (evt) {
      btn.addEventListener(evt, function () { btn.classList.remove('is-pressed'); });
    });
  });

  /* ---------------- Motion preference ---------------- */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    document.querySelectorAll('.hero__bg-video video').forEach(function (v) {
      v.removeAttribute('autoplay');
      v.pause();
    });
  }

  /* Static fallback: .reveal ships at opacity 0, so any path that skips the
     GSAP reveals must put the page back to its readable state. */
  function showStaticPage() {
    document.documentElement.classList.add('js-off');
    if (window.gsap) gsap.set('.reveal, .hero__ticket-float', { clearProps: 'all' });
  }

  /* ---------------- GSAP: load-in + scroll reveals ---------------- */
  if (!window.gsap || !window.ScrollTrigger || reduceMotion) {
    showStaticPage();
  } else try {
    gsap.registerPlugin(ScrollTrigger);

    /* Hero load sequence: ticket "prints in" like paper feeding from a receipt printer */
    var heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTl
      .from('.hero__eyebrow', { y: 14, opacity: 0, duration: 0.5 })
      .from('.hero h1', { y: 26, opacity: 0, duration: 0.7 }, '-=0.3')
      .from('.hero .lede', { y: 18, opacity: 0, duration: 0.6 }, '-=0.4')
      .from('.hero .btn-row', { y: 14, opacity: 0, duration: 0.5 }, '-=0.35')
      .from('.hero__trust', { y: 10, opacity: 0, duration: 0.5 }, '-=0.3')
      .from('.hero__bg-video', { opacity: 0, scale: 1.04, duration: 0.9 }, '-=0.9')
      .fromTo('.hero__ticket-float',
        { clipPath: 'inset(0 0 100% 0)', opacity: 0, y: -10 },
        { clipPath: 'inset(0 0 0% 0)', opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
        '-=0.3');

    /* Generic reveal: any .reveal fades/slides up into view once */
    gsap.utils.toArray('.reveal').forEach(function (el, i) {
      var group = el.closest('[data-reveal-group]');
      gsap.fromTo(el,
        { y: 28, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, ease: 'power2.out',
          delay: group ? Math.min(i % 6, 5) * 0.08 : 0,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true }
        });
    });

    /* Stat count-up for .stat[data-count] */
    gsap.utils.toArray('.stat[data-count]').forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var decimals = (el.getAttribute('data-count').split('.')[1] || '').length;
      var suffix = el.getAttribute('data-suffix') || '';
      var obj = { val: 0 };
      el.firstChild.nodeValue = (0).toFixed(decimals) + suffix;
      ScrollTrigger.create({
        trigger: el, start: 'top 90%', once: true,
        onEnter: function () {
          gsap.to(obj, {
            val: target, duration: 1.4, ease: 'power2.out',
            onUpdate: function () { el.firstChild.nodeValue = obj.val.toFixed(decimals) + suffix; }
          });
        }
      });
    });

    /* Subtle parallax on hero background video */
    if (window.matchMedia('(min-width: 960px)').matches) {
      gsap.to('.hero__bg-video video', {
        y: 40, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 }
      });
    }
  } catch (err) {
    /* A blocked CDN or an unsupported browser must never hide the content. */
    showStaticPage();
  }
})();
