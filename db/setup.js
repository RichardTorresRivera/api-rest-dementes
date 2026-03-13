import pgPromise from "pg-promise";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { DB_BASE_URL, DB_NAME, DB_URL } from "../server/config/env.js";

const pgp = pgPromise()

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaSql = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf-8");
const seedSql = fs.readFileSync(path.join(__dirname, "seed.sql"), "utf-8");

async function setupDatabase() {
  const dbAdmin = pgp(`${DB_BASE_URL}/postgres`);

  try {
    console.log("Creating database...");
    
    await dbAdmin.none(`DROP DATABASE IF EXISTS ${DB_NAME}`);
    await dbAdmin.none(`CREATE DATABASE ${DB_NAME}`)
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