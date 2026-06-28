import { Link } from "react-router-dom";
import { slikaUrl } from "../api";

export default function FilmKartica({ film }) {
  return (
    <Link to={"/film/" + film.id} className="film-kartica">
      <div className="film-poster">
        {film.poster ? (
          <img src={slikaUrl(film.poster)} alt={film.naziv} />
        ) : (
          <div className="poster-zamjena">{film.naziv}</div>
        )}
      </div>
      <div className="film-info">
        <h3>{film.naziv}</h3>
        <p className="film-meta">{film.zanr}</p>
        {film.trajanje && <p className="film-meta">{film.trajanje} min</p>}
      </div>
    </Link>
  );
}
