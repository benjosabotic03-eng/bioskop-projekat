import { useState } from "react";
import { api } from "../api";
import FilmKartica from "../komponente/FilmKartica";

export default function Pretraga() {
  const [nacin, postaviNacin] = useState("brza");
  const [brzaRijec, postaviBrzaRijec] = useState("");
  const [detaljna, postaviDetaljna] = useState({ naziv: "", zanr: "", reziser: "" });
  const [rezultati, postaviRezultate] = useState([]);
  const [traženo, postaviTraženo] = useState(false);

  function izmjenaDetaljne(polje, vrijednost) {
    postaviDetaljna({ ...detaljna, [polje]: vrijednost });
  }

  async function brzaPretraga(dogadjaj) {
    dogadjaj.preventDefault();
    const r = await api.get("/api/filmovi?pretraga=" + encodeURIComponent(brzaRijec));
    postaviRezultate(r);
    postaviTraženo(true);
  }

  async function detaljnaPretraga(dogadjaj) {
    dogadjaj.preventDefault();
    const parametri = new URLSearchParams();
    Object.entries(detaljna).forEach(([kljuc, vrijednost]) => {
      if (vrijednost) parametri.append(kljuc, vrijednost);
    });
    const r = await api.get("/api/filmovi?" + parametri.toString());
    postaviRezultate(r);
    postaviTraženo(true);
  }

  return (
    <div className="omotac">
      <h1>Pretraga filmova</h1>

      <div className="tabovi">
        <button
          className={nacin === "brza" ? "tab aktivan" : "tab"}
          onClick={() => postaviNacin("brza")}
        >Brza pretraga</button>
        <button
          className={nacin === "detaljna" ? "tab aktivan" : "tab"}
          onClick={() => postaviNacin("detaljna")}
        >Detaljna pretraga</button>
      </div>

      {nacin === "brza" ? (
        <form className="forma-pretrage" onSubmit={brzaPretraga}>
          <input
            placeholder="Naziv, žanr, režiser ili glumac..."
            value={brzaRijec}
            onChange={(e) => postaviBrzaRijec(e.target.value)}
          />
          <button className="dugme" type="submit">Traži</button>
        </form>
      ) : (
        <form className="forma detaljna-forma" onSubmit={detaljnaPretraga}>
          <label>
            Naziv
            <input value={detaljna.naziv} onChange={(e) => izmjenaDetaljne("naziv", e.target.value)} />
          </label>
          <label>
            Žanr
            <input value={detaljna.zanr} onChange={(e) => izmjenaDetaljne("zanr", e.target.value)} />
          </label>
          <label>
            Režiser
            <input value={detaljna.reziser} onChange={(e) => izmjenaDetaljne("reziser", e.target.value)} />
          </label>
          <button className="dugme" type="submit">Traži</button>
        </form>
      )}

      {traženo && rezultati.length === 0 && <p>Nema rezultata za zadate kriterijume.</p>}
      <div className="mreza-filmova">
        {rezultati.map((film) => (
          <FilmKartica key={film.id} film={film} />
        ))}
      </div>
    </div>
  );
}
