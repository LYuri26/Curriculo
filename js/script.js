document.addEventListener("DOMContentLoaded", function () {
  // ============ CONTROLE DE TEMA ============
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

    // Aplicar tema inicial
    function initializeTheme() {
      const savedTheme = localStorage.getItem("theme");
      const prefersDark = prefersDarkScheme.matches;
      const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
      applyTheme(initialTheme);
    }

    // Aplicar tema específico
    function applyTheme(theme) {
      document.documentElement.setAttribute("data-theme", theme);
      const icon = themeToggle.querySelector("i");

      if (theme === "dark") {
        icon.classList.remove("bi-moon-fill");
        icon.classList.add("bi-sun-fill");
        themeToggle.setAttribute("aria-label", "Alternar para modo claro");
      } else {
        icon.classList.remove("bi-sun-fill");
        icon.classList.add("bi-moon-fill");
        themeToggle.setAttribute("aria-label", "Alternar para modo escuro");
      }

      // Disparar evento para atualizar componentes que dependem do tema
      document.dispatchEvent(
        new CustomEvent("themeChanged", { detail: theme })
      );
    }

    // Alternador de tema
    themeToggle.addEventListener("click", function () {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      applyTheme(newTheme);
      localStorage.setItem("theme", newTheme);
    });

    // Observar mudanças na preferência do sistema
    prefersDarkScheme.addEventListener("change", (e) => {
      if (!localStorage.getItem("theme")) {
        applyTheme(e.matches ? "dark" : "light");
      }
    });

    // Inicializar tema
    initializeTheme();
  }

  // ============ SCROLL SUAVE ============
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      // Fechar navbar mobile se estiver aberta
      const navbarCollapse = document.querySelector(".navbar-collapse.show");
      if (navbarCollapse) {
        const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
          toggle: false,
        });
        bsCollapse.hide();
      }

      // Rolagem suave com offset para navbar fixa
      const navbarHeight = document.querySelector(".navbar").offsetHeight;
      const targetPosition =
        targetElement.getBoundingClientRect().top +
        window.pageYOffset -
        navbarHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });

      // Atualizar URL sem recarregar a página
      history.replaceState(null, null, targetId);
    });
  });

  // ============ ANIMAÇÃO AO ROLAR ============
  function animateOnScroll() {
    const elements = document.querySelectorAll(".animate-on-scroll");
    const windowHeight = window.innerHeight;
    const triggerOffset = 100;

    elements.forEach((element) => {
      const elementPosition = element.getBoundingClientRect().top;

      if (elementPosition < windowHeight - triggerOffset) {
        element.classList.add("animate__animated", "animate__fadeInUp");
        element.style.opacity = "1";
        element.style.transform = "translateY(0)";
      }
    });
  }

  // Configurar elementos para animação
  function setupScrollAnimations() {
    const animatableElements = document.querySelectorAll(
      ".card, .timeline-item, .section-title, .section-subtitle"
    );

    animatableElements.forEach((el) => {
      el.classList.add("animate-on-scroll");
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    });

    // Verificar elementos visíveis no carregamento
    animateOnScroll();
  }

  // Configurar observador de scroll com debounce
  let scrollTimeout;
  window.addEventListener("scroll", function () {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(animateOnScroll, 50);
  });

  // Inicializar animações
  setupScrollAnimations();

  // ============ FORMULÁRIO DE CONTATO ============
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const submitBtn = this.querySelector('button[type="submit"]');
      if (!submitBtn) return;

      const originalText = submitBtn.innerHTML;
      const originalDisabled = submitBtn.disabled;

      // Feedback visual
      submitBtn.innerHTML = `
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Enviando...
      `;
      submitBtn.disabled = true;

      // Simular envio assíncrono
      setTimeout(() => {
        // Criar alerta de sucesso
        const alertPlaceholder = document.createElement("div");
        alertPlaceholder.innerHTML = `
          <div class="alert alert-success alert-dismissible fade show mt-3" role="alert">
            Mensagem enviada com sucesso!
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        `;

        // Inserir alerta antes do formulário
        contactForm.parentNode.insertBefore(alertPlaceholder, contactForm);

        // Resetar formulário
        contactForm.reset();

        // Restaurar botão
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = originalDisabled;
      }, 1500);
    });
  }

  // ============ TOOLTIPS ============
  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  );
  if (tooltipTriggerList.length > 0) {
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  // ============ SCROLLSPY ============
  const navbar = document.getElementById("navbar");
  if (navbar) {
    new bootstrap.ScrollSpy(document.body, {
      target: "#navbar",
      offset: 70,
    });
  }

  // ============ ATUALIZAR ANO NO FOOTER ============
  const currentYearElement = document.getElementById("current-year");
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }

  // ============ AJUSTE DE ALTURA DE CARDS ============
  function adjustCardHeights() {
    if (window.innerWidth >= 992) {
      document.querySelectorAll(".row .card-group").forEach((group) => {
        let maxHeight = 0;
        const cards = group.querySelectorAll(".card");

        // Resetar alturas
        cards.forEach((card) => {
          card.style.minHeight = "";
        });

        // Calcular altura máxima
        cards.forEach((card) => {
          const cardHeight = card.offsetHeight;
          if (cardHeight > maxHeight) maxHeight = cardHeight;
        });

        // Aplicar altura máxima
        cards.forEach((card) => {
          card.style.minHeight = `${maxHeight}px`;
        });
      });
    } else {
      document.querySelectorAll(".card").forEach((card) => {
        card.style.minHeight = "";
      });
    }
  }

  // Executar ao carregar e redimensionar com debounce
  let resizeTimeout;
  window.addEventListener("load", adjustCardHeights);
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(adjustCardHeights, 100);
  });

  // Forçar redesenho para evitar flashes de conteúdo não estilizado
  document.body.style.opacity = "1";
});
