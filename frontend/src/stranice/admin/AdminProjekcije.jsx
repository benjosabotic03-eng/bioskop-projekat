import { useState, useEffect } from "react";
import { api } from "../../api";

function formatDatum(iso) {
  return new Date(iso).toLocaleString("sr-Latn", {
    day: "numeric", month: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit"
  });
}

export default function AdminProjekcije() {
  const [projekcije, postaviProjekcije] = useState([]);
  const [filmovi, postaviFilmove] = useState([]);
  const [sale, postaviSale] = useState([]);
  const [forma, postaviFormu] = useState({ film_id: "", sala_id: "", datum_vrijeme: "", cijena: "" });
  const [novaSala, postaviNovuSalu] = useState({ naziv: "", broj_redova: "", sjedista_po_redu: "" });
  const [poruka, postaviPoruku] = useState("");

  function ucitaj() {
    api.get("/api/projekcije").then((p) => postaviProjekcije(p));
    api.get("/api/filmovi").then((f) => postaviFilmove(f));
    api.get("/api/sale").then((s) => postaviSale(s));
  }
  useEffect(() => { ucitaj(); }, []);

  async function dodajProjekciju(dogadjaj) {
    dogadjaj.preventDefault();
    try {
      await api.post("/api/projekcije", forma);
      postaviFormu({ film_id: "", sala_id: "", datum_vrijeme: "", cijena: "" });
      postaviPoruku("Projekcija je dodata.");
      ucitaj();
    } catch (g) {
      postaviPoruku(g.message);
    }
  }

  async function dodajSalu(dogadjaj) {
    dogadjaj.preventDefault();
    try {
      await api.post("/api/sale", novaSala);
      postaviNovuSalu({ naziv: "", broj_redova: "", sjedista_po_redu: "" });
      postaviPoruku("Sala je dodata.");
      ucitaj();
    } catch (g) {
      postaviPoruku(g.message);
    }
  }

  async function obrisiProjekciju(id) {
    if (!confirm("Obrisati projekciju?")) return;
    await api.izbrisi("/api/projekcije/" + id);
    ucitaj();
  }

  return (
    <div className="omotac">
      <h1>Upravljanje projekcijama</h1>
      {poruka && <p className="info">{poruka}</p>}

      <div className="dvije-kolone">
        <form className="forma" onSubmit={dodajProjekciju}>
          <h2>Nova projekcija</h2>
          <label>Film
            <select value={forma.film_id} onChange={(e) => postaviFormu({ ...forma, film_id: e.target.value })} required>
              <option value="">- izaberite -</option>
              {filmovi.map((f) => <option key={f.id} value={f.id}>{f.naziv}</option>)}
            </select>
          </label>
          <label>Sala
            <select value={forma.sala_id} onChange={(e) => postaviFormu({ ...forma, sala_id: e.target.value })} required>
              <option value="">- izaberite -</option>
              {sale.map((s) => <option key={s.id} value={s.id}>{s.naziv}</option>)}
            </select>
          </label>
          <label>Datum i vrijeme
            <input type="datetime-local" value={forma.datum_vrijeme} onChange={(e) => postaviFormu({ ...forma, datum_vrijeme: e.target.value })} required />
          </label>
          <label>Cijena (€)
            <input type="number" step="0.5" value={forma.cijena} onChange={(e) => postaviFormu({ ...forma, cijena: e.target.value })} required />
          </label>
          <button className="dugme" type="submit">Dodaj projekciju</button>
        </form>

        <form className="forma" onSubmit={dodajSalu}>
          <h2>Nova sala</h2>
          <label>Naziv<input value={novaSala.naziv} onChange={(e) => postaviNovuSalu({ ...novaSala, naziv: e.target.value })} required /></label>
          <label>Broj redova<input type="number" value={novaSala.broj_redova} onChange={(e) => postaviNovuSalu({ ...novaSala, broj_redova: e.target.value })} required /></label>
          <label>Sjedišta po redu<input type="number" value={novaSala.sjedista_po_redu} onChange={(e) => postaviNovuSalu({ ...novaSala, sjedista_po_redu: e.target.value })} required /></label>
          <button className="dugme" type="submit">Dodaj salu</button>
        </form>
      </div>

      <h2>Zakazane projekcije</h2>
      <table className="tabela">
        <thead>
          <tr><th>Film</th><th>Sala</th><th>Datum</th><th>Cijena</th><th></th></tr>
        </thead>
        <tbody>
          {projekcije.map((p) => (
            <tr key={p.id}>
              <td>{p.film_naziv}</td>
              <td>{p.sala_naziv}</td>
              <td>{formatDatum(p.datum_vrijeme)}</td>
              <td>{Number(p.cijena).toFixed(2)} €</td>
              <td><button className="dugme-opasno" onClick={() => obrisiProjekciju(p.id)}>Obriši</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
