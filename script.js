/*
  Box du Mercredi - script.js
  Liens Shopify, menu mobile, animations et compteur de dons.
*/

const SHOPIFY_CONFIG = {
  baseUrl: 'https://votre-boutique.myshopify.com',
  products: {
    'box-exemple': '/products/box-qui-a-mange-le-gateau',
  },
  subscriptions: {
    'abonnement-mensuel': '/products/abonnement-box-du-mercredi',
  },
  pages: {
    contact: '/pages/contact',
    'mentions-legales': '/pages/mentions-legales',
  },
};

function resolveShopifyLinks() {
  const links = document.querySelectorAll('[data-shopify]');
  links.forEach((link) => {
    const key = link.getAttribute('data-shopify');
    const path = SHOPIFY_CONFIG.products[key] || SHOPIFY_CONFIG.subscriptions[key] || SHOPIFY_CONFIG.pages[key];

    if (path) {
      link.href = SHOPIFY_CONFIG.baseUrl + path;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    } else {
      link.href = '#';
      if (window.location.hostname === 'localhost') {
        console.warn(`[Box du Mercredi] Cle Shopify introuvable: ${key}`);
      }
    }
  });
}

function initMobileMenu() {
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!burgerBtn || !mobileMenu) return;

  burgerBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('is-open');
    burgerBtn.setAttribute('aria-expanded', String(isOpen));
  });

  mobileMenu.querySelectorAll('a').forEach((item) => {
    item.addEventListener('click', () => {
      mobileMenu.classList.remove('is-open');
      burgerBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

function initFadeInAnimations() {
  const nodes = document.querySelectorAll('.fade-in');
  if (!nodes.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  nodes.forEach((node) => observer.observe(node));
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      const header = document.querySelector('.header');
      const offset = header ? header.offsetHeight : 0;
      const y = target.getBoundingClientRect().top + window.scrollY - offset - 10;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
}

function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute('id');

        navLinks.forEach((link) => {
          link.classList.toggle('nav__link--active', link.getAttribute('href') === `#${id}`);
        });
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((section) => observer.observe(section));
}

function initDonationCounter() {
  const counter = document.getElementById('donationCounter');
  if (!counter) return;

  const target = Number(counter.dataset.target || '0');
  const duration = 1600;
  const startTime = performance.now();

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = Math.floor(target * progress);
    counter.textContent = value.toLocaleString('fr-FR');

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

document.addEventListener('DOMContentLoaded', () => {
  resolveShopifyLinks();
  initMobileMenu();
  initFadeInAnimations();
  initSmoothScroll();
  initScrollSpy();
  initDonationCounter();
});
