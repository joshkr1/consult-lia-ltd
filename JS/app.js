// ========== DOM Elements ==========
const body = document.body;
const themeToggle = document.getElementById('themeToggle');
const loginBtn = document.getElementById('loginBtn');
const authModal = document.getElementById('authModal');
const authClose = document.getElementById('authClose');
const showLogin = document.getElementById('showLogin');
const showRegister = document.getElementById('showRegister');
const loginView = document.getElementById('loginView');
const registerView = document.getElementById('registerView');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const toRegister = document.getElementById('toRegister');
const dashboardShell = document.getElementById('dashboardShell');
const logoutBtn = document.getElementById('logoutBtn');

// ========== Theme ==========
function toggleTheme() {
  body.classList.toggle('dark');
  localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
}

if (localStorage.getItem('theme') === 'dark') body.classList.add('dark');
if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

// ========== Auth Modal ==========
function openAuthModal() { if(authModal) authModal.style.display = 'flex'; }
function closeAuthModal() { if(authModal) authModal.style.display = 'none'; }

if (loginBtn) loginBtn.addEventListener('click', openAuthModal);
if (authClose) authClose.addEventListener('click', closeAuthModal);

function showLoginView() {
  if(showLogin) showLogin.classList.add('active');
  if(showRegister) showRegister.classList.remove('active');
  if(loginView) loginView.classList.add('active');
  if(registerView) registerView.classList.remove('active');
}

function showRegisterView() {
  if(showRegister) showRegister.classList.add('active');
  if(showLogin) showLogin.classList.remove('active');
  if(registerView) registerView.classList.add('active');
  if(loginView) loginView.classList.remove('active');
}

if (showLogin) showLogin.addEventListener('click', showLoginView);
if (showRegister) showRegister.addEventListener('click', showRegisterView);
if (toRegister) toRegister.addEventListener('click', showRegisterView);

// ========== Dashboard ==========
function openDashboard() {
  if(!dashboardShell) return;
  dashboardShell.classList.remove('hidden');
  closeAuthModal();
  const user = JSON.parse(localStorage.getItem('userData'));
  if (user) {
    const dashName = document.getElementById('dashName');
    if(dashName) dashName.innerText = user.name;
    const pName = document.getElementById('p-name');
    if(pName) pName.value = user.name;
    const pEmail = document.getElementById('p-email');
    if(pEmail) pEmail.value = user.email;
    const pPhone = document.getElementById('p-phone');
    if(pPhone) pPhone.value = user.phone || '';
  }
  loadServices();
}

function closeDashboard() { if(dashboardShell) dashboardShell.classList.add('hidden'); }

function showPanel(panelId) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.dash-nav button').forEach(b => b.classList.remove('active'));
  const panel = document.getElementById(`panel-${panelId}`);
  if(panel) panel.classList.add('active');
  const btn = document.querySelector(`.dash-nav button[data-panel="${panelId}"]`);
  if(btn) btn.classList.add('active');
}

// Service management
function loadServices() {
  const services = JSON.parse(localStorage.getItem('userServices')) || [];
  const container = document.getElementById('serviceList');
  const widget = document.getElementById('widgetServices');
  if (!container) return;
  if (services.length === 0) {
    container.innerHTML = '<div class="card"><p>No services added yet.</p></div>';
  } else {
    container.innerHTML = services.map((s, i) => `
      <div class="card mb-20">
        <h4>${escapeHtml(s.title)}</h4>
        <p>${escapeHtml(s.description)}</p>
        <button class="btn small" onclick="deleteService(${i})">Delete</button>
      </div>
    `).join('');
  }
  if (widget) widget.innerText = services.length;
}

function addService(e) {
  e.preventDefault();
  const title = document.getElementById('svc-title')?.value;
  const desc = document.getElementById('svc-desc')?.value;
  if (!title || !desc) return alert('Please fill both fields');
  const services = JSON.parse(localStorage.getItem('userServices')) || [];
  services.push({ title, description: desc });
  localStorage.setItem('userServices', JSON.stringify(services));
  document.getElementById('addServiceForm')?.reset();
  loadServices();
  const notice = document.getElementById('addSvcNotice');
  if(notice) { notice.innerText = 'Service added!'; setTimeout(() => notice.innerText = '', 2000); }
}

window.deleteService = function(index) {
  const services = JSON.parse(localStorage.getItem('userServices')) || [];
  services.splice(index, 1);
  localStorage.setItem('userServices', JSON.stringify(services));
  loadServices();
};

// Profile save
function saveProfile(e) {
  e.preventDefault();
  const user = JSON.parse(localStorage.getItem('userData'));
  if (user) {
    user.name = document.getElementById('p-name')?.value || '';
    user.email = document.getElementById('p-email')?.value || '';
    user.phone = document.getElementById('p-phone')?.value || '';
    localStorage.setItem('userData', JSON.stringify(user));
    const notice = document.getElementById('profileNotice');
    if(notice) { notice.innerText = 'Profile updated!'; setTimeout(() => notice.innerText = '', 2000); }
  }
}

// Login/Register handlers
function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email')?.value;
  const pass = document.getElementById('login-pass')?.value;
  const user = JSON.parse(localStorage.getItem('userData'));
  if (user && user.email === email && user.password === pass) {
    openDashboard();
  } else {
    const notice = document.getElementById('loginNotice');
    if(notice) notice.innerText = 'Invalid credentials';
  }
}

function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('reg-name')?.value;
  const email = document.getElementById('reg-email')?.value;
  const phone = document.getElementById('reg-phone')?.value;
  const password = document.getElementById('reg-pass')?.value;
  if (!name || !email || !password) return alert('Please fill all required fields');
  const userData = { name, email, phone, password };
  localStorage.setItem('userData', JSON.stringify(userData));
  const notice = document.getElementById('regNotice');
  if(notice) notice.innerText = 'Registration successful! Please login.';
  setTimeout(() => showLoginView(), 1500);
}

if (loginForm) loginForm.addEventListener('submit', handleLogin);
if (registerForm) registerForm.addEventListener('submit', handleRegister);
if (logoutBtn) logoutBtn.addEventListener('click', closeDashboard);

document.querySelectorAll('.dash-nav button[data-panel]').forEach(btn => {
  btn.addEventListener('click', () => showPanel(btn.getAttribute('data-panel')));
});
const addServiceForm = document.getElementById('addServiceForm');
if (addServiceForm) addServiceForm.addEventListener('submit', addService);
const profileForm = document.getElementById('profileForm');
if (profileForm) profileForm.addEventListener('submit', saveProfile);

// Close modals on outside click
window.addEventListener('click', (e) => {
  if (e.target === authModal) closeAuthModal();
  if (e.target === dashboardShell) closeDashboard();
});

function escapeHtml(str) {
  if(!str) return '';
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

// ========== KPI Counters (only if elements exist) ==========
function animateKPI() {
  document.querySelectorAll('.kpi-value[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    let current = 0;
    const step = target / 50;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        el.innerText = target + (el.dataset.target === '98' ? '%' : '+');
        clearInterval(timer);
      } else {
        el.innerText = Math.floor(current) + (el.dataset.target === '98' ? '%' : '+');
      }
    }, 30);
  });
}
const kpiSection = document.querySelector('.kpi-section');
if (kpiSection) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { animateKPI(); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.5 });
  observer.observe(kpiSection);
}

// ========== Testimonial Slider ==========
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial');
const dots = document.querySelectorAll('.slider-dot');
function showTestimonial(index) {
  testimonials.forEach((t, i) => t.classList.toggle('active', i === index));
  dots.forEach((d, i) => d.classList.toggle('active', i === index));
  currentTestimonial = index;
}
if (testimonials.length) {
  setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
  }, 5000);
  dots.forEach((dot, i) => dot.addEventListener('click', () => showTestimonial(i)));
}

// ========== Contact Form (if using Formspree, no extra JS needed) ==========
// The form already has action="https://formspree.io/f/mldprnvd" method="POST"