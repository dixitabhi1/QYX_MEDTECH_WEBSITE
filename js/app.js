/**
 * Qyx Medtech — Main Application Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header Scroll Effect
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // 2. Mobile Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navActions = document.querySelector('.nav-actions');

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);

      if (navMenu) {
        navMenu.style.display = isExpanded ? 'none' : 'flex';
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '80px';
        navMenu.style.left = '0';
        navMenu.style.right = '0';
        navMenu.style.backgroundColor = 'var(--color-sand)';
        navMenu.style.padding = '24px';
        navMenu.style.borderBottom = '1px solid var(--color-hairline)';
        navMenu.style.gap = '16px';
        navMenu.style.boxShadow = 'var(--shadow-floating)';
      }
    });
  }

  // 3. FAQ Accordion Behavior
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close all others (single-open accordion per design system)
        faqItems.forEach((other) => other.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // 4. Tab Switching (for How It Works dual tracks)
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');
      tabButtons.forEach((b) => b.classList.remove('active'));
      tabPanes.forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  // 5. Global Action Hooks (Buttons with data-trigger)
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-trigger]');
    if (!trigger) return;

    const action = trigger.getAttribute('data-trigger');
    if (action === 'popup-doctor') {
      e.preventDefault();
      if (window.QyxPopup) window.QyxPopup.open('doctor');
    } else if (action === 'popup-patient') {
      e.preventDefault();
      if (window.QyxPopup) window.QyxPopup.open('patient');
    } else if (action === 'popup-default') {
      e.preventDefault();
      if (window.QyxPopup) window.QyxPopup.open();
    } else if (action === 'chatbot') {
      e.preventDefault();
      if (window.QyxChatbot) window.QyxChatbot.open();
    }
  });

  // 6. Inline Forms Submissions
  const docAppForm = document.getElementById('doctorApplicationForm');
  if (docAppForm) {
    docAppForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = docAppForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Submitting Application...';

      setTimeout(() => {
        docAppForm.innerHTML = `
          <div style="text-align: center; padding: 40px 20px;">
            <div class="trust-check" style="width: 52px; height: 52px; font-size: 24px; margin: 0 auto 16px;">✓</div>
            <h3 style="margin-bottom: 8px;">Application Submitted Successfully</h3>
            <p style="color: var(--color-charcoal); max-width: 480px; margin: 0 auto 20px;">
              Thank you for bringing your consultancy onto Qyx. Our clinical onboarding team will review your credentials and contact you within <strong>2 business days</strong>.
            </p>
            <span class="pill pill-teal">Status: Under Verification Review</span>
          </div>
        `;
      }, 700);
    });
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending...';

      setTimeout(() => {
        contactForm.innerHTML = `
          <div style="text-align: center; padding: 40px 20px;">
            <div class="trust-check" style="width: 52px; height: 52px; font-size: 24px; margin: 0 auto 16px;">✓</div>
            <h3 style="margin-bottom: 8px;">Message Dispatched</h3>
            <p style="color: var(--color-charcoal); max-width: 440px; margin: 0 auto;">
              Thank you for getting in touch. A representative from Qyx Medtech will respond within 24 hours.
            </p>
          </div>
        `;
      }, 600);
    });
  }
});

