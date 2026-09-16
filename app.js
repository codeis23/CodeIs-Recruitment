/**
 * CODEIS CLUB RECRUITMENT PORTAL - INTERACTIVE LOGIC
 */

document.addEventListener('DOMContentLoaded', () => {
  initAudio();
  initCountdown();
  initRangoliTrims();
  initTracks();
  initApplicationFlow();
  initNoticeBoard();
  initFAQs();
  initConfetti();
});

/* =========================================================
   1. RETRO 8-BIT SOUND SYNTHESIZER (WEB AUDIO API)
   ========================================================= */
let audioCtx = null;
let soundEnabled = true;

function initAudio() {
  const soundBtn = document.getElementById('soundToggleBtn');
  if (!soundBtn) return;

  soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundBtn.innerHTML = soundEnabled ? '🔊 SFX: ON' : '🔇 SFX: OFF';
    if (soundEnabled) {
      playBeep(600, 'triangle', 0.1);
    }
  });
}

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playBeep(freq = 440, type = 'sine', duration = 0.08) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    console.warn('Audio not allowed yet:', e);
  }
}

function playLevelUpChime() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const notes = [330, 392, 494, 587, 659];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        playBeep(freq, 'square', 0.12);
      }, idx * 70);
    });
  } catch (e) {}
}

/* =========================================================
   2. DEADLINE COUNTDOWN TIMER
   ========================================================= */
function initCountdown() {
  const now = new Date();
  
  // App Deadline: Next Friday at 23:59:59
  const appDeadline = new Date(now);
  appDeadline.setDate(now.getDate() + ((5 - now.getDay() + 7) % 7));
  appDeadline.setHours(23, 59, 59, 0);

  // Sub Deadline: Day after App Deadline (Saturday) at 23:59:59
  const subDeadline = new Date(appDeadline);
  subDeadline.setDate(appDeadline.getDate() + 1);

  function updateTimers() {
    const current = new Date().getTime();
    
    // Update Application Timer
    const appDiff = appDeadline.getTime() - current;
    updateTimerUI('app', appDiff);

    // Update Submission Timer
    const subDiff = subDeadline.getTime() - current;
    updateTimerUI('sub', subDiff);
  }

  function updateTimerUI(prefix, diff) {
    if (diff <= 0) {
      document.getElementById(`${prefix}_days`).textContent = '00';
      document.getElementById(`${prefix}_hours`).textContent = '00';
      document.getElementById(`${prefix}_mins`).textContent = '00';
      document.getElementById(`${prefix}_secs`).textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    const dElem = document.getElementById(`${prefix}_days`);
    const hElem = document.getElementById(`${prefix}_hours`);
    const mElem = document.getElementById(`${prefix}_mins`);
    const sElem = document.getElementById(`${prefix}_secs`);

    if (dElem) dElem.textContent = String(days).padStart(2, '0');
    if (hElem) hElem.textContent = String(hours).padStart(2, '0');
    if (mElem) mElem.textContent = String(mins).padStart(2, '0');
    if (sElem) sElem.textContent = String(secs).padStart(2, '0');
  }

  updateTimers();
  setInterval(updateTimers, 1000);
}

/* =========================================================
   3. GEOMETRIC RANGOLI DIVIDERS
   ========================================================= */
function initRangoliTrims() {
  const trims = ['trimRow1', 'trimRow2', 'trimRow3', 'trimRow4'];
  trims.forEach(id => {
    const row = document.getElementById(id);
    if (!row) return;
    let html = '';
    for (let i = 0; i < 48; i++) {
      html += `<div class="trim-unit">${i % 2 === 0 ? '<div class="trim-tri"></div>' : '<div class="trim-dot"></div>'}</div>`;
    }
    row.innerHTML = html;
  });
}

/* =========================================================
   4. TRACKS & DOMAINS EXPLORER DATA & SWITCHING
   ========================================================= */
const ENGINEERING_CHALLENGE_BRIEF_URL = "./docs/AI_Build_Challenge_Brief.pdf";
const ENGINEERING_CHALLENGE_SUBMISSION_URL = "#apply";

const tracksData = {
  eng: {
    title: "Engineering & Tech",
    icon: "⚡",
    seats: "12 OPEN SLOTS",
    tagline: "Build something real. Show us how you think.",
    desc: "Your first step is a hands-on engineering challenge designed to test your problem-solving, implementation, and technical thinking. The complete challenge instructions are provided in the Challenge Brief.",
    skills: ["Web Development", "Backend", "AI & ML", "Databases", "APIs", "Problem Solving"],
    points: [
      "Receive a real engineering problem to solve.",
      "Read the complete requirements in the Challenge Brief.",
      "Build your solution independently within the given constraints.",
      "Submit your completed project for evaluation."
    ]
  },
  ai: {
    title: "Finance & Markets",
    icon: "💸",
    seats: "8 OPEN SLOTS",
    tagline: "Learn, analyze, and solve real-world financial problems.",
    desc: "Your first step into the Finance track is a short selection test covering financial awareness, logical thinking, markets, and basic analytical ability.",
    skills: ["Financial Analysis", "Market Research", "Logic & Reasoning", "Economics"],
    points: [
      "Understand and decode complex financial structures.",
      "Work on simulated real-world investment scenarios.",
      "Analyze crypto, traditional equities, and macro trends."
    ]
  },
  design: {
    title: "Social Media & Marketing",
    icon: "📽️",
    seats: "6 OPEN SLOTS",
    tagline: "Make CodeIs impossible to scroll past.",
    desc: "Create a short-form marketing video that introduces CodeIs, captures what makes the club interesting, and makes students want to know more. Your creativity, storytelling, editing, and ability to communicate will be evaluated.",
    skills: ["Content Creation", "Video Editing", "Storytelling", "Social Media", "Marketing", "Branding"],
    points: [
      "Create a short marketing video promoting CodeIs.",
      "Make it engaging enough to stop someone from scrolling.",
      "Post it on your social media account and tag the official CodeIs account.",
      "We evaluate the idea, storytelling, editing, presentation, creativity, and engagement potential."
    ]
  },
  hardware: {
    title: "Hardware & Creative Computing",
    icon: "📟",
    seats: "6 OPEN SLOTS",
    tagline: "Solder circuits, program microcontrollers, and hack physical devices.",
    desc: "Bridging the physical and digital. We build interactive LED installations, campus NFC check-in terminals, IoT sensor networks, and autonomous mini-rovers.",
    skills: ["ESP32 / Arduino", "Raspberry Pi", "C++ / MicroPython", "PCB Design (KiCad)", "Sensors & Actuators"],
    points: [
      "Access dedicated club lab hardware, soldering stations, and 3D printers.",
      "Build interactive interactive installations for campus tech fests.",
      "Hack on retro game emulation and custom handheld consoles.",
      "Connect physical sensor arrays to live cloud dashboards."
    ]
  },
  ops: {
    title: "Operations & Community",
    icon: "🚀",
    seats: "8 OPEN SLOTS",
    tagline: "Drive sponsorships, organize wild build nights, and grow the community.",
    desc: "The heartbeat of Codeis Club. The ops team secures industry sponsorships, manages 500+ participant hackathons, handles brand partnerships, and curates unforgettable build nights.",
    skills: ["Event Management", "Sponsorship Pitches", "Public Relations", "Community Building", "Content & Media"],
    points: [
      "Directly manage budgets, venue logistics, and sponsor relations.",
      "Host high-energy weekly build nights with unlimited chai & snacks.",
      "Build ties with leading tech startups and campus venture funds.",
      "Master high-stakes project management and leadership."
    ]
  }
};

const financeTest = {
  day: "This Friday",
  date: "",
  time: "",
  duration: "",
  format: "Online / In-person"
};

function initTracks() {
  const buttons = document.querySelectorAll('.track-tab-btn');
  const card = document.getElementById('trackContentCard');
  if (!buttons.length || !card) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const trackKey = btn.getAttribute('data-track');
      if (!tracksData[trackKey]) return;

      playBeep(480, 'sine', 0.05);

      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const data = tracksData[trackKey];
      
      // Update track card UI
      document.getElementById('trackIcon').textContent = data.icon;
      document.getElementById('trackSeats').textContent = data.seats;
      document.getElementById('trackTitle').textContent = data.title;
      document.getElementById('trackTagline').textContent = data.tagline;
      document.getElementById('trackDesc').textContent = data.desc;

      // Update skills
      const skillsContainer = document.getElementById('trackSkills');
      skillsContainer.innerHTML = data.skills.map(s => `<span class="skill-chip">${s}</span>`).join('');

      // Update points
      const pointsContainer = document.getElementById('trackPoints');
      pointsContainer.innerHTML = data.points.map(p => `<li>${p}</li>`).join('');

      // Conditional Test Rendering
      const testAnnounce = document.getElementById('trackTestAnnouncement');
      const testInfoRow = document.getElementById('trackTestInfoRow');
      const trackApplyBtn = document.getElementById('trackApplyBtn');
      const statusBadge = document.getElementById('trackStatusBadge');
      const socialChallenge = document.getElementById('trackSocialChallenge');
      const engChallenge = document.getElementById('trackEngChallenge');
      const trackActions = document.getElementById('trackActions');

      // Default resets
      if (testAnnounce) testAnnounce.style.display = 'none';
      if (testInfoRow) testInfoRow.style.display = 'none';
      if (statusBadge) statusBadge.style.display = 'none';
      if (socialChallenge) socialChallenge.style.display = 'none';
      if (engChallenge) engChallenge.style.display = 'none';
      if (trackActions) trackActions.style.display = 'flex';

      if (trackKey === 'eng') {
        if (engChallenge) {
          engChallenge.style.display = 'block';
          const briefBtn = document.getElementById('engBriefBtn');
          const submitBtn = document.getElementById('engSubmitBtn');
          if (briefBtn) briefBtn.href = ENGINEERING_CHALLENGE_BRIEF_URL;
          if (submitBtn) submitBtn.href = ENGINEERING_CHALLENGE_SUBMISSION_URL;
        }
        if (trackActions) trackActions.style.display = 'none';
      } else if (trackKey === 'ai') { // 'ai' key holds the Finance data
        if (testAnnounce) {
          testAnnounce.style.display = 'block';
          const dayEl = document.getElementById('testAnnounceDay');
          if (dayEl) dayEl.textContent = (financeTest.day || financeTest.date).toUpperCase();
        }
        if (statusBadge) statusBadge.style.display = 'inline-block';
        if (testInfoRow) {
          let infoHtml = '';
          infoHtml += `<div class="test-info-item"><div class="test-info-label">TEST</div><div class="test-info-val">Finance Selection Test</div></div>`;
          if (financeTest.day || financeTest.date) infoHtml += `<div class="test-info-item"><div class="test-info-label">WHEN</div><div class="test-info-val">${financeTest.day || financeTest.date}</div></div>`;
          if (financeTest.format) infoHtml += `<div class="test-info-item"><div class="test-info-label">FORMAT</div><div class="test-info-val">${financeTest.format}</div></div>`;
          if (financeTest.time) infoHtml += `<div class="test-info-item"><div class="test-info-label">TIME</div><div class="test-info-val">${financeTest.time}</div></div>`;
          if (financeTest.duration) infoHtml += `<div class="test-info-item"><div class="test-info-label">DURATION</div><div class="test-info-val">${financeTest.duration}</div></div>`;
          testInfoRow.innerHTML = infoHtml;
          testInfoRow.style.display = 'grid';
        }
        if (trackApplyBtn) {
          trackApplyBtn.innerHTML = 'REGISTER FOR THE FINANCE TEST ↗';
          trackApplyBtn.setAttribute('data-target-track', trackKey);
        }
      } else if (trackKey === 'design') { // 'design' key holds Social Media & Marketing
        if (socialChallenge) socialChallenge.style.display = 'block';
        if (trackApplyBtn) {
          trackApplyBtn.innerHTML = 'SUBMIT YOUR VIDEO ↗';
          trackApplyBtn.setAttribute('data-target-track', trackKey);
        }
      } else {
        if (trackApplyBtn) {
          trackApplyBtn.innerHTML = 'APPLY FOR THIS TRACK ↗';
          trackApplyBtn.setAttribute('data-target-track', trackKey);
        }
      }
    });
  });

  const trackApplyBtn = document.getElementById('trackApplyBtn');
  if (trackApplyBtn) {
    trackApplyBtn.addEventListener('click', () => {
      const target = trackApplyBtn.getAttribute('data-target-track') || 'eng';
      selectFormTrack(target);
      const applySection = document.getElementById('apply');
      if (applySection) {
        applySection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

function selectFormTrack(trackKey) {
  const radio = document.querySelector(`input[name="primaryTrack"][value="${trackKey}"]`);
  if (radio) {
    radio.checked = true;
    updateTrackOptionsVisual();
    updatePassPreview();
  }
}

function updateTrackOptionsVisual() {
  document.querySelectorAll('.track-option-card').forEach(card => {
    const input = card.querySelector('input[name="primaryTrack"]');
    if (input && input.checked) {
      card.classList.add('selected');
    } else {
      card.classList.remove('selected');
    }
  });
}

/* =========================================================
   5. APPLICATION FLOW & REAL-TIME PASS GENERATOR
   ========================================================= */
let currentStep = 1;
const totalSteps = 3;
let selectedAvatar = '👾';

const GOOGLE_FORM_CONFIG = {
  formAction: "https://docs.google.com/forms/d/e/1FAIpQLSd3O6FyslPahA0nksZOqPhe7_wWgr_pWSnssuZnop4vZBdiFQ/formResponse",
  fields: {
    fullName: "entry.1750574377",
    email: "entry.602256517",
    usn: "entry.1790567416",
    phone: "entry.150626301",
    year: "entry.232120372",
    branch: "entry.277167960",
    avatar: "entry.491704812",
    track: "entry.93685844",
    portfolio: "entry.1079887904",
    proudProject: "entry.1256538972",
    learningGoal: "entry.662325485"
  }
};

let isSubmitting = false;

function initApplicationFlow() {
  const avatarOpts = document.querySelectorAll('.avatar-opt');
  avatarOpts.forEach(opt => {
    opt.addEventListener('click', () => {
      avatarOpts.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      selectedAvatar = opt.getAttribute('data-avatar');
      playBeep(440, 'sine', 0.05);
      updatePassPreview();
    });
  });

  const trackRadios = document.querySelectorAll('input[name="primaryTrack"]');
  trackRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('.track-option-card').forEach(card => card.classList.remove('selected'));
      if (radio.checked) {
        radio.closest('.track-option-card').classList.add('selected');
      }
      playBeep(480, 'triangle', 0.05);
      updatePassPreview();
    });
  });

  const nameInput = document.getElementById('applicantName');
  const usnInput = document.getElementById('applicantUSN');
  const yearInput = document.getElementById('applicantYear');
  const branchInput = document.getElementById('applicantBranch');

  [nameInput, usnInput, yearInput, branchInput].forEach(elem => {
    if (elem) {
      elem.addEventListener('input', updatePassPreview);
    }
  });

  const nextBtn = document.getElementById('formNextBtn');
  const prevBtn = document.getElementById('formPrevBtn');
  const submitBtn = document.getElementById('formSubmitBtn');

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (validateStep(currentStep)) {
        currentStep++;
        goToStep(currentStep);
        playBeep(580, 'triangle', 0.08);
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        goToStep(currentStep);
        playBeep(380, 'triangle', 0.08);
      }
    });
  }

  const appForm = document.getElementById('recruitmentForm');
  if (appForm) {
    appForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateStep(currentStep) && !isSubmitting) {
        submitApplication();
      }
    });
  }

  // Download pass button
  const downloadBtn = document.getElementById('downloadPassBtn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', downloadPassImage);
  }

  // Modal close buttons
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
      const modal = document.getElementById('successModal');
      if (modal) modal.classList.remove('open');
    });
  }

  // Generate initial random Barcode and Pass ID
  generatePassIdentifiers();
  updatePassPreview();
}

function generatePassIdentifiers() {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  const passId = `CIS-26-${randomNum.toString().slice(0, 4)}`;
  
  const idElem = document.getElementById('ticketPassId');
  if (idElem) idElem.textContent = passId;

  const barcodeElem = document.getElementById('ticketBarcode');
  if (barcodeElem) {
    // Generate barcode-like pattern
    const pattern = '||| | |||| || ||| |||| | |||';
    barcodeElem.textContent = pattern;
  }
}

function validateStep(step) {
  if (step === 1) {
    const name = document.getElementById('applicantName')?.value.trim();
    const email = document.getElementById('applicantEmail')?.value.trim();
    const usn = document.getElementById('applicantUSN')?.value.trim();
    const phone = document.getElementById('applicantPhone')?.value.trim();
    const branch = document.getElementById('applicantBranch')?.value.trim();

    if (!name) {
      alert('Please enter your full name.');
      document.getElementById('applicantName')?.focus();
      return false;
    }
    if (!phone) {
      alert('Please enter your phone number.');
      document.getElementById('applicantPhone')?.focus();
      return false;
    }
    if (!email || !email.includes('@')) {
      alert('Please enter a valid campus or personal email address.');
      document.getElementById('applicantEmail')?.focus();
      return false;
    }
    if (!usn) {
      alert('Please enter your USN or University Roll Number.');
      document.getElementById('applicantUSN')?.focus();
      return false;
    }
    if (!branch) {
      alert('Please enter your Branch / Major.');
      document.getElementById('applicantBranch')?.focus();
      return false;
    }
  } else if (step === 2) {
    const track = document.querySelector('input[name="primaryTrack"]:checked');
    if (!track) {
      alert('Please select your primary track of interest.');
      return false;
    }
  } else if (step === 3) {
    const qProud = document.getElementById('qProud')?.value.trim();
    const qGoal = document.getElementById('qGoal')?.value.trim();
    if (!qProud) {
      alert('Please tell us about something you built, designed, or broke and fixed.');
      document.getElementById('qProud')?.focus();
      return false;
    }
    if (!qGoal) {
      alert('Please tell us what you would love to build or learn at Codeis.');
      document.getElementById('qGoal')?.focus();
      return false;
    }
  }
  return true;
}

function goToStep(step) {
  document.querySelectorAll('.form-step').forEach(el => el.classList.remove('active'));
  const currentStepEl = document.getElementById(`formStep${step}`);
  if (currentStepEl) currentStepEl.classList.add('active');

  // Update step nodes
  for (let i = 1; i <= totalSteps; i++) {
    const node = document.getElementById(`stepNode${i}`);
    if (node) {
      node.classList.remove('active', 'completed');
      if (i < step) {
        node.classList.add('completed');
      } else if (i === step) {
        node.classList.add('active');
      }
    }
  }

  const prevBtn = document.getElementById('formPrevBtn');
  const nextBtn = document.getElementById('formNextBtn');
  const submitBtn = document.getElementById('formSubmitBtn');

  if (prevBtn) prevBtn.style.display = step > 1 ? 'inline-flex' : 'none';
  if (nextBtn) nextBtn.style.display = step < totalSteps ? 'inline-flex' : 'none';
  if (submitBtn) submitBtn.style.display = step === totalSteps ? 'inline-flex' : 'none';
}

function updatePassPreview() {
  const name = document.getElementById('applicantName')?.value.trim() || 'Alex Mercer';
  const usn = document.getElementById('applicantUSN')?.value.trim() || '1MS24CS042';
  const year = document.getElementById('applicantYear')?.value || '1st Year';
  const branch = document.getElementById('applicantBranch')?.value || 'Computer Science';
  
  const trackInput = document.querySelector('input[name="primaryTrack"]:checked');
  const trackKey = trackInput ? trackInput.value : 'eng';
  const trackNames = {
    eng: 'Engineering & Web',
    ai: 'Finance & Markets',
    design: 'Social Media & Marketing',
    hardware: 'Hardware & IoT',
    ops: 'Operations & Events'
  };

  const nameEl = document.getElementById('ticketName');
  const metaEl = document.getElementById('ticketMeta');
  const trackEl = document.getElementById('ticketTrackBadge');
  const avatarEl = document.getElementById('ticketAvatar');
  const rollEl = document.getElementById('ticketRoll');
  const branchEl = document.getElementById('ticketBranch');

  if (nameEl) nameEl.textContent = name;
  if (metaEl) metaEl.textContent = `${year} · Batch of 2026`;
  if (trackEl) trackEl.textContent = `★ ${trackNames[trackKey] || 'Engineering'}`;
  if (avatarEl) avatarEl.textContent = selectedAvatar;
  if (rollEl) rollEl.textContent = usn;
  if (branchEl) branchEl.textContent = branch;
}

function submitApplication() {
  if (isSubmitting) return;
  isSubmitting = true;
  
  const submitBtn = document.getElementById('formSubmitBtn');
  if (submitBtn) {
    submitBtn.textContent = 'SUBMITTING...';
    submitBtn.style.opacity = '0.7';
    submitBtn.style.pointerEvents = 'none';
  }

  const name = document.getElementById('applicantName')?.value.trim();
  const email = document.getElementById('applicantEmail')?.value.trim();
  const usn = document.getElementById('applicantUSN')?.value.trim();
  const phone = document.getElementById('applicantPhone')?.value.trim();
  const branch = document.getElementById('applicantBranch')?.value.trim();
  const year = document.getElementById('applicantYear')?.value;
  const portfolio = document.getElementById('applicantLinks')?.value.trim();
  const qProud = document.getElementById('qProud')?.value.trim();
  const qGoal = document.getElementById('qGoal')?.value.trim();
  const avatar = selectedAvatar;
  
  const trackInput = document.querySelector('input[name="primaryTrack"]:checked')?.value;
  
  const trackMapping = {
    eng: 'Enginnering',
    ai: 'Finance',
    design: 'Social Media Handling',
    hardware: 'Hardware & IoT', // Default fallbacks
    ops: 'Ops & Community'
  };
  
  const mappedTrack = trackMapping[trackInput] || 'Enginnering';

  const formData = new URLSearchParams();
  formData.append(GOOGLE_FORM_CONFIG.fields.fullName, name || '');
  formData.append(GOOGLE_FORM_CONFIG.fields.email, email || '');
  formData.append(GOOGLE_FORM_CONFIG.fields.usn, usn || '');
  formData.append(GOOGLE_FORM_CONFIG.fields.phone, phone || '');
  formData.append(GOOGLE_FORM_CONFIG.fields.branch, branch || '');
  formData.append(GOOGLE_FORM_CONFIG.fields.year, year || '');
  formData.append(GOOGLE_FORM_CONFIG.fields.avatar, avatar || '');
  formData.append(GOOGLE_FORM_CONFIG.fields.track, mappedTrack || '');
  formData.append(GOOGLE_FORM_CONFIG.fields.portfolio, portfolio || '');
  formData.append(GOOGLE_FORM_CONFIG.fields.proudProject, qProud || '');
  formData.append(GOOGLE_FORM_CONFIG.fields.learningGoal, qGoal || '');

  fetch(GOOGLE_FORM_CONFIG.formAction, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formData.toString()
  }).then(() => {
    // Due to no-cors, we can't read the response properly, but if it reaches here without throwing,
    // we assume it succeeded.
    playLevelUpChime();
    triggerConfetti();

    const modal = document.getElementById('successModal');
    const modalName = document.getElementById('modalApplicantName');
    
    if (modalName) modalName.textContent = name;
    if (modal) modal.classList.add('open');
    
    const appForm = document.getElementById('recruitmentForm');
    if (appForm) {
      appForm.reset();
      currentStep = 1;
      goToStep(1);
      updatePassPreview();
    }
  }).catch(error => {
    console.error('Submission failed:', error);
    alert('SUBMISSION FAILED\nSomething went wrong while sending your application. Please check your connection and try again.');
    if (submitBtn) {
      submitBtn.textContent = 'TRY AGAIN ↻';
    }
  }).finally(() => {
    isSubmitting = false;
    if (submitBtn) {
      if (submitBtn.textContent === 'SUBMITTING...') {
        submitBtn.textContent = 'SUBMIT APPLICATION ✦';
      }
      submitBtn.style.opacity = '1';
      submitBtn.style.pointerEvents = 'auto';
    }
  });
}

/* =========================================================
   6. PASS IMAGE GENERATION & DOWNLOAD (CANVAS API)
   ========================================================= */
function downloadPassImage() {
  playBeep(700, 'square', 0.1);

  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 420;
  const ctx = canvas.getContext('2d');

  const name = document.getElementById('ticketName')?.textContent || 'Alex Mercer';
  const meta = document.getElementById('ticketMeta')?.textContent || '1st Year · Batch of 2026';
  const track = document.getElementById('ticketTrackBadge')?.textContent || '★ Engineering & Web';
  const roll = document.getElementById('ticketRoll')?.textContent || '1MS24CS042';
  const branch = document.getElementById('ticketBranch')?.textContent || 'Computer Science';
  const passId = document.getElementById('ticketPassId')?.textContent || 'CIS-26-8492';

  // 1. Draw outer background
  ctx.fillStyle = '#173F26';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. Draw card background (Cream)
  ctx.fillStyle = '#F5F0DC';
  ctx.roundRect(20, 20, 560, 380, 16);
  ctx.fill();
  ctx.strokeStyle = '#F2C230';
  ctx.lineWidth = 6;
  ctx.stroke();

  // 3. Header bar
  ctx.fillStyle = '#173F26';
  ctx.fillRect(20, 20, 560, 60);

  ctx.fillStyle = '#F2C230';
  ctx.font = 'bold 16px "Courier New", monospace';
  ctx.fillText('CODEIS CLUB · APPLICANT PASS', 40, 56);

  ctx.fillStyle = '#E91E7B';
  ctx.fillRect(450, 36, 110, 28);
  ctx.fillStyle = '#F2C230';
  ctx.font = 'bold 12px "Courier New", monospace';
  ctx.fillText('BATCH 2026', 465, 55);

  // 4. Avatar circle
  ctx.fillStyle = '#1E4A2F';
  ctx.beginPath();
  ctx.arc(80, 140, 40, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#E91E7B';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Avatar text
  ctx.font = '40px serif';
  ctx.textAlign = 'center';
  ctx.fillText(selectedAvatar, 80, 154);
  ctx.textAlign = 'left';

  // 5. Applicant Info
  ctx.fillStyle = '#173F26';
  ctx.font = 'bold 24px Georgia, serif';
  ctx.fillText(name, 140, 130);

  ctx.fillStyle = '#555555';
  ctx.font = '14px "Courier New", monospace';
  ctx.fillText(meta, 140, 152);

  // Track Badge
  ctx.fillStyle = '#F2C230';
  ctx.fillRect(140, 165, 230, 26);
  ctx.strokeStyle = '#12271A';
  ctx.lineWidth = 1;
  ctx.strokeRect(140, 165, 230, 26);
  ctx.fillStyle = '#12271A';
  ctx.font = 'bold 12px "Courier New", monospace';
  ctx.fillText(track, 150, 183);

  // 6. Details Box
  ctx.fillStyle = '#ede7d1';
  ctx.fillRect(40, 215, 520, 80);
  ctx.strokeStyle = '#d4cbb0';
  ctx.strokeRect(40, 215, 520, 80);

  ctx.fillStyle = '#777777';
  ctx.font = 'bold 10px "Courier New", monospace';
  ctx.fillText('ROLL / USN', 60, 240);
  ctx.fillText('BRANCH / MAJOR', 320, 240);

  ctx.fillStyle = '#12271A';
  ctx.font = 'bold 15px "Courier New", monospace';
  ctx.fillText(roll, 60, 265);
  ctx.fillText(branch, 320, 265);

  // 7. Verified Stamp
  ctx.save();
  ctx.translate(460, 145);
  ctx.rotate(-0.18);
  ctx.strokeStyle = '#E91E7B';
  ctx.lineWidth = 3;
  ctx.strokeRect(-60, -20, 120, 40);
  ctx.fillStyle = '#E91E7B';
  ctx.font = 'bold 12px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('APPLIED', 0, 5);
  ctx.restore();

  // 8. Footer Barcode & ID
  ctx.fillStyle = '#ede7d1';
  ctx.fillRect(20, 320, 560, 80);
  ctx.strokeStyle = '#173F26';
  ctx.beginPath();
  ctx.setLineDash([4, 4]);
  ctx.moveTo(20, 320);
  ctx.lineTo(580, 320);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#12271A';
  ctx.font = 'bold 22px monospace';
  ctx.fillText('||| | |||| || ||| |||| | |||', 40, 365);

  ctx.fillStyle = '#555555';
  ctx.font = 'bold 11px "Courier New", monospace';
  ctx.fillText(`ID: ${passId}`, 400, 362);

  // Download Trigger
  const link = document.createElement('a');
  link.download = `${name.toLowerCase().replace(/\s+/g, '-')}-codeis-pass.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

/* =========================================================
   7. NOTICE BOARD & FAQ ACCORDION
   ========================================================= */
function initNoticeBoard() {
  document.querySelectorAll('.board-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      playBeep(420, 'sine', 0.03);
    });
  });
}

function initFAQs() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      items.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
        playBeep(500, 'triangle', 0.04);
      } else {
        playBeep(350, 'triangle', 0.04);
      }
    });
  });
}

/* =========================================================
   8. RETRO CONFETTI CANNON
   ========================================================= */
let confettiCanvas, confettiCtx;
let confettiParticles = [];
let confettiAnimationId = null;

function initConfetti() {
  confettiCanvas = document.getElementById('confettiCanvas');
  if (!confettiCanvas) return;
  confettiCtx = confettiCanvas.getContext('2d');

  function resize() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();
}

function triggerConfetti() {
  if (!confettiCanvas || !confettiCtx) return;

  const colors = ['#F2C230', '#E91E7B', '#F5F0DC', '#00ff66', '#ff479d'];
  confettiParticles = [];

  for (let i = 0; i < 150; i++) {
    confettiParticles.push({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      w: Math.random() * 10 + 6,
      h: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 22,
      vy: (Math.random() - 0.8) * 20 - 4,
      rot: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 12,
      gravity: 0.35,
      opacity: 1
    });
  }

  if (confettiAnimationId) cancelAnimationFrame(confettiAnimationId);
  renderConfetti();
}

function renderConfetti() {
  if (!confettiCtx) return;
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  let active = false;
  confettiParticles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.rot += p.vRot;
    p.opacity -= 0.007;

    if (p.opacity > 0) {
      active = true;
      confettiCtx.save();
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate((p.rot * Math.PI) / 180);
      confettiCtx.fillStyle = p.color;
      confettiCtx.globalAlpha = Math.max(0, p.opacity);
      confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      confettiCtx.restore();
    }
  });

  if (active) {
    confettiAnimationId = requestAnimationFrame(renderConfetti);
  } else {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }
}
