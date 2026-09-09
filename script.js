/* ==========================================================================
   قهوتنا | ملف الجافاسكريبت الرئيسي
   يحتوي على:
   1) تبديل الوضع الليلي/النهاري (Dark/Light Mode) + الحفظ في localStorage
   2) التحقق من صحة نموذج التواصل (Form Validation)
   3) زر العودة لأعلى الصفحة (Scroll to Top)
   4) تصفية وطلب المنتجات في صفحة القائمة (menu.html)
   5) تحديث سنة حقوق النشر تلقائيًا
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ------------------------------------------------------------------
     1) تبديل الوضع الليلي / النهاري
     ------------------------------------------------------------------ */
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const bodyEl = document.body;

  // استرجاع الوضع المحفوظ مسبقًا من التخزين المحلي (إن وُجد)
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

  // تغيير أيقونة الزر حسب الوضع الحالي (قمر للوضع النهاري، شمس للوضع الليلي)
  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    if (theme === 'dark') {
      themeIcon.classList.remove('bi-moon-stars-fill');
      themeIcon.classList.add('bi-sun-fill');
    } else {
      themeIcon.classList.remove('bi-sun-fill');
      themeIcon.classList.add('bi-moon-stars-fill');
    }
  }


  /* ------------------------------------------------------------------
     2) التحقق من صحة نموذج التواصل (Form Validation)
     ------------------------------------------------------------------ */
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    const fields = {
      fullName: { el: document.getElementById('fullName'), error: document.getElementById('fullNameError'), validate: validateName },
      phone: { el: document.getElementById('phone'), error: document.getElementById('phoneError'), validate: validatePhone },
      email: { el: document.getElementById('email'), error: document.getElementById('emailError'), validate: validateEmail },
      guests: { el: document.getElementById('guests'), error: document.getElementById('guestsError'), validate: validateGuests },
      message: { el: document.getElementById('message'), error: document.getElementById('messageError'), validate: validateMessage }
    };

    // التحقق الفوري أثناء الكتابة/الخروج من الحقل
    Object.values(fields).forEach(function (field) {
      if (!field.el) return;
      field.el.addEventListener('blur', function () {
        checkField(field);
      });
      field.el.addEventListener('input', function () {
        // إزالة رسالة الخطأ فور تصحيح المستخدم للبيانات
        if (field.el.classList.contains('is-invalid-custom') && field.validate(field.el.value)) {
          setFieldValid(field);
        }
      });
    });

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      let isFormValid = true;
      Object.values(fields).forEach(function (field) {
        const fieldIsValid = checkField(field);
        if (!fieldIsValid) isFormValid = false;
      });

      const successMsg = document.getElementById('formSuccessMsg');

      if (isFormValid) {
        // في حال نجاح التحقق: إظهار رسالة النجاح وإعادة تعيين النموذج
        if (successMsg) {
          successMsg.style.display = 'block';
        }
        contactForm.reset();
        Object.values(fields).forEach(function (field) {
          if (field.el) field.el.classList.remove('is-invalid-custom');
        });

        // إخفاء رسالة النجاح تلقائيًا بعد 5 ثوانٍ
        setTimeout(function () {
          if (successMsg) successMsg.style.display = 'none';
        }, 5000);
      } else if (successMsg) {
        successMsg.style.display = 'none';
      }
    });

    function checkField(field) {
      if (!field.el) return true;
      const value = field.el.value.trim();
      const isValid = field.validate(value);

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

  // دوال التحقق من كل حقل على حدة
  function validateName(value) {
    return value.length >= 2;
  }

  function validatePhone(value) {
    // يقبل أرقام جوال سعودية/عربية مكوّنة من 9 إلى 10 أرقام، مع أو بدون رمز الدولة
    const phoneRegex = /^(\+?\d{1,3}[- ]?)?\d{9,10}$/;
    return phoneRegex.test(value.replace(/\s/g, ''));
  }

  function validateEmail(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }

  function validateGuests(value) {
    const num = Number(value);
    return value !== '' && Number.isInteger(num) && num >= 1 && num <= 20;
  }

  function validateMessage(value) {
    return value.length >= 10;
  }


  /* ------------------------------------------------------------------
     3) زر العودة لأعلى الصفحة (Scroll to Top)
     ------------------------------------------------------------------ */
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  if (scrollTopBtn) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 350) {
        scrollTopBtn.classList.add('is-visible');
      } else {
        scrollTopBtn.classList.remove('is-visible');
      }
    });

    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ------------------------------------------------------------------
     4) تصفية وطلب المنتجات (خاص بصفحة menu.html)
     ------------------------------------------------------------------ */
  const filterButtons = document.querySelectorAll('.menu-filter-btn');
  const menuItems = document.querySelectorAll('.menu-item');
  const noResultsMsg = document.getElementById('noResultsMsg');

  if (filterButtons.length && menuItems.length) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        // تحديث الزر النشط بصريًا
        filterButtons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        const selectedCategory = btn.getAttribute('data-filter');
        let visibleCount = 0;

        menuItems.forEach(function (item) {
          const itemCategory = item.getAttribute('data-category');
          const shouldShow = selectedCategory === 'all' || itemCategory === selectedCategory;
          item.style.display = shouldShow ? '' : 'none';
          if (shouldShow) visibleCount++;
        });

        if (noResultsMsg) {
          noResultsMsg.classList.toggle('d-none', visibleCount > 0);
        }
      });
    });
  }

  // زر "اطلب الآن": إظهار إشعار تأكيد بسيط للمستخدم
  const orderButtons = document.querySelectorAll('.btn-order');
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


  /* ------------------------------------------------------------------
     5) تحديث سنة حقوق النشر تلقائيًا في التذييل
     ------------------------------------------------------------------ */
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

});
