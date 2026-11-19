const room = document.getElementById('room');
const handle = document.getElementById('stringHandle');
const stringPath = document.getElementById('stringpath');
const fireflies = document.getElementById('fireflies');
const loginForm = document.getElementById('loginForm');
const formMessage = document.getElementById('formMessage');
const confirmPasswordWrap = document.getElementById('confirmPasswordWrap');
const confirmPasswordInput = loginForm.elements.confirmPassword;
const submitButton = document.getElementById('submitButton');
const formTitle = document.getElementById('formTitle');
const formSubtitle = document.getElementById('formSubtitle');
const authPrompt = document.getElementById('authPrompt');
const authToggle = document.getElementById('authToggle');
let isRegistering = false;
let isOn = false, dragging = false, startY = 0, dragY = 0;

function setLamp(on) {
  isOn = on;
  room.classList.toggle('on', isOn);
  if (isOn) createFireflies();
  else fireflies.replaceChildren();
}
function updateString(y = 0) {
  const pull = Math.max(0, Math.min(55, y));
  stringPath.setAttribute('d', `M 0 0 Q ${pull * .12} ${35 + pull * .4} 0 ${80 + pull}`);
  handle.style.transform = `translateY(${pull}px)`;
}
function resetString() { updateString(0); }
function pointerDown(e) {
  dragging = true; startY = e.clientY; dragY = 0;
  handle.classList.add('dragging');
  handle.setPointerCapture?.(e.pointerId);
}
function pointerMove(e) {
  if (!dragging) return;
  dragY = Math.max(0, Math.min(55, e.clientY - startY));
  updateString(dragY);
}
function pointerUp() {
  if (!dragging) return;
  dragging = false; handle.classList.remove('dragging');
  if (dragY > 18) setLamp(!isOn);
  resetString();
}
handle.addEventListener('pointerdown', pointerDown);
handle.addEventListener('pointermove', pointerMove);
handle.addEventListener('pointerup', pointerUp);
handle.addEventListener('pointercancel', pointerUp);
handle.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setLamp(!isOn); }
});
function random(min, max) { return Math.random() * (max - min) + min; }
function createFireflies() {
  fireflies.replaceChildren();
  for (let i = 0; i < 18; i++) {
    const dot = document.createElement('span');
    dot.className = 'firefly';
    dot.style.left = `${random(5, 95)}%`;
    dot.style.top = `${random(8, 92)}%`;
    dot.style.setProperty('--duration', `${random(4, 10)}s`);
    dot.style.setProperty('--delay', `${random(-8, 0)}s`);
    for (let n = 1; n <= 5; n++) {
      dot.style.setProperty(`--x${n === 1 ? '' : n}`, `${random(-45, 45)}px`);
      dot.style.setProperty(`--y${n === 1 ? '' : n}`, `${random(-45, 45)}px`);
    }
    fireflies.appendChild(dot);
  }
}
function setMessage(message, success = true) {
  formMessage.textContent = message;
  formMessage.style.color = success ? '#e8c66a' : '#ff8d8d';
}

authToggle.addEventListener('click', () => {
  isRegistering = !isRegistering;
  loginForm.classList.toggle('register-mode', isRegistering);
  confirmPasswordWrap.hidden = !isRegistering;
  confirmPasswordInput.required = isRegistering;
  loginForm.elements.password.autocomplete = isRegistering ? 'new-password' : 'current-password';
  submitButton.textContent = isRegistering ? 'Create Account' : 'Sign In';
  formTitle.textContent = isRegistering ? 'Create your account.' : '# Discover Knowledge.';
  formSubtitle.textContent = isRegistering ? 'Join Research Navigator.' : '# Power Innovation.';
  authPrompt.firstChild.textContent = isRegistering ? 'Already have an account? ' : 'New to Research Navigator? ';
  authToggle.textContent = isRegistering ? 'Sign in' : 'Create an account';
  formMessage.textContent = '';
});

loginForm.addEventListener('submit', e => {
  e.preventDefault();

  const username = loginForm.username.value.trim();
  const email = loginForm.email.value.trim();
  const password = loginForm.password.value.trim();

  if (!username || !email || !password) {
    setMessage('Please fill in all required fields.', false);
    return;
  }

  if (!email.includes('@') || !email.includes('.')) {
    setMessage('Please enter a valid email address.', false);
    return;
  }

  if (password.length < 6) {
    setMessage('Password must be at least 6 characters long.', false);
    return;
  }

  if (isRegistering && confirmPasswordInput.value !== password) {
    setMessage('Your passwords do not match.', false);
    return;
  }

  const userData = { username, email };
  localStorage.setItem('lampLoginUser', JSON.stringify(userData));

  setMessage(
    isRegistering
      ? `Account created for ${username}! Redirecting...`
      : `Welcome back, ${username}! Redirecting...`,
    true
  );
  loginForm.reset();

  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 700);
});

const providerLinks = {
  Google: 'https://accounts.google.com/signin',
  GitHub: 'https://github.com/login'
};

const socialButtons = document.querySelectorAll('.social-btn');
socialButtons.forEach(button => {
  const provider = button.textContent.includes('Google') ? 'Google' : 'GitHub';

  button.addEventListener('click', () => {
    setMessage(`Redirecting to ${provider} sign-in...`, true);
    window.open(providerLinks[provider], '_blank', 'noopener,noreferrer');
  });
});
setLamp(false);
