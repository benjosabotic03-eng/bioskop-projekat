import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api";

const AuthKontekst = createContext(null);

export function AuthProvajder({ children }) {
  const [korisnik, postaviKorisnika] = useState(null);
  const [ucitava, postaviUcitava] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      postaviUcitava(false);
      return;
    }
    api.get("/api/korisnici/ja")
      .then((k) => postaviKorisnika(k))
      .catch(() => {
        localStorage.removeItem("token");
      })
      .finally(() => postaviUcitava(false));
  }, []);

  async function prijava(email, lozinka) {
    const podaci = await api.post("/api/korisnici/prijava", { email, lozinka });
    localStorage.setItem("token", podaci.token);
    postaviKorisnika(podaci.korisnik);
  }

  async function registracija(podaciForme) {
    const podaci = await api.post("/api/korisnici/registracija", podaciForme);
    localStorage.setItem("token", podaci.token);
    postaviKorisnika(podaci.korisnik);
  }

  function odjava() {
    localStorage.removeItem("token");
    postaviKorisnika(null);
  }

  return (
    <AuthKontekst.Provider value={{ korisnik, ucitava, prijava, registracija, odjava }}>
      {children}
    </AuthKontekst.Provider>
  );
}

export function useAuth() {
  return useContext(AuthKontekst);
}
