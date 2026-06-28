# Platforma za rezervaciju karti

Web aplikacija za rezervaciju bioskopskih karti sa vizuelnim izborom sjedišta,
upravljanjem korisnicima, filmovima i projekcijama. Sastoji se iz dva odvojena
dijela: **backend** (Node.js + Express + PostgreSQL) i **frontend** (React + Vite).

## Pokretanje

### Backend

```
cd backend
cp .env.example .env        # podesite podatke o bazi (DB_KORISNIK, DB_LOZINKA...)
npm install
npm run seed                # kreira tabele i ubacuje test podatke
npm start
```

Server se pokreće na `http://localhost:4000`.

### Frontend

```
cd frontend
npm install
npm run dev
```

Aplikacija se otvara na `http://localhost:5173`.

## Test nalozi

| Uloga    | Email               | Lozinka       |
|----------|---------------------|---------------|
| Admin    | admin@bioskop.me    | 12345678      |
| Korisnik | marko@gmail.com     | 12345678      |