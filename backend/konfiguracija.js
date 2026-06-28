require("dotenv").config();

module.exports = {
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET || "tajna_za_razvoj",
  baza: {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_KORISNIK || "postgres",
    password: process.env.DB_LOZINKA || "",
    database: process.env.DB_IME || "bioskop"
  }
};
