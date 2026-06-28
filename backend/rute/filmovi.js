const express = require("express");
const multer = require("multer");
const path = require("path");
const connectionPool = require("../baza");
const { provjeriPrijavu, samoAdmin } = require("../middleware/autentifikacija");

const ruter = express.Router();

const skladiste = multer.diskStorage({
  destination: (z, f, povratak) => povratak(null, "uploads"),
  filename: (z, f, povratak) => {
    const nastavak = path.extname(f.originalname);
    povratak(null, "poster-" + Date.now() + nastavak);
  }
});
const otpremi = multer({ storage: skladiste });

ruter.get("/", async (zahtjev, odgovor) => {
  const { pretraga, naziv, zanr, reziser } = zahtjev.query;
  try {
    let upit = "SELECT * FROM filmovi WHERE 1=1";
    const parametri = [];
    let brojac = 1;

    if (pretraga) {
      const izraz = "%" + pretraga + "%";
      upit += ` AND (naziv ILIKE $${brojac} OR opis ILIKE $${brojac + 1} OR reziser ILIKE $${brojac + 2} OR glumci ILIKE $${brojac + 3})`;
      parametri.push(izraz, izraz, izraz, izraz);
      brojac += 4;
    }
    if (naziv) {
      upit += ` AND naziv ILIKE $${brojac++}`;
      parametri.push("%" + naziv + "%");
    }
    if (zanr) {
      upit += ` AND zanr ILIKE $${brojac++}`;
      parametri.push("%" + zanr + "%");
    }
    if (reziser) {
      upit += ` AND reziser ILIKE $${brojac++}`;
      parametri.push("%" + reziser + "%");
    }

    upit += " ORDER BY datum_kreiranja DESC";
    const rezultat = await connectionPool.query(upit, parametri);
    odgovor.json(rezultat.rows);
  } catch (greska) {
    odgovor.status(500).json({ poruka: "Greška na serveru." });
  }
});

ruter.get("/:id", async (zahtjev, odgovor) => {
  try {
    const rezultat = await connectionPool.query("SELECT * FROM filmovi WHERE id = $1", [zahtjev.params.id]);
    if (rezultat.rows.length === 0) {
      return odgovor.status(404).json({ poruka: "Film nije pronađen." });
    }
    odgovor.json(rezultat.rows[0]);
  } catch (greska) {
    odgovor.status(500).json({ poruka: "Greška na serveru." });
  }
});

ruter.post("/", provjeriPrijavu, samoAdmin, otpremi.single("poster"), async (zahtjev, odgovor) => {
  const { naziv, opis, zanr, trajanje, reziser, glumci } = zahtjev.body;
  if (!naziv) {
    return odgovor.status(400).json({ poruka: "Naziv filma je obavezan." });
  }
  try {
    const poster = zahtjev.file ? zahtjev.file.filename : null;
    const rezultat = await connectionPool.query(
      "INSERT INTO filmovi (naziv, opis, zanr, trajanje, reziser, glumci, poster) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      [naziv, opis, zanr, trajanje || null, reziser, glumci, poster]
    );
    odgovor.status(201).json({ id: rezultat.rows[0].id, poruka: "Film je dodat." });
  } catch (greska) {
    odgovor.status(500).json({ poruka: "Greška na serveru." });
  }
});

ruter.put("/:id", provjeriPrijavu, samoAdmin, otpremi.single("poster"), async (zahtjev, odgovor) => {
  const { naziv, opis, zanr, trajanje, reziser, glumci } = zahtjev.body;
  try {
    if (zahtjev.file) {
      await connectionPool.query(
        "UPDATE filmovi SET naziv=$1, opis=$2, zanr=$3, trajanje=$4, reziser=$5, glumci=$6, poster=$7 WHERE id=$8",
        [naziv, opis, zanr, trajanje || null, reziser, glumci, zahtjev.file.filename, zahtjev.params.id]
      );
    } else {
      await connectionPool.query(
        "UPDATE filmovi SET naziv=$1, opis=$2, zanr=$3, trajanje=$4, reziser=$5, glumci=$6 WHERE id=$7",
        [naziv, opis, zanr, trajanje || null, reziser, glumci, zahtjev.params.id]
      );
    }
    odgovor.json({ poruka: "Film je izmijenjen." });
  } catch (greska) {
    odgovor.status(500).json({ poruka: "Greška na serveru." });
  }
});

ruter.delete("/:id", provjeriPrijavu, samoAdmin, async (zahtjev, odgovor) => {
  try {
    await connectionPool.query("DELETE FROM filmovi WHERE id = $1", [zahtjev.params.id]);
    odgovor.json({ poruka: "Film je obrisan." });
  } catch (greska) {
    odgovor.status(500).json({ poruka: "Greška na serveru." });
  }
});

module.exports = ruter;
