const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const connectionPool = require("./baza");

async function kreirajSemu() {
  const sema = fs.readFileSync(path.join(__dirname, "sema.sql"), "utf8");
  await connectionPool.query(sema);
}

async function ocistiBazu() {
  await connectionPool.query(
    "TRUNCATE rezervisana_sjedista, rezervacije, projekcije, filmovi, sale, korisnici RESTART IDENTITY CASCADE"
  );
}

async function ubaciKorisnike() {
  const lozinkaAdmin = await bcrypt.hash("12345678", 10);
  const lozinkaKorisnik = await bcrypt.hash("12345678", 10);

  const korisnici = [
    ["Admin", "Admin", "admin@bioskop.me", lozinkaAdmin, "admin"],
    ["Marko", "Markovic", "marko@gmail.com", lozinkaKorisnik, "korisnik"],
    ["Janko", "Jankovic", "jovan@gmail.com", lozinkaKorisnik, "korisnik"],
    ["Ivan", "Ivanovic", "ivan@gmail.com", lozinkaKorisnik, "korisnik"]
  ];

  for (const k of korisnici) {
    await connectionPool.query(
      "INSERT INTO korisnici (ime, prezime, email, lozinka, uloga) VALUES ($1, $2, $3, $4, $5)",
      k
    );
  }
}

async function ubaciSale() {
  const sale = [
    ["Velika sala", 8, 12],
    ["Mala sala", 6, 8],
    ["VIP sala", 4, 6]
  ];

  for (const s of sale) {
    await connectionPool.query(
      "INSERT INTO sale (naziv, broj_redova, sjedista_po_redu) VALUES ($1, $2, $3)",
      s
    );
  }
}

async function ubaciFilmove() {
  const filmovi = [
    [
      "Backrooms: Bez izlaza.",
      "U podrumu jednog naizgled običnog salona namještaja pojavljuju se neobična vrata. Film Backrooms vodi gledaoce u uznemirujuću dimenziju tzv. „liminalnih prostora“, paralelnog svijeta u kome se stvarnost raspada, arhitektura mijenja pred očima, a nepoznate sile vrebaju u beskrajnim praznim prostorima. Ono što započinje kao naizgled bezazleno otkriće ubrzo prerasta u noćnu moru iz koje možda nema povratka. Zasnovan na viralnoj YouTube seriji koja je postala globalni fenomen internetskog horora, film donosi jedinstveno iskustvo strave – onaj nelagodni osjećaj da ste zakoračili na mjesto na kome nikada niste smjeli da budete.",
      "Naučna fantastika", 111, "Kane Parsons", "Chiwetel Ejiofor, Avan Jogia, Renate Reinsve, Lukita Maxwell, Finn Bennett, Mark Duplass",
      "backrooms.jpg"
    ],
    [
      "Disclosure Day",
      "Stiven Spilberg je jedan od najuspešnijih i najuticajnijih filmskih stvaralaca u industriji. Kao najprofitabilniji reditelj svih vremena, Spilberg je režirao blokbastere kao što su „Ajkula“, „E.T. Vanzemaljac“, franšize „Indijana Džouns“ i „Park iz doba jure“. On je trostruki dobitnik Oskara, uključujući Oskara za najbolju režiju i najbolji film za „Šindlerovu listu“, film koji je osvojio ukupno sedam Oskara, i za najbolju režiju za „Spasavanje redova Rajana“. Njegov film „Fabelmanovi“, distribuirao je studio Universal 2022. godine i dobio je sedam nominacija za Oskara, uključujući za režiju, najbolji originalni scenario, najbolju glumicu i najbolji film.",
      "Naučna fantastika", 145, "Steven Spielberg", "Colin Firth, Emily Blunt, Josh O'Connor, Eve Hewson, Colman Domingo",
      "dan_razotkrivanja.jpg"
    ],
    [
      "Masters of the Universe",
      "Nakon što je 15 godina bio razdvojen, Mač Moći vodi princa Adama nazad na Eterniju, gdje otkriva da je njegov dom razoren pod zlokobnom vladavinom Skeletora. Kako bi spasao svoju porodicu i svoj svijet, Adam mora da udruži snage sa svojim najbližim saveznicima Tilom i Dankanom i prihvati svoju pravu sudbinu kao Hi-Men, najmoćniji čovjek u univerzumu.",
      "Naučna fantastika", 141, "Travis Knight", "Kristen Wiig, Idris Elba, Jared Leto, Alison Brie, Morena Baccarin, James Purefoy, Nicholas Galitzine, Camila Mendes, Jóhannes Haukur Jóhannesson, Charlotte Riley",
      "masters_of_the_universe.jpg"
    ],
    [
      "Michael",
      "„Majkl“ je filmski portret života i nasleđa jednog od najuticajnijih umjetnika koje je svijet ikada imao priliku da upozna.",
      "Drama", 130, "Antoine Fuqua", "Miles Teller, Laura Harrier, Colman Domingo, Nia Long, Jaafar Jackson, Juliano Krue Valdi",
      "michael.jpg"
    ],
    [
      "Minions & Monsters",
      "Ovo je urnebesna, smiješna i potpuno istinita priča o tome kako su Malci osvojili Holivud, postali filmske zvijezde, izgubili sve, pustili monstrume u svijet, a zatim se udružili da pokušaju da spasu planetu od haosa koji su sami stvorili.",
      "Komedija", 90, "Pierre Coffin", "Marko Mrđenović, Dubravko Jovanović, Ognjen Drenjanin, Marijana Vićentijević Badovinac, Slobodan Ninković, Kristina Jovanović, Dragan Vujić, Aleksandar Gligorić",
      "minions.jpg"
    ],
    [
      "Scary Movie",
      "Dvadeset šest godina nakon što su pobjegli neobično poznatom ubici pod maskom, \"Glavna četvorka\" ponovo se nalazi na nišanu, a nijedna horor franšiza nije bezbjedna.",
      "Komedija", 96, "Wayans Brothers", "Marlon Vejans („Šorti“), Šon Vejans („Rej“), Ana Faris („Sindi“) i Redžina Hol („Brenda“)",
      "scary_movie.jpg"
    ],
    [
      "Obsession",
      "Mladić oslobađa moć misterioznog predmeta u želji da osvoji ljubav, ali ubrzo otkriva da svaka želja nosi mračnu i zlokobnu cijenu.",
      "Horor", 108, "Curry Barker", "Michael Johnston, Inde Navarrette, Cooper Tomlinson, Megan Lawless, Andy Richter",
      "obsession.jpg"
    ],
    [
      "The Last Whale Singer",
      "Mladi grbavi kit, sin poslednjeg legendarnog Pjevača kitova, čija je čarobna pjesma nekada štitila okeane, mora da pronađe sospstveni glas. Nakon gubitka roditelja, sumnja u sebe i svoje sposobnosti. Kada se iz glečera oslobodi strašno morsko čudovište koje prijeti cijelom životu u okeanu, započinje opasno putovanje do najdubljih djelova mora. Na tom putu, uz pomoć neobičnih saveznika i novih prijatelja, moraće da prevlada strah i otkrije snagu koja se skriva u njemu.",
      "Animirano", 91, "Reza Memari", "Jenna Wheeler-Hughes, Vincent Tong, Bruce Dinsmore, Chimwemwe Miller, Jen Viens, Elizabeth Neale, Jessica Kardos, Matthew Kabwe, Priyanka",
      "last_whale.jpg"
    ],
    [
      "Toy Story 5",
      "Disney i Pixar studio vraćaju se svojoj voljenoj animiranoj franšizi, donoseći na veliko platno još jedan nastavak. Ovog puta riječ je o spoju igračke i tehnologije. Uz Vudija, Baza, Džesi i Forkija, fanovi će se upoznati i sa novim likom - visokotehnološkom, pametnom tabletu u obliku žabe, koji će staru ekipu učiniti potpuno zatečenom. Da li je riječ o novoj prijetnji po igru?",
      "Avantura", 102, "Andrew Stanton", "Tom Hanks, Tony Hale, Tim Allen, Greta Lee, Joan Cusack, Conan O'Brien",
      "toy_story_5.jpg"
    ],
    [
      "Romería",
      "Sa majčinim dnevnikom u ruci, Marina potraga za zvaničnim dokumentima za univerzitet vodi je do njene biološke porodice na atlantskoj obali. Ono što počinje kao administrativna potraga otkriva dugo zakopane porodične tajne.",
      "Drama", 114, "Carla Simón", "Sara Casasnovas, Miryam Gallego, Tristán Ulloa, Llúcia Garcia Torras, Mitch Martín",
      "romeria.jpg"
    ]
  ];

  for (const f of filmovi) {
    await connectionPool.query(
      "INSERT INTO filmovi (naziv, opis, zanr, trajanje, reziser, glumci, poster) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      f
    );
  }
}

async function ubaciProjekcije() {
  const danas = new Date();
  function datum(dodajDana, sat, minut) {
    const d = new Date(danas);
    d.setDate(d.getDate() + dodajDana);
    d.setHours(sat, minut, 0, 0);
    return d.toISOString().slice(0, 19).replace("T", " ");
  }

  const projekcije = [
    [1, 1, datum(1, 18, 0), 5.0],
    [1, 2, datum(2, 20, 30), 5.0],
    [2, 1, datum(1, 20, 0), 5.5],
    [2, 3, datum(3, 19, 0), 8.0],
    [3, 1, datum(2, 17, 30), 6.0],
    [3, 1, datum(4, 21, 0), 6.0],
    [4, 2, datum(1, 19, 30), 5.5],
    [5, 2, datum(2, 16, 0), 4.5],
    [5, 1, datum(3, 15, 30), 4.5],
    [6, 3, datum(4, 18, 30), 8.0],

    [7, 3, datum(5, 18, 30), 4.0],
    [7, 3, datum(5, 14, 30), 5.0],
    [8, 3, datum(2, 13, 0), 4.5],
    [8, 3, datum(3, 21, 15), 6.0],
    [8, 3, datum(4, 20, 20), 5.0],
    [9, 3, datum(7, 17, 30), 5.0],
    [10, 3, datum(1, 9, 0), 4.5],
    [10, 3, datum(2, 20, 0), 6.5],
  ];

  for (const p of projekcije) {
    await connectionPool.query(
      "INSERT INTO projekcije (film_id, sala_id, datum_vrijeme, cijena) VALUES ($1, $2, $3, $4)",
      p
    );
  }
}

async function pokreni() {
  try {
    console.log("Kreiranje šeme baze...");
    await kreirajSemu();
    console.log("Brisanje postojećih podataka...");
    await ocistiBazu();
    console.log("Dodavanje korisnika...");
    await ubaciKorisnike();
    console.log("Dodavanje sala...");
    await ubaciSale();
    console.log("Dodavanje filmova...");
    await ubaciFilmove();
    console.log("Dodavanje projekcija...");
    await ubaciProjekcije();
    console.log("Gotovo! Baza je popunjena.");
    console.log("Admin nalog: admin@bioskop.me / admin123");
    console.log("Korisnik nalog: jovana@gmail.com / korisnik123");
    await connectionPool.end();
    process.exit(0);
  } catch (greska) {
    console.error("Greška pri popunjavanju baze:", greska);
    process.exit(1);
  }
}

pokreni();
