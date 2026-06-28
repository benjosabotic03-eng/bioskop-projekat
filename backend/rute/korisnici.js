const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connectionPool = require("../baza");
const konfig = require("../konfiguracija");
const { provjeriPrijavu, samoAdmin } = require("../middleware/autentifikacija");

const ruter = express.Router();

ruter.post("/registracija", async (zahtjev, odgovor) => {
  const { ime, prezime, email, lozinka } = zahtjev.body;
  if (!ime || !prezime || !email || !lozinka) {
    return odgovor.status(400).json({ poruka: "Sva polja su obavezna." });
  }

  try {
    const postoji = await connectionPool.query("SELECT id FROM korisnici WHERE email = $1", [email]);
    if (postoji.rows.length > 0) {
      return odgovor.status(400).json({ poruka: "Korisnik sa ovom adresom već postoji." });
    }

    const hash = await bcrypt.hash(lozinka, 10);
    const rezultat = await connectionPool.query(
      "INSERT INTO korisnici (ime, prezime, email, lozinka) VALUES ($1, $2, $3, $4) RETURNING id",
      [ime, prezime, email, hash]
    );
    const noviId = rezultat.rows[0].id;

    const token = jwt.sign(
      { id: noviId, uloga: "korisnik", ime, prezime },
      konfig.jwtSecret,
      { expiresIn: "7d" }
    );

    odgovor.status(201).json({
      token,
      korisnik: { id: noviId, ime, prezime, email, uloga: "korisnik" }
    });
  } catch (greska) {
    odgovor.status(500).json({ poruka: "Greška na serveru." });
  }
});

ruter.post("/prijava", async (zahtjev, odgovor) => {
  const { email, lozinka } = zahtjev.body;
  if (!email || !lozinka) {
    return odgovor.status(400).json({ poruka: "Unesite email i lozinku." });
  }

  try {
    const rezultat = await connectionPool.query("SELECT * FROM korisnici WHERE email = $1", [email]);
    if (rezultat.rows.length === 0) {
      return odgovor.status(400).json({ poruka: "Pogrešan email ili lozinka." });
    }

    const korisnik = rezultat.rows[0];
    const ispravna = await bcrypt.compare(lozinka, korisnik.lozinka);
    if (!ispravna) {
      return odgovor.status(400).json({ poruka: "Pogrešan email ili lozinka." });
    }

    const token = jwt.sign(
      { id: korisnik.id, uloga: korisnik.uloga, ime: korisnik.ime, prezime: korisnik.prezime },
      konfig.jwtSecret,
      { expiresIn: "7d" }
    );

    odgovor.json({
      token,
      korisnik: {
        id: korisnik.id,
        ime: korisnik.ime,
        prezime: korisnik.prezime,
        email: korisnik.email,
        uloga: korisnik.uloga
      }
    });
  } catch (greska) {
    odgovor.status(500).json({ poruka: "Greška na serveru." });
  }
});

ruter.get("/ja", provjeriPrijavu, async (zahtjev, odgovor) => {
  try {
    const rezultat = await connectionPool.query(
      "SELECT id, ime, prezime, email, uloga FROM korisnici WHERE id = $1",
      [zahtjev.korisnik.id]
    );
    if (rezultat.rows.length === 0) {
      return odgovor.status(404).json({ poruka: "Korisnik nije pronađen." });
    }
    odgovor.json(rezultat.rows[0]);
  } catch (greska) {
    odgovor.status(500).json({ poruka: "Greška na serveru." });
  }
});

ruter.get("/", provjeriPrijavu, samoAdmin, async (zahtjev, odgovor) => {
  try {
    const rezultat = await connectionPool.query(
      "SELECT id, ime, prezime, email, uloga, datum_registracije FROM korisnici ORDER BY id"
    );
    odgovor.json(rezultat.rows);
  } catch (greska) {
    odgovor.status(500).json({ poruka: "Greška na serveru." });
  }
});

ruter.put("/:id/uloga", provjeriPrijavu, samoAdmin, async (zahtjev, odgovor) => {
  const { uloga } = zahtjev.body;
  if (!["korisnik", "admin"].includes(uloga)) {
    return odgovor.status(400).json({ poruka: "Nepoznata uloga." });
  }
  try {
    await connectionPool.query("UPDATE korisnici SET uloga = $1 WHERE id = $2", [uloga, zahtjev.params.id]);
    odgovor.json({ poruka: "Uloga je izmijenjena." });
  } catch (greska) {
    odgovor.status(500).json({ poruka: "Greška na serveru." });
  }
});

ruter.delete("/:id", provjeriPrijavu, samoAdmin, async (zahtjev, odgovor) => {
  if (Number(zahtjev.params.id) === zahtjev.korisnik.id) {
    return odgovor.status(400).json({ poruka: "Ne možete obrisati sopstveni nalog." });
  }
  try {
    await connectionPool.query("DELETE FROM korisnici WHERE id = $1", [zahtjev.params.id]);
    odgovor.json({ poruka: "Korisnik je obrisan." });
  } catch (greska) {
    odgovor.status(500).json({ poruka: "Greška na serveru." });
  }
});

module.exports = ruter;
