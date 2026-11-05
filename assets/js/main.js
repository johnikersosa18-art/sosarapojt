/**
 * John Iker N. Sosa — OJT Portfolio Website
 * Lightweight Vanilla JavaScript:
 * 1. Sticky Header Scroll Elevation
 * 2. Accessible Mobile Navigation Drawer & Backdrop
 * 3. Active Section Scroll-Spy
 * 4. Subtle Viewport Reveal Animations (IntersectionObserver)
 * 5. One-Click Email Copy Micro-Interaction
 * 6. Client-Side Mailto OJT Inquiry Composer
 */
(function () {
  'use strict';

  // Enable progressive reveal animations safely
  document.documentElement.classList.add('js-ready');

  document.addEventListener('DOMContentLoaded', function () {
    const header = document.getElementById('header');
    const navToggle = document.getElementById('navToggle');
    const primaryNav = document.getElementById('primaryNav');
    const navBackdrop = document.getElementById('navBackdrop');
    const navLinks = document.querySelectorAll('.nav-link');
    const spyTargets = document.querySelectorAll('main section[id], article[id="academic"]');
    const revealElements = document.querySelectorAll('.reveal');
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    const emailDisplay = document.getElementById('emailDisplay');
    const inquiryForm = document.getElementById('inquiryForm');
    const formFeedback = document.getElementById('formFeedback');

    // 1. Sticky Header Elevation on Scroll
    function handleHeaderScroll() {
      if (!header) return;
      if (window.scrollY > 16) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }

    // 2. Accessible Mobile Navigation Drawer
    function setMobileNavState(isOpen) {
      if (!navToggle || !primaryNav) return;
      navToggle.setAttribute('aria-expanded', String(isOpen));
      primaryNav.classList.toggle('is-open', isOpen);
      if (navBackdrop) {
        navBackdrop.classList.toggle('is-open', isOpen);
      }
    }

    if (navToggle && primaryNav) {
      navToggle.addEventListener('click', function () {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        setMobileNavState(!isExpanded);
      });

      navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
          setMobileNavState(false);
        });
      });

      if (navBackdrop) {
        navBackdrop.addEventListener('click', function () {
          setMobileNavState(false);
        });
      }

      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && primaryNav.classList.contains('is-open')) {
          setMobileNavState(false);
          navToggle.focus();
        }
      });

      window.addEventListener('resize', function () {
        if (window.innerWidth > 880 && primaryNav.classList.contains('is-open')) {
          setMobileNavState(false);
        }
      });
    }

    // 3. Active Navigation Link Highlight on Scroll
    function updateActiveNavLink() {
      const scrollPosition = window.scrollY + 150;
      let currentId = '';

      spyTargets.forEach(function (el) {
        const rect = el.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        const height = el.offsetHeight;
        if (scrollPosition >= top && scrollPosition < top + height) {
          currentId = el.getAttribute('id');
        }
      });

      navLinks.forEach(function (link) {
        const href = link.getAttribute('href');
        if (href === '#' + currentId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }

    window.addEventListener(
      'scroll',
      function () {
        handleHeaderScroll();
        updateActiveNavLink();
      },
      { passive: true }
    );
    handleHeaderScroll();
    updateActiveNavLink();

    // 4. Subtle Viewport Reveal Animations
    const prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealElements.forEach(function (el) {
        el.classList.add('is-visible');
      });
    } else {
      const revealObserver = new IntersectionObserver(
        function (entries, observer) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          root: null,
          rootMargin: '0px 0px -50px 0px',
          threshold: 0.1
        }
      );

      revealElements.forEach(function (el) {
        revealObserver.observe(el);
      });
    }

    // 5. One-Click Copy Email Micro-Interaction
    if (copyEmailBtn && emailDisplay) {
      copyEmailBtn.addEventListener('click', function () {
        const emailText = emailDisplay.textContent.trim();
        if (!navigator.clipboard || !navigator.clipboard.writeText) {
          return;
        }
        navigator.clipboard.writeText(emailText).then(function () {
          copyEmailBtn.textContent = 'Copied!';
          copyEmailBtn.classList.add('is-copied');
          setTimeout(function () {
            copyEmailBtn.textContent = 'Copy';
            copyEmailBtn.classList.remove('is-copied');
          }, 2000);
        });
      });
    }

    // 6. Client-Side OJT Inquiry Mailto Composer
    if (inquiryForm) {
      inquiryForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const senderInput = document.getElementById('senderName');
        const subjectInput = document.getElementById('inquirySubject');
        const messageInput = document.getElementById('inquiryMessage');

        const sender = senderInput ? senderInput.value.trim() : '';
        const subject = subjectInput ? subjectInput.value.trim() : 'OJT Inquiry — John Iker N. Sosa';
        const message = messageInput ? messageInput.value.trim() : '';

        if (!sender || !message) {
          if (formFeedback) {
            formFeedback.classList.add('is-error');
            formFeedback.textContent =
              'Please enter your name/organization and a brief message before sending.';
          }
          return;
        }

        let recipient = 'johnikersosa15@gmail.com';
        if (emailDisplay) {
          const displayedText = emailDisplay.textContent.trim();
          if (displayedText.includes('@')) {
            recipient = displayedText;
          }
        }

        const bodyLines = [
          'From: ' + sender,
          '',
          message,
          '',
          '---',
          'Sent via John Iker N. Sosa — BulSU-CIT OJT Portfolio Website'
        ];

        const mailtoUrl =
          'mailto:' +
          encodeURIComponent(recipient) +
          '?subject=' +
          encodeURIComponent(subject) +
          '&body=' +
          encodeURIComponent(bodyLines.join('\n'));

        if (formFeedback) {
          formFeedback.classList.remove('is-error');
          formFeedback.textContent = 'Opening your default email client with the prepared inquiry...';
        }

        window.location.href = mailtoUrl;
      });
    }
  });
})();
