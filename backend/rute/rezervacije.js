const express = require("express");
const connectionPool = require("../baza");
const { provjeriPrijavu, samoAdmin } = require("../middleware/autentifikacija");

const ruter = express.Router();

ruter.post("/", provjeriPrijavu, async (zahtjev, odgovor) => {
  if (zahtjev.korisnik.uloga === "admin") {
    return odgovor.status(403).json({ poruka: "Administratori ne mogu da rezervišu karte." });
  }

  const { projekcija_id, sjedista } = zahtjev.body;
  if (!projekcija_id || !Array.isArray(sjedista) || sjedista.length === 0) {
    return odgovor.status(400).json({ poruka: "Izaberite bar jedno sjedište." });
  }

  const veza = await connectionPool.connect();
  try {
    await veza.query("BEGIN");

    for (const sjediste of sjedista) {
      const zauzeto = await veza.query(
        "SELECT id FROM rezervisana_sjedista WHERE projekcija_id = $1 AND red = $2 AND sjediste = $3 FOR UPDATE",
        [projekcija_id, sjediste.red, sjediste.sjediste]
      );
      if (zauzeto.rows.length > 0) {
        await veza.query("ROLLBACK");
        return odgovor.status(409).json({
          poruka: `Sjedište (red ${sjediste.red + 1}, broj ${sjediste.sjediste + 1}) je već zauzeto.`
        });
      }
    }

    const rezultat = await veza.query(
      "INSERT INTO rezervacije (korisnik_id, projekcija_id) VALUES ($1, $2) RETURNING id",
      [zahtjev.korisnik.id, projekcija_id]
    );
    const rezervacijaId = rezultat.rows[0].id;

    for (const sjediste of sjedista) {
      await veza.query(
        "INSERT INTO rezervisana_sjedista (rezervacija_id, projekcija_id, red, sjediste) VALUES ($1, $2, $3, $4)",
        [rezervacijaId, projekcija_id, sjediste.red, sjediste.sjediste]
      );
    }

    await veza.query("COMMIT");
    odgovor.status(201).json({ id: rezervacijaId, poruka: "Rezervacija je uspješna." });
  } catch (greska) {
    await veza.query("ROLLBACK");
    odgovor.status(500).json({ poruka: "Greška na serveru." });
  } finally {
    veza.release();
  }
});

ruter.get("/moje", provjeriPrijavu, async (zahtjev, odgovor) => {
  try {
    const rezultat = await connectionPool.query(
      `SELECT r.id, r.datum_rezervacije, p.datum_vrijeme, p.cijena,
              f.naziv AS film_naziv, f.poster AS film_poster, s.naziv AS sala_naziv
       FROM rezervacije r
       JOIN projekcije p ON r.projekcija_id = p.id
       JOIN filmovi f ON p.film_id = f.id
       JOIN sale s ON p.sala_id = s.id
       WHERE r.korisnik_id = $1
       ORDER BY r.datum_rezervacije DESC`,
      [zahtjev.korisnik.id]
    );
    const rezervacije = rezultat.rows;

    for (const rez of rezervacije) {
      const sjedista = await connectionPool.query(
        "SELECT red, sjediste FROM rezervisana_sjedista WHERE rezervacija_id = $1",
        [rez.id]
      );
      rez.sjedista = sjedista.rows;
    }

    odgovor.json(rezervacije);
  } catch (greska) {
    odgovor.status(500).json({ poruka: "Greška na serveru." });
  }
});

ruter.get("/", provjeriPrijavu, samoAdmin, async (zahtjev, odgovor) => {
  try {
    const rezultat = await connectionPool.query(
      `SELECT r.id, r.datum_rezervacije, p.datum_vrijeme, p.cijena,
              f.naziv AS film_naziv, s.naziv AS sala_naziv,
              k.ime AS korisnik_ime, k.prezime AS korisnik_prezime, k.email AS korisnik_email
       FROM rezervacije r
       JOIN korisnici k ON r.korisnik_id = k.id
       JOIN projekcije p ON r.projekcija_id = p.id
       JOIN filmovi f ON p.film_id = f.id
       JOIN sale s ON p.sala_id = s.id
       ORDER BY r.datum_rezervacije DESC`
    );
    const rezervacije = rezultat.rows;

    for (const rez of rezervacije) {
      const sjedista = await connectionPool.query(
        "SELECT red, sjediste FROM rezervisana_sjedista WHERE rezervacija_id = $1",
        [rez.id]
      );
      rez.sjedista = sjedista.rows;
    }

    odgovor.json(rezervacije);
  } catch (greska) {
    odgovor.status(500).json({ poruka: "Greška na serveru." });
  }
});

ruter.delete("/:id", provjeriPrijavu, async (zahtjev, odgovor) => {
  try {
    const rezultat = await connectionPool.query(
      "SELECT korisnik_id FROM rezervacije WHERE id = $1",
      [zahtjev.params.id]
    );
    if (rezultat.rows.length === 0) {
      return odgovor.status(404).json({ poruka: "Rezervacija nije pronađena." });
    }
    if (rezultat.rows[0].korisnik_id !== zahtjev.korisnik.id && zahtjev.korisnik.uloga !== "admin") {
      return odgovor.status(403).json({ poruka: "Nemate dozvolu." });
    }
    await connectionPool.query("DELETE FROM rezervacije WHERE id = $1", [zahtjev.params.id]);
    odgovor.json({ poruka: "Rezervacija je otkazana." });
  } catch (greska) {
    odgovor.status(500).json({ poruka: "Greška na serveru." });
  }
});

module.exports = ruter;
