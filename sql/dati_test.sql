-- ============================================================
-- DaVinciDocs — Dati di test (utenti e credenziali)
-- Da eseguire in phpMyAdmin DOPO sql/davincidocs.sql, sullo
-- stesso database: serve a ripopolarlo ogni volta che la cartella
-- del sito viene scaricata da git (il database non è nel repository).
--
-- Rieseguibile: usa INSERT IGNORE, quindi rilanciarlo su un database
-- già popolato non crea righe duplicate (il confronto è su
-- UTENTE.email e su CREDENZIALI.username, entrambi UNIQUE/PRIMARY KEY).
--
-- Le password sono salvate in chiaro, coerenti con la versione 5.2
-- (NON sicura) di login.php attualmente in uso — vedi sezione 5.2 del
-- documento di riferimento. Passando alla versione con hash (5.3),
-- queste righe vanno rigenerate con password_hash().
-- ============================================================

USE davincidocs;

INSERT IGNORE INTO UTENTE (nome, cognome, email, tipo_utente, tempo_indeterminato) VALUES
('Maurizio',  'Minissale',  'maurizio.minissale@davincimilazzo.edu.it', 'docente', TRUE),
('Rosita',    'Artigliere', 'rosita.artigliere@davincimilazzo.edu.it',  'docente', TRUE),
('Antonio',   'Caristia',   'antonio.caristia@davincimilazzo.edu.it',   'docente', TRUE),
('Antonio',   'Sgro',       'antonio.sgro@davincimilazzo.edu.it',       'docente', TRUE),
('Pietro',    'Rizzo',      'pietro.rizzo@davincimilazzo.edu.it',       'docente', TRUE),
('Antonio',   'Pirri',      'antonio.pirri@davincimilazzo.edu.it',      'docente', TRUE),
('Paoletta',  'Cotroneo',   'paoletta.cotroneo@davincimilazzo.edu.it',  'docente', TRUE);

-- CREDENZIALI.username è sempre la stessa email di UTENTE, per convenzione del progetto.
INSERT IGNORE INTO CREDENZIALI (username, password, utente_id)
SELECT u.email, cred.password, u.id
FROM UTENTE u
JOIN (
  SELECT 'maurizio.minissale@davincimilazzo.edu.it' AS email, '1234'        AS password
  UNION ALL SELECT 'rosita.artigliere@davincimilazzo.edu.it', 'Rosa1234'
  UNION ALL SELECT 'antonio.caristia@davincimilazzo.edu.it',  'antO1234'
  UNION ALL SELECT 'antonio.sgro@davincimilazzo.edu.it',      'Sgro1234'
  UNION ALL SELECT 'pietro.rizzo@davincimilazzo.edu.it',      'Filippo1234'
  UNION ALL SELECT 'antonio.pirri@davincimilazzo.edu.it',     'Pirri1234'
  UNION ALL SELECT 'paoletta.cotroneo@davincimilazzo.edu.it', 'Paola1234'
) AS cred ON cred.email = u.email;
