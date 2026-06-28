const OSNOVA = import.meta.env.VITE_API || "http://localhost:4000";

function uzmiToken() {
  return localStorage.getItem("token");
}

async function posalji(putanja, opcije = {}) {
  const zaglavlja = opcije.zaglavlja || {};
  const token = uzmiToken();
  if (token) zaglavlja["Authorization"] = "Bearer " + token;

  let tijelo = opcije.tijelo;
  if (tijelo && !(tijelo instanceof FormData)) {
    zaglavlja["Content-Type"] = "application/json";
    tijelo = JSON.stringify(tijelo);
  }

  const odgovor = await fetch(OSNOVA + putanja, {
    method: opcije.metod || "GET",
    headers: zaglavlja,
    body: tijelo
  });

  const podaci = await odgovor.json().catch(() => ({}));
  if (!odgovor.ok) {
    throw new Error(podaci.poruka || "Došlo je do greške.");
  }
  return podaci;
}

export const api = {
  osnova: OSNOVA,
  get: (p) => posalji(p),
  post: (p, tijelo) => posalji(p, { metod: "POST", tijelo }),
  put: (p, tijelo) => posalji(p, { metod: "PUT", tijelo }),
  izbrisi: (p) => posalji(p, { metod: "DELETE" }),
  posaljiFormu: (p, metod, formData) => posalji(p, { metod, tijelo: formData })
};

export function slikaUrl(ime) {
  return ime ? OSNOVA + "/uploads/" + ime : null;
}
