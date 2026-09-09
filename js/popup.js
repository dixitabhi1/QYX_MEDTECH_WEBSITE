/**
 * Qyx Medtech — First-Visit Multi-View Lead Generation Popup
 * Derived from references/lead-gen-popup.md
 */

(function () {
  const POPUP_STORAGE_KEY = 'qyx_lead_popup_dismissed_at';
  const SUPPRESSION_DAYS = 60;
  const AUTO_TRIGGER_DELAY_MS = 5000;
  const AUTO_TRIGGER_SCROLL_PERCENT = 45;

  let popupState = {
    step: 1,           // 1 = Branch, 2 = Benefits, 3 = Intake/Form, 4 = Confirmation
    track: null,       // 'doctor' | 'patient' | 'other'
    emailOrPhone: '',
    fullName: '',
    specialization: '',
    city: '',
    consultFormat: 'Video Consultation',
    consentChecked: true,
    hasAutoTriggered: false
  };

  function hasBeenSuppressed() {
    try {
      const dismissedAt = localStorage.getItem(POPUP_STORAGE_KEY);
      if (!dismissedAt) return false;
      const daysSince = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60 * 24);
      return daysSince < SUPPRESSION_DAYS;
    } catch (e) {
      return false;
    }
  }

  function setSuppressed() {
    try {
      localStorage.setItem(POPUP_STORAGE_KEY, Date.now().toString());
    } catch (e) {
      // localStorage may be restricted in private browsing
    }
  }

  function createModalDOM() {
    if (document.getElementById('qyxModalOverlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'qyxModalOverlay';
    overlay.className = 'modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Get started with Qyx');

    overlay.innerHTML = `
      <div class="modal-card" id="qyxModalCard">
        <button class="modal-close" id="qyxModalClose" aria-label="Close dialog">✕</button>
        <div id="qyxModalContent"></div>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal();
      }
    });

    document.getElementById('qyxModalClose').addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        closeModal();
      }
    });
  }

  function openModal(initialTrack) {
    createModalDOM();
    const overlay = document.getElementById('qyxModalOverlay');
    if (!overlay) return;

    if (initialTrack) {
      popupState.track = initialTrack;
      popupState.step = 2;
    } else {
      popupState.step = 1;
      popupState.track = null;
    }

    renderModalContent();
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    const overlay = document.getElementById('qyxModalOverlay');
    if (overlay) {
      overlay.classList.remove('active');
    }
    document.body.style.overflow = '';
    setSuppressed();
  }

  function renderModalContent() {
    const container = document.getElementById('qyxModalContent');
    if (!container) return;

    let html = '';

    // SCREEN 1: The Branch
    if (popupState.step === 1) {
      html = `
        <h3 class="modal-title">Get started with Qyx</h3>
        <p class="modal-subtitle">Tell us who you are — takes 15 seconds.</p>
        
        <div style="font-size: 0.75rem; font-weight: 700; color: var(--color-stone); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px;">
          I AM A...
        </div>

        <div class="modal-segments">
          <button type="button" class="modal-segment-btn" onclick="window.QyxPopup.selectTrack('doctor')">Doctor / Specialist</button>
          <button type="button" class="modal-segment-btn" onclick="window.QyxPopup.selectTrack('patient')">Patient / Partner</button>
          <button type="button" class="modal-segment-btn" onclick="window.QyxPopup.selectTrack('other')">Other Inquiry</button>
        </div>

        <p class="text-meta">Select a path above to see tailored platform information.</p>
      `;
    }

    // SCREEN 2: Benefits & Initial Contact
    else if (popupState.step === 2 && popupState.track === 'doctor') {
      html = `
        <button type="button" class="modal-back" onclick="window.QyxPopup.goToStep(1)">‹ Back</button>
        <div class="modal-dots">
          <div class="modal-dot active-teal"></div>
          <div class="modal-dot"></div>
          <div class="modal-dot"></div>
        </div>

        <h3 class="modal-title">Why doctors join Qyx</h3>
        <p class="modal-subtitle">You focus on the consult — we handle the infrastructure.</p>

        <div class="modal-benefit-list">
          <div class="modal-benefit-item">
            <div class="modal-benefit-check">✓</div>
            <div><strong>Steady patient volume:</strong> Reach men actively seeking a male reproductive health specialist.</div>
          </div>
          <div class="modal-benefit-item">
            <div class="modal-benefit-check">✓</div>
            <div><strong>Zero setup friction:</strong> No clinic overhead or software licenses needed to start.</div>
          </div>
          <div class="modal-benefit-item">
            <div class="modal-benefit-check">✓</div>
            <div><strong>Verified credentials:</strong> Platform verified badge establishes patient trust prior to consults.</div>
          </div>
          <div class="modal-benefit-item">
            <div class="modal-benefit-check">✓</div>
            <div><strong>Single dashboard:</strong> Integrated scheduling, automated reminders, and direct payouts.</div>
          </div>
        </div>

        <div class="form-group" style="margin-top: 18px;">
          <label class="form-label" for="popupEmailPhone">Email address or phone number</label>
          <input type="text" id="popupEmailPhone" class="form-control" placeholder="doctor@clinic.com or +91 / +1..." value="${popupState.emailOrPhone}">
        </div>

        <button type="button" class="btn btn-teal btn-block" onclick="window.QyxPopup.proceedToDoctorForm()">Continue to Application</button>
      `;
    }

    else if (popupState.step === 2 && popupState.track === 'patient') {
      html = `
        <button type="button" class="modal-back" onclick="window.QyxPopup.goToStep(1)">‹ Back</button>
        <div class="modal-dots">
          <div class="modal-dot active"></div>
          <div class="modal-dot"></div>
          <div class="modal-dot"></div>
        </div>

        <h3 class="modal-title">Why patients choose Qyx</h3>
        <p class="modal-subtitle">Direct access to verified male reproductive specialists.</p>

        <div class="modal-benefit-list">
          <div class="modal-benefit-item">
            <div class="modal-benefit-check" style="background-color: var(--color-coral);">✓</div>
            <div><strong>100% credential-checked:</strong> Every specialist is independently verified before listing.</div>
          </div>
          <div class="modal-benefit-item">
            <div class="modal-benefit-check" style="background-color: var(--color-coral);">✓</div>
            <div><strong>No referral wall:</strong> Book consultations directly without weeks of clinic runaround.</div>
          </div>
          <div class="modal-benefit-item">
            <div class="modal-benefit-check" style="background-color: var(--color-coral);">✓</div>
            <div><strong>Private & confidential:</strong> Your medical details remain protected under strict data standards.</div>
          </div>
          <div class="modal-benefit-item">
            <div class="modal-benefit-check" style="background-color: var(--color-coral);">✓</div>
            <div><strong>Continuous care:</strong> Follow up with the same doctor rather than starting over each time.</div>
          </div>
        </div>

        <div class="form-group" style="margin-top: 18px;">
          <label class="form-label" for="popupEmailPhone">Email address or phone number</label>
          <input type="text" id="popupEmailPhone" class="form-control" placeholder="you@example.com or +91 / +1..." value="${popupState.emailOrPhone}">
        </div>

        <button type="button" class="btn btn-coral btn-block" onclick="window.QyxPopup.proceedToPatientIntake()">Find My Specialist</button>
      `;
    }

    else if (popupState.step === 2 && popupState.track === 'other') {
      html = `
        <button type="button" class="modal-back" onclick="window.QyxPopup.goToStep(1)">‹ Back</button>

        <h3 class="modal-title">Tell us how we can help</h3>
        <p class="modal-subtitle">Reach our partnerships, press, or clinical team.</p>

        <div class="form-group">
          <label class="form-label" for="popupOtherName">Full name</label>
          <input type="text" id="popupOtherName" class="form-control" placeholder="Your name">
        </div>

        <div class="form-group">
          <label class="form-label" for="popupOtherEmail">Work email</label>
          <input type="email" id="popupOtherEmail" class="form-control" placeholder="name@institution.com">
        </div>

        <div class="form-group">
          <label class="form-label" for="popupOtherMsg">Inquiry details</label>
          <textarea id="popupOtherMsg" class="form-control" rows="3" placeholder="Partnership, clinical research, media..."></textarea>
        </div>

        <button type="button" class="btn btn-teal btn-block" onclick="window.QyxPopup.submitOtherInquiry()">Submit Inquiry</button>
      `;
    }

    // SCREEN 3: Deepened Intake / Application
    else if (popupState.step === 3 && popupState.track === 'doctor') {
      html = `
        <button type="button" class="modal-back" onclick="window.QyxPopup.goToStep(2)">‹ Back</button>
        <div class="modal-dots">
          <div class="modal-dot active-teal"></div>
          <div class="modal-dot active-teal"></div>
          <div class="modal-dot"></div>
        </div>

        <h3 class="modal-title">Consultant Application</h3>
        <p class="modal-subtitle">Short initial expression of interest. Formal credential verification follows.</p>

        <div class="form-group">
          <label class="form-label" for="docName">Full name & Title</label>
          <input type="text" id="docName" class="form-control" placeholder="e.g. Dr. Jane Smith" value="${popupState.fullName}">
        </div>

        <div class="form-group">
          <label class="form-label" for="docSpec">Clinical Specialization</label>
          <input type="text" id="docSpec" class="form-control" placeholder="e.g. Urology, Andrology, Male Reproductive Health" value="${popupState.specialization}">
        </div>

        <div class="form-group">
          <label class="form-label" for="docCity">City of Practice</label>
          <input type="text" id="docCity" class="form-control" placeholder="e.g. Bengaluru, Delhi, Mumbai, London" value="${popupState.city}">
        </div>

        <label class="form-checkbox-label">
          <input type="checkbox" id="docConsent" ${popupState.consentChecked ? 'checked' : ''}>
          <span>I agree to be contacted by Qyx Medtech regarding credential verification and platform onboarding.</span>
        </label>

        <div style="margin-top: 20px;">
          <button type="button" class="btn btn-teal btn-block" onclick="window.QyxPopup.submitDoctorApp()">Submit Application</button>
        </div>
      `;
    }

    else if (popupState.step === 3 && popupState.track === 'patient') {
      html = `
        <button type="button" class="modal-back" onclick="window.QyxPopup.goToStep(2)">‹ Back</button>
        <div class="modal-dots">
          <div class="modal-dot active"></div>
          <div class="modal-dot active"></div>
          <div class="modal-dot"></div>
        </div>

        <h3 class="modal-title">Consultation Preferences</h3>
        <p class="modal-subtitle">Help us match you with the appropriate verified male fertility specialist.</p>

        <div class="form-group">
          <label class="form-label" for="patFormat">Preferred Consultation Format</label>
          <select id="patFormat" class="form-control">
            <option value="Video Consultation">Secure 1-on-1 Video Consultation</option>
            <option value="Audio Consultation">Private Audio Call</option>
            <option value="Clinic In-Person">In-Clinic Consultation Referral</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label" for="patTimeline">When would you like to speak to a specialist?</label>
          <select id="patTimeline" class="form-control">
            <option value="This week">Earliest available (This week)</option>
            <option value="Next week">Next week</option>
            <option value="Flexible">Within the next 30 days</option>
          </select>
        </div>

        <label class="form-checkbox-label">
          <input type="checkbox" id="patConsent" ${popupState.consentChecked ? 'checked' : ''}>
          <span>I agree to receive specialist availability matching options from Qyx Medtech. Information is kept strictly confidential.</span>
        </label>

        <div style="margin-top: 20px;">
          <button type="button" class="btn btn-coral btn-block" onclick="window.QyxPopup.submitPatientIntake()">Request Specialist Match</button>
        </div>
      `;
    }

    // SCREEN 4: Confirmation State
    else if (popupState.step === 4) {
      const isDoctor = popupState.track === 'doctor';
      const isPatient = popupState.track === 'patient';

      html = `
        <div class="text-center" style="padding: 16px 0;">
          <div class="modal-confirm-icon">✓</div>
          <h3 class="modal-title">${isDoctor ? 'Application Received' : (isPatient ? 'Consultation Request Registered' : 'Message Sent')}</h3>
          <p style="font-size: 0.95rem; color: var(--color-charcoal); line-height: 1.6; margin-top: 12px;">
            ${isDoctor
              ? 'Thank you for your interest in bringing your consultancy onto Qyx. Our clinical operations team will review your registration and reach out within <strong>2 business days</strong> to initiate credential verification.'
              : isPatient
                ? 'Your specialist matching request has been received. Our clinical coordinators will send verified specialist availability to your contact address shortly.'
                : 'Thank you for reaching out. A member of the Qyx Medtech team will reply within 1 business day.'}
          </p>
          <button type="button" class="btn btn-coral" style="margin-top: 20px;" onclick="window.QyxPopup.close()">Done</button>
        </div>
      `;
    }

    container.innerHTML = html;
  }

  // Public Controller API
  window.QyxPopup = {
    open: function (trackPreset) {
      openModal(trackPreset);
    },
    close: function () {
      closeModal();
    },
    selectTrack: function (track) {
      popupState.track = track;
      popupState.step = 2;
      renderModalContent();
    },
    goToStep: function (step) {
      popupState.step = step;
      renderModalContent();
    },
    proceedToDoctorForm: function () {
      const field = document.getElementById('popupEmailPhone');
      if (field) popupState.emailOrPhone = field.value.trim();
      popupState.step = 3;
      renderModalContent();
    },
    proceedToPatientIntake: function () {
      const field = document.getElementById('popupEmailPhone');
      if (field) popupState.emailOrPhone = field.value.trim();
      popupState.step = 3;
      renderModalContent();
    },
    submitDoctorApp: function () {
      const name = document.getElementById('docName');
      const spec = document.getElementById('docSpec');
      const city = document.getElementById('docCity');
      const consent = document.getElementById('docConsent');

      if (name) popupState.fullName = name.value.trim();
      if (spec) popupState.specialization = spec.value.trim();
      if (city) popupState.city = city.value.trim();
      if (consent && !consent.checked) {
        alert('Please accept the contact agreement to proceed with your application.');
        return;
      }

      console.log('Qyx Doctor Lead Submitted:', {
        type: 'doctor',
        contact: popupState.emailOrPhone,
        name: popupState.fullName,
        specialization: popupState.specialization,
        city: popupState.city,
        timestamp: new Date().toISOString()
      });

      popupState.step = 4;
      renderModalContent();
      setSuppressed();
    },
    submitPatientIntake: function () {
      const consent = document.getElementById('patConsent');
      if (consent && !consent.checked) {
        alert('Please confirm consent to proceed with specialist matching.');
        return;
      }

      console.log('Qyx Patient Lead Submitted:', {
        type: 'patient',
        contact: popupState.emailOrPhone,
        format: document.getElementById('patFormat') ? document.getElementById('patFormat').value : 'Video',
        timeline: document.getElementById('patTimeline') ? document.getElementById('patTimeline').value : 'Flexible',
        timestamp: new Date().toISOString()
      });

      popupState.step = 4;
      renderModalContent();
      setSuppressed();
    },
    submitOtherInquiry: function () {
      popupState.step = 4;
      renderModalContent();
      setSuppressed();
    }
  };

  // Auto-trigger on page load (if not suppressed)
  window.addEventListener('DOMContentLoaded', () => {
    if (hasBeenSuppressed()) return;

    // Timer trigger
    const timer = setTimeout(() => {
      if (!popupState.hasAutoTriggered && !hasBeenSuppressed()) {
        popupState.hasAutoTriggered = true;
        openModal();
      }
    }, AUTO_TRIGGER_DELAY_MS);

    // Scroll depth trigger (45%)
    window.addEventListener('scroll', function onScroll() {
      if (popupState.hasAutoTriggered || hasBeenSuppressed()) {
        window.removeEventListener('scroll', onScroll);
        return;
      }
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (docHeight > 0 && (scrollY / docHeight) * 100 >= AUTO_TRIGGER_SCROLL_PERCENT) {
        popupState.hasAutoTriggered = true;
        clearTimeout(timer);
        window.removeEventListener('scroll', onScroll);
        openModal();
      }
    });
  });
})();

