<?php
// sessione.php — dice alla pagina se c'e' gia' un utente collegato.
// home.html lo chiama a ogni caricamento: cosi' ricaricando la pagina
// l'utente resta collegato finche' la sessione PHP e' aperta.

require_once __DIR__ . '/../includes/json.php';

// Nessun cookie di sessione: e' un visitatore, inutile aprire una sessione vuota.
if (!isset($_COOKIE[session_name()])) {
    rispondi_json(['successo' => true, 'collegato' => false]);
}

session_start();
session_write_close(); // qui la sessione si legge soltanto

if (empty($_SESSION['utente_id'])) {
    rispondi_json(['successo' => true, 'collegato' => false]);
}

rispondi_json([
    'successo'    => true,
    'collegato'   => true,
    'nome'        => $_SESSION['nome'],
    'cognome'     => $_SESSION['cognome'],
    'tipo_utente' => $_SESSION['tipo_utente'],
]);
