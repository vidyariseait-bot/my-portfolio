// =========================================================
// MODERN SOFTWARE ENGINEER PORTFOLIO LOGIC
// Includes: Theme Toggle, Timeline Filter, Projects Modal,
// Scrollspy Navigation, Mobile Drawer & Interactive Chat.
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

  // -------------------------------------------------------
  // 1. NIGHT / DARK MODE TOGGLE & SYSTEM PREFERENCE
  // -------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const themeText = document.getElementById('theme-text');
  const currentYearSpan = document.getElementById('current-year');

  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  const prefersDarkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    return prefersDarkMediaQuery.matches ? 'dark' : 'light';
  };

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    
    if (theme === 'dark') {
      if (themeIcon) themeIcon.textContent = '☀️';
      if (themeText) themeText.textContent = 'Light Mode';
      themeToggleBtn?.setAttribute('aria-label', 'Switch to Light Mode');
    } else {
      if (themeIcon) themeIcon.textContent = '🌙';
      if (themeText) themeText.textContent = 'Dark Mode';
      themeToggleBtn?.setAttribute('aria-label', 'Switch to Dark Mode');
    }
  };

  applyTheme(getPreferredTheme());

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || (prefersDarkMediaQuery.matches ? 'dark' : 'light');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      localStorage.setItem('theme', newTheme);
      applyTheme(newTheme);
    });
  }

  prefersDarkMediaQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // -------------------------------------------------------
  // 2. VERTICAL NAVIGATION & SCROLLSPY
  // -------------------------------------------------------
  const navLinks = document.querySelectorAll('.sidebar-menu .nav-link');
  const sections = document.querySelectorAll('main section[id]');

  const updateActiveNavLink = () => {
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 200;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach((link) => {
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  };

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  // -------------------------------------------------------
  // 3. RESPONSIVE MOBILE SIDEBAR DRAWER
  // -------------------------------------------------------
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const sidebarNav = document.getElementById('sidebar-nav');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');

  const openMobileMenu = () => {
    sidebarNav?.classList.add('open');
    sidebarBackdrop?.classList.add('active');
    mobileMenuToggle?.setAttribute('aria-expanded', 'true');
  };

  const closeMobileMenu = () => {
    sidebarNav?.classList.remove('open');
    sidebarBackdrop?.classList.remove('active');
    mobileMenuToggle?.setAttribute('aria-expanded', 'false');
  };

  mobileMenuToggle?.addEventListener('click', () => {
    if (sidebarNav?.classList.contains('open')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  sidebarBackdrop?.addEventListener('click', closeMobileMenu);

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 992) {
        closeMobileMenu();
      }
    });
  });

  // -------------------------------------------------------
  // 4. INTERACTIVE TIMELINE CATEGORY FILTER
  // -------------------------------------------------------
  const filterChips = document.querySelectorAll('.timeline-filters .filter-chip');
  const timelineCards = document.querySelectorAll('.timeline-track .timeline-card');

  filterChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      filterChips.forEach((c) => {
        c.classList.remove('active');
        c.setAttribute('aria-selected', 'false');
      });
      chip.classList.add('active');
      chip.setAttribute('aria-selected', 'true');

      const selectedCategory = chip.getAttribute('data-filter');

      timelineCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        if (selectedCategory === 'all' || cardCategory === selectedCategory) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // -------------------------------------------------------
  // 5. PROJECTS MODAL DETAIL VIEW (CONNECTED TO THUMBNAILS)
  // -------------------------------------------------------
  const modal = document.getElementById('project-detail-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalCat = document.getElementById('modal-project-category');
  const modalTitle = document.getElementById('modal-project-title');
  const modalImg = document.getElementById('modal-project-img');
  const modalDesc = document.getElementById('modal-project-desc');
  const modalTags = document.getElementById('modal-project-tags');
  const modalLive = document.getElementById('modal-live-link');
  const modalRepo = document.getElementById('modal-repo-link');

  const projectCards = document.querySelectorAll('.interactive-project');

  const openProjectModal = (card) => {
    const title = card.getAttribute('data-title') || 'Project Overview';
    const category = card.getAttribute('data-category') || 'Software Engineering';
    const image = card.getAttribute('data-image') || '';
    const desc = card.getAttribute('data-description') || '';
    const tags = (card.getAttribute('data-tags') || '').split(',');
    const demo = card.getAttribute('data-demo') || '#';
    const repo = card.getAttribute('data-repo') || '#';

    if (modalTitle) modalTitle.textContent = title;
    if (modalCat) modalCat.textContent = category;
    if (modalImg) {
      modalImg.src = image;
      modalImg.alt = `${title} preview screenshot`;
    }
    if (modalDesc) modalDesc.textContent = desc;

    if (modalTags) {
      modalTags.innerHTML = '';
      tags.forEach((tag) => {
        if (tag.trim()) {
          const tagSpan = document.createElement('span');
          tagSpan.className = 'tech-pill';
          tagSpan.textContent = tag.trim();
          modalTags.appendChild(tagSpan);
        }
      });
    }

    if (modalLive) modalLive.href = demo;
    if (modalRepo) modalRepo.href = repo;

    if (modal && typeof modal.showModal === 'function') {
      modal.showModal();
    }
  };

  projectCards.forEach((card) => {
    const thumbBox = card.querySelector('.project-thumbnail-box');
    const openBtn = card.querySelector('.open-details-btn');

    thumbBox?.addEventListener('click', () => openProjectModal(card));
    thumbBox?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openProjectModal(card);
      }
    });

    openBtn?.addEventListener('click', () => openProjectModal(card));
  });

  const closeProjectModal = () => {
    if (modal && typeof modal.close === 'function') {
      modal.close();
    }
  };

  modalCloseBtn?.addEventListener('click', closeProjectModal);

  // Close when clicking modal backdrop
  modal?.addEventListener('click', (e) => {
    const dialogDimensions = modal.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      closeProjectModal();
    }
  });

  // -------------------------------------------------------
  // 6. INTERACTIVE CONVERSATIONAL ASSISTANT
  // -------------------------------------------------------
  const chatUserInput = document.getElementById('chat-user-input');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const chatHistory = document.getElementById('chat-history');

  const sampleResponses = [
    "Vidya's primary technical stack includes TypeScript, React/Next.js, Python (FastAPI), Go, and AWS cloud infrastructures.",
    "Vidya has extensive experience building scalable microservices and distributed data pipelines handling over 10M+ daily API requests.",
    "Feel free to check out the GitHub repositories linked in the projects section or email Vidya directly for software engineering opportunities!",
    "Vidya specializes in clean architecture, automated testing suites, and high core web vital performance across production applications."
  ];

  const sendChatMessage = () => {
    const text = chatUserInput?.value.trim();
    if (!text || !chatHistory) return;

    const userDiv = document.createElement('div');
    userDiv.className = 'chat-msg user-msg';
    userDiv.innerHTML = `<div class="msg-bubble">${escapeHtml(text)}</div>`;
    chatHistory.appendChild(userDiv);
    chatUserInput.value = '';
    chatHistory.scrollTop = chatHistory.scrollHeight;

    setTimeout(() => {
      const botDiv = document.createElement('div');
      botDiv.className = 'chat-msg bot-msg';
      const randomReply = sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
      botDiv.innerHTML = `<div class="msg-bubble">${randomReply}</div>`;
      chatHistory.appendChild(botDiv);
      chatHistory.scrollTop = chatHistory.scrollHeight;
    }, 400);
  };

  chatSendBtn?.addEventListener('click', sendChatMessage);
  chatUserInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      sendChatMessage();
    }
  });

  function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }
});
