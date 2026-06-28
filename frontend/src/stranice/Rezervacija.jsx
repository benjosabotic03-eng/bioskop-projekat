import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../kontekst/AuthKontekst";
import IzborSjedista from "../komponente/IzborSjedista";

function formatDatum(iso) {
  const d = new Date(iso);
  return d.toLocaleString("sr-Latn", {
    weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit"
  });
}

export default function Rezervacija() {
  const { id } = useParams();
  const navigacija = useNavigate();
  const { korisnik } = useAuth();
  const [projekcija, postaviProjekciju] = useState(null);
  const [izabrana, postaviIzabrana] = useState([]);
  const [greska, postaviGresku] = useState("");
  const [salje, postaviSalje] = useState(false);

  useEffect(() => {
    api.get("/api/projekcije/" + id)
      .then((p) => postaviProjekciju(p))
      .catch((g) => postaviGresku(g.message));
  }, [id]);

  function klikSjediste(red, sjediste) {
    const postoji = izabrana.find((s) => s.red === red && s.sjediste === sjediste);
    if (postoji) {
      postaviIzabrana(izabrana.filter((s) => !(s.red === red && s.sjediste === sjediste)));
    } else {
      postaviIzabrana([...izabrana, { red, sjediste }]);
    }
  }

  async function rezervisi() {
    if (!korisnik) {
      navigacija("/prijava");
      return;
    }
    if (izabrana.length === 0) {
      postaviGresku("Izaberite bar jedno sjedište.");
      return;
    }
    postaviGresku("");
    postaviSalje(true);
    try {
      await api.post("/api/rezervacije", { projekcija_id: Number(id), sjedista: izabrana });
      navigacija("/moje-rezervacije");
    } catch (g) {
      postaviGresku(g.message);
      const osvjezena = await api.get("/api/projekcije/" + id);
      postaviProjekciju(osvjezena);
      postaviIzabrana([]);
    } finally {
      postaviSalje(false);
    }
  }

  if (greska && !projekcija) return <div className="omotac"><p className="greska">{greska}</p></div>;
  if (!projekcija) return <div className="omotac"><p>Učitavanje...</p></div>;

  const ukupno = (izabrana.length * Number(projekcija.cijena)).toFixed(2);

  return (
    <div className="omotac">
      <h1>{projekcija.film_naziv}</h1>
      <p className="podnaslov">
        {formatDatum(projekcija.datum_vrijeme)} · {projekcija.sala_naziv} · {Number(projekcija.cijena).toFixed(2)} € po karti
      </p>

      <IzborSjedista
        brojRedova={projekcija.broj_redova}
        sjedistaPoRedu={projekcija.sjedista_po_redu}
        zauzeta={projekcija.zauzeta_sjedista}
        izabrana={izabrana}
        naKlik={klikSjediste}
      />

      <div className="rezime-rezervacije">
        <div>
          <p><strong>Izabrano sjedišta:</strong> {izabrana.length}</p>
          <p><strong>Ukupno:</strong> {ukupno} €</p>
        </div>
        {greska && <p className="greska">{greska}</p>}
        {korisnik && korisnik.uloga === "admin" ? (
          <p className="info">Administratori ne mogu da rezervišu karte.</p>
        ) : (
          <button className="dugme" onClick={rezervisi} disabled={salje}>
            {salje ? "Rezervišem..." : "Rezerviši"}
          </button>
        )}
      </div>
    </div>
  );
}
