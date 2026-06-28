const express = require("express");
const connectionPool = require("../baza");
const { provjeriPrijavu, samoAdmin } = require("../middleware/autentifikacija");

const ruter = express.Router();

ruter.get("/", async (zahtjev, odgovor) => {
  try {
    const rezultat = await connectionPool.query("SELECT * FROM sale ORDER BY naziv");
    odgovor.json(rezultat.rows);
  } catch (greska) {
    odgovor.status(500).json({ poruka: "Greška na serveru." });
  }
});

ruter.post("/", provjeriPrijavu, samoAdmin, async (zahtjev, odgovor) => {
  const { naziv, broj_redova, sjedista_po_redu } = zahtjev.body;
  if (!naziv || !broj_redova || !sjedista_po_redu) {
    return odgovor.status(400).json({ poruka: "Sva polja su obavezna." });
  }
  try {
    const rezultat = await connectionPool.query(
      "INSERT INTO sale (naziv, broj_redova, sjedista_po_redu) VALUES ($1, $2, $3) RETURNING id",
      [naziv, broj_redova, sjedista_po_redu]
    );
    odgovor.status(201).json({ id: rezultat.rows[0].id, poruka: "Sala je dodata." });
  } catch (greska) {
    odgovor.status(500).json({ poruka: "Greška na serveru." });
  }
});

ruter.delete("/:id", provjeriPrijavu, samoAdmin, async (zahtjev, odgovor) => {
  try {
    await connectionPool.query("DELETE FROM sale WHERE id = $1", [zahtjev.params.id]);
    odgovor.json({ poruka: "Sala je obrisana." });
  } catch (greska) {
    odgovor.status(500).json({ poruka: "Greška na serveru." });
  }
});

module.exports = ruter;
