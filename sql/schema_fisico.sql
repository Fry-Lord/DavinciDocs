-- ============================================================
-- DaVinciDocs — Schema fisico (MySQL / InnoDB)
-- Da importare in phpMyAdmin: crea il database "davincidocs"
-- (o un nome a scelta) ed esegui questo script nella scheda SQL.
-- ============================================================

CREATE DATABASE IF NOT EXISTS davincidocs CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE davincidocs;

-- Tabelle indipendenti --------------------------------------------------

CREATE TABLE IF NOT EXISTS INDIRIZZO (
    id      INT AUTO_INCREMENT PRIMARY KEY,
    nome    VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS UTENTE (
    id                   INT AUTO_INCREMENT PRIMARY KEY,
    nome                 VARCHAR(50)  NOT NULL,
    cognome              VARCHAR(50)  NOT NULL,
    cell                 VARCHAR(15),
    email                VARCHAR(100) NOT NULL UNIQUE,
    tipo_utente          ENUM('docente','amministratore') NOT NULL,
    tempo_indeterminato  BOOLEAN,
    ruolo                ENUM('docente','studente'),
    CONSTRAINT chk_utente_email_dominio
        CHECK (email LIKE '%@davincimilazzo.edu.it')
) ENGINE=InnoDB;

-- Tabelle che dipendono dal primo livello --------------------------------

-- NB: qui la chiave primaria e' solo username (non piu' username+password
-- come nella versione "didattica" del documento di riferimento): una
-- password con hash non si puo' usare come parte di una chiave di ricerca,
-- password_verify() e' l'unico modo corretto per confrontarla. Per
-- convenzione lo username coincide con l'email istituzionale.
CREATE TABLE IF NOT EXISTS CREDENZIALI (
    username    VARCHAR(100) NOT NULL PRIMARY KEY,
    password    VARCHAR(255) NOT NULL,
    utente_id   INT          NOT NULL UNIQUE,
    data_acc    DATETIME,
    FOREIGN KEY (utente_id) REFERENCES UTENTE(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS MATERIA (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    nome           VARCHAR(100) NOT NULL,
    indirizzo_id   INT NOT NULL,
    FOREIGN KEY (indirizzo_id) REFERENCES INDIRIZZO(id)
) ENGINE=InnoDB;

-- Tabelle che dipendono dal secondo livello -------------------------------

CREATE TABLE IF NOT EXISTS INSEGNA (
    docente_id   INT NOT NULL,
    materia_id   INT NOT NULL,
    PRIMARY KEY (docente_id, materia_id),
    FOREIGN KEY (docente_id) REFERENCES UTENTE(id),
    FOREIGN KEY (materia_id) REFERENCES MATERIA(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS MATERIALE (
    id                 INT AUTO_INCREMENT PRIMARY KEY,
    titolo             VARCHAR(150) NOT NULL,
    descrizione        TEXT,
    tipo_file          VARCHAR(10)  NOT NULL,
    path_file          VARCHAR(255) NOT NULL,
    dimensione_kb      INT,
    data_caricamento   DATETIME DEFAULT CURRENT_TIMESTAMP,
    docente_id         INT NOT NULL,
    materia_id         INT NOT NULL,
    FOREIGN KEY (docente_id) REFERENCES UTENTE(id),
    FOREIGN KEY (materia_id) REFERENCES MATERIA(id)
) ENGINE=InnoDB;
