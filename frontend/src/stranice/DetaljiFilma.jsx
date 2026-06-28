import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api, slikaUrl } from "../api";

function formatDatum(iso) {
  const d = new Date(iso);
  return d.toLocaleString("sr-Latn", {
    weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit"
  });
}

export default function DetaljiFilma() {
  const { id } = useParams();
  const [film, postaviFilm] = useState(null);
  const [projekcije, postaviProjekcije] = useState([]);
  const [greska, postaviGresku] = useState("");

  useEffect(() => {
    api.get("/api/filmovi/" + id)
      .then((f) => postaviFilm(f))
      .catch((g) => postaviGresku(g.message));
    api.get("/api/projekcije?film_id=" + id)
      .then((p) => postaviProjekcije(p))
      .catch(() => {});
  }, [id]);

  if (greska) return <div className="omotac"><p className="greska">{greska}</p></div>;
  if (!film) return <div className="omotac"><p>Učitavanje...</p></div>;

  return (
    <div className="omotac">
      <div className="detalji-film">
        <div className="detalji-poster">
          {film.poster ? (
            <img src={slikaUrl(film.poster)} alt={film.naziv} />
          ) : (
            <div className="poster-zamjena velik">{film.naziv}</div>
          )}
        </div>
        <div className="detalji-info">
          <h1>{film.naziv}</h1>
          <p className="film-meta">{film.zanr} · {film.trajanje} min</p>
          {film.reziser && <p><strong>Režija:</strong> {film.reziser}</p>}
          {film.glumci && <p><strong>Uloge:</strong> {film.glumci}</p>}
          <p className="opis">{film.opis}</p>
        </div>
      </div>

      <h2>Termini projekcija</h2>
      {projekcije.length === 0 && <p>Nema zakazanih projekcija za ovaj film.</p>}
      <div className="lista-projekcija">
        {projekcije.map((p) => (
          <Link key={p.id} to={"/rezervacija/" + p.id} className="projekcija-stavka">
            <div>
              <strong>{formatDatum(p.datum_vrijeme)}</strong>
              <span className="film-meta">{p.sala_naziv}</span>
            </div>
            <div className="cijena">{Number(p.cijena).toFixed(2)} €</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
