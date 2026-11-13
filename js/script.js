/* ============================================================
    SAWA REPAIRS & SOLUTIONS — Main JavaScript (Clean & Robust)
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
const hamburgerEl = document.querySelector('.hamburger');

function toggleMenu() {
  if (!navLinksEl) return;
  const isOpen = navLinksEl.classList.contains('open') || navLinksEl.classList.contains('mobile-open');
  navLinksEl.classList.toggle('open', !isOpen);
  navLinksEl.classList.toggle('mobile-open', !isOpen);
  if (hamburgerEl) hamburgerEl.classList.toggle('active', !isOpen);
  document.body.classList.toggle('menu-open', !isOpen);
}

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    if (navLinksEl) {
      navLinksEl.classList.remove('open', 'mobile-open');
    }
    if (hamburgerEl) hamburgerEl.classList.remove('active');
    document.body.classList.remove('menu-open');
  });
});

window.addEventListener('resize', () => {
  if (window.innerWidth >= 900 && navLinksEl) {
    navLinksEl.classList.remove('open', 'mobile-open');
    if (hamburgerEl) hamburgerEl.classList.remove('active');
    document.body.classList.remove('menu-open');
  }
});

/* ── FAQ ACCORDION (Works across all pages) ── */
document.addEventListener('click', (e) => {
  const q = e.target.closest('.faq-q');
  if (!q) return;
  const item = q.closest('.faq-item');
  if (!item) return;

  const parentList = item.closest('.faq-list');
  const wasOpen = item.classList.contains('open');

  if (parentList) {
    parentList.querySelectorAll('.faq-item.open').forEach(other => {
      if (other !== item) other.classList.remove('open');
    });
  }

  item.classList.toggle('open', !wasOpen);
});

/* Support inline onclick="toggleFaq(this)" for backwards compatibility */
function toggleFaq(el) {
  const item = el.closest('.faq-item');
  if (item) item.classList.toggle('open');
}

/* ── THANK YOU MODAL ── */
function closeTyModal() {
  const modal = document.getElementById('ty-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
}

/* ── GALLERY LIGHTBOX ── */
const galleryImages = [];
let currentIndex = 0;

function openLightbox(index) {
  if (!galleryImages.length) return;
  currentIndex = index;
  updateLightbox();
  if (lightboxEl) {
    lightboxEl.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function updateLightbox() {
  const item = galleryImages[currentIndex];
  const img = document.getElementById('lightbox-img');
  const cap = document.getElementById('lightbox-caption');
  const cnt = document.getElementById('lightbox-counter');
  if (img) { img.src = item.src; img.alt = item.alt; }
  if (cap) cap.textContent = item.caption;
  if (cnt) cnt.textContent = (currentIndex + 1) + ' / ' + galleryImages.length;
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
  if (lightboxEl) lightboxEl.classList.remove('active');
  document.body.style.overflow = '';
}

const galleryDoms = document.querySelectorAll('.gallery-item img');
let lightboxEl = null;

if (galleryDoms.length > 0) {
  lightboxEl = document.createElement('div');
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

  galleryDoms.forEach((img, i) => {
    const caption = img.closest('.gallery-item')?.querySelector('.gallery-overlay span')?.textContent || '';
    galleryImages.push({ src: img.src, alt: img.alt, caption });
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => openLightbox(i));
  });

  lightboxEl.addEventListener('click', (e) => {
    if (e.target === lightboxEl) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightboxEl.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') lightboxNext();
    if (e.key === 'ArrowLeft') lightboxPrev();
  });
}

/* ── GALLERY SCROLL ANIMATION ── */
const galleryItems = document.querySelectorAll('.gallery-item');
if (galleryItems.length > 0) {
  const galleryObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        galleryObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  galleryItems.forEach(item => galleryObs.observe(item));
}
