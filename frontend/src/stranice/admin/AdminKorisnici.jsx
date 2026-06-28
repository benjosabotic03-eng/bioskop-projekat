import { useState, useEffect } from "react";
import { api } from "../../api";
import { useAuth } from "../../kontekst/AuthKontekst";

function formatDatum(iso) {
  return new Date(iso).toLocaleDateString("sr-Latn", { day: "numeric", month: "numeric", year: "numeric" });
}

export default function AdminKorisnici() {
  const { korisnik } = useAuth();
  const [korisnici, postaviKorisnike] = useState([]);

  function ucitaj() {
    api.get("/api/korisnici").then((k) => postaviKorisnike(k));
  }
  useEffect(() => { ucitaj(); }, []);

  async function promijeniUlogu(id, novaUloga) {
    await api.put("/api/korisnici/" + id + "/uloga", { uloga: novaUloga });
    ucitaj();
  }

  async function obrisi(id) {
    if (!confirm("Obrisati korisnika?")) return;
    await api.izbrisi("/api/korisnici/" + id);
    ucitaj();
  }

  return (
    <div className="omotac">
      <h1>Upravljanje korisnicima</h1>
      <table className="tabela">
        <thead>
          <tr><th>Ime</th><th>Email</th><th>Uloga</th><th>Registrovan</th><th></th></tr>
        </thead>
        <tbody>
          {korisnici.map((k) => (
            <tr key={k.id}>
              <td>{k.ime} {k.prezime}</td>
              <td>{k.email}</td>
              <td>
                <select
                  value={k.uloga}
                  disabled={k.id === korisnik.id}
                  onChange={(e) => promijeniUlogu(k.id, e.target.value)}
                >
                  <option value="korisnik">korisnik</option>
                  <option value="admin">admin</option>
                </select>
              </td>
              <td>{formatDatum(k.datum_registracije)}</td>
              <td>
                {k.id !== korisnik.id && (
                  <button className="dugme-opasno" onClick={() => obrisi(k.id)}>Obriši</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
