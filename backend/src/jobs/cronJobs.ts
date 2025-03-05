import { UserMutations } from "../resolvers/UserMutations";
import nodeCron from "node-cron";

const colorText = (text: string, colorCode: string) => {
  return `\x1b[${colorCode}m${text}\x1b[0m`;
};

const creditWeeklyMango = async () => {
  const userMutations = new UserMutations();
  try {
    await userMutations.creditWeeklyMango();
    console.log(colorText("✅ Crédit de mangue effectué avec succès !", "32;1")); 
  } catch (error) {
    console.log(
      colorText("❌ Erreur lors du crédit de mangue: ", "31;1") +
        colorText(String(error), "33")
    );
  }
};

nodeCron.schedule("1 0 * * 1", async () => {
  console.log(
    colorText(`⏰ Cron job exécuté à ${new Date().toLocaleString()}`, "36;1")
  );
  await creditWeeklyMango();
});
