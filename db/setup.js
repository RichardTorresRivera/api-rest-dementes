import pgPromise from "pg-promise";
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import { fileURLToPath } from "url";
import { DB_BASE_URL, DB_NAME, DB_URL } from "../server/config/env.js";

const pgp = pgPromise();

const seedUsers = [
  { rol: "admin", email: "admin@test.com", password: "test" },
  { rol: "paciente", email: "paciente@test.com", password: "test" },
  { rol: "paciente", email: "maria.lopez@test.com", password: "test" },
  { rol: "paciente", email: "carlos.sanchez@test.com", password: "test" },
  { rol: "paciente", email: "ana.torres@test.com", password: "test" },
  { rol: "paciente", email: "luca.morales@test.com", password: "test" },
  { rol: "psicologo", email: "psico@test.com", password: "test" },
  { rol: "psicologo", email: "miguel.garcia@test.com", password: "test" },
  { rol: "psicologo", email: "sofia.ruiz@test.com", password: "test" },
  { rol: "psicologo", email: "pedro.castillo@test.com", password: "test" },
  { rol: "psicologo", email: "valeria.ortiz@test.com", password: "test" },
];

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaSql = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf-8");
const seedSql = fs.readFileSync(path.join(__dirname, "seed.sql"), "utf-8");

async function setupDatabase() {
  const dbAdmin = pgp(`${DB_BASE_URL}/postgres`);

  try {
    console.log("Creating database...");

    await dbAdmin.none(`DROP DATABASE IF EXISTS ${DB_NAME}`);
    await dbAdmin.none(`CREATE DATABASE ${DB_NAME}`);
    pgp.end();

    console.log(`Database ${DB_NAME} created successfully.`);
  } catch (error) {
    console.error("Error setting up database:", error);
    process.exit(1);
  }

  const db = pgp(DB_URL);

  try {
    console.log("Setting up database schema...");
    await db.none(schemaSql);
    console.log("Database schema set up successfully.");

    console.log("Seeding users...");
    const usersWithHash = await Promise.all(
      seedUsers.map(async (u) => ({
        rol: u.rol,
        email: u.email,
        password: await bcrypt.hash(u.password, 10),
      })),
    );

    const cs = new pgp.helpers.ColumnSet(["rol", "email", "password"], {
      table: "usuario",
    });
    const query = pgp.helpers.insert(usersWithHash, cs);

    await db.none(query);

    console.log("Seeding database...");
    await db.none(seedSql);
    console.log("Database seeded successfully.");
  } catch (error) {
    console.error("Error setting up database:", error);
    process.exit(1);
  } finally {
    pgp.end();
  }
}

setupDatabase();
