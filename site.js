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
