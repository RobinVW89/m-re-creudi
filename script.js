/**
 * CRÉUDI — script.js
 * Gestion des liens Shopify, menu mobile, animations
 * -------------------------------------------------------
 * CONFIGURATION SHOPIFY : modifiez SHOPIFY_CONFIG ci-dessous
 * pour pointer vers votre boutique Shopify réelle.
 */

/* ========================================================
   1. CONFIGURATION SHOPIFY
   --------------------------------------------------------
   Remplacez "votre-boutique" par votre sous-domaine Shopify
   (ex: "creudi" si votre boutique est creudi.myshopify.com)
   Remplacez les slugs de produits/collections par les vôtres.
======================================================== */
const SHOPIFY_CONFIG = {
  // URL de base de votre boutique Shopify
  baseUrl: 'https://votre-boutique.myshopify.com',

  // Liens produits (box à l'unité)
  products: {
    'box-du-mois':       '/products/box-du-mois',
    'box-noel-2024':     '/products/box-noel-2024',
    'box-halloween-2024':'/products/box-halloween-2024',
    'box-ete-2024':      '/products/box-ete-2024',
  },

  // Liens abonnements
  subscriptions: {
    'abonnement-3mois':  '/products/abonnement-3-mois',
    'abonnement-6mois':  '/products/abonnement-6-mois',
    'abonnement-12mois': '/products/abonnement-12-mois',
  },

  // Liens de pages génériques
  pages: {
    'faq':              '/pages/faq',
    'livraison':        '/pages/livraison',
    'contact':          '/pages/contact',
    'mentions-legales': '/pages/mentions-legales',
    'newsletter':       '/pages/newsletter',
  },
};

/* ========================================================
   2. RÉSOLUTION DES LIENS SHOPIFY
   --------------------------------------------------------
   Chaque élément portant [data-shopify="clé"] reçoit
   automatiquement son href Shopify au chargement.
======================================================== */
function resolveShopifyLinks() {
  const allLinks = document.querySelectorAll('[data-shopify]');

  allLinks.forEach((el) => {
    const key = el.getAttribute('data-shopify');

    // Cherche la clé dans products, subscriptions, puis pages
    const path =
      SHOPIFY_CONFIG.products[key] ||
      SHOPIFY_CONFIG.subscriptions[key] ||
      SHOPIFY_CONFIG.pages[key] ||
      null;

    if (path) {
      el.setAttribute('href', SHOPIFY_CONFIG.baseUrl + path);
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
    } else {
      // Clé non trouvée : avertissement en console (mode développement uniquement)
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.warn(`[Créudi] Lien Shopify introuvable pour la clé : "${key}"`);
      }
      // Lien désactivé visuellement si pas encore configuré
      el.setAttribute('href', '#');
    }
  });
}

/* ========================================================
   3. MENU BURGER (mobile)
======================================================== */
function initMobileMenu() {
  const burgerBtn  = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (!burgerBtn || !mobileMenu) return;

  burgerBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('is-open');
    burgerBtn.classList.toggle('is-open', isOpen);
    burgerBtn.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Fermer le menu au clic sur un lien mobile
  mobileMenu.querySelectorAll('.nav__mobile-link, .btn').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('is-open');
      burgerBtn.classList.remove('is-open');
      burgerBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* ========================================================
   4. ANIMATIONS FADE-IN (IntersectionObserver)
   --------------------------------------------------------
   Les éléments .fade-in apparaissent progressivement
   au fur et à mesure que l'utilisateur fait défiler.
======================================================== */
function initFadeInAnimations() {
  const elements = document.querySelectorAll('.fade-in');

  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Délai progressif pour les groupes d'éléments
          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, index * 80);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  elements.forEach((el) => observer.observe(el));
}

/* ========================================================
   5. HEADER STICKY — ombre au défilement
======================================================== */
function initStickyHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('header--scrolled', window.scrollY > 10);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ========================================================
   6. SMOOTH SCROLL pour les ancres internes
   (complément au scroll-behavior: smooth du CSS)
======================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
      const targetTop = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight - 8;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });
}

/* ========================================================
   7. EFFET "BOX DU MOMENT" — compte à rebours optionnel
   --------------------------------------------------------
   Affiche un délai avant la prochaine box si vous voulez
   créer de l'urgence. Désactivez en passant SHOW_COUNTDOWN: false
======================================================== */
const COUNTDOWN_CONFIG = {
  SHOW_COUNTDOWN: true,
  // Date de fin de l'édition limitée (format: YYYY-MM-DD)
  END_DATE: '2025-05-31T23:59:59',
};

function initCountdown() {
  if (!COUNTDOWN_CONFIG.SHOW_COUNTDOWN) return;

  const boxActuelle = document.getElementById('box-actuelle');
  if (!boxActuelle) return;

  // Crée la zone de compte à rebours
  const countdownEl = document.createElement('div');
  countdownEl.className = 'countdown';
  countdownEl.setAttribute('aria-live', 'polite');
  countdownEl.innerHTML = `
    <p class="countdown__label">⏰ Offre disponible encore :</p>
    <div class="countdown__timer">
      <div class="countdown__unit"><span id="cd-days">--</span><small>jours</small></div>
      <div class="countdown__sep">:</div>
      <div class="countdown__unit"><span id="cd-hours">--</span><small>heures</small></div>
      <div class="countdown__sep">:</div>
      <div class="countdown__unit"><span id="cd-mins">--</span><small>min</small></div>
      <div class="countdown__sep">:</div>
      <div class="countdown__unit"><span id="cd-secs">--</span><small>sec</small></div>
    </div>
  `;

  // Ajoute le CSS du compte à rebours dynamiquement
  const style = document.createElement('style');
  style.textContent = `
    .countdown {
      margin-top: 1rem;
      display: inline-flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
    .countdown__label {
      font-weight: 700;
      font-size: 0.9rem;
      color: var(--violet-dark);
    }
    .countdown__timer {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .countdown__unit {
      background: var(--violet);
      color: white;
      border-radius: 0.5rem;
      padding: 0.4rem 0.7rem;
      text-align: center;
      min-width: 54px;
      font-family: var(--font-head);
    }
    .countdown__unit span {
      display: block;
      font-size: 1.4rem;
      font-weight: 900;
      line-height: 1;
    }
    .countdown__unit small {
      font-size: 0.7rem;
      opacity: 0.8;
    }
    .countdown__sep {
      font-size: 1.5rem;
      font-weight: 900;
      color: var(--violet-dark);
    }
    @media (max-width: 480px) {
      .countdown { align-items: center; width: 100%; }
    }
  `;
  document.head.appendChild(style);

  // Insère le compte à rebours après le bouton
  const btn = boxActuelle.querySelector('.btn');
  if (btn) btn.insertAdjacentElement('afterend', countdownEl);

  // Mise à jour chaque seconde
  function updateTimer() {
    const now = Date.now();
    const end = new Date(COUNTDOWN_CONFIG.END_DATE).getTime();
    const diff = end - now;

    if (diff <= 0) {
      countdownEl.innerHTML = '<p class="countdown__label">✅ Stock épuisé — abonnez-vous pour la prochaine box !</p>';
      return;
    }

    const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins  = Math.floor((diff / (1000 * 60)) % 60);
    const secs  = Math.floor((diff / 1000) % 60);

    const pad = (n) => String(n).padStart(2, '0');

    document.getElementById('cd-days').textContent  = pad(days);
    document.getElementById('cd-hours').textContent = pad(hours);
    document.getElementById('cd-mins').textContent  = pad(mins);
    document.getElementById('cd-secs').textContent  = pad(secs);
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ========================================================
   8. MISE EN ÉVIDENCE DE LA NAV ACTIVE (scroll spy)
======================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.toggle(
              'nav__link--active',
              link.getAttribute('href') === `#${id}`
            );
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  // Ajouter le style de lien actif
  const style = document.createElement('style');
  style.textContent = `.nav__link--active { color: var(--violet-dark) !important; }
  .nav__link--active::after { width: 100% !important; }`;
  document.head.appendChild(style);

  sections.forEach((s) => observer.observe(s));
}

/* ========================================================
   9. INITIALISATION
======================================================== */
document.addEventListener('DOMContentLoaded', () => {
  resolveShopifyLinks();
  initMobileMenu();
  initFadeInAnimations();
  initStickyHeader();
  initSmoothScroll();
  initCountdown();
  initScrollSpy();
});
