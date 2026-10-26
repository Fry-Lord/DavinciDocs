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

  // aggiornano topbar e menu dopo login, logout o al caricamento della pagina
  function mostraUtente(nome, cognome){
    var nomeCompleto = nome + ' ' + cognome;
    loginItem.textContent = nomeCompleto;
    loginItem.classList.add('user');
    logoutItem.hidden = false;
    usernameFull.textContent = nomeCompleto;
    usernameInitials.textContent = getInitials(nomeCompleto);
    topbarUsername.hidden = false;
  }
  function mostraOspite(){
    loginItem.textContent = 'Login';
    loginItem.classList.remove('user');
    logoutItem.hidden = true;
    topbarUsername.hidden = true;
    usernameFull.textContent = '';
    usernameInitials.textContent = '';
  }

  // al caricamento: se la sessione PHP e' ancora aperta, l'utente resta collegato
  fetch('api/sessione.php')
    .then(function(risposta){ return risposta.json(); })
    .then(function(dati){
      if (dati.collegato) mostraUtente(dati.nome, dati.cognome);
    })
    .catch(function(){
      console.error('Verifica della sessione non riuscita: server non raggiungibile.');
    });

  menuBtn.addEventListener('click', function(e){
    e.stopPropagation();
    setMenuOpen(!dropdown.classList.contains('open'));
  });
  document.addEventListener('click', function(e){
    if (!e.target.closest('.menu-wrap')) setMenuOpen(false);
  });

  logoutItem.addEventListener('click', function(){
    fetch('api/logout.php', { method: 'POST' })
      .then(function(risposta){ return risposta.json(); })
      .then(function(dati){
        if (!dati.successo) return;
        mostraOspite();
        setMenuOpen(false);
      })
      .catch(function(){
        console.error('Logout non riuscito: server non raggiungibile.');
      });
  });

  // ===== Login modal =====
  var backdrop = document.getElementById('loginBackdrop');
  var modalClose = document.getElementById('modalClose');
  var authForm = document.getElementById('authForm');
  var heroLoginBtn = document.querySelector('.hero-cta .btn-primary');
  var passwordInput = document.getElementById('authPassword');
  var togglePassword = document.getElementById('togglePassword');
  var togglePasswordIcon = togglePassword.querySelector('img');

  function setPasswordVisible(visible){
    passwordInput.type = visible ? 'text' : 'password';
    togglePasswordIcon.src = visible ? 'img/icon-eye-off.svg' : 'img/icon-eye.svg';
    togglePassword.setAttribute('aria-label', visible ? 'Nascondi password' : 'Mostra password');
    togglePassword.setAttribute('aria-pressed', visible ? 'true' : 'false');
  }
  togglePassword.addEventListener('click', function(){
    setPasswordVisible(passwordInput.type === 'password');
    passwordInput.focus();
  });

  function openModal(){
    backdrop.classList.add('open');
    setMenuOpen(false);
  }
  function closeModal(){
    backdrop.classList.remove('open');
    setPasswordVisible(false);
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
    var email = document.getElementById('authEmail').value;
    var password = document.getElementById('authPassword').value;
    var errorEl = document.getElementById('authError');
    var submitBtn = document.getElementById('authSubmit');

    submitBtn.disabled = true;
    fetch('api/login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'email=' + encodeURIComponent(email) + '&password=' + encodeURIComponent(password)
    })
      .then(function(risposta){ return risposta.json(); })
      .then(function(dati){
        if (!dati.successo) {
          errorEl.textContent = dati.errore;
          errorEl.hidden = false;
          return;
        }
        errorEl.hidden = true;
        mostraUtente(dati.nome, dati.cognome);
        closeModal();
      })
      .catch(function(){
        errorEl.textContent = 'Errore di connessione al server.';
        errorEl.hidden = false;
      })
      .finally(function(){
        submitBtn.disabled = false;
      });
  });
})();
