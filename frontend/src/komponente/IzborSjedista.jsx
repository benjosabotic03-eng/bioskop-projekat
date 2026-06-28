function slovoReda(indeks) {
  return String.fromCharCode(65 + indeks);
}

export default function IzborSjedista({ brojRedova, sjedistaPoRedu, zauzeta, izabrana, naKlik }) {
  function jeZauzeto(red, sjediste) {
    return zauzeta.some((s) => s.red === red && s.sjediste === sjediste);
  }

  function jeIzabrano(red, sjediste) {
    return izabrana.some((s) => s.red === red && s.sjediste === sjediste);
  }

  const redovi = [];
  for (let r = 0; r < brojRedova; r++) {
    const sjedista = [];
    for (let s = 0; s < sjedistaPoRedu; s++) {
      let klasa = "sjediste";
      if (jeZauzeto(r, s)) klasa += " zauzeto";
      else if (jeIzabrano(r, s)) klasa += " izabrano";

      sjedista.push(
        <button
          key={s}
          className={klasa}
          disabled={jeZauzeto(r, s)}
          onClick={() => naKlik(r, s)}
          title={"Red " + slovoReda(r) + ", sjedište " + (s + 1)}
        >
          {s + 1}
        </button>
      );
    }
    redovi.push(
      <div key={r} className="red-sjedista">
        <span className="oznaka-reda">{slovoReda(r)}</span>
        <div className="sjedista">{sjedista}</div>
      </div>
    );
  }

  return (
    <div className="sala-prikaz">
      <div className="platno">PLATNO</div>
      <div className="raspored-sjedista">{redovi}</div>
      <div className="legenda">
        <span><span className="kvadrat slobodno"></span> Slobodno</span>
        <span><span className="kvadrat izabrano"></span> Izabrano</span>
        <span><span className="kvadrat zauzeto"></span> Zauzeto</span>
      </div>
    </div>
  );
}
