(function() {
  'use strict';

  window.__app = window.__app || {};

  var debounce = function(func, wait) {
    var timeout;
    return function() {
      var context = this;
      var args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        func.apply(context, args);
      }, wait);
    };
  };

  var throttle = function(func, limit) {
    var inThrottle;
    return function() {
      var args = arguments;
      var context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(function() {
          inThrottle = false;
        }, limit);
      }
    };
  };

  function initBurgerMenu() {
    if (window.__app.burgerInitialized) return;
    window.__app.burgerInitialized = true;

    var toggle = document.querySelector('.navbar-toggler');
    var collapse = document.querySelector('.navbar-collapse');
    var body = document.body;

    if (!toggle || !collapse) return;

    var isOpen = false;

    function openMenu() {
      if (isOpen) return;
      isOpen = true;
      collapse.classList.add('show');
      toggle.setAttribute('aria-expanded', 'true');
      body.classList.add('u-no-scroll');
    }

    function closeMenu() {
      if (!isOpen) return;
      isOpen = false;
      collapse.classList.remove('show');
      toggle.setAttribute('aria-expanded', 'false');
      body.classList.remove('u-no-scroll');
    }

    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && isOpen) {
        closeMenu();
      }
    });

    document.addEventListener('click', function(e) {
      if (isOpen && !collapse.contains(e.target) && !toggle.contains(e.target)) {
        closeMenu();
      }
    });

    var navLinks = document.querySelectorAll('.nav-link');
    for (var i = 0; i < navLinks.length; i++) {
      navLinks[i].addEventListener('click', function() {
        if (window.innerWidth < 1024) {
          closeMenu();
        }
      });
    }

    window.addEventListener('resize', debounce(function() {
      if (window.innerWidth >= 1024 && isOpen) {
        closeMenu();
      }
    }, 150));
  }

  function initSmoothScroll() {
    if (window.__app.smoothScrollInitialized) return;
    window.__app.smoothScrollInitialized = true;

    var isHomePage = window.location.pathname === '/' || window.location.pathname === '/index.html' || window.location.pathname.endsWith('/index.html');

    document.addEventListener('click', function(e) {
      var target = e.target;
      while (target && target.tagName !== 'A') {
        target = target.parentElement;
      }

      if (!target) return;

      var href = target.getAttribute('href');
      if (!href || !href.startsWith('#') || href === '#' || href === '#!') return;

      var targetId = href.substring(1);
      var targetElement = document.getElementById(targetId);

      if (targetElement && isHomePage) {
        e.preventDefault();

        var header = document.querySelector('.l-header');
        var headerHeight = header ? header.offsetHeight : 64;
        var targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  }

  function initScrollSpy() {
    if (window.__app.scrollSpyInitialized) return;
    window.__app.scrollSpyInitialized = true;

    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    if (sections.length === 0 || navLinks.length === 0) return;

    var observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    var currentActive = null;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          
          for (var i = 0; i < navLinks.length; i++) {
            var link = navLinks[i];
            var linkHref = link.getAttribute('href');
            
            if (linkHref === '#' + id) {
              if (currentActive && currentActive !== link) {
                currentActive.classList.remove('is-active', 'active');
                currentActive.removeAttribute('aria-current');
              }
              
              link.classList.add('is-active', 'active');
              link.setAttribute('aria-current', 'page');
              currentActive = link;
            }
          }
        }
      });
    }, observerOptions);

    for (var i = 0; i < sections.length; i++) {
      observer.observe(sections[i]);
    }
  }

  function initActiveMenu() {
    if (window.__app.activeMenuInitialized) return;
    window.__app.activeMenuInitialized = true;

    var currentPath = window.location.pathname;
    var navLinks = document.querySelectorAll('.nav-link:not([href^="#"])');

    for (var i = 0; i < navLinks.length; i++) {
      var link = navLinks[i];
      var linkHref = link.getAttribute('href');

      if (!linkHref) continue;

      var linkPath = linkHref.split('#')[0];
      var isMatch = false;

      if (linkPath === currentPath) {
        isMatch = true;
      } else if (currentPath === '/' && (linkPath === '/index.html' || linkPath === '')) {
        isMatch = true;
      } else if (linkPath && linkPath !== '/' && currentPath.indexOf(linkPath) === 0) {
        isMatch = true;
      }

      if (isMatch) {
        link.setAttribute('aria-current', 'page');
        link.classList.add('is-active', 'active');
      } else {
        link.removeAttribute('aria-current');
        link.classList.remove('is-active', 'active');
      }
    }
  }

  function initImages() {
    if (window.__app.imagesInitialized) return;
    window.__app.imagesInitialized = true;

    var images = document.querySelectorAll('img');

    for (var i = 0; i < images.length; i++) {
      var img = images[i];

      if (!img.hasAttribute('loading') && !img.classList.contains('c-logo__img')) {
        img.setAttribute('loading', 'lazy');
      }

      img.addEventListener('error', function(e) {
        var failedImg = e.target;
        var svgPlaceholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="18" font-family="sans-serif"%3EBild nicht verfügbar%3C/text%3E%3C/svg%3E';
        failedImg.src = svgPlaceholder;
      });
    }
  }

  function validateField(field) {
    var value = field.value.trim();
    var type = field.type;
    var id = field.id;
    var isValid = true;
    var errorMsg = '';

    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMsg = 'Dieses Feld ist erforderlich.';
    } else if (type === 'email' && value) {
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMsg = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
      }
    } else if (type === 'tel' && value) {
      var phoneRegex = /^[\d\s\+\(\)\-]{10,20}$/;
      if (!phoneRegex.test(value)) {
        isValid = false;
        errorMsg = 'Bitte geben Sie eine gültige Telefonnummer ein.';
      }
    } else if (field.tagName === 'TEXTAREA' && value && value.length < 10) {
      isValid = false;
      errorMsg = 'Die Nachricht muss mindestens 10 Zeichen lang sein.';
    } else if (type === 'text' && value && (id === 'firstName' || id === 'lastName' || id === 'fullName')) {
      var nameRegex = /^[a-zA-ZÀ-ÿ\s\-']{2,50}$/;
      if (!nameRegex.test(value)) {
        isValid = false;
        errorMsg = 'Bitte geben Sie einen gültigen Namen ein.';
      }
    } else if (type === 'checkbox' && field.hasAttribute('required') && !field.checked) {
      isValid = false;
      errorMsg = 'Sie müssen zustimmen, um fortzufahren.';
    }

    var feedbackEl = field.parentElement.querySelector('.invalid-feedback');
    if (!feedbackEl) {
      feedbackEl = document.createElement('div');
      feedbackEl.className = 'invalid-feedback';
      field.parentElement.appendChild(feedbackEl);
    }

    if (isValid) {
      field.classList.remove('is-invalid');
      field.classList.add('is-valid');
      feedbackEl.textContent = '';
    } else {
      field.classList.remove('is-valid');
      field.classList.add('is-invalid');
      feedbackEl.textContent = errorMsg;
    }

    return isValid;
  }

  function initForms() {
    if (window.__app.formsInitialized) return;
    window.__app.formsInitialized = true;

    var forms = document.querySelectorAll('form');

    window.__app.notify = function(message, type) {
      var container = document.getElementById('toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;max-width:320px;';
        document.body.appendChild(container);
      }

      var toast = document.createElement('div');
      toast.className = 'alert alert-' + (type || 'info') + ' alert-dismissible fade show';
      toast.setAttribute('role', 'alert');
      toast.innerHTML = message + '<button type="button" class="btn-close" onclick="this.parentElement.remove()" aria-label="Schließen" style="background:none;border:none;font-size:1.5rem;cursor:pointer;padding:0.5rem;">&times;</button>';
      container.appendChild(toast);

      setTimeout(function() {
        toast.classList.remove('show');
        setTimeout(function() {
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
          }
        }, 150);
      }, 5000);
    };

    for (var i = 0; i < forms.length; i++) {
      (function(form) {
        var fields = form.querySelectorAll('input, textarea, select');
        
        for (var j = 0; j < fields.length; j++) {
          (function(field) {
            field.addEventListener('blur', function() {
              if (form.classList.contains('was-validated')) {
                validateField(field);
              }
            });
          })(fields[j]);
        }

        form.addEventListener('submit', function(e) {
          e.preventDefault();
          e.stopPropagation();

          form.classList.add('was-validated');

          var allValid = true;
          var requiredFields = form.querySelectorAll('[required]');

          for (var k = 0; k < requiredFields.length; k++) {
            if (!validateField(requiredFields[k])) {
              allValid = false;
            }
          }

          if (!allValid) {
            window.__app.notify('Bitte füllen Sie alle erforderlichen Felder korrekt aus.', 'danger');
            return;
          }

          var submitBtn = form.querySelector('[type="submit"]');
          var originalText = '';

          if (submitBtn) {
            submitBtn.disabled = true;
            originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" style="width:1rem;height:1rem;border:2px solid currentColor;border-right-color:transparent;border-radius:50%;display:inline-block;animation:spinner-border 0.75s linear infinite;"></span>Wird gesendet...';
          }

          setTimeout(function() {
            window.__app.notify('Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.', 'success');
            
            setTimeout(function() {
              window.location.href = 'thank_you.html';
            }, 1500);
          }, 1000);
        });
      })(forms[i]);
    }
  }

  function initScrollToTop() {
    if (window.__app.scrollToTopInitialized) return;
    window.__app.scrollToTopInitialized = true;

    var scrollTopBtn = document.querySelector('.c-button[href="#top"]');
    
    if (!scrollTopBtn) {
      scrollTopBtn = document.createElement('button');
      scrollTopBtn.className = 'c-button c-button--primary';
      scrollTopBtn.setAttribute('aria-label', 'Nach oben scrollen');
      scrollTopBtn.innerHTML = '↑';
      scrollTopBtn.style.cssText = 'position:fixed;bottom:2rem;right:2rem;width:48px;height:48px;border-radius:50%;z-index:100;opacity:0;pointer-events:none;transition:opacity 0.3s;padding:0;';
      document.body.appendChild(scrollTopBtn);
    }

    var showButton = throttle(function() {
      if (window.pageYOffset > 300) {
        scrollTopBtn.style.opacity = '1';
        scrollTopBtn.style.pointerEvents = 'auto';
      } else {
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.pointerEvents = 'none';
      }
    }, 100);

    window.addEventListener('scroll', showButton);

    scrollTopBtn.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  function initCountUp() {
    if (window.__app.countUpInitialized) return;
    window.__app.countUpInitialized = true;

    var countElements = document.querySelectorAll('[data-count]');
    if (countElements.length === 0) return;

    var animated = [];

    function animateCount(el) {
      var target = parseInt(el.getAttribute('data-count'));
      var duration = 2000;
      var start = 0;
      var startTime = null;

      function update(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = timestamp - startTime;
        var percent = Math.min(progress / duration, 1);
        var current = Math.floor(start + (target - start) * percent);
        
        el.textContent = current.toLocaleString('de-DE');
        
        if (percent < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = target.toLocaleString('de-DE');
        }
      }

      requestAnimationFrame(update);
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var index = Array.prototype.indexOf.call(countElements, el);
          
          if (animated.indexOf(index) === -1) {
            animated.push(index);
            animateCount(el);
            observer.unobserve(el);
          }
        }
      });
    }, { threshold: 0.5 });

    for (var i = 0; i < countElements.length; i++) {
      observer.observe(countElements[i]);
    }
  }

  function initModals() {
    if (window.__app.modalsInitialized) return;
    window.__app.modalsInitialized = true;

    var privacyLinks = document.querySelectorAll('a[href*="privacy"]');
    
    for (var i = 0; i < privacyLinks.length; i++) {
      (function(link) {
        var href = link.getAttribute('href');
        if (href && (href.indexOf('privacy.html') > -1 || href.indexOf('#privacy') > -1)) {
          link.addEventListener('click', function(e) {
            var isExternal = href.indexOf('privacy.html') > -1;
            if (!isExternal) {
              e.preventDefault();
              window.location.href = 'privacy.html';
            }
          });
        }
      })(privacyLinks[i]);
    }
  }

  window.__app.init = function() {
    if (window.__app.initialized) return;
    window.__app.initialized = true;

    initBurgerMenu();
    initSmoothScroll();
    initScrollSpy();
    initActiveMenu();
    initImages();
    initForms();
    initScrollToTop();
    initCountUp();
    initModals();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.__app.init);
  } else {
    window.__app.init();
  }

})();
