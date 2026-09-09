/**
 * Qyx Medtech — AI Concierge Chatbot Widget
 * Derived from references/chatbot.md & assets/mockups/chatbot.png
 */

(function () {
  let chatInitialized = false;
  let chatState = 'greeting';

  const CLINICAL_TRIGGER_WORDS = [
    'symptom', 'pain', 'diagnos', 'treat', 'cure', 'prescri', 'medicine', 'drug',
    'sperm count', 'motility', 'morphology', 'semen analysis', 'varicocele', 'azoospermia',
    'testosterone', 'fsh', 'lh', 'hormone', 'fertility test', 'report', 'lab result',
    'erectile', 'infection', 'ivf', 'icsi', 'supplement'
  ];

  function createChatbotDOM() {
    if (document.getElementById('qyxChatLauncher')) return;

    // Launcher Button
    const launcher = document.createElement('button');
    launcher.id = 'qyxChatLauncher';
    launcher.className = 'chatbot-launcher';
    launcher.setAttribute('aria-label', 'Open Qyx Assistant');
    launcher.innerHTML = `
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    `;

    // Chat Window
    const windowEl = document.createElement('div');
    windowEl.id = 'qyxChatWindow';
    windowEl.className = 'chatbot-window';
    windowEl.innerHTML = `
      <div class="chatbot-header">
        <div class="chatbot-header-info">
          <div class="chatbot-avatar">✦</div>
          <div>
            <div class="chatbot-title">Qyx Assistant</div>
            <div class="chatbot-status">
              <span class="chatbot-status-dot"></span>
              Automated Concierge
            </div>
          </div>
        </div>
        <button class="chatbot-close" id="qyxChatClose" aria-label="Close chat">✕</button>
      </div>

      <div class="chatbot-disclaimer">
        <span>Disclaimer:</span> Automated assistant. Does not provide medical diagnoses or clinical advice.
      </div>

      <div class="chatbot-body" id="qyxChatBody"></div>
      <div class="chatbot-choices" id="qyxChatChoices"></div>

      <div class="chatbot-footer">
        <input type="text" id="qyxChatInput" class="chatbot-input" placeholder="Type a message or question...">
        <button class="chatbot-send-btn" id="qyxChatSend" aria-label="Send message">→</button>
      </div>
    `;

    document.body.appendChild(launcher);
    document.body.appendChild(windowEl);

    // Event Listeners
    launcher.addEventListener('click', toggleChat);
    document.getElementById('qyxChatClose').addEventListener('click', toggleChat);

    const input = document.getElementById('qyxChatInput');
    const sendBtn = document.getElementById('qyxChatSend');

    sendBtn.addEventListener('click', handleUserInput);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleUserInput();
    });
  }

  function toggleChat() {
    createChatbotDOM();
    const windowEl = document.getElementById('qyxChatWindow');
    const isOpen = windowEl.classList.toggle('open');

    if (isOpen && !chatInitialized) {
      chatInitialized = true;
      startConversation();
    }
  }

  function addBotMessage(text, isWarning = false) {
    const body = document.getElementById('qyxChatBody');
    if (!body) return;

    const bubble = document.createElement('div');
    bubble.className = `chat-bubble bot ${isWarning ? 'warning' : ''}`;
    bubble.innerHTML = text;
    body.appendChild(bubble);
    body.scrollTop = body.scrollHeight;
  }

  function addUserMessage(text) {
    const body = document.getElementById('qyxChatBody');
    if (!body) return;

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble user';
    bubble.textContent = text;
    body.appendChild(bubble);
    body.scrollTop = body.scrollHeight;
  }

  function setChoices(choices) {
    const container = document.getElementById('qyxChatChoices');
    if (!container) return;
    container.innerHTML = '';

    choices.forEach((c) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = c.label;
      btn.addEventListener('click', () => {
        addUserMessage(c.label);
        container.innerHTML = '';
        setTimeout(() => c.action(), 400);
      });
      container.appendChild(btn);
    });
  }

  function startConversation() {
    addBotMessage("Hello! I am the Qyx automated concierge. I can help guide you to book a specialist consultation, answer platform questions, or help doctors join our network.");
    setTimeout(() => {
      addBotMessage("To get started: Are you a healthcare specialist, or are you seeking fertility care?");
      setChoices([
        { label: "I am a Doctor / Specialist", action: handleDoctorTrack },
        { label: "I am looking for a Doctor", action: handlePatientTrack },
        { label: "Platform FAQs", action: handleFaqTrack }
      ]);
    }, 500);
  }

  function handleDoctorTrack() {
    chatState = 'doctor';
    addBotMessage("Welcome! Qyx Medtech is launching doctor-first, inviting specialists in male reproductive health and urology to bring their consultancy onto the platform.");
    setTimeout(() => {
      addBotMessage("How would you like to proceed?");
      setChoices([
        {
          label: "Start Consultant Application",
          action: () => {
            addBotMessage("Opening the doctor application for you now →");
            if (window.QyxPopup) {
              window.QyxPopup.open('doctor');
              toggleChat();
            }
          }
        },
        {
          label: "What does Qyx handle for me?",
          action: () => {
            addBotMessage("<strong>Qyx handles:</strong> Patient visibility & matching, automated scheduling, calendar synchronization, and secure invoicing/payouts.<br><br><strong>You handle:</strong> The consultation itself, clinical recommendations, and setting your availability.");
            setChoices([
              { label: "Start Application", action: () => { if (window.QyxPopup) { window.QyxPopup.open('doctor'); toggleChat(); } } },
              { label: "Verification Requirements", action: handleDoctorVerificationFaq },
              { label: "Main Menu", action: startConversation }
            ]);
          }
        },
        {
          label: "Verification Requirements",
          action: handleDoctorVerificationFaq
        }
      ]);
    }, 400);
  }

  function handleDoctorVerificationFaq() {
    addBotMessage("Verification on Qyx requires:<br>1. Valid medical degree & council registration number.<br>2. Documented specialization in urology/andrology/reproductive medicine.<br>3. Minimum 2 years of independent practice.<br>4. A short introductory call with our clinical onboarding team.");
    setChoices([
      { label: "Start Application", action: () => { if (window.QyxPopup) { window.QyxPopup.open('doctor'); toggleChat(); } } },
      { label: "Back to Doctor Options", action: handleDoctorTrack }
    ]);
  }

  function handlePatientTrack() {
    chatState = 'patient';
    addBotMessage("We connect men and couples with verified specialists in male reproductive health. Every listed doctor is credential-checked before taking appointments.");
    setTimeout(() => {
      addBotMessage("How can I assist you today?");
      setChoices([
        {
          label: "Book a Specialist Consultation",
          action: () => {
            addBotMessage("Opening the specialist matching request for you now →");
            if (window.QyxPopup) {
              window.QyxPopup.open('patient');
              toggleChat();
            }
          }
        },
        {
          label: "How does doctor verification work?",
          action: () => {
            addBotMessage("Every physician on Qyx is independently reviewed for medical board registration, active licensure, and male-reproductive specialization. No unverified practitioners are ever listed on the platform.");
            setChoices([
              { label: "Book a Consultation", action: () => { if (window.QyxPopup) { window.QyxPopup.open('patient'); toggleChat(); } } },
              { label: "Is my medical data private?", action: handlePrivacyFaq }
            ]);
          }
        },
        {
          label: "Is my medical data private?",
          action: handlePrivacyFaq
        }
      ]);
    }, 400);
  }

  function handlePrivacyFaq() {
    addBotMessage("<strong>Privacy is fundamental at Qyx:</strong><br>Your consultation details and contact info are never shared without explicit consent. Our platform architecture is built aligned with HIPAA data security standards and India's Digital Personal Data Protection (DPDP) Act.");
    setChoices([
      { label: "Book a Consultation", action: () => { if (window.QyxPopup) { window.QyxPopup.open('patient'); toggleChat(); } } },
      { label: "Main Menu", action: startConversation }
    ]);
  }

  function handleFaqTrack() {
    addBotMessage("Select a common question below:");
    setChoices([
      {
        label: "Is Qyx a clinic or a marketplace?",
        action: () => {
          addBotMessage("Qyx is a specialized consultancy platform connecting men directly with independent, certified male fertility specialists. We provide the digital infrastructure; licensed specialists provide the care.");
          setChoices([{ label: "Back to FAQs", action: handleFaqTrack }, { label: "Main Menu", action: startConversation }]);
        }
      },
      {
        label: "What does a consultation cost?",
        action: () => {
          addBotMessage("Consultation fees are set transparently by each specialist based on appointment format (video vs audio) and duration, displayed upfront before booking.");
          setChoices([{ label: "Book a Consultation", action: () => { if (window.QyxPopup) { window.QyxPopup.open('patient'); toggleChat(); } } }, { label: "Main Menu", action: startConversation }]);
        }
      },
      {
        label: "How are tests handled?",
        action: () => {
          addBotMessage("During Phase 1, you can share existing semen analysis or lab reports directly with your consulting specialist during your video appointment. Diagnostic tools will roll out in Phase 2.");
          setChoices([{ label: "Main Menu", action: startConversation }]);
        }
      }
    ]);
  }

  function handleUserInput() {
    const input = document.getElementById('qyxChatInput');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    addUserMessage(text);
    input.value = '';

    const lower = text.toLowerCase();

    // Check for clinical / diagnostic queries (Strict Medical Guardrail)
    const isClinical = CLINICAL_TRIGGER_WORDS.some((word) => lower.includes(word));

    setTimeout(() => {
      if (isClinical) {
        addBotMessage(
          "⚠️ <strong>Important Medical Safety Notice:</strong><br>As an automated concierge, I cannot interpret clinical test values, diagnose medical conditions, or recommend therapies. For your health and safety, medical queries must be evaluated directly by a licensed specialist.",
          true
        );
        setTimeout(() => {
          addBotMessage("Would you like to speak to a verified male reproductive specialist to review your case?");
          setChoices([
            {
              label: "Connect with a Verified Doctor",
              action: () => {
                if (window.QyxPopup) {
                  window.QyxPopup.open('patient');
                  toggleChat();
                }
              }
            },
            {
              label: "Ask a Platform Question",
              action: handleFaqTrack
            }
          ]);
        }, 500);
      } else if (lower.includes('doctor') || lower.includes('apply') || lower.includes('join') || lower.includes('specialist')) {
        handleDoctorTrack();
      } else if (lower.includes('patient') || lower.includes('book') || lower.includes('consult')) {
        handlePatientTrack();
      } else if (lower.includes('cost') || lower.includes('price') || lower.includes('fee')) {
        addBotMessage("Consultation fees are displayed transparently per doctor, with zero booking surcharges. Would you like to check doctor availability?");
        setChoices([
          { label: "Book a Consult", action: () => { if (window.QyxPopup) { window.QyxPopup.open('patient'); toggleChat(); } } },
          { label: "Main Menu", action: startConversation }
        ]);
      } else {
        addBotMessage("Thank you for your message. How can I best guide you right now?");
        setChoices([
          { label: "I'm a Doctor (Join Network)", action: handleDoctorTrack },
          { label: "I'm a Patient (Book Consult)", action: handlePatientTrack },
          { label: "Platform FAQs", action: handleFaqTrack }
        ]);
      }
    }, 500);
  }

  // Initialize DOM on ready
  window.addEventListener('DOMContentLoaded', () => {
    createChatbotDOM();
  });

  window.QyxChatbot = {
    open: function () {
      createChatbotDOM();
      const windowEl = document.getElementById('qyxChatWindow');
      if (windowEl && !windowEl.classList.contains('open')) {
        toggleChat();
      }
    }
  };
})();

