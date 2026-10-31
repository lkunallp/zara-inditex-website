/* ==========================================================================
   ZARA & INDITEX — INTERNATIONAL BUSINESS CASE STUDY
   JavaScript: Interactions, Animations, Charts & Timeline Logic
   Author: Vaishnavi Kapadi | PRN: 250102271008
   ========================================================================== */

'use strict';

/* --------------------------------------------------------------------------
   1. Scroll Progress Indicator
   -------------------------------------------------------------------------- */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgressBar');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const totalScrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalScrollable) * 100;
    bar.style.width = progress + '%';
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   2. Header: Sticky, Scroll Class & Active Nav Links
   -------------------------------------------------------------------------- */
function initHeader() {
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    updateActiveNav(navLinks);
  }, { passive: true });
}

function updateActiveNav(navLinks) {
  const sections = document.querySelectorAll('section[id]');
  let currentSection = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-section') === currentSection) {
      link.classList.add('active');
    }
  });
}

/* --------------------------------------------------------------------------
   3. Mobile Navigation
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const overlay = document.getElementById('mobileNavOverlay');
  const closeBtn = document.getElementById('mobileNavClose');
  const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

  function openMenu() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (menuBtn) menuBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (overlay) overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeMenu();
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* --------------------------------------------------------------------------
   4. Back to Top Button
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const btn = document.getElementById('backToTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* --------------------------------------------------------------------------
   5. Scroll-Reveal Animation (Intersection Observer)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('[data-reveal]');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.08
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.getAttribute('data-reveal-delay') || 0;
        setTimeout(() => {
          el.classList.add('revealed');
        }, Number(delay));
        observer.unobserve(el);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    el.classList.add('reveal-init');
    observer.observe(el);
  });

  // Inject reveal CSS dynamically
  if (!document.getElementById('revealStyles')) {
    const style = document.createElement('style');
    style.id = 'revealStyles';
    style.textContent = `
      .reveal-init {
        opacity: 0;
        transform: translateY(28px);
        transition: opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .reveal-init.revealed {
        opacity: 1;
        transform: translateY(0);
      }
      [data-reveal="left"].reveal-init { transform: translateX(-30px); }
      [data-reveal="left"].reveal-init.revealed { transform: translateX(0); }
      [data-reveal="right"].reveal-init { transform: translateX(30px); }
      [data-reveal="right"].reveal-init.revealed { transform: translateX(0); }
      [data-reveal="scale"].reveal-init { transform: scale(0.92); }
      [data-reveal="scale"].reveal-init.revealed { transform: scale(1); }
    `;
    document.head.appendChild(style);
  }
}

/* --------------------------------------------------------------------------
   6. Animated Counter (for Key Metrics)
   -------------------------------------------------------------------------- */
function animateCounter(el) {
  const target = parseFloat(el.getAttribute('data-target'));
  const prefix = el.getAttribute('data-prefix') || '';
  const suffix = el.getAttribute('data-suffix') || '';
  const decimals = el.getAttribute('data-decimals') || 0;
  const duration = 1800;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = (eased * target).toFixed(Number(decimals));
    el.textContent = prefix + current + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   7. Interactive Timeline Filter (Section D)
   -------------------------------------------------------------------------- */
function initTimelineFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const timelineNodes = document.querySelectorAll('.timeline-node');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      timelineNodes.forEach(node => {
        const era = node.getAttribute('data-era');
        if (filter === 'all' || era === filter) {
          node.style.display = '';
          node.style.opacity = '1';
        } else {
          node.style.opacity = '0.25';
          node.style.pointerEvents = 'none';
          setTimeout(() => {
            if (node.style.opacity === '0.25') {
              node.style.pointerEvents = '';
            }
          }, 300);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   8. Financial Revenue Chart (Chart.js — Section F)
   -------------------------------------------------------------------------- */
function initRevenueChart() {
  const canvas = document.getElementById('revenueChart');
  if (!canvas || typeof Chart === 'undefined') return;

  const labels = ['FY2013–14', 'FY2017–18', 'FY2021–22', 'FY2023–24', 'FY2024–25'];
  const revenueData = [581, 1222, 1815, 2769, 2782];

  const ctx = canvas.getContext('2d');

  // Gradient fill
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(124, 26, 34, 0.18)');
  gradient.addColorStop(1, 'rgba(124, 26, 34, 0)');

  const revenueChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Revenue (₹ Crore)',
        data: revenueData,
        backgroundColor: revenueData.map((_, i) =>
          i === revenueData.length - 1
            ? 'rgba(124, 26, 34, 0.9)'
            : 'rgba(124, 26, 34, 0.65)'
        ),
        borderColor: 'rgba(124, 26, 34, 1)',
        borderWidth: 1,
        borderRadius: 0,
        barThickness: 60
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0d0d0d',
          titleColor: '#ffffff',
          bodyColor: '#cccccc',
          padding: 14,
          borderColor: 'rgba(255,255,255,0.08)',
          borderWidth: 1,
          callbacks: {
            label: ctx => `₹${ctx.parsed.y.toLocaleString('en-IN')} Crore`,
            afterLabel: ctx => {
              const prev = revenueData[ctx.dataIndex - 1];
              if (prev) {
                const growth = (((ctx.parsed.y - prev) / prev) * 100).toFixed(1);
                return `Growth: +${growth}% vs prior period`;
              }
              return '';
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: {
            font: { family: 'Plus Jakarta Sans', size: 12, weight: '600' },
            color: '#76767f'
          }
        },
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(0,0,0,0.05)', drawBorder: false },
          border: { display: false, dash: [4, 4] },
          ticks: {
            callback: val => '₹' + val.toLocaleString('en-IN'),
            font: { family: 'Plus Jakarta Sans', size: 12 },
            color: '#76767f'
          }
        }
      },
      animation: {
        duration: 900,
        easing: 'easeOutQuart'
      }
    }
  });

  // Chart type toggle
  const toggleBtns = document.querySelectorAll('.chart-toggle-btn');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      toggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const type = btn.getAttribute('data-chart-type');
      if (type === 'line') {
        revenueChart.config.type = 'line';
        revenueChart.data.datasets[0].backgroundColor = gradient;
        revenueChart.data.datasets[0].borderColor = 'rgba(124, 26, 34, 1)';
        revenueChart.data.datasets[0].pointBackgroundColor = 'rgba(124, 26, 34, 1)';
        revenueChart.data.datasets[0].pointRadius = 6;
        revenueChart.data.datasets[0].fill = true;
        revenueChart.data.datasets[0].tension = 0.35;
      } else {
        revenueChart.config.type = 'bar';
        revenueChart.data.datasets[0].backgroundColor = revenueData.map((_, i) =>
          i === revenueData.length - 1 ? 'rgba(124, 26, 34, 0.9)' : 'rgba(124, 26, 34, 0.65)');
        revenueChart.data.datasets[0].fill = false;
      }
      revenueChart.update();
    });
  });
}

/* --------------------------------------------------------------------------
   9. Theories Tabs (Section I)
   -------------------------------------------------------------------------- */
function initTheoryTabs() {
  const tabBtns = document.querySelectorAll('.theory-tab-btn');
  const tabPanels = document.querySelectorAll('.theory-tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });
}

/* --------------------------------------------------------------------------
   10. Ownership Bar Animation (Section G — Animated on scroll-in)
   -------------------------------------------------------------------------- */
function initOwnershipBars() {
  const stageBars = document.querySelectorAll('.stage-bar');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const inditexPart = bar.querySelector('.inditex-part');
        const trentPart = bar.querySelector('.trent-part');
        const inditexPct = parseFloat(bar.getAttribute('data-inditex'));
        const trentPct = 100 - inditexPct;

        // Animate from 0
        inditexPart.style.width = '0%';
        trentPart.style.width = '0%';
        inditexPart.style.transition = 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
        trentPart.style.transition = 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.1s';

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            inditexPart.style.width = inditexPct + '%';
            trentPart.style.width = trentPct + '%';
          });
        });

        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });

  stageBars.forEach(bar => observer.observe(bar));

  // Also animate the JV ratio bar
  const ratioBar = document.querySelector('.ratio-bar-container');
  if (ratioBar) {
    const inditexSeg = ratioBar.querySelector('.ratio-inditex-bar');
    const trentSeg = ratioBar.querySelector('.ratio-trent-bar');

    const ratioObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          inditexSeg.style.width = '0%';
          trentSeg.style.width = '0%';
          inditexSeg.style.transition = 'width 1.1s cubic-bezier(0.16, 1, 0.3, 1)';
          trentSeg.style.transition = 'width 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.12s';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              inditexSeg.style.width = '51%';
              trentSeg.style.width = '49%';
            });
          });
          ratioObserver.unobserve(ratioBar);
        }
      });
    }, { threshold: 0.5 });

    ratioObserver.observe(ratioBar);
  }
}

/* --------------------------------------------------------------------------
   11. Smooth Scroll for all anchor links
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* --------------------------------------------------------------------------
   12. Hero Section Parallax (subtle)
   -------------------------------------------------------------------------- */
function initHeroParallax() {
  const heroImage = document.querySelector('.hero-image-frame img');
  if (!heroImage) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      heroImage.style.transform = `translateY(${scrollY * 0.12}px)`;
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   13. Typing Effect for Hero Title (optional enhancement)
   -------------------------------------------------------------------------- */
function initHeroEntrance() {
  const heroContent = document.querySelector('.hero-content-wrapper');
  if (!heroContent) return;
  heroContent.style.opacity = '0';
  heroContent.style.transform = 'translateY(20px)';
  heroContent.style.transition = 'opacity 0.9s ease, transform 0.9s ease';

  requestAnimationFrame(() => {
    setTimeout(() => {
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateY(0)';
    }, 200);
  });
}

/* --------------------------------------------------------------------------
   14. Store Count Ticker in Metrics Ribbon
   -------------------------------------------------------------------------- */
function initMetricsRibbon() {
  const metricValues = document.querySelectorAll('.metric-value[data-counter]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  metricValues.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   15. Mobile: Card tap-to-reveal on timeline
   -------------------------------------------------------------------------- */
function initMobileCardInteractions() {
  if (window.innerWidth > 820) return;
  const timelineCards = document.querySelectorAll('.timeline-card');
  timelineCards.forEach(card => {
    card.addEventListener('touchstart', () => {
      card.style.boxShadow = 'var(--shadow-card)';
    }, { passive: true });
    card.addEventListener('touchend', () => {
      setTimeout(() => { card.style.boxShadow = ''; }, 300);
    }, { passive: true });
  });
}

/* --------------------------------------------------------------------------
   16. Scroll-triggered table row highlights (Conclusion)
   -------------------------------------------------------------------------- */
function initTableRowAnimation() {
  const rows = document.querySelectorAll('.conclusion-summary-table tbody tr');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';
        }, i * 90);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  rows.forEach(row => {
    row.style.opacity = '0';
    row.style.transform = 'translateX(-16px)';
    row.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(row);
  });
}

/* --------------------------------------------------------------------------
   17. Initialize All Modules on DOM Ready
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initHeader();
  initMobileNav();
  initBackToTop();
  initScrollReveal();
  initCounters();
  initTimelineFilter();
  initTheoryTabs();
  initOwnershipBars();
  initSmoothScroll();
  initHeroParallax();
  initHeroEntrance();
  initMetricsRibbon();
  initMobileCardInteractions();
  initTableRowAnimation();

  // Chart.js: wait for library to load
  if (typeof Chart !== 'undefined') {
    initRevenueChart();
  } else {
    window.addEventListener('load', () => {
      initRevenueChart();
    });
  }

  console.log('%cZARA & INDITEX — Case Study Website', 'font-family:serif;font-size:18px;color:#7c1a22;font-weight:bold');
  console.log('%cPrepared by: Vaishnavi Kapadi | PRN: 250102271008', 'font-size:12px;color:#4a4a4f');
});

