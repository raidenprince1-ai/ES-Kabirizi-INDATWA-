document.addEventListener('DOMContentLoaded', function () {
  const mobileNav = document.getElementById('mobile-nav');
  const menuBtn = document.getElementById('menu-btn');

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const msg = document.getElementById('form-msg');
      if (msg) {
        msg.textContent = 'Message sent successfully. The school can follow up using the contact details you provided.';
        msg.className = 'text-sm text-center text-green-700 font-medium';
        msg.classList.remove('hidden');
        setTimeout(function () {
          msg.classList.add('hidden');
        }, 4000);
      }
      contactForm.reset();
    });
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.scroll-reveal').forEach(function (el) {
    observer.observe(el);
  });

  const liveCounters = Array.from(document.querySelectorAll('.live-count'));
  if (liveCounters.length) {
    function animateCounter(counter) {
      const target = Number(counter.dataset.countTarget || 0);
      const suffix = counter.dataset.countSuffix || '';
      const duration = 1800;
      const startTime = performance.now();

      function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.round(target * eased) + suffix;
        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      }

      counter.dataset.counted = 'true';
      requestAnimationFrame(tick);
    }

    const countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && entry.target.dataset.counted !== 'true') {
          animateCounter(entry.target);
        }
      });
    }, { threshold: 0.4 });

    liveCounters.forEach(function (counter) {
      countObserver.observe(counter);
    });
  }

  const heroSlider = document.querySelector('[data-hero-slider]');
  if (heroSlider) {
    const heroSlides = Array.from(heroSlider.querySelectorAll('.hero-slide'));
    let heroIndex = Math.max(0, heroSlides.findIndex(function (slide) {
      return slide.classList.contains('is-active');
    }));

    setInterval(function () {
      if (!heroSlides.length) return;
      heroSlides[heroIndex].classList.remove('is-active');
      heroIndex = (heroIndex + 1) % heroSlides.length;
      heroSlides[heroIndex].classList.add('is-active');
    }, 4800);
  }

  const heroStage = document.querySelector('.hero-stage');
  const heroCopy = document.querySelector('.hero-copy');
  if (heroStage && heroCopy && window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) {
    heroStage.addEventListener('mousemove', function (event) {
      const rect = heroStage.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      heroCopy.style.transform = 'translate3d(' + (x * 10).toFixed(2) + 'px, ' + (y * -8).toFixed(2) + 'px, 0)';
    });

    heroStage.addEventListener('mouseleave', function () {
      heroCopy.style.transform = '';
    });
  }

  const videoModal = document.getElementById('video-modal');
  const videoOpen = document.querySelector('[data-video-open]');
  const videoClose = document.querySelector('[data-video-close]');
  const videoEl = document.getElementById('video-modal-video');
  if (videoModal && videoOpen) {
    videoOpen.addEventListener('click', function () {
      videoModal.classList.add('open');
      videoModal.setAttribute('aria-hidden', 'false');
      if (videoEl) {
        try { videoEl.currentTime = 0; } catch (e) {}
        videoEl.play().catch(function () {});
      }
    });

    function closeVideoModal() {
      if (videoEl) {
        try { videoEl.pause(); videoEl.currentTime = 0; } catch (e) {}
      }
      videoModal.classList.remove('open');
      videoModal.setAttribute('aria-hidden', 'true');
    }

    if (videoClose) {
      videoClose.addEventListener('click', closeVideoModal);
    }

    videoModal.addEventListener('click', function (event) {
      if (event.target === videoModal) {
        closeVideoModal();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeVideoModal();
      }
    });
  }

  if (!document.querySelector('.corner-actions')) {
    const cornerActions = document.createElement('div');
    cornerActions.className = 'corner-actions';
    cornerActions.innerHTML = [
      '<a class="corner-action-btn" href="index.html#registration" aria-label="Register now">',
      '<i data-lucide="user-plus" class="corner-action-icon"></i>',
      '<span>Register Now</span>',
      '</a>',
      '<a class="corner-action-btn corner-action-donate" href="index.html#donation-payment" aria-label="Donate now">',
      '<i data-lucide="hand-heart" class="corner-action-icon"></i>',
      '<span>Donate Now</span>',
      '</a>'
    ].join('');
    document.body.appendChild(cornerActions);
  }

  const slider = document.querySelector('[data-campus-slider]');
  if (slider) {
    const slides = Array.from(slider.querySelectorAll('.campus-slide'));
    const prevButton = document.querySelector('[data-slider-prev]');
    const nextButton = document.querySelector('[data-slider-next]');
    const dotsWrap = document.querySelector('[data-slider-dots]');
    let activeIndex = Math.max(0, slides.findIndex(function (slide) {
      return slide.classList.contains('is-active');
    }));
    let autoSlideTimer;

    function showSlide(index) {
      if (!slides.length) return;
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === activeIndex);
      });
      if (dotsWrap) {
        dotsWrap.querySelectorAll('.slider-dot').forEach(function (dot, dotIndex) {
          dot.classList.toggle('is-active', dotIndex === activeIndex);
        });
      }
    }

    function restartAutoSlide() {
      clearInterval(autoSlideTimer);
      autoSlideTimer = setInterval(function () {
        showSlide(activeIndex + 1);
      }, 4500);
    }

    if (dotsWrap) {
      slides.forEach(function (_, index) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'slider-dot';
        dot.setAttribute('aria-label', 'Show image ' + (index + 1));
        dot.addEventListener('click', function () {
          showSlide(index);
          restartAutoSlide();
        });
        dotsWrap.appendChild(dot);
      });
    }

    if (prevButton) {
      prevButton.addEventListener('click', function () {
        showSlide(activeIndex - 1);
        restartAutoSlide();
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', function () {
        showSlide(activeIndex + 1);
        restartAutoSlide();
      });
    }

    showSlide(activeIndex);
    restartAutoSlide();
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }
});

window.addEventListener('load', function () {
  const loader = document.getElementById('page-loader');
  if (loader) {
    loader.classList.add('hidden');
    setTimeout(function () {
      loader.remove();
    }, 500);
  }
});

/* Image modal viewer: open image on click, navigate with arrows, close with click or Escape */
(function () {
  var modal = null;
  var modalImg = null;
  var zoomableImages = [];
  var currentIndex = 0;

  function showModal(index) {
    if (!modal || !modalImg || !zoomableImages.length) return;
    currentIndex = (index + zoomableImages.length) % zoomableImages.length;
    var target = zoomableImages[currentIndex];
    modalImg.src = target.src;
    modalImg.alt = target.alt || '';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  function showNext() {
    showModal(currentIndex + 1);
  }

  function showPrev() {
    showModal(currentIndex - 1);
  }

  document.addEventListener('DOMContentLoaded', function () {
    modal = document.getElementById('img-modal');
    modalImg = document.getElementById('img-modal-img');
    zoomableImages = Array.from(document.querySelectorAll('.zoomable'));

    zoomableImages.forEach(function (img, index) {
      img.addEventListener('click', function () {
        showModal(index);
      });
    });

    if (!modal) return;

    modal.addEventListener('click', function (e) {
      if (e.target === modal || e.target.classList.contains('img-modal-close')) {
        closeModal();
      }
    });

    var nextButton = modal.querySelector('.img-modal-next');
    var prevButton = modal.querySelector('.img-modal-prev');
    if (nextButton) nextButton.addEventListener('click', function (e) {
      e.stopPropagation();
      showNext();
    });
    if (prevButton) prevButton.addEventListener('click', function (e) {
      e.stopPropagation();
      showPrev();
    });

    document.addEventListener('keydown', function (e) {
      if (!modal.classList.contains('open')) return;
      if (e.key === 'Escape') {
        closeModal();
      }
      if (e.key === 'ArrowRight') {
        showNext();
      }
      if (e.key === 'ArrowLeft') {
        showPrev();
      }
    });
  });
})();

/* Admin panel behavior */
const db = {
  students: "kabiriziStudents",
  teachers: "kabiriziTeachers",
  users: "kabiriziUsers",
  donations: "kabiriziDonations",
  gallery: "kabiriziGallery",
  news: "kabiriziNews",
  babyeyi: "kabiriziBabyeyi",
  admin: "kabiriziAdmin"
};

const defaults = {
  students: [
    { name: "Maya Chen", className: "Senior 4", status: "Present" },
    { name: "Ari Patel", className: "Senior 2", status: "Present" },
    { name: "Leah Brooks", className: "Senior 5", status: "Absent" }
  ],
  teachers: [
    { name: "Mr. Hakizimana", subject: "Mathematics", contact: "math@kabirizi.edu" },
    { name: "Ms. Uwase", subject: "Biology", contact: "biology@kabirizi.edu" },
    { name: "Mr. Niyonsenga", subject: "History", contact: "history@kabirizi.edu" }
  ],
  users: [],
  donations: [],
  gallery: [],
  news: [
    { category: "Academics", title: "Senior students earn regional science honors", date: "2026-05-06" },
    { category: "Arts", title: "Spring concert brings choir, strings, and jazz together", date: "2026-04-29" },
    { category: "Community", title: "Families collect 3,000 books for local reading program", date: "2026-04-18" }
  ],
  babyeyi: [
    { name: "Parent Committee", student: "All classes", phone: "+250 780 000 000", message: "Supports school-family communication" }
  ]
};

const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "\"": "&quot;",
  "'": "&#039;"
}[char]));

const readData = (key, fallback = []) => {
  const stored = localStorage.getItem(key);
  if (!stored) return fallback;
  try {
    return JSON.parse(stored);
  } catch {
    return fallback;
  }
};

const writeData = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const ensureData = () => {
  Object.entries(defaults).forEach(([name, value]) => {
    if (!localStorage.getItem(db[name])) writeData(db[name], value);
  });
};

ensureData();

const adminPage = document.querySelector("[data-admin-page]");
const logoutButton = document.querySelector("[data-logout]");
const announcementForm = document.querySelector("[data-announcement-form]");
const adminNote = document.querySelector("[data-admin-note]");

const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

if (adminPage && sessionStorage.getItem(db.admin) !== "true") {
  window.location.href = "login.html";
}

logoutButton?.addEventListener("click", () => {
  sessionStorage.removeItem(db.admin);
  window.location.href = "login.html";
});

announcementForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  announcementForm.reset();
  adminNote.textContent = "Announcement saved for review.";
});

const rowButton = (index, type) => `<button class="mini-button" type="button" data-delete-${type}="${index}">Delete</button>`;

const renderAdmin = () => {
  if (!adminPage) return;
  const students = readData(db.students);
  const teachers = readData(db.teachers);
  const donations = readData(db.donations);
  const users = readData(db.users);
  const news = readData(db.news);
  const gallery = readData(db.gallery);
  const babyeyi = readData(db.babyeyi);

  document.querySelector("[data-admin-students]").innerHTML = students.map((student, index) => `<tr><td>${escapeHtml(student.name)}</td><td>${escapeHtml(student.className)}</td><td>${escapeHtml(student.status)}</td><td>${rowButton(index, "student")}</td></tr>`).join("");
  document.querySelector("[data-admin-teachers]").innerHTML = teachers.map((teacher, index) => `<tr><td>${escapeHtml(teacher.name)}</td><td>${escapeHtml(teacher.subject)}</td><td>${escapeHtml(teacher.contact || "")}</td><td>${rowButton(index, "teacher")}</td></tr>`).join("");
  document.querySelector("[data-admin-donations]").innerHTML = donations.map((donation) => `<tr><td>${escapeHtml(donation.name)}</td><td>$${Number(donation.amount || 0).toLocaleString()}</td><td>${escapeHtml(donation.purpose)}</td></tr>`).join("");
  document.querySelector("[data-admin-accounts]").innerHTML = users.map((user) => `<tr><td>${escapeHtml(user.name)}</td><td>${escapeHtml(user.email)}</td><td>${escapeHtml(user.role)}</td></tr>`).join("");
  document.querySelector("[data-admin-news]").innerHTML = news.map((item, index) => `<tr><td>${escapeHtml(item.category)}</td><td>${escapeHtml(item.title)}</td><td>${escapeHtml(item.date)}</td><td>${rowButton(index, "news")}</td></tr>`).join("");
  document.querySelector("[data-admin-babyeyi]").innerHTML = babyeyi.map((item, index) => {
    const attachmentLabel = item.attachment ? escapeHtml(item.attachment.name) : "â€”";
    return `<tr><td>${escapeHtml(item.name)}</td><td>${escapeHtml(item.student)}</td><td>${escapeHtml(item.phone)}</td><td>${attachmentLabel}</td><td>${rowButton(index, "babyeyi")}</td></tr>`;
  }).join("");
  document.querySelector("[data-admin-gallery]").innerHTML = gallery.map((item, index) => `<article><img src="${item.src}" alt="${escapeHtml(item.title)}"><div><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.caption || "")}</span></div>${rowButton(index, "gallery")}</article>`).join("");
};

document.querySelector("[data-student-form]")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const students = readData(db.students);
  students.push({ name: String(formData.get("name")).trim(), className: String(formData.get("className")).trim(), status: String(formData.get("status")) });
  writeData(db.students, students);
  event.currentTarget.reset();
  renderAdmin();
});

document.querySelector("[data-teacher-form]")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const teachers = readData(db.teachers);
  teachers.push({ name: String(formData.get("name")).trim(), subject: String(formData.get("subject")).trim(), contact: String(formData.get("contact")).trim() });
  writeData(db.teachers, teachers);
  event.currentTarget.reset();
  renderAdmin();
});

document.querySelector("[data-news-form]")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const news = readData(db.news);
  news.unshift({ category: String(formData.get("category")).trim(), title: String(formData.get("title")).trim(), date: String(formData.get("date")) });
  writeData(db.news, news);
  event.currentTarget.reset();
  renderAdmin();
});

document.querySelector("[data-babyeyi-form]")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const file = formData.get("attachment");
  const attachment = file instanceof File && file.size
    ? { name: String(file.name), type: file.type, src: await readFileAsDataUrl(file) }
    : null;
  const babyeyi = readData(db.babyeyi);
  babyeyi.unshift({
    name: String(formData.get("name")).trim(),
    student: String(formData.get("student")).trim(),
    phone: String(formData.get("phone")).trim(),
    message: String(formData.get("message")).trim(),
    attachment,
    date: new Date().toISOString()
  });
  writeData(db.babyeyi, babyeyi);
  event.currentTarget.reset();
  renderAdmin();
});

document.querySelector("[data-gallery-form]")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const file = formData.get("image");
  if (!(file instanceof File) || !file.size) return;
  const gallery = readData(db.gallery);
  gallery.unshift({
    title: String(formData.get("title")).trim(),
    caption: String(formData.get("caption")).trim(),
    src: await readFileAsDataUrl(file)
  });
  writeData(db.gallery, gallery);
  event.currentTarget.reset();
  renderAdmin();
});

document.addEventListener("click", (event) => {
  [
    ["student", db.students],
    ["teacher", db.teachers],
    ["news", db.news],
    ["babyeyi", db.babyeyi],
    ["gallery", db.gallery]
  ].forEach(([type, key]) => {
    const button = event.target.closest(`[data-delete-${type}]`);
    if (!button) return;
    const items = readData(key);
    items.splice(Number(button.dataset[`delete${type[0].toUpperCase()}${type.slice(1)}`]), 1);
    writeData(key, items);
    renderAdmin();
  });
});

document.querySelector("[data-clear-students]")?.addEventListener("click", () => { writeData(db.students, []); renderAdmin(); });
document.querySelector("[data-clear-teachers]")?.addEventListener("click", () => { writeData(db.teachers, []); renderAdmin(); });
document.querySelector("[data-clear-news]")?.addEventListener("click", () => { writeData(db.news, []); renderAdmin(); });
document.querySelector("[data-clear-babyeyi]")?.addEventListener("click", () => { writeData(db.babyeyi, []); renderAdmin(); });
document.querySelector("[data-clear-gallery]")?.addEventListener("click", () => { writeData(db.gallery, []); renderAdmin(); });

renderAdmin();


/* Page-specific behavior moved out of inline scripts */
document.addEventListener('DOMContentLoaded', function () {
  const studentLoginForm = document.getElementById('student-login-form');
  if (studentLoginForm) {
    studentLoginForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const msg = document.getElementById('student-login-message');
      const password = document.getElementById('student-password');
      const enteredPassword = password ? password.value.trim() : '';
      const adminKey = 'kabiriziAdmin';
      const adminPassword = 'kabirizi2026';

      if (enteredPassword === adminPassword) {
        sessionStorage.setItem(adminKey, 'true');
        if (msg) {
          msg.textContent = 'Success. Opening the admin panel...';
          msg.className = 'text-sm text-center text-green-700 font-medium';
          msg.classList.remove('hidden');
        }
        setTimeout(function () {
          window.location.href = 'admin.html';
        }, 650);
        return;
      }

      if (msg) {
        msg.textContent = 'Invalid admin password. Please try again.';
        msg.className = 'text-sm text-center text-red-700 font-medium';
        msg.classList.remove('hidden');
      }
    });
  }

  const newsList = document.getElementById('newsList');
  const newsCount = document.getElementById('newsCount');
  if (newsList && newsCount) {
    const localNewsKey = 'esKabiriziAdminPosts';

    function formatTime(value) {
      if (!value) return 'Just now';
      const date = value.toDate ? value.toDate() : new Date(value);
      return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    }

    function renderNewsItem(data) {
      const article = document.createElement('article');
      article.className = 'rounded-2xl bg-white border border-slate-100 p-5 shadow-sm';

      const meta = document.createElement('p');
      meta.className = 'text-xs font-bold uppercase tracking-[0.14em] text-[var(--gold)]';
      meta.textContent = formatTime(data.date || data.time);

      const heading = document.createElement('h3');
      heading.className = 'font-heading text-2xl text-[var(--navy)] mt-2';
      heading.textContent = data.title || 'Untitled news';

      const content = document.createElement('p');
      content.className = 'text-[var(--muted)] leading-relaxed mt-3 whitespace-pre-line';
      content.textContent = data.body || data.content || '';

      article.append(meta, heading, content);
      return article;
    }

    function readLocalNews() {
      try {
        return JSON.parse(localStorage.getItem(localNewsKey)) || [];
      } catch (error) {
        return [];
      }
    }

    const posts = readLocalNews();
    newsList.innerHTML = '';
    newsCount.textContent = posts.length === 1 ? '1 update' : posts.length + ' updates';
    if (!posts.length) {
      const empty = document.createElement('div');
      empty.className = 'rounded-2xl bg-white border border-slate-100 p-5 text-sm text-[var(--muted)]';
      empty.textContent = 'No news has been posted yet.';
      newsList.appendChild(empty);
      return;
    }
    posts.forEach(function (post) {
      newsList.appendChild(renderNewsItem(post));
    });
  }
});
