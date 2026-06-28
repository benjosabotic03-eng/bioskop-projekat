import { Navigate } from "react-router-dom";
import { useAuth } from "../kontekst/AuthKontekst";

export default function PrivatnaRuta({ children, samoAdmin }) {
  const { korisnik, ucitava } = useAuth();

  if (ucitava) return <p className="centriran-tekst">Učitavanje...</p>;
  if (!korisnik) return <Navigate to="/prijava" replace />;
  if (samoAdmin && korisnik.uloga !== "admin") return <Navigate to="/" replace />;

  return children;
}
