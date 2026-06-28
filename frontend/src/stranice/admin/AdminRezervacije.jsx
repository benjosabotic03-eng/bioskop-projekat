import { useState, useEffect } from "react";
import { api } from "../../api";

function slovoReda(indeks) {
  return String.fromCharCode(65 + indeks);
}

function formatDatum(iso) {
  return new Date(iso).toLocaleString("sr-Latn", {
    day: "numeric", month: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit"
  });
}

export default function AdminRezervacije() {
  const [rezervacije, postaviRezervacije] = useState([]);
  const [ucitava, postaviUcitava] = useState(true);

  function ucitaj() {
    api.get("/api/rezervacije")
      .then((r) => postaviRezervacije(r))
      .finally(() => postaviUcitava(false));
  }
  useEffect(() => { ucitaj(); }, []);

  async function ukloni(id) {
    if (!confirm("Ukloniti ovu rezervaciju?")) return;
    await api.izbrisi("/api/rezervacije/" + id);
    ucitaj();
  }

  if (ucitava) return <div className="omotac"><p>Učitavanje...</p></div>;

  return (
    <div className="omotac">
      <h1>Rezervacije korisnika</h1>
      {rezervacije.length === 0 && <p>Nema rezervacija.</p>}
      <table className="tabela">
        <thead>
          <tr><th>Korisnik</th><th>Film</th><th>Termin</th><th>Sala</th><th>Sjedišta</th><th>Iznos</th><th></th></tr>
        </thead>
        <tbody>
          {rezervacije.map((r) => (
            <tr key={r.id}>
              <td>{r.korisnik_ime} {r.korisnik_prezime}<br /><span className="film-meta">{r.korisnik_email}</span></td>
              <td>{r.film_naziv}</td>
              <td>{formatDatum(r.datum_vrijeme)}</td>
              <td>{r.sala_naziv}</td>
              <td>{r.sjedista.map((s) => slovoReda(s.red) + (s.sjediste + 1)).join(", ")}</td>
              <td>{(r.sjedista.length * Number(r.cijena)).toFixed(2)} €</td>
              <td><button className="dugme-opasno" onClick={() => ukloni(r.id)}>Ukloni</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
