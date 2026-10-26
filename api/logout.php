<?php
// logout.php — disconnette l'utente: svuota e distrugge la sessione PHP
// e cancella il cookie di sessione dal browser.
// Accetta solo POST, cosi' un semplice link o un'immagine esterna non possono
// disconnettere l'utente a sua insaputa.

require_once __DIR__ . '/../includes/json.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    rispondi_json(['successo' => false, 'errore' => 'Metodo non consentito.'], 405);
}

session_start();
$_SESSION = [];

if (ini_get('session.use_cookies')) {
    $p = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'], $p['secure'], $p['httponly']);
}

session_destroy();

rispondi_json(['successo' => true]);
