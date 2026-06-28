import { useState, useEffect } from "react";
import { api } from "../api";

function slovoReda(indeks) {
  return String.fromCharCode(65 + indeks);
}

function formatDatum(iso) {
  const d = new Date(iso);
  return d.toLocaleString("sr-Latn", {
    weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit"
  });
}

export default function MojeRezervacije() {
  const [rezervacije, postaviRezervacije] = useState([]);
  const [ucitava, postaviUcitava] = useState(true);

  function ucitaj() {
    api.get("/api/rezervacije/moje")
      .then((r) => postaviRezervacije(r))
      .finally(() => postaviUcitava(false));
  }

  useEffect(() => { ucitaj(); }, []);

  async function otkazi(id) {
    if (!confirm("Da li ste sigurni da želite da otkažete rezervaciju?")) return;
    await api.izbrisi("/api/rezervacije/" + id);
    ucitaj();
  }

  if (ucitava) return <div className="omotac"><p>Učitavanje...</p></div>;

  return (
    <div className="omotac">
      <h1>Moje rezervacije</h1>
      {rezervacije.length === 0 && <p>Još uvijek nemate rezervacija.</p>}
      <div className="lista-rezervacija">
        {rezervacije.map((r) => (
          <div key={r.id} className="rezervacija-kartica">
            <div className="rezervacija-glavni">
              <h3>{r.film_naziv}</h3>
              <p className="film-meta">{formatDatum(r.datum_vrijeme)} · {r.sala_naziv}</p>
              <p>
                Sjedišta:{" "}
                {r.sjedista.map((s) => slovoReda(s.red) + (s.sjediste + 1)).join(", ")}
              </p>
              <p><strong>{(r.sjedista.length * Number(r.cijena)).toFixed(2)} €</strong></p>
            </div>
            <button className="dugme-opasno" onClick={() => otkazi(r.id)}>Otkaži</button>
          </div>
        ))}
      </div>
    </div>
  );
}
