

// Número de WhatsApp em formato internacional (sem +, parênteses ou traços)
const WHATSAPP_NUMBER = '5582993368039';

// Mensagens pré-definidas por ação (data-whats-action)
const WHATSAPP_MESSAGES = {
  geral: 'Olá! Gostaria de saber mais sobre seus atendimentos de nutrição.',
  'info-geral': 'Olá! Vi seu site e gostaria de entender melhor como funcionam suas consultas.',
  hipertrofia: 'Olá! Gostaria de marcar uma consulta com você, meu objetivo é hipertrofia.',
  'saude-mulher': 'Olá! Gostaria de marcar uma consulta focada em saúde da mulher.',
  'nutricao-clinica': 'Olá! Gostaria de atendimento em nutrição clínica para avaliar minha saúde.',
  'reeducacao-alimentar': 'Olá! Quero ajuda para fazer uma reeducação alimentar sustentável.',
  emagrecimento: 'Olá! Meu objetivo é emagrecimento saudável, gostaria de agendar uma consulta.',
  'nutricao-esportiva': 'Olá! Quero melhorar minha performance com nutrição esportiva.',
  'nutricao-comportamental': 'Olá! Quero trabalhar minha relação com a comida e comportamento alimentar.',
  'consultoria-online': 'Olá! Gostaria de saber mais sobre sua consultoria online.'
};

// URLs de PDF por receita (ajuste para os caminhos reais dos seus PDFs)
const RECEITA_PDFS = {
  'salada-colorida': 'https://drive.google.com/file/d/11hSAenTWvplt9_LifCrNwHJJ8F4a8uZk/view?usp=drive_link',
  'crepioca-frango-desfiado': 'https://drive.google.com/file/d/16TDsNG8XfljKuxX8sUjQjYiQ_o95caEs/view',
  'quinoa-camarao': 'https://drive.google.com/file/d/1_o3QbV_foJxEL9bPPRIbMDqpKjz_awAC/view',
  'suco-verde-melao-couve': 'https://drive.google.com/file/d/1DuuyxPyXnzrjOlazwdk29B7lIkZQ0iDm/view?usp=drive_link',
  'pudim-whey': 'https://drive.google.com/file/d/1MQft4QJhbC7g_gzpkJaRhFJUk7k_TBCh/view?usp=drive_link',
  'frozen-iogurte-frutas-vermelhas': 'https://drive.google.com/file/d/1HjPsufWOqIJAehp92YKwAw1YcOiYAlT-/view'
};

// ===========================
// FUNÇÕES AUXILIARES
// ===========================

// Monta URL de WhatsApp "click to chat" com mensagem pré-preenchida
function buildWhatsAppUrl(action) {
  const rawMessage =
    WHATSAPP_MESSAGES[action] || WHATSAPP_MESSAGES.geral || 'Olá! Gostaria de mais informações.';
  const encodedMessage = encodeURIComponent(rawMessage);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

// Abre uma URL em nova aba, com fallback simples
function openInNewTab(url) {
  const newWin = window.open(url, '_blank');
  if (newWin) {
    newWin.opener = null;
  }
}

// ===========================
// PRELOADER (0–100% em 4s)
// ===========================

function initPreloader() {
  const preloader = document.getElementById('preloader');
  const loadingBar = document.querySelector('.loading-bar');
  const percentageText = document.getElementById('preloader-percentage');
  const progressContainer = document.querySelector('.loading-bar-container'); // role="progressbar"

  if (!preloader || !loadingBar || !percentageText || !progressContainer) return;

  const DURATION = 4000; 
  let startTime = null;
  let loadComplete = false;

  // Mostra o preloader imediatamente
  preloader.style.display = 'flex';
  preloader.style.opacity = '1';

  // Marca quando a página terminou de carregar (HTML + imagens)
  window.addEventListener('load', () => {
    loadComplete = true;
  });

  function animate(timestamp) {
    if (!startTime) {
      startTime = timestamp;
    }

    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / DURATION, 1);
    const percent = Math.round(progress * 100);

    loadingBar.style.width = `${percent}%`;
    percentageText.textContent = `${percent}%`;
    progressContainer.setAttribute('aria-valuenow', percent);

    // Se ainda não passou 4s OU a página ainda não terminou de carregar, continua animando
    if (progress < 1 || !loadComplete) {
      window.requestAnimationFrame(animate);
      return;
    }

    // Aqui: já deu 4s E o load já ocorreu -> esconde o preloader
    preloader.style.transition = 'opacity 0.4s ease';
    preloader.style.opacity = '0';

    setTimeout(() => {
      preloader.style.display = 'none';
    }, 400);
  }

  // Inicia a animação
  window.requestAnimationFrame(animate);
}

// ===========================
// MENU MOBILE
// ===========================

function initMobileMenu() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');

  if (!hamburgerBtn || !navMenu) return;

  hamburgerBtn.addEventListener('click', () => {
    const isActive = navMenu.classList.toggle('active');
    hamburgerBtn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
  });

  // Fecha o menu ao clicar em algum link
  navMenu.addEventListener('click', (event) => {
    const target = event.target;
    if (target.tagName === 'A') {
      navMenu.classList.remove('active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

// ===========================
// BOTÕES WHATSAPP
// ===========================

function initWhatsAppButtons() {
  const whatsButtons = document.querySelectorAll('[data-whats-action]');
  if (!whatsButtons.length) return;

  whatsButtons.forEach((btn) => {
    btn.addEventListener('click', (event) => {
      event.preventDefault();
      const action = btn.dataset.whatsAction;
      const url = buildWhatsAppUrl(action);
      openInNewTab(url);
    });
  });
}

// ===========================
// BOTÕES DE RECEITAS (PDF)
// ===========================

function initRecipeButtons() {
  const recipeButtons = document.querySelectorAll('[data-receita]');
  if (!recipeButtons.length) return;

  recipeButtons.forEach((btn) => {
    btn.addEventListener('click', (event) => {
      event.preventDefault();
      const key = btn.dataset.receita;
      const pdfUrl = RECEITA_PDFS[key];

      if (!pdfUrl) {
        console.warn(`Nenhum PDF configurado para a receita: ${key}`);
        return;
      }

      openInNewTab(pdfUrl);
    });
  });
}

// ===========================
// SCROLL-REVEAL (ANIMAÇÕES)
// ===========================

function initScrollReveal() {
  const elements = document.querySelectorAll('.scroll-reveal');
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('active'));
    return;
  }

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -10% 0px'
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  elements.forEach((el) => observer.observe(el));
}

// ===========================
// FORMULÁRIO (VALIDAÇÃO + WHATSAPP)
// ===========================

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('input-name');
  const emailInput = document.getElementById('input-email');
  const phoneInput = document.getElementById('input-phone');
  const goalSelect = document.getElementById('input-goal'); 
  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const phoneError = document.getElementById('phone-error');
  const goalError = document.getElementById('goal-error');
  const submitBtn = document.getElementById('submit-btn');
  const btnText = submitBtn?.querySelector('.btn-text');
  const btnLoader = submitBtn?.querySelector('.btn-loader');
  const statusDiv = document.getElementById('form-status');

  function showError(el, errorEl, message) {
    if (!errorEl) return;
    errorEl.textContent = message;
    if (el) el.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  function clearErrors() {
    showError(nameInput, nameError, '');
    showError(emailInput, emailError, '');
    showError(phoneInput, phoneError, '');
    showError(goalSelect, goalError, '');
    if (statusDiv) statusDiv.textContent = '';
  }

  function toggleLoading(isLoading) {
    if (!submitBtn || !btnText || !btnLoader) return;
    submitBtn.disabled = isLoading;
    btnText.style.display = isLoading ? 'none' : 'inline';
    btnLoader.style.display = isLoading ? 'inline' : 'none';
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearErrors();

    let hasError = false;

    if (nameInput && !nameInput.value.trim()) {
      showError(nameInput, nameError, 'Por favor, informe seu nome completo.');
      hasError = true;
    }

    if (emailInput) {
      const emailValue = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailValue) {
        showError(emailInput, emailError, 'Por favor, informe seu e-mail.');
        hasError = true;
      } else if (!emailRegex.test(emailValue)) {
        showError(emailInput, emailError, 'Por favor, informe um e-mail válido.');
        hasError = true;
      }
    }

    if (phoneInput) {
      const phoneValue = phoneInput.value.trim();
      if (!phoneValue) {
        showError(phoneInput, phoneError, 'Por favor, informe seu telefone.');
        hasError = true;
      }
    }

    if (goalSelect) {
      const goalValue = goalSelect.value;
      if (!goalValue) {
        showError(goalSelect, goalError, 'Por favor, selecione seu objetivo.');
        hasError = true;
      }
    }

    if (hasError) return;

    // Monta mensagem para o WhatsApp
    toggleLoading(true);

    const nome = nameInput?.value.trim() || '';
    const email = emailInput?.value.trim() || '';
    const telefone = phoneInput?.value.trim() || '';
    const goalText =
      goalSelect && goalSelect.value
        ? goalSelect.options[goalSelect.selectedIndex].text
        : 'Não informado';

    let mensagem = 'Olá! Gostaria de marcar uma consulta com você.\n\n';
    mensagem += '*Dados do contato:*\n';
    mensagem += `*Nome:* ${nome}\n`;
    mensagem += `*Email:* ${email}\n`;
    mensagem += `*Telefone:* ${telefone}\n`;
    mensagem += `*Objetivo:* ${goalText}\n`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;

    // Abre o WhatsApp em nova aba
    openInNewTab(url);

    setTimeout(() => {
      toggleLoading(false);
      form.reset();
      if (statusDiv) statusDiv.textContent = '';
    }, 1000);
  });
}

// ===========================
// DEPOIMENTOS: SETAS PARA NAVEGAR
// ===========================

function initTestimonialsArrows() {
  const grid = document.querySelector('.testimonials__grid');
  const prevBtn = document.querySelector('.testimonials-arrow.prev');
  const nextBtn = document.querySelector('.testimonials-arrow.next');

  if (!grid || !prevBtn || !nextBtn) return;

  const firstCard = grid.querySelector('.testimonial-card');
  const cardWidth = firstCard ? firstCard.offsetWidth : 280;
  const gap = 20; // mesmo gap do CSS
  const scrollAmount = cardWidth + gap;

  prevBtn.addEventListener('click', () => {
    grid.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    });
  });

  nextBtn.addEventListener('click', () => {
    grid.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  });
}

// ===========================
// DEPOIMENTOS: AUTO-SCROLL
// ===========================

function initTestimonialsAutoScroll() {
  const grid = document.querySelector('.testimonials__grid');
  if (!grid) return;

  const firstCard = grid.querySelector('.testimonial-card');
  if (!firstCard) return;

  const cardWidth = firstCard.offsetWidth || 280;
  const gap = 20;
  const scrollAmount = cardWidth + gap;
  const intervalMs = 4000; 

  let autoScrollId = null;

  function step() {
    const maxScrollLeft = grid.scrollWidth - grid.clientWidth;
    const nearEnd = grid.scrollLeft + scrollAmount >= maxScrollLeft - 5;

    if (nearEnd) {
      grid.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      grid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  function startAutoScroll() {
    if (autoScrollId) return;
    autoScrollId = setInterval(step, intervalMs);
  }

  function stopAutoScroll() {
    if (!autoScrollId) return;
    clearInterval(autoScrollId);
    autoScrollId = null;
  }

  grid.addEventListener('mouseenter', stopAutoScroll);
  grid.addEventListener('mouseleave', startAutoScroll);
  grid.addEventListener('focusin', stopAutoScroll);
  grid.addEventListener('focusout', startAutoScroll);

  startAutoScroll();
}

// ===========================
// INICIALIZAÇÃO GERAL
// ===========================

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initMobileMenu();
  initWhatsAppButtons();
  initRecipeButtons();
  initScrollReveal();
  initContactForm();
  initTestimonialsArrows();
  initTestimonialsAutoScroll();
});
