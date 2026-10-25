(function(){
  var menuBtn = document.getElementById('menuBtn');
  var dropdown = document.getElementById('menuDropdown');
  var loginItem = document.getElementById('loginItem');
  var logoutItem = document.getElementById('logoutItem');
  var topbarUsername = document.getElementById('topbarUsername');
  var usernameFull = document.getElementById('usernameFull');
  var usernameInitials = document.getElementById('usernameInitials');

  function getInitials(name){
    return name.split(' ').map(function(p){ return p.charAt(0).toUpperCase(); }).join('');
  }

  function setMenuOpen(open){
    dropdown.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  menuBtn.addEventListener('click', function(e){
    e.stopPropagation();
    setMenuOpen(!dropdown.classList.contains('open'));
  });
  document.addEventListener('click', function(e){
    if (!e.target.closest('.menu-wrap')) setMenuOpen(false);
  });

  logoutItem.addEventListener('click', function(){
    loginItem.textContent = 'Login';
    loginItem.classList.remove('user');
    logoutItem.hidden = true;
    topbarUsername.hidden = true;
    usernameFull.textContent = '';
    usernameInitials.textContent = '';
    setMenuOpen(false);
  });

  // ===== Login modal =====
  var backdrop = document.getElementById('loginBackdrop');
  var modalClose = document.getElementById('modalClose');
  var authForm = document.getElementById('authForm');
  var heroLoginBtn = document.querySelector('.hero-cta .btn-primary');

  function openModal(){
    backdrop.classList.add('open');
    setMenuOpen(false);
  }
  function closeModal(){
    backdrop.classList.remove('open');
  }

  loginItem.addEventListener('click', function(){
    openModal();
  });
  if (heroLoginBtn) {
    heroLoginBtn.addEventListener('click', function(e){
      e.preventDefault();
      openModal();
    });
  }
  modalClose.addEventListener('click', closeModal);
  backdrop.addEventListener('click', function(e){
    if (e.target === backdrop) closeModal();
  });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape') closeModal();
  });
  authForm.addEventListener('submit', function(e){
    e.preventDefault();
    loginItem.textContent = 'Maurizio Minissale';
    loginItem.classList.add('user');
    logoutItem.hidden = false;
    usernameFull.textContent = 'Maurizio Minissale';
    usernameInitials.textContent = getInitials('Maurizio Minissale');
    topbarUsername.hidden = false;
    closeModal();
  });
})();
