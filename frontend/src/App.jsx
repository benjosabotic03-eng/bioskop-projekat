import { Routes, Route } from "react-router-dom";
import Navigacija from "./komponente/Navigacija";
import PrivatnaRuta from "./komponente/PrivatnaRuta";
import Pocetna from "./stranice/Pocetna";
import Prijava from "./stranice/Prijava";
import Registracija from "./stranice/Registracija";
import DetaljiFilma from "./stranice/DetaljiFilma";
import Rezervacija from "./stranice/Rezervacija";
import MojeRezervacije from "./stranice/MojeRezervacije";
import Pretraga from "./stranice/Pretraga";
import AdminFilmovi from "./stranice/admin/AdminFilmovi";
import AdminProjekcije from "./stranice/admin/AdminProjekcije";
import AdminRezervacije from "./stranice/admin/AdminRezervacije";
import AdminKorisnici from "./stranice/admin/AdminKorisnici";

export default function App() {
  return (
    <>
      <Navigacija />
      <main>
        <Routes>
          <Route path="/" element={<Pocetna />} />
          <Route path="/prijava" element={<Prijava />} />
          <Route path="/registracija" element={<Registracija />} />
          <Route path="/pretraga" element={<Pretraga />} />
          <Route path="/film/:id" element={<DetaljiFilma />} />
          <Route path="/rezervacija/:id" element={<Rezervacija />} />
          <Route path="/moje-rezervacije" element={
            <PrivatnaRuta><MojeRezervacije /></PrivatnaRuta>
          } />
          <Route path="/admin/filmovi" element={
            <PrivatnaRuta samoAdmin><AdminFilmovi /></PrivatnaRuta>
          } />
          <Route path="/admin/projekcije" element={
            <PrivatnaRuta samoAdmin><AdminProjekcije /></PrivatnaRuta>
          } />
          <Route path="/admin/rezervacije" element={
            <PrivatnaRuta samoAdmin><AdminRezervacije /></PrivatnaRuta>
          } />
          <Route path="/admin/korisnici" element={
            <PrivatnaRuta samoAdmin><AdminKorisnici /></PrivatnaRuta>
          } />
          <Route path="*" element={<div className="omotac"><h1>Stranica nije pronađena</h1></div>} />
        </Routes>
      </main>
    </>
  );
}
