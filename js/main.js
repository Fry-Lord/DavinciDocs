(function(){
  var menuBtn = document.getElementById('menuBtn');
  var dropdown = document.getElementById('menuDropdown');
  var loginItem = document.getElementById('loginItem');
  var logoutItem = document.getElementById('logoutItem');
  var topbarUsername = document.getElementById('topbarUsername');
  var usernameFull = document.getElementById('usernameFull');
  var usernameInitials = document.getElementById('usernameInitials');
  var heroLoginBtn = document.querySelector('.hero-cta .btn-primary');
  var exploreBtn = document.getElementById('exploreBtn');
  var exploreBtnTestoBase = exploreBtn ? exploreBtn.textContent : '';

  function getInitials(name){
    return name.split(' ').map(function(p){ return p.charAt(0).toUpperCase(); }).join('');
  }

  function setMenuOpen(open){
    dropdown.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  // true quando un utente ha effettuato il login; usato anche dal pulsante dell'hero
  var collegato = false;

  // aggiornano topbar e menu dopo login, logout o al caricamento della pagina
  function mostraUtente(nome, cognome){
    collegato = true;
    var nomeCompleto = nome + ' ' + cognome;
    loginItem.textContent = nomeCompleto;
    loginItem.classList.add('user');
    logoutItem.hidden = false;
    usernameFull.textContent = nomeCompleto;
    usernameInitials.textContent = getInitials(nomeCompleto);
    topbarUsername.hidden = false;
    if (heroLoginBtn) {
      heroLoginBtn.textContent = 'Carica materiali';
      heroLoginBtn.classList.add('carica');
    }
    if (exploreBtn) {
      exploreBtn.textContent = 'Ciao ' + nome + ', esplora i materiali';
    }
  }
  function mostraOspite(){
    collegato = false;
    loginItem.textContent = 'Login';
    loginItem.classList.remove('user');
    logoutItem.hidden = true;
    topbarUsername.hidden = true;
    usernameFull.textContent = '';
    usernameInitials.textContent = '';
    if (heroLoginBtn) {
      heroLoginBtn.textContent = 'Accedi';
      heroLoginBtn.classList.remove('carica');
    }
    if (exploreBtn) {
      exploreBtn.textContent = exploreBtnTestoBase;
    }
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

  loginItem.addEventListener('click', function(e){
    // da loggato e' un link vuoto (#), come il nome nella topbar: per ora
    // non apre piu' la finestra di login.
    if (collegato) return;
    e.preventDefault();
    openModal();
  });
  if (heroLoginBtn) {
    heroLoginBtn.addEventListener('click', function(e){
      // da loggato il pulsante è "Carica materiali": in attesa della pagina
      // vera (sezione 6.6) resta un link vuoto, come "Esplora i materiali".
      if (collegato) return;
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
