/* ==========================================================================
   قهوتنا | ملف الجافاسكريبت الرئيسي
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  const bodyEl = document.body;
  const headerEl = document.querySelector('.site-header');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');

  const savedTheme = localStorage.getItem('qahwatuna-theme');
  if (savedTheme) {
    bodyEl.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function () {
      const currentTheme = bodyEl.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      bodyEl.setAttribute('data-theme', newTheme);
      localStorage.setItem('qahwatuna-theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    themeIcon.classList.toggle('bi-sun-fill', theme === 'dark');
    themeIcon.classList.toggle('bi-moon-stars-fill', theme !== 'dark');
  }

  function updateHeaderState() {
    if (!headerEl) return;
    headerEl.classList.toggle('is-scrolled', window.scrollY > 12);
  }

  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });

  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    const visitDateEl = document.getElementById('visitDate');
    if (visitDateEl) {
      visitDateEl.min = new Date().toISOString().split('T')[0];
    }

    const fields = {
      fullName: { el: document.getElementById('fullName'), error: document.getElementById('fullNameError'), validate: validateName },
      phone: { el: document.getElementById('phone'), error: document.getElementById('phoneError'), validate: validatePhone },
      email: { el: document.getElementById('email'), error: document.getElementById('emailError'), validate: validateEmail },
      guests: { el: document.getElementById('guests'), error: document.getElementById('guestsError'), validate: validateGuests },
      visitDate: { el: document.getElementById('visitDate'), error: document.getElementById('visitDateError'), validate: validateVisitDate },
      visitTime: { el: document.getElementById('visitTime'), error: document.getElementById('visitTimeError'), validate: validateVisitTime },
      message: { el: document.getElementById('message'), error: document.getElementById('messageError'), validate: validateMessage }
    };

    Object.values(fields).forEach(function (field) {
      if (!field.el) return;
      field.el.addEventListener('blur', function () {
        checkField(field);
      });
      field.el.addEventListener('input', function () {
        if (field.el.classList.contains('is-invalid-custom') && field.validate(field.el.value)) {
          setFieldValid(field);
        }
      });
      field.el.addEventListener('change', function () {
        if (field.el.classList.contains('is-invalid-custom') && field.validate(field.el.value)) {
          setFieldValid(field);
        }
      });
    });

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      let isFormValid = true;
      Object.values(fields).forEach(function (field) {
        if (!checkField(field)) isFormValid = false;
      });

      const successMsg = document.getElementById('formSuccessMsg');

      if (isFormValid) {
        if (successMsg) successMsg.style.display = 'block';
        contactForm.reset();
        if (visitDateEl) visitDateEl.min = new Date().toISOString().split('T')[0];
        Object.values(fields).forEach(function (field) {
          if (field.el) field.el.classList.remove('is-invalid-custom');
        });
        setTimeout(function () {
          if (successMsg) successMsg.style.display = 'none';
        }, 5000);
      } else if (successMsg) {
        successMsg.style.display = 'none';
      }
    });

    function checkField(field) {
      if (!field.el) return true;
      const isValid = field.validate(field.el.value.trim());
      if (isValid) {
        setFieldValid(field);
      } else {
        setFieldInvalid(field);
      }
      return isValid;
    }

    function setFieldValid(field) {
      field.el.classList.remove('is-invalid-custom');
      if (field.error) field.error.style.display = 'none';
    }

    function setFieldInvalid(field) {
      field.el.classList.add('is-invalid-custom');
      if (field.error) field.error.style.display = 'block';
    }
  }

  function validateName(value) {
    return value.length >= 2;
  }

  function validatePhone(value) {
    const phoneRegex = /^(\+?\d{1,3}[- ]?)?\d{9,10}$/;
    return phoneRegex.test(value.replace(/\s/g, ''));
  }

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validateGuests(value) {
    const num = Number(value);
    return value !== '' && Number.isInteger(num) && num >= 1 && num <= 20;
  }

  function validateVisitDate(value) {
    if (!value) return false;
    const selected = new Date(value + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected >= today;
  }

  function validateVisitTime(value) {
    return value !== '';
  }

  function validateMessage(value) {
    return value.length >= 10;
  }

  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', function () {
      scrollTopBtn.classList.toggle('is-visible', window.scrollY > 350);
    }, { passive: true });

    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const filterButtons = document.querySelectorAll('.menu-filter-btn');
  const menuItems = document.querySelectorAll('.menu-item');
  const noResultsMsg = document.getElementById('noResultsMsg');

  if (filterButtons.length && menuItems.length) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterButtons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        const selectedCategory = btn.getAttribute('data-filter');
        let visibleCount = 0;

        menuItems.forEach(function (item) {
          const shouldShow = selectedCategory === 'all' || item.getAttribute('data-category') === selectedCategory;
          item.style.display = shouldShow ? '' : 'none';
          if (shouldShow) visibleCount++;
        });

        if (noResultsMsg) {
          noResultsMsg.classList.toggle('d-none', visibleCount > 0);
        }
      });
    });
  }

  const orderButtons = document.querySelectorAll('.btn-order[data-product]');
  const orderToast = document.getElementById('orderToast');
  const orderToastText = document.getElementById('orderToastText');
  let toastTimeout;

  if (orderButtons.length && orderToast) {
    orderButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const productName = btn.getAttribute('data-product') || 'المنتج';
        if (orderToastText) {
          orderToastText.textContent = 'تمت إضافة "' + productName + '" إلى طلبك';
        }
        orderToast.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(function () {
          orderToast.classList.remove('show');
        }, 2500);
      });
    });
  }

  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
