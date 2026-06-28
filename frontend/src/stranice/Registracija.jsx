import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../kontekst/AuthKontekst";

export default function Registracija() {
  const { registracija } = useAuth();
  const navigacija = useNavigate();
  const [forma, postaviFormu] = useState({ ime: "", prezime: "", email: "", lozinka: "" });
  const [greska, postaviGresku] = useState("");

  function izmjena(polje, vrijednost) {
    postaviFormu({ ...forma, [polje]: vrijednost });
  }

  async function posalji(dogadjaj) {
    dogadjaj.preventDefault();
    postaviGresku("");
    try {
      await registracija(forma);
      navigacija("/");
    } catch (g) {
      postaviGresku(g.message);
    }
  }

  return (
    <div className="omotac uski">
      <h1>Registracija</h1>
      <form className="forma" onSubmit={posalji}>
        <label>
          Ime
          <input value={forma.ime} onChange={(e) => izmjena("ime", e.target.value)} required />
        </label>
        <label>
          Prezime
          <input value={forma.prezime} onChange={(e) => izmjena("prezime", e.target.value)} required />
        </label>
        <label>
          Email
          <input type="email" value={forma.email} onChange={(e) => izmjena("email", e.target.value)} required />
        </label>
        <label>
          Lozinka
          <input type="password" value={forma.lozinka} onChange={(e) => izmjena("lozinka", e.target.value)} required />
        </label>
        {greska && <p className="greska">{greska}</p>}
        <button className="dugme" type="submit">Registruj se</button>
      </form>
      <p className="centriran-tekst">
        Već imate nalog? <Link to="/prijava">Prijavite se</Link>
      </p>
    </div>
  );
}
