(function () {
  var header = document.querySelector('.dr-header');
  if (!header) return;

  var burger = header.querySelector('.dr-header-burger');
  var navList = header.querySelector('#dr-header-nav-links');
  if (!burger || !navList) return;

  var isMobile = function () {
    return window.matchMedia('(max-width: 768px)').matches;
  };

  var collapseClass = 'dr-is-collapsed';

  var setInitialState = function () {
    if (isMobile()) {
      navList.classList.add(collapseClass);
      burger.setAttribute('aria-expanded', 'false');
      burger.classList.remove('dr-is-open');
    } else {
      navList.classList.remove(collapseClass);
      burger.setAttribute('aria-expanded', 'false');
      burger.classList.remove('dr-is-open');
    }
  };

  setInitialState();

  burger.addEventListener('click', function () {
    var isCollapsed = navList.classList.contains(collapseClass);
    if (isCollapsed) {
      navList.classList.remove(collapseClass);
      burger.setAttribute('aria-expanded', 'true');
      burger.classList.add('dr-is-open');
    } else {
      navList.classList.add(collapseClass);
      burger.setAttribute('aria-expanded', 'false');
      burger.classList.remove('dr-is-open');
    }
  });

  window.addEventListener('resize', function () {
    setInitialState();
  });
})();
