<?php
// login.php — verifica le credenziali (email + password) e apre la sessione.
// VERSIONE 1 (sezione 5.2 del documento di riferimento): confronto diretto
// della password in chiaro. NON sicura — da sostituire con la versione a hash
// (sezione 5.3) prima di qualsiasi uso reale.

require_once __DIR__ . '/../includes/json.php';
session_start();
require_once __DIR__ . '/../includes/config.php';

$dati = $_POST;
if (empty($dati)) {
    $corpo = json_decode(file_get_contents('php://input'), true);
    if (is_array($corpo)) {
        $dati = $corpo;
    }
}

$email    = trim($dati['email'] ?? '');
$password = $dati['password'] ?? '';

if ($email === '' || $password === '') {
    rispondi_json(['successo' => false, 'errore' => 'Inserisci email e password.']);
}

$stmt = $pdo->prepare(
    'SELECT u.id, u.nome, u.cognome, u.tipo_utente
     FROM CREDENZIALI c
     JOIN UTENTE u ON u.id = c.utente_id
     WHERE c.username = :username AND c.password = :password'
);
$stmt->execute(['username' => $email, 'password' => $password]);
$riga = $stmt->fetch();

if (!$riga) {
    rispondi_json(['successo' => false, 'errore' => 'Email o password non corrette.']);
}

$_SESSION['utente_id']   = $riga['id'];
$_SESSION['nome']        = $riga['nome'];
$_SESSION['cognome']     = $riga['cognome'];
$_SESSION['tipo_utente'] = $riga['tipo_utente'];

rispondi_json([
    'successo'    => true,
    'nome'        => $riga['nome'],
    'cognome'     => $riga['cognome'],
    'tipo_utente' => $riga['tipo_utente'],
]);
