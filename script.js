/**
 * PRIME ACADEMY - PRODUCTION SCRIPT
 * Digital Art With Excellence - Since 2013
 * Features:
 *  1. Hero Three.js 3D Scene with 3 Course Artifacts & Parallax
 *  2. Individual Interactive 3D Canvases for Graphic, Video & Motion tracks
 *  3. Performance Optimizations (IntersectionObserver Render Pausing, DPR capped at 2)
 *  4. Robust Client-Side Form Validation (Indian 10-digit Phone, Honeypot, Loading & Success State)
 *  5. WhatsApp Fallback Integration with Pre-filled Lead Details
 *  6. Course Auto-Select & Smooth Scroll Focus
 *  7. Scroll Reveal & Animated Number Counters
 *  8. Mobile Navigation & Sticky Header Handling
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initScrollReveal();
  initStatCounters();
  initCourseEnquiryLinks();
  initLeadForm();
  initThreeJSScenes();
  initStudentWorkVideos();
  initCourseLoopVideos();
  initCurrentYear();
  handleUrlScroll();
  initMetaPixelTracking();
});

function handleUrlScroll() {
  const params = new URLSearchParams(window.location.search);
  const targetId = params.get('scroll');
  if (targetId) {
    const el = document.getElementById(targetId);
    if (el) {
      document.documentElement.style.scrollBehavior = 'auto';
      document.body.style.scrollBehavior = 'auto';
      document.querySelectorAll('.scroll-reveal').forEach(r => r.classList.add('is-visible'));
      window.scrollTo(0, el.offsetTop);
    }
  }
}

/* --------------------------------------------------------------------------
   1. STICKY HEADER & ACTIVE NAV LINKS
   -------------------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   2. MOBILE MENU TOGGLE
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const mainNav = document.getElementById('main-nav');
  if (!toggleBtn || !mainNav) return;

  const toggleMenu = (open) => {
    const isOpen = open !== undefined ? open : !mainNav.classList.contains('is-open');
    mainNav.classList.toggle('is-open', isOpen);
    toggleBtn.classList.toggle('is-active', isOpen);
    toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  };

  toggleBtn.addEventListener('click', () => toggleMenu());

  // Close on navigation link click
  mainNav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (mainNav.classList.contains('is-open') && !mainNav.contains(e.target) && !toggleBtn.contains(e.target)) {
      toggleMenu(false);
    }
  });
}

/* --------------------------------------------------------------------------
   3. SCROLL REVEAL (INTERSECTION OBSERVER)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.scroll-reveal');
  if (!revealElements.length) return;

  if (!('IntersectionObserver' in window) || window.location.search.includes('reveal=all')) {
    revealElements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  // Handle direct hash navigation
  if (window.location.hash) {
    const hashTarget = document.querySelector(window.location.hash);
    if (hashTarget) {
      revealElements.forEach(el => el.classList.add('is-visible'));
      hashTarget.scrollIntoView({ behavior: 'auto' });
    }
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.12
  });

  revealElements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   4. ANIMATED NUMBER COUNTERS (WHY PRIME SECTION)
   -------------------------------------------------------------------------- */
function initStatCounters() {
  const counterElements = document.querySelectorAll('.counter-number');
  if (!counterElements.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1800; // ms
    const startTime = performance.now();

    // If target is year 2013, animate from 2000 to 2013 smoothly
    const startVal = target === 2013 ? 2000 : 0;

    const updateNumber = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startVal + (target - startVal) * easeProgress);

      el.textContent = `${prefix}${current.toLocaleString()}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        el.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
      }
    };

    requestAnimationFrame(updateNumber);
  };

  if (!('IntersectionObserver' in window)) {
    counterElements.forEach(el => animateCounter(el));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counterElements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   5. COURSE ENQUIRY BUTTONS (AUTO-SELECT & SCROLL TO FORM)
   -------------------------------------------------------------------------- */
function initCourseEnquiryLinks() {
  const enquireButtons = document.querySelectorAll('[data-course-select]');
  const courseSelect = document.getElementById('user-course');
  const contactCard = document.getElementById('contact-card');
  const nameInput = document.getElementById('user-name');

  enquireButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const courseName = btn.getAttribute('data-course-select');
      if (courseSelect && courseName) {
        courseSelect.value = courseName;
        // Trigger change event to clear potential validation errors
        courseSelect.dispatchEvent(new Event('change'));
      }

      // Meta Pixel: Track Course View / Selection
      trackMetaPixel('ViewContent', {
        content_name: courseName || 'Course Track',
        content_category: 'Course Track Selection'
      });

      if (contactCard) {
        contactCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Pulse highlight effect on contact card
        contactCard.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        contactCard.style.transform = 'scale(1.02)';
        contactCard.style.boxShadow = '0 0 0 4px var(--brand-red), 0 16px 48px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.8)';

        setTimeout(() => {
          contactCard.style.transform = '';
          contactCard.style.boxShadow = '';
          if (nameInput) nameInput.focus();
        }, 600);
      }
    });
  });
}

/* --------------------------------------------------------------------------
   6. LEAD FORM VALIDATION & SUBMISSION
   -------------------------------------------------------------------------- */
// Google Sheets Apps Script Web App Deployment URL
const GOOGLE_SHEET_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxYhvvy8CFosM8J8-ZOIQlsbtGyV0GBq0nN51--unIhnAShbBaBIL75aGZej9F9sEON/exec";

function initLeadForm() {
  const form = document.getElementById('lead-form');
  if (!form) return;

  const nameInput = document.getElementById('user-name');
  const phoneInput = document.getElementById('user-phone');
  const cityInput = document.getElementById('user-city');
  const courseSelect = document.getElementById('user-course');
  const submitBtn = document.getElementById('btn-submit-form');
  const whatsappBtn = document.getElementById('btn-whatsapp-direct');
  const successBox = document.getElementById('form-success-message');
  const successUserName = document.getElementById('success-user-name');
  const successWaLink = document.getElementById('success-whatsapp-link');
  const resetBtn = document.getElementById('btn-reset-form');

  // Helper: Show error
  const setError = (inputId, errorId, message) => {
    const input = document.getElementById(inputId);
    const errorSpan = document.getElementById(errorId);
    if (input) input.classList.add('is-invalid');
    if (errorSpan) errorSpan.textContent = message;
  };

  // Helper: Clear error
  const clearError = (inputId, errorId) => {
    const input = document.getElementById(inputId);
    const errorSpan = document.getElementById(errorId);
    if (input) input.classList.remove('is-invalid');
    if (errorSpan) errorSpan.textContent = '';
  };

  // Restrict phone field to numbers only
  phoneInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
    if (e.target.value.length === 10) {
      clearError('user-phone', 'error-phone');
    }
  });

  // Clear errors on input
  nameInput.addEventListener('input', () => clearError('user-name', 'error-name'));
  cityInput.addEventListener('input', () => clearError('user-city', 'error-city'));
  courseSelect.addEventListener('change', () => clearError('user-course', 'error-course'));

  // Validation function
  const validateForm = () => {
    let isValid = true;

    // Honeypot check
    const honeypot = form.querySelector('[name="_gotcha"]');
    if (honeypot && honeypot.value !== '') {
      return false; // Spam submission
    }

    // Name Validation
    const nameVal = nameInput.value.trim();
    if (!nameVal || nameVal.length < 2) {
      setError('user-name', 'error-name', 'Please enter your full name (minimum 2 characters).');
      isValid = false;
    } else {
      clearError('user-name', 'error-name');
    }

    // Indian 10-digit Phone Validation (starts with 6, 7, 8, or 9)
    const phoneVal = phoneInput.value.trim();
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneVal)) {
      setError('user-phone', 'error-phone', 'Please enter a valid 10-digit Indian mobile number.');
      isValid = false;
    } else {
      clearError('user-phone', 'error-phone');
    }

    // City / Location Validation
    const cityVal = cityInput.value.trim();
    if (!cityVal || cityVal.length < 2) {
      setError('user-city', 'error-city', 'Please enter your location or city.');
      isValid = false;
    } else {
      clearError('user-city', 'error-city');
    }

    // Course Select Validation
    const courseVal = courseSelect.value;
    if (!courseVal) {
      setError('user-course', 'error-course', 'Please select a course to book your free demo.');
      isValid = false;
    } else {
      clearError('user-course', 'error-course');
    }

    return isValid;
  };

  // WhatsApp Direct Booking Fallback
  whatsappBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const course = courseSelect.value;

    // Meta Pixel: Track WhatsApp Contact Event
    trackMetaPixel('Contact', {
      content_name: 'WhatsApp Demo Enquiry',
      content_category: 'WhatsApp Direct',
      course: course || 'General'
    });

    let messageText = 'Hi Prime Academy, I visited your website and want to know more about your courses. Please share details and book me a free demo!';
    if (name || course) {
      messageText += `\n\n👤 *Name:* ${name || 'Prospective Student'}\n🎯 *Course:* ${course || 'Creative Courses'}`;
    }

    const message = encodeURIComponent(messageText);
    window.open(`https://wa.me/919033222499?text=${message}`, '_blank', 'noopener,noreferrer');
  });

  // Form Submit Handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Set brief tactile loading state
    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;

    const payload = {
      name: nameInput.value.trim(),
      number: `+91 ${phoneInput.value.trim()}`,
      phone: `+91 ${phoneInput.value.trim()}`,
      location: cityInput.value.trim(),
      city: cityInput.value.trim(),
      course: courseSelect.value,
      timestamp: new Date().toISOString()
    };

    // Meta Pixel: Track Lead Conversion Event
    trackMetaPixel('Lead', {
      content_name: payload.course || 'Creative Course Demo',
      content_category: 'Course Demo Booking',
      currency: 'INR',
      value: 1
    });

    // Send to Google Sheets asynchronously in background with keepalive (zero blocking on UI)
    if (GOOGLE_SHEET_WEB_APP_URL && GOOGLE_SHEET_WEB_APP_URL.trim() !== '') {
      try {
        fetch(GOOGLE_SHEET_WEB_APP_URL.trim(), {
          method: 'POST',
          mode: 'no-cors',
          keepalive: true,
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          body: JSON.stringify(payload)
        }).catch((err) => {
          console.warn('Background sync status:', err);
        });
      } catch (err) {
        console.warn('Background sync error:', err);
      }
    }

    // Snappy micro-delay (300ms) so user feels button click registering
    await new Promise(resolve => setTimeout(resolve, 300));

    // Update Success Box Details
    if (successUserName) successUserName.textContent = payload.name;

    if (successWaLink) {
      let waText = 'Hi Prime Academy, I visited your website and want to know more about your courses. Please share details and book me a free demo!';
      if (payload.name || payload.course) {
        waText += `\n\n👤 *Name:* ${payload.name}\n🎯 *Course:* ${payload.course}`;
      }
      successWaLink.href = `https://wa.me/919033222499?text=${encodeURIComponent(waText)}`;
    }

    // Transition to Success State immediately & smoothly
    const formTitleGroup = document.getElementById('form-title-group');
    if (formTitleGroup) formTitleGroup.style.display = 'none';
    form.style.display = 'none';
    if (successBox) {
      successBox.style.display = 'block';
      successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    submitBtn.classList.remove('is-loading');
    submitBtn.disabled = false;
  });

  // Reset Form
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      const formTitleGroup = document.getElementById('form-title-group');
      if (formTitleGroup) formTitleGroup.style.display = 'block';
      form.style.display = 'flex';
      if (successBox) successBox.style.display = 'none';
    });
  }
}

/* --------------------------------------------------------------------------
   7. THREE.JS 3D SCENES & INTERACTIVE ARTIFACTS
   -------------------------------------------------------------------------- */
function initThreeJSScenes() {
  // Check if WebGL & Three.js is supported and prefers-reduced-motion is false
  if (typeof THREE === 'undefined') {
    console.warn('Three.js library not loaded; WebGL fallback active.');
    return;
  }

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Hero background elements removed as requested
  // initHeroScene(isReducedMotion);

  // Individual Course 3D Artifacts (Replaced with high-fidelity media showcases)
  // initCourseCanvas('canvas-graphic-design', 'graphic', isReducedMotion);
  // initCourseCanvas('canvas-video-editing', 'video', isReducedMotion);
  // initCourseCanvas('canvas-motion-graphics', 'motion', isReducedMotion);
}

/**
 * 7A. HERO 3D SCENE: 3 Floating Course Artifacts with Parallax
 */
function initHeroScene(isReducedMotion) {
  const container = document.getElementById('hero-3d-container');
  if (!container) return;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 14);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  } catch (e) {
    console.warn('WebGL initialization failed for Hero scene');
    return;
  }

  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
  scene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
  dirLight1.position.set(10, 15, 10);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0xE23A0F, 0.9);
  dirLight2.position.set(-10, -10, -5);
  scene.add(dirLight2);

  // Group for floating objects
  const objectsGroup = new THREE.Group();
  scene.add(objectsGroup);

  // 1. Graphic Design Artifact: Stylized Golden/Red Isometric Pen Nib Cube
  const cubeGeo = new THREE.BoxGeometry(2.2, 2.2, 2.2);
  const cubeMat = new THREE.MeshStandardMaterial({
    color: 0x0A0A0A,
    roughness: 0.3,
    metalness: 0.8,
    wireframe: false
  });
  const cube = new THREE.Mesh(cubeGeo, cubeMat);
  cube.position.set(-5.5, 2.5, 0);

  // Accent wireframe outline
  const edgesGeo = new THREE.EdgesGeometry(cubeGeo);
  const edgesMat = new THREE.LineBasicMaterial({ color: 0xE23A0F, linewidth: 2 });
  const wireframe = new THREE.LineSegments(edgesGeo, edgesMat);
  cube.add(wireframe);
  objectsGroup.add(cube);

  // 2. Video Editing Artifact: Clapperboard / Cinema Prism
  const prismGeo = new THREE.ConeGeometry(1.8, 2.6, 4);
  const prismMat = new THREE.MeshStandardMaterial({
    color: 0xE23A0F,
    roughness: 0.25,
    metalness: 0.6
  });
  const prism = new THREE.Mesh(prismGeo, prismMat);
  prism.position.set(-4.8, -2.8, 1);
  prism.rotation.x = Math.PI / 4;
  objectsGroup.add(prism);

  // 3. Motion Graphics Artifact: Interlocking Torus Knot & Glowing Rings
  const torusGeo = new THREE.TorusKnotGeometry(1.3, 0.38, 96, 16);
  const torusMat = new THREE.MeshStandardMaterial({
    color: 0x0A0A0A,
    roughness: 0.2,
    metalness: 0.9,
    emissive: 0xC27000,
    emissiveIntensity: 0.25
  });
  const torus = new THREE.Mesh(torusGeo, torusMat);
  torus.position.set(5.8, 3.2, -1);
  objectsGroup.add(torus);

  // Background floating ambient particles
  const particleCount = 40;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 25;
    positions[i + 1] = (Math.random() - 0.5) * 20;
    positions[i + 2] = (Math.random() - 0.5) * 15;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0xE23A0F,
    size: 0.22,
    transparent: true,
    opacity: 0.65
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // Parallax Mouse Interaction
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  const handleMouseMove = (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  };

  window.addEventListener('mousemove', handleMouseMove, { passive: true });

  // Handle Resize
  const handleResize = () => {
    if (!container) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };
  window.addEventListener('resize', handleResize, { passive: true });

  // Animation Loop with Visibility Observer
  let isVisible = true;
  let animationFrameId;

  if ('IntersectionObserver' in window) {
    const heroObserver = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
      if (isVisible && !animationFrameId) {
        animate();
      }
    }, { threshold: 0.05 });
    heroObserver.observe(container);
  }

  let clock = new THREE.Clock();

  const animate = () => {
    if (!isVisible) {
      animationFrameId = null;
      return;
    }

    animationFrameId = requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    if (!isReducedMotion) {
      // Smooth mouse lerp
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      objectsGroup.rotation.y = targetX * 0.45;
      objectsGroup.rotation.x = -targetY * 0.35;

      // Object rotations
      cube.rotation.x = elapsedTime * 0.6;
      cube.rotation.y = elapsedTime * 0.7;
      cube.position.y = 2.5 + Math.sin(elapsedTime * 1.5) * 0.3;

      prism.rotation.y = elapsedTime * 0.8;
      prism.rotation.z = Math.sin(elapsedTime) * 0.4;
      prism.position.y = -2.8 + Math.cos(elapsedTime * 1.2) * 0.25;

      torus.rotation.x = elapsedTime * 0.5;
      torus.rotation.y = elapsedTime * 0.6;
      torus.position.y = 3.2 + Math.sin(elapsedTime * 1.3) * 0.35;

      particles.rotation.y = elapsedTime * 0.08;
    }

    renderer.render(scene, camera);
  };

  animate();
}

/**
 * 7B. COURSE SECTION 3D INTERACTIVE CANVASES
 */
function initCourseCanvas(canvasId, trackType, isReducedMotion) {
  const container = document.getElementById(canvasId);
  if (!container) return;

  const width = container.clientWidth || 360;
  const height = container.clientHeight || 380;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
  camera.position.set(0, 0, 7.5);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  } catch (e) {
    container.innerHTML = '<div style="padding:2rem;text-align:center;color:#888;">Interactive 3D Preview Active</div>';
    return;
  }

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
  keyLight.position.set(5, 8, 5);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xE23A0F, 0.8);
  fillLight.position.set(-5, -5, -2);
  scene.add(fillLight);

  const mainGroup = new THREE.Group();
  scene.add(mainGroup);

  // Track-Specific 3D Models
  if (trackType === 'graphic') {
    // 1. Graphic Design: 3D Pen-Tool Nib & Floating Color Swatches
    // Nib Base
    const nibGeo = new THREE.ConeGeometry(1.6, 2.8, 4);
    const nibMat = new THREE.MeshStandardMaterial({
      color: 0x0A0A0A,
      roughness: 0.2,
      metalness: 0.85
    });
    const nib = new THREE.Mesh(nibGeo, nibMat);
    nib.rotation.x = Math.PI;
    nib.position.y = -0.3;
    mainGroup.add(nib);

    // Nib Tip Accent
    const tipGeo = new THREE.ConeGeometry(0.5, 1.0, 4);
    const tipMat = new THREE.MeshStandardMaterial({ color: 0xE23A0F, roughness: 0.1, metalness: 0.9 });
    const tip = new THREE.Mesh(tipGeo, tipMat);
    tip.rotation.x = Math.PI;
    tip.position.y = -1.9;
    mainGroup.add(tip);

    // Orbiting Color Swatch Discs
    const swatchColors = [0xFEA707, 0xE23A0F, 0x0A0A0A, 0xFFFFFF];
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const swatchGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.1, 16);
      const swatchMat = new THREE.MeshStandardMaterial({ color: swatchColors[i], metalness: 0.3 });
      const swatch = new THREE.Mesh(swatchGeo, swatchMat);
      swatch.position.set(Math.cos(angle) * 2.4, Math.sin(angle) * 1.8, Math.sin(angle * 2) * 0.8);
      swatch.rotation.x = Math.PI / 4;
      mainGroup.add(swatch);
    }

  } else if (trackType === 'video') {
    // 2. Video Editing: 3D Clapperboard with Red Stripes & Play Triangle
    const boardGeo = new THREE.BoxGeometry(3.0, 2.2, 0.3);
    const boardMat = new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.4, metalness: 0.7 });
    const board = new THREE.Mesh(boardGeo, boardMat);
    mainGroup.add(board);

    // Clapper Top Bar (Angled)
    const topBarGeo = new THREE.BoxGeometry(3.1, 0.5, 0.35);
    const topBarMat = new THREE.MeshStandardMaterial({ color: 0xE23A0F, roughness: 0.3, metalness: 0.8 });
    const topBar = new THREE.Mesh(topBarGeo, topBarMat);
    topBar.position.set(0, 1.4, 0);
    topBar.rotation.z = -0.12;
    mainGroup.add(topBar);

    // Play Triangle Prism
    const playGeo = new THREE.ConeGeometry(0.7, 0.4, 3);
    const playMat = new THREE.MeshStandardMaterial({ color: 0xFEA707, roughness: 0.2, metalness: 0.9 });
    const playIcon = new THREE.Mesh(playGeo, playMat);
    playIcon.rotation.z = -Math.PI / 2;
    playIcon.position.set(0.1, -0.1, 0.25);
    mainGroup.add(playIcon);

  } else if (trackType === 'motion') {
    // 3. Motion Graphics: 3-Axis Gyroscopic Kinetic Rings & Central Sphere
    const ringMat1 = new THREE.MeshStandardMaterial({ color: 0xFEA707, roughness: 0.2, metalness: 0.9 });
    const ringMat2 = new THREE.MeshStandardMaterial({ color: 0xE23A0F, roughness: 0.2, metalness: 0.9 });
    const ringMat3 = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.3, metalness: 0.8 });

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.12, 16, 64), ringMat1);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.65, 0.1, 16, 64), ringMat2);
    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.08, 16, 64), ringMat3);

    mainGroup.add(ring1);
    mainGroup.add(ring2);
    mainGroup.add(ring3);

    // Central core
    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.65, 1),
      new THREE.MeshStandardMaterial({ color: 0x0A0A0A, roughness: 0.1, metalness: 0.95 })
    );
    mainGroup.add(core);

    // Store references for specialized motion
    mainGroup.userData = { ring1, ring2, ring3, core };
  }

  // Interactive Drag & Hover Controls
  let isDragging = false;
  let previousMouseX = 0;
  let previousMouseY = 0;
  let autoRotateSpeed = 0.015;

  const onPointerDown = (e) => {
    isDragging = true;
    previousMouseX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    previousMouseY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

    const deltaX = clientX - previousMouseX;
    const deltaY = clientY - previousMouseY;

    mainGroup.rotation.y += deltaX * 0.015;
    mainGroup.rotation.x += deltaY * 0.015;

    previousMouseX = clientX;
    previousMouseY = clientY;
  };

  const onPointerUp = () => {
    isDragging = false;
  };

  container.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  container.addEventListener('touchstart', onPointerDown, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('touchend', onPointerUp, { passive: true });

  // Handle Resize
  const handleCanvasResize = () => {
    if (!container) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener('resize', handleCanvasResize, { passive: true });

  // Render Loop with Visibility Observer
  let isCanvasVisible = true;
  let animId;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      isCanvasVisible = entries[0].isIntersecting;
      if (isCanvasVisible && !animId) {
        animateCanvas();
      }
    }, { threshold: 0.1 });
    observer.observe(container);
  }

  let clock = new THREE.Clock();

  const animateCanvas = () => {
    if (!isCanvasVisible) {
      animId = null;
      return;
    }

    animId = requestAnimationFrame(animateCanvas);
    const delta = clock.getDelta();
    const time = clock.getElapsedTime();

    if (!isReducedMotion) {
      if (!isDragging) {
        mainGroup.rotation.y += autoRotateSpeed;
      }

      if (trackType === 'motion' && mainGroup.userData) {
        const { ring1, ring2, ring3, core } = mainGroup.userData;
        if (ring1) ring1.rotation.x = time * 0.8;
        if (ring2) ring2.rotation.y = time * 1.1;
        if (ring3) ring3.rotation.z = time * 0.9;
        if (core) core.rotation.y = time * 1.5;
      } else if (trackType === 'graphic') {
        mainGroup.position.y = Math.sin(time * 1.8) * 0.15;
      } else if (trackType === 'video') {
        mainGroup.position.y = Math.cos(time * 1.6) * 0.12;
      }
    }

    renderer.render(scene, camera);
  };

  animateCanvas();
}

/* --------------------------------------------------------------------------
   8. DYNAMIC COPYRIGHT YEAR
   -------------------------------------------------------------------------- */
function initCurrentYear() {
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

/* --------------------------------------------------------------------------
   8.5 STUDENT WORK VIDEO CONTROLS (AUTO-PAUSE SIBLING VIDEOS)
   -------------------------------------------------------------------------- */
function initStudentWorkVideos() {
  const videoPlayers = document.querySelectorAll('.student-video-player');
  if (!videoPlayers || videoPlayers.length === 0) return;

  videoPlayers.forEach(player => {
    player.addEventListener('play', () => {
      // Auto pause any other student video currently playing
      videoPlayers.forEach(otherPlayer => {
        if (otherPlayer !== player && !otherPlayer.paused) {
          otherPlayer.pause();
        }
      });
      // Also mute course background videos to prevent sound collision
      document.querySelectorAll('.motion-section-video, .video-editing-section-video').forEach(v => {
        if (!v.muted) v.muted = true;
      });
      document.querySelectorAll('.video-sound-toggle').forEach(btn => {
        btn.classList.add('is-muted');
        btn.setAttribute('aria-label', 'Unmute Sound');
        btn.title = 'Click to Unmute Sound';
        const iconUnmuted = btn.querySelector('.icon-unmuted');
        const iconMuted = btn.querySelector('.icon-muted');
        if (iconUnmuted) iconUnmuted.style.display = 'none';
        if (iconMuted) iconMuted.style.display = 'block';
      });
    });
  });
}

/* --------------------------------------------------------------------------
   8.6 COURSE SECTION VIDEOS AUDIO & SOUND CONTROLS (AUTOPLAY & CONTINUOUS LOOP)
   -------------------------------------------------------------------------- */
function initCourseLoopVideos() {
  const videoConfigs = [
    {
      videoId: 'video-editing-video',
      btnId: 'video-editing-sound-btn',
      sectionId: 'video-editing'
    },
    {
      videoId: 'motion-graphics-video',
      btnId: 'motion-sound-btn',
      sectionId: 'motion-graphics'
    }
  ];

  const trackedVideos = [];

  videoConfigs.forEach(cfg => {
    const video = document.getElementById(cfg.videoId);
    const soundBtn = document.getElementById(cfg.btnId);
    if (!video) return;

    trackedVideos.push({ video, soundBtn });

    const updateSoundUI = (isMuted) => {
      if (!soundBtn) return;
      soundBtn.classList.toggle('is-muted', isMuted);
      soundBtn.setAttribute('aria-label', isMuted ? 'Unmute Sound' : 'Mute Sound');
      soundBtn.title = isMuted ? 'Click to Unmute Sound' : 'Click to Mute Sound';
      const iconUnmuted = soundBtn.querySelector('.icon-unmuted');
      const iconMuted = soundBtn.querySelector('.icon-muted');
      if (iconUnmuted && iconMuted) {
        iconUnmuted.style.display = isMuted ? 'none' : 'block';
        iconMuted.style.display = isMuted ? 'block' : 'none';
      }
    };

    // 1. Rigorously enforce loop and muted properties on DOM element
    video.loop = true;
    video.setAttribute('loop', '');
    video.defaultMuted = true;
    video.muted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.volume = 1.0;
    updateSoundUI(true);

    // Safe play helper that prevents unhandled promise rejections
    let isRetrying = false;
    const safePlay = () => {
      if (!video) return;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          isRetrying = false;
        }).catch(() => {
          // If autoplay was rejected (e.g. strict browser policy), ensure muted and retry
          if (!video.muted) {
            video.muted = true;
            updateSoundUI(true);
          }
          if (!isRetrying) {
            isRetrying = true;
            setTimeout(() => {
              if (video && video.paused) {
                video.play().catch(() => {});
              }
            }, 300);
          }
        });
      }
    };

    // 2. Immediate playback attempt
    safePlay();

    // 3. Play as soon as metadata or buffered data becomes available
    ['loadstart', 'loadedmetadata', 'loadeddata', 'canplay'].forEach(evt => {
      video.addEventListener(evt, safePlay, { once: true });
    });

    // 4. STRICT CONTINUOUS LOOP ENFORCEMENT:
    // Native 'loop' attribute can stall in some browsers; this guarantees seamless continuous loop
    video.addEventListener('ended', () => {
      video.currentTime = 0;
      safePlay();
    });

    // Timeupdate safeguard: if within 0.12s of the end, seamlessly loop back to 0
    video.addEventListener('timeupdate', () => {
      if (video.duration && video.currentTime >= video.duration - 0.12) {
        video.currentTime = 0;
        safePlay();
      }
    });

    // Auto-resume if accidentally paused while page is active
    video.addEventListener('pause', () => {
      if (!document.hidden) {
        setTimeout(() => {
          if (video && video.paused) safePlay();
        }, 60);
      }
    });

    // 5. Intersection Observer: Guarantee playback when user scrolls into section
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && video.paused) {
            safePlay();
          }
        });
      }, { threshold: [0, 0.2, 0.5] });

      observer.observe(video);
      const section = document.getElementById(cfg.sectionId);
      if (section) observer.observe(section);
    }

    // 6. User gesture unlock fallback:
    // If browser blocked cold-load autoplay, start playback on first user gesture
    const unlockPlay = () => {
      if (video && video.paused) {
        safePlay();
      }
    };
    ['touchstart', 'touchend', 'scroll', 'pointerdown', 'mousedown'].forEach(evt => {
      window.addEventListener(evt, unlockPlay, { passive: true, once: true });
    });

    // 7. Resume playback when returning to this browser tab
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && video && video.paused) {
        safePlay();
      }
    });

    // 8. Sound toggle controls (Button & direct video click with mutual exclusion)
    const toggleSound = (e) => {
      if (e) e.stopPropagation();
      const willUnmute = video.muted;
      if (willUnmute) {
        // Mute all other course looping videos to prevent overlapping sound
        trackedVideos.forEach(item => {
          if (item.video !== video && !item.video.muted) {
            item.video.muted = true;
            if (item.soundBtn) {
              item.soundBtn.classList.add('is-muted');
              item.soundBtn.setAttribute('aria-label', 'Unmute Sound');
              item.soundBtn.title = 'Click to Unmute Sound';
              const u = item.soundBtn.querySelector('.icon-unmuted');
              const m = item.soundBtn.querySelector('.icon-muted');
              if (u) u.style.display = 'none';
              if (m) m.style.display = 'block';
            }
          }
        });
        video.muted = false;
        video.volume = 1.0;
      } else {
        video.muted = true;
      }
      safePlay();
      updateSoundUI(video.muted);
    };

    if (soundBtn) {
      soundBtn.addEventListener('click', toggleSound);
    }
    video.addEventListener('click', toggleSound);
  });
}

// Backward compatibility alias
function initMotionVideoSound() {
  initCourseLoopVideos();
}

/* --------------------------------------------------------------------------
   8. META PIXEL SEAMLESS EVENT TRACKING
   -------------------------------------------------------------------------- */
function trackMetaPixel(eventName, params = {}, isCustom = false) {
  try {
    if (typeof window.fbq === 'function') {
      if (isCustom) {
        window.fbq('trackCustom', eventName, params);
      } else {
        window.fbq('track', eventName, params);
      }
    }
  } catch (err) {
    console.debug('Meta Pixel tracking skipped:', err);
  }
}

function initMetaPixelTracking() {
  // Track all WhatsApp links across the page (Header, Hero, Floating dock, Footer, Cards)
  document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    link.addEventListener('click', () => {
      trackMetaPixel('Contact', {
        content_name: 'WhatsApp Chat',
        content_category: 'Messaging'
      });
    });
  });

  // Track all Phone call links across the page (Header, Floating dock, Footer)
  document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => {
      trackMetaPixel('Contact', {
        content_name: 'Phone Call',
        content_category: 'Direct Call'
      });
    });
  });
}

