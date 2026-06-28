import { useState, useEffect } from "react";
import { api, slikaUrl } from "../../api";

const prazno = { naziv: "", opis: "", zanr: "", trajanje: "", reziser: "", glumci: "" };

export default function AdminFilmovi() {
  const [filmovi, postaviFilmove] = useState([]);
  const [forma, postaviFormu] = useState(prazno);
  const [poster, postaviPoster] = useState(null);
  const [izmjenaId, postaviIzmjenaId] = useState(null);
  const [poruka, postaviPoruku] = useState("");

  function ucitaj() {
    api.get("/api/filmovi").then((f) => postaviFilmove(f));
  }
  useEffect(() => { ucitaj(); }, []);

  function izmjena(polje, vrijednost) {
    postaviFormu({ ...forma, [polje]: vrijednost });
  }

  function resetuj() {
    postaviFormu(prazno);
    postaviPoster(null);
    postaviIzmjenaId(null);
  }

  async function sacuvaj(dogadjaj) {
    dogadjaj.preventDefault();
    const fd = new FormData();
    Object.entries(forma).forEach(([k, v]) => fd.append(k, v));
    if (poster) fd.append("poster", poster);

    try {
      if (izmjenaId) {
        await api.posaljiFormu("/api/filmovi/" + izmjenaId, "PUT", fd);
        postaviPoruku("Film je izmijenjen.");
      } else {
        await api.posaljiFormu("/api/filmovi", "POST", fd);
        postaviPoruku("Film je dodat.");
      }
      resetuj();
      ucitaj();
    } catch (g) {
      postaviPoruku(g.message);
    }
  }

  function pripremiIzmjenu(film) {
    postaviFormu({
      naziv: film.naziv || "", opis: film.opis || "", zanr: film.zanr || "",
      trajanje: film.trajanje || "", reziser: film.reziser || "",
      glumci: film.glumci || ""
    });
    postaviIzmjenaId(film.id);
    window.scrollTo(0, 0);
  }

  async function obrisi(id) {
    if (!confirm("Obrisati film i sve njegove projekcije?")) return;
    await api.izbrisi("/api/filmovi/" + id);
    ucitaj();
  }

  return (
    <div className="omotac">
      <h1>Upravljanje filmovima</h1>
      {poruka && <p className="info">{poruka}</p>}

      <form className="forma admin-forma" onSubmit={sacuvaj}>
        <h2>{izmjenaId ? "Izmjena filma" : "Novi film"}</h2>
        <label>Naziv<input value={forma.naziv} onChange={(e) => izmjena("naziv", e.target.value)} required /></label>
        <label>Žanr<input value={forma.zanr} onChange={(e) => izmjena("zanr", e.target.value)} /></label>
        <label>Režiser<input value={forma.reziser} onChange={(e) => izmjena("reziser", e.target.value)} /></label>
        <label>Glumci<input value={forma.glumci} onChange={(e) => izmjena("glumci", e.target.value)} /></label>
        <label>Trajanje (min)<input type="number" value={forma.trajanje} onChange={(e) => izmjena("trajanje", e.target.value)} /></label>
        <label className="puna-sirina">Opis<textarea value={forma.opis} onChange={(e) => izmjena("opis", e.target.value)} rows="3" /></label>
        <label className="puna-sirina">Poster<input type="file" accept="image/*" onChange={(e) => postaviPoster(e.target.files[0])} /></label>
        <div className="dugmad-forme">
          <button className="dugme" type="submit">{izmjenaId ? "Sačuvaj izmjene" : "Dodaj film"}</button>
          {izmjenaId && <button type="button" className="dugme-sekundarno" onClick={resetuj}>Otkaži</button>}
        </div>
      </form>

      <h2>Postojeći filmovi</h2>
      <table className="tabela">
        <thead>
          <tr><th>Poster</th><th>Naziv</th><th>Žanr</th><th></th></tr>
        </thead>
        <tbody>
          {filmovi.map((f) => (
            <tr key={f.id}>
              <td>{f.poster ? <img className="mini-poster" src={slikaUrl(f.poster)} alt="" /> : "-"}</td>
              <td>{f.naziv}</td>
              <td>{f.zanr}</td>
              <td className="akcije">
                <button className="dugme-sekundarno" onClick={() => pripremiIzmjenu(f)}>Izmijeni</button>
                <button className="dugme-opasno" onClick={() => obrisi(f.id)}>Obriši</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
