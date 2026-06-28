const express = require("express");
const cors = require("cors");
const path = require("path");
const konfig = require("./konfiguracija");

const korisniciRute = require("./rute/korisnici");
const filmoviRute = require("./rute/filmovi");
const saleRute = require("./rute/sale");
const projekcijeRute = require("./rute/projekcije");
const rezervacijeRute = require("./rute/rezervacije");

const aplikacija = express();

aplikacija.use(cors());
aplikacija.use(express.json());
aplikacija.use("/uploads", express.static(path.join(__dirname, "uploads")));

aplikacija.use("/api/korisnici", korisniciRute);
aplikacija.use("/api/filmovi", filmoviRute);
aplikacija.use("/api/sale", saleRute);
aplikacija.use("/api/projekcije", projekcijeRute);
aplikacija.use("/api/rezervacije", rezervacijeRute);

aplikacija.get("/", (z, o) => o.json({ poruka: "API bioskopa radi." }));

aplikacija.listen(konfig.port, () => {
  console.log(`Server radi na portu ${konfig.port}`);
});
