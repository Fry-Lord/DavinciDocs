<?php
// config.php — connessione al database (PDO)

$db_host = 'localhost';
$db_name = 'davincidocs';
$db_user = 'root';
$db_pass = 'root';

try {
    $pdo = new PDO(
        "mysql:host={$db_host};dbname={$db_name};charset=utf8mb4",
        $db_user,
        $db_pass,
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['successo' => false, 'errore' => 'Connessione al database non riuscita.']);
    exit;
}
