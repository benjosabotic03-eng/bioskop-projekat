import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../kontekst/AuthKontekst";

export default function Prijava() {
  const { prijava } = useAuth();
  const navigacija = useNavigate();
  const [email, postaviEmail] = useState("");
  const [lozinka, postaviLozinku] = useState("");
  const [greska, postaviGresku] = useState("");

  async function posalji(dogadjaj) {
    dogadjaj.preventDefault();
    postaviGresku("");
    try {
      await prijava(email, lozinka);
      navigacija("/");
    } catch (g) {
      postaviGresku(g.message);
    }
  }

  return (
    <div className="omotac uski">
      <h1>Prijava</h1>
      <form className="forma" onSubmit={posalji}>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => postaviEmail(e.target.value)} required />
        </label>
        <label>
          Lozinka
          <input type="password" value={lozinka} onChange={(e) => postaviLozinku(e.target.value)} required />
        </label>
        {greska && <p className="greska">{greska}</p>}
        <button className="dugme" type="submit">Prijavi se</button>
      </form>
      <p className="centriran-tekst">
        Nemate nalog? <Link to="/registracija">Registrujte se</Link>
      </p>
    </div>
  );
}
