const jwt = require("jsonwebtoken");
const konfig = require("../konfiguracija");

function provjeriPrijavu(zahtjev, odgovor, dalje) {
  const zaglavlje = zahtjev.headers["authorization"];
  const token = zaglavlje && zaglavlje.split(" ")[1];

  if (!token) {
    return odgovor.status(401).json({ poruka: "Niste prijavljeni." });
  }

  try {
    const podaci = jwt.verify(token, konfig.jwtSecret);
    zahtjev.korisnik = podaci;
    dalje();
  } catch (greska) {
    return odgovor.status(401).json({ poruka: "Token nije validan." });
  }
}

function samoAdmin(zahtjev, odgovor, dalje) {
  if (zahtjev.korisnik && zahtjev.korisnik.uloga === "admin") {
    return dalje();
  }
  return odgovor.status(403).json({ poruka: "Nemate dozvolu za ovu radnju." });
}

module.exports = { provjeriPrijavu, samoAdmin };
