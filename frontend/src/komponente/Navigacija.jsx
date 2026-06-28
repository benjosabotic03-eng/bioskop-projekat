import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../kontekst/AuthKontekst";

export default function Navigacija() {
  const { korisnik, odjava } = useAuth();
  const navigacija = useNavigate();

  function odjaviSe() {
    odjava();
    navigacija("/");
  }

  return (
    <header className="navigacija">
      <div className="nav-sadrzaj">
        <Link to="/" className="logo">Bioskop</Link>
        <nav className="nav-linkovi">
          <Link to="/">Repertoar</Link>
          <Link to="/pretraga">Pretraga</Link>
          {korisnik && korisnik.uloga !== "admin" && (
            <Link to="/moje-rezervacije">Moje rezervacije</Link>
          )}
          {korisnik && korisnik.uloga === "admin" && (
            <>
              <Link to="/admin/filmovi">Filmovi</Link>
              <Link to="/admin/projekcije">Projekcije</Link>
              <Link to="/admin/rezervacije">Rezervacije korisnika</Link>
              <Link to="/admin/korisnici">Korisnici</Link>
            </>
          )}
        </nav>
        <div className="nav-desno">
          {korisnik ? (
            <>
              <span className="pozdrav">Zdravo, {korisnik.ime}</span>
              <button className="dugme-sekundarno" onClick={odjaviSe}>Odjava</button>
            </>
          ) : (
            <>
              <Link to="/prijava" className="dugme-sekundarno">Prijava</Link>
              <Link to="/registracija" className="dugme">Registracija</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
