import { useState, useEffect } from "react";
import { api } from "../api";
import FilmKartica from "../komponente/FilmKartica";

export default function Pocetna() {
  const [filmovi, postaviFilmove] = useState([]);
  const [ucitava, postaviUcitava] = useState(true);
  const [greska, postaviGresku] = useState("");

  useEffect(() => {
    api.get("/api/filmovi")
      .then((p) => postaviFilmove(p))
      .catch((g) => postaviGresku(g.message))
      .finally(() => postaviUcitava(false));
  }, []);

  return (
    <div className="omotac">
      <h1>Repertoar</h1>
      <p className="podnaslov">Izaberite film i rezervišite svoja mjesta.</p>

      {ucitava && <p>Učitavanje...</p>}
      {greska && <p className="greska">{greska}</p>}

      {!ucitava && filmovi.length === 0 && (
        <p>Trenutno nema dostupnih filmova.</p>
      )}

      <div className="mreza-filmova">
        {filmovi.map((film) => (
          <FilmKartica key={film.id} film={film} />
        ))}
      </div>
    </div>
  );
}
