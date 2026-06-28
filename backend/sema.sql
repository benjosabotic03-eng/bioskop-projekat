CREATE TABLE IF NOT EXISTS korisnici (
  id SERIAL PRIMARY KEY,
  ime VARCHAR(100) NOT NULL,
  prezime VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  lozinka VARCHAR(255) NOT NULL,
  uloga VARCHAR(20) NOT NULL DEFAULT 'korisnik' CHECK (uloga IN ('korisnik', 'admin')),
  datum_registracije TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sale (
  id SERIAL PRIMARY KEY,
  naziv VARCHAR(100) NOT NULL,
  broj_redova INT NOT NULL,
  sjedista_po_redu INT NOT NULL
);

CREATE TABLE IF NOT EXISTS filmovi (
  id SERIAL PRIMARY KEY,
  naziv VARCHAR(200) NOT NULL,
  opis TEXT,
  zanr VARCHAR(100),
  trajanje INT,
  reziser VARCHAR(150),
  glumci VARCHAR(255),
  poster VARCHAR(255),
  datum_kreiranja TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projekcije (
  id SERIAL PRIMARY KEY,
  film_id INT NOT NULL REFERENCES filmovi(id) ON DELETE CASCADE,
  sala_id INT NOT NULL REFERENCES sale(id) ON DELETE CASCADE,
  datum_vrijeme TIMESTAMP NOT NULL,
  cijena DECIMAL(6,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS rezervacije (
  id SERIAL PRIMARY KEY,
  korisnik_id INT NOT NULL REFERENCES korisnici(id) ON DELETE CASCADE,
  projekcija_id INT NOT NULL REFERENCES projekcije(id) ON DELETE CASCADE,
  datum_rezervacije TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rezervisana_sjedista (
  id SERIAL PRIMARY KEY,
  rezervacija_id INT NOT NULL REFERENCES rezervacije(id) ON DELETE CASCADE,
  projekcija_id INT NOT NULL REFERENCES projekcije(id) ON DELETE CASCADE,
  red INT NOT NULL,
  sjediste INT NOT NULL,
  CONSTRAINT jedinstveno_sjediste UNIQUE (projekcija_id, red, sjediste)
);
