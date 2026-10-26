<?php
// json.php — risposte JSON comuni a tutti gli endpoint in api/ (login.php, logout.php, ...).
// Va incluso per primo: da qui in poi anche un errore imprevisto (es. una query
// su una tabella mancante) arriva al browser come JSON e non come pagina HTML.

ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');

function rispondi_json(array $dati, int $codice = 200): void
{
    http_response_code($codice);
    echo json_encode($dati, JSON_UNESCAPED_UNICODE);
    exit;
}

set_exception_handler(function (Throwable $e) {
    error_log((string) $e); // il dettaglio resta nel log di PHP, non va all'utente
    rispondi_json(['successo' => false, 'errore' => 'Errore interno del server. Riprova più tardi.'], 500);
});
