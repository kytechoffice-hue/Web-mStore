// --- THEME SWITCHER LOGIC ---
const themeToggleBtn = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Load theme preference from localStorage or fallback to default Light mode
const savedTheme = localStorage.getItem('kymstore-theme');
if (savedTheme === 'dark') {
  htmlElement.classList.remove('light-theme');
} else {
  htmlElement.classList.add('light-theme');
}

themeToggleBtn.addEventListener('click', () => {
  if (htmlElement.classList.contains('light-theme')) {
    htmlElement.classList.remove('light-theme');
    localStorage.setItem('kymstore-theme', 'dark');
  } else {
    htmlElement.classList.add('light-theme');
    localStorage.setItem('kymstore-theme', 'light');
  }
});

// --- SCROLL EFFECTS ---
const header = document.getElementById('header');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
  // Toggle header background on scroll
  if (window.scrollY > 20) {
    header.classList.add('header-scrolled');
  } else {
    header.classList.remove('header-scrolled');
  }

  // Active navigation link highlighting based on scroll position
  let currentActiveId = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.offsetHeight;
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentActiveId = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentActiveId}`) {
      link.classList.add('active');
    }
  });
});

// --- HERO IMAGE SLIDER ---
const heroSlider = document.getElementById('heroSlider');
const navDots = document.querySelectorAll('.device-nav-dot');
let currentSlide = 0;
const totalSlides = 5;
let autoPlayInterval;

function updateSlider() {
  heroSlider.style.transform = `translateX(-${currentSlide * 20}%)`;
  navDots.forEach((dot, index) => {
    if (index === currentSlide) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

function setHeroSlide(index) {
  currentSlide = index;
  updateSlider();
  resetAutoPlay();
}

function startAutoPlay() {
  autoPlayInterval = setInterval(() => {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
  }, 4000);
}

function resetAutoPlay() {
  clearInterval(autoPlayInterval);
  startAutoPlay();
}

// Start slide rotation on page load
startAutoPlay();

// --- LIGHTBOX GALLERY MODAL ---
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');

function openLightbox(imagePath) {
  lightboxImg.src = imagePath;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden'; // Lock background scrolling
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = ''; // Restore scrolling
}

// Close lightbox on escape keypress
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLightbox();
  }
});

// --- INTERACTIVE WORKSPACE SANDBOX ---
// Panel switching controls
const controlCards = document.querySelectorAll('.sandbox-control-card');
const visualizerTitle = document.getElementById('visualizerTitle');

// Map control panel IDs to visualizer content wrappers
const vizWrappers = {
  theme: document.getElementById('vizContentTheme'),
  number: document.getElementById('vizContentNumber'),
  invoice: document.getElementById('vizContentInvoice'),
  email: document.getElementById('vizContentEmail')
};

const panelTitles = {
  theme: 'Theme Customizer Preview',
  number: 'Automated Sequence Engine',
  invoice: 'Dynamic Billing Layout',
  email: 'SMTP Mail Deliverability Sandbox'
};

function activatePanel(panelName) {
  // Highlight active panel card
  controlCards.forEach(card => {
    if (card.dataset.panel === panelName) {
      card.classList.add('active-panel');
    } else {
      card.classList.remove('active-panel');
    }
  });

  // Switch visualizer logs title
  visualizerTitle.textContent = panelTitles[panelName];

  // Toggle active virtual output wrapper
  Object.keys(vizWrappers).forEach(key => {
    if (key === panelName) {
      vizWrappers[key].style.display = 'block';
    } else {
      vizWrappers[key].style.display = 'none';
    }
  });
}

// Card headers wrapper triggers switching
controlCards.forEach(card => {
  card.addEventListener('click', (e) => {
    // Avoid triggering switch when clicking elements within control cards that have their own listeners
    if (e.target.closest('.accent-picker') || e.target.closest('input') || e.target.closest('select') || e.target.closest('button')) {
      return;
    }
    activatePanel(card.dataset.panel);
  });
});

// 1. Theme accent customization logic
const accentDots = document.querySelectorAll('.accent-dot');
const accentHslText = document.getElementById('accentHslText');

function setAccent(name, h, s, l) {
  // Update class active styling
  accentDots.forEach(dot => {
    if (dot.classList.contains(`dot-${name}`)) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });

  // Inject CSS properties globally
  document.documentElement.style.setProperty('--accent-h', h);
  document.documentElement.style.setProperty('--accent-s', s);
  document.documentElement.style.setProperty('--accent-l', l);

  // Update visual text readout
  accentHslText.textContent = `HSL(${h}, ${s}, ${l})`;

  // Ensure active panel is set to theme
  activatePanel('theme');
}

// 2. Automated Number Series Logic
const prefixInput = document.getElementById('seriesPrefix');
const paddingInput = document.getElementById('seriesPadding');
const startInput = document.getElementById('seriesStart');

const counterDisplay = document.getElementById('numberCounter');
const seriesActiveVal = document.getElementById('seriesActiveVal');
const seriesVal2 = document.getElementById('seriesVal2');
const seriesVal3 = document.getElementById('seriesVal3');
const invNumPlaceholder = document.getElementById('invNumPlaceholder');

function padNumber(num, size) {
  let s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}

function calculateSeries() {
  const prefix = prefixInput.value || '';
  const padding = parseInt(paddingInput.value, 10) || 1;
  const startNum = parseInt(startInput.value, 10) || 1;

  // Format values
  const currentStr = prefix + padNumber(startNum, padding);
  const next1Str = prefix + padNumber(startNum + 1, padding);
  const next2Str = prefix + padNumber(startNum + 2, padding);

  // Update simulator display
  counterDisplay.textContent = currentStr;
  seriesActiveVal.textContent = currentStr;
  seriesVal2.textContent = next1Str;
  seriesVal3.textContent = next2Str;

  // Sync to invoice mockup preview
  if (invNumPlaceholder) {
    invNumPlaceholder.textContent = currentStr;
  }
}

// Setup input listeners
[prefixInput, paddingInput, startInput].forEach(input => {
  input.addEventListener('input', () => {
    calculateSeries();
    activatePanel('number');
  });
});

// Run initial series calculation
calculateSeries();

// 3. Invoice Templates Selector Logic
const layoutSelect = document.getElementById('invoiceLayout');
const invoiceHeaderInput = document.getElementById('invoiceHeader');
const invoiceTitleVal = document.getElementById('invoiceTitleVal');
const invoiceMockup = document.getElementById('invoiceMockup');

function updateInvoiceLayout() {
  const layout = layoutSelect.value;
  const headerText = invoiceHeaderInput.value || 'TAX INVOICE';

  // Apply layout class
  invoiceMockup.className = `virtual-invoice layout-${layout}`;
  
  // Update visual text title
  invoiceTitleVal.textContent = headerText;
}

layoutSelect.addEventListener('change', () => {
  updateInvoiceLayout();
  activatePanel('invoice');
});

invoiceHeaderInput.addEventListener('input', () => {
  updateInvoiceLayout();
  activatePanel('invoice');
});

// 4. SMTP Connection Mock Test Logic
const smtpHostInput = document.getElementById('smtpHost');
const recipientEmailInput = document.getElementById('recipientEmail');
const btnTestSmtp = document.getElementById('btnTestSmtp');

const emailToVal = document.getElementById('emailToVal');
const emailHostVal = document.getElementById('emailHostVal');
const emailStatus = document.getElementById('emailStatus');
const emailStatusText = document.getElementById('emailStatusText');

btnTestSmtp.addEventListener('click', () => {
  // Sync values to visualizer
  emailToVal.textContent = recipientEmailInput.value || 'client@example.com';
  emailHostVal.textContent = smtpHostInput.value || 'smtp.gmail.com';
  
  activatePanel('email');

  // Trigger dispatch sequence animation
  btnTestSmtp.disabled = true;
  btnTestSmtp.style.opacity = '0.7';
  
  emailStatus.className = 'email-status sending';
  emailStatusText.textContent = `Connecting to ${smtpHostInput.value}...`;

  setTimeout(() => {
    emailStatusText.textContent = `Dispatched invoice payload...`;
    
    setTimeout(() => {
      emailStatus.className = 'email-status success';
      emailStatusText.textContent = `Email successfully delivered! Verification OK`;
      
      btnTestSmtp.disabled = false;
      btnTestSmtp.style.opacity = '1';
    }, 1200);
  }, 1200);
});
