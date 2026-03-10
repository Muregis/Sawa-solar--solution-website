/* ============================================================
    SAWA REPAIRS & SOLUTIONS — Main JavaScript (Fixed)
   ============================================================ */

/* ── NAV SHADOW ON SCROLL ── */
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
});

/* ── SCROLL REVEAL ── */
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

/* ── MOBILE MENU ── */
const navLinksEl = document.querySelector('.nav-links');
function toggleMenu() {
  navLinksEl.classList.toggle('mobile-open');
  document.body.classList.toggle('menu-open');
}

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinksEl.classList.remove('mobile-open');
    document.body.classList.remove('menu-open');
  });
});

window.addEventListener('resize', () => {
  if (window.innerWidth >= 900) {
    navLinksEl.classList.remove('mobile-open');
    document.body.classList.remove('menu-open');
  }
});

/* ── GALLERY LIGHTBOX ── */
const galleryImages = [];
let currentIndex = 0;

function openLightbox(index) {
  if (!galleryImages.length) return;
  currentIndex = index;
  updateLightbox();
  lightboxEl.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function updateLightbox() {
  const item = galleryImages[currentIndex];
  document.getElementById('lightbox-img').src = item.src;
  document.getElementById('lightbox-img').alt = item.alt;
  document.getElementById('lightbox-caption').textContent = item.caption;
  document.getElementById('lightbox-counter').textContent =
    (currentIndex + 1) + ' / ' + galleryImages.length;
}

function lightboxNext() {
  currentIndex = (currentIndex + 1) % galleryImages.length;
  updateLightbox();
}

function lightboxPrev() {
  currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
  updateLightbox();
}

function closeLightbox() {
  lightboxEl.classList.remove('active');
  document.body.style.overflow = '';
}

const lightboxEl = document.createElement('div');
lightboxEl.className = 'lightbox';
lightboxEl.innerHTML = `
  <button class="lightbox-close" onclick="closeLightbox()">&#x2715;</button>
  <button class="lightbox-prev" onclick="lightboxPrev()">&#8592;</button>
  <img class="lightbox-img" id="lightbox-img" src="" alt="">
  <button class="lightbox-next" onclick="lightboxNext()">&#8594;</button>
  <div class="lightbox-caption" id="lightbox-caption"></div>
  <div class="lightbox-counter" id="lightbox-counter"></div>
`;
document.body.appendChild(lightboxEl);

document.querySelectorAll('.gallery-item img').forEach((img, i) => {
  const caption = img.closest('.gallery-item')?.querySelector('.gallery-overlay span')?.textContent || '';
  galleryImages.push({ src: img.src, alt: img.alt, caption });
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', () => openLightbox(i));
});

lightboxEl.addEventListener('click', (e) => { if (e.target === lightboxEl) closeLightbox(); });

document.addEventListener('keydown', (e) => {
  if (!lightboxEl.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') lightboxNext();
  if (e.key === 'ArrowLeft') lightboxPrev();
});

/* ── GALLERY SCROLL ANIMATION ── */
const galleryItems = document.querySelectorAll('.gallery-item');
const galleryObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in-view');
      galleryObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
galleryItems.forEach(item => galleryObs.observe(item));

/* ── STATS COUNTER ── */
const statsObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = +el.dataset.target;
    const duration = 1200;
    const startTime = performance.now();

    function animate(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      el.textContent = Math.floor(progress * target);
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(animate);
    observer.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num').forEach(el => {
  statsObserver.observe(el);
});

/* ── CONTACT FORM ── */
function submitForm(event) {
  event.preventDefault();

  const form = event.target;
  const btn = form.querySelector('.form-submit');

  btn.textContent = 'Sending...';
  btn.disabled = true;

  fetch(form.action, {
    method: 'POST',
    body: new FormData(form),
  })
  .then(() => {
    btn.textContent = '✅ Request Sent!';
    form.reset();
  })
  .catch(() => {
    btn.textContent = '❌ Failed. Try again.';
  })
  .finally(() => {
    setTimeout(() => {
      btn.textContent = '📋 Send My Request →';
      btn.disabled = false;
    }, 4000);
  });
}

/* ── ACTIVE NAV HIGHLIGHT ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === '#' + current ? 'var(--green)' : '';
  });
});