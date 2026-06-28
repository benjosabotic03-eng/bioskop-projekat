const express = require("express");
const connectionPool = require("../baza");
const { provjeriPrijavu, samoAdmin } = require("../middleware/autentifikacija");

const ruter = express.Router();

ruter.get("/", async (zahtjev, odgovor) => {
  const { film_id } = zahtjev.query;
  try {
    let upit = `
      SELECT p.*, f.naziv AS film_naziv, f.poster AS film_poster,
             s.naziv AS sala_naziv, s.broj_redova, s.sjedista_po_redu
      FROM projekcije p
      JOIN filmovi f ON p.film_id = f.id
      JOIN sale s ON p.sala_id = s.id
      WHERE p.datum_vrijeme >= NOW()`;
    const parametri = [];
    if (film_id) {
      upit += " AND p.film_id = $1";
      parametri.push(film_id);
    }
    upit += " ORDER BY p.datum_vrijeme";
    const rezultat = await connectionPool.query(upit, parametri);
    odgovor.json(rezultat.rows);
  } catch (greska) {
    odgovor.status(500).json({ poruka: "Greška na serveru." });
  }
});

ruter.get("/:id", async (zahtjev, odgovor) => {
  try {
    const rezultat = await connectionPool.query(
      `SELECT p.*, f.naziv AS film_naziv, f.opis AS film_opis, f.poster AS film_poster,
              s.naziv AS sala_naziv, s.broj_redova, s.sjedista_po_redu
       FROM projekcije p
       JOIN filmovi f ON p.film_id = f.id
       JOIN sale s ON p.sala_id = s.id
       WHERE p.id = $1`,
      [zahtjev.params.id]
    );
    if (rezultat.rows.length === 0) {
      return odgovor.status(404).json({ poruka: "Projekcija nije pronađena." });
    }

    const zauzeta = await connectionPool.query(
      "SELECT red, sjediste FROM rezervisana_sjedista WHERE projekcija_id = $1",
      [zahtjev.params.id]
    );

    odgovor.json({ ...rezultat.rows[0], zauzeta_sjedista: zauzeta.rows });
  } catch (greska) {
    odgovor.status(500).json({ poruka: "Greška na serveru." });
  }
});

ruter.post("/", provjeriPrijavu, samoAdmin, async (zahtjev, odgovor) => {
  const { film_id, sala_id, datum_vrijeme, cijena } = zahtjev.body;
  if (!film_id || !sala_id || !datum_vrijeme || !cijena) {
    return odgovor.status(400).json({ poruka: "Sva polja su obavezna." });
  }
  try {
    const rezultat = await connectionPool.query(
      "INSERT INTO projekcije (film_id, sala_id, datum_vrijeme, cijena) VALUES ($1, $2, $3, $4) RETURNING id",
      [film_id, sala_id, datum_vrijeme, cijena]
    );
    odgovor.status(201).json({ id: rezultat.rows[0].id, poruka: "Projekcija je dodata." });
  } catch (greska) {
    odgovor.status(500).json({ poruka: "Greška na serveru." });
  }
});

ruter.delete("/:id", provjeriPrijavu, samoAdmin, async (zahtjev, odgovor) => {
  try {
    await connectionPool.query("DELETE FROM projekcije WHERE id = $1", [zahtjev.params.id]);
    odgovor.json({ poruka: "Projekcija je obrisana." });
  } catch (greska) {
    odgovor.status(500).json({ poruka: "Greška na serveru." });
  }
});

module.exports = ruter;
