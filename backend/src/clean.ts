import "reflect-metadata";
import { dataSource } from "./datasource/index";

async function clean() {
  // Initialisation de la source de données
  await dataSource.initialize();
  console.log("Base de données PostgreSQL initialisée avec succès.");

  // Liste des tables à nettoyer
  const tables = [
    '"chat"',
    '"message"',
    '"review"',
    '"transaction"',
    '"ad"',
    '"user"', 
    '"skill"'
  ];

  // Suppression des données dans chaque table
  for (const table of tables) {
    await dataSource.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`);
    console.log(`Table ${table} nettoyée avec succès.`);
  }

  console.log("Nettoyage de la base de données terminé avec succès !");
  await dataSource.destroy();
}

clean().catch((error) => {
  console.error("Erreur lors du nettoyage de la base de données : ", error);
  process.exit(1);
});