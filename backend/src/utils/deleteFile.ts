import fs from "fs";
import path from "path";

// Fonction pour supprimer un fichier donné
const deleteFile = (
  fileName: string,
  targetType: "user" | "ad",
  id: string
): void => {
  const folderPath = path.join(
    __dirname,
    "..",
    "..",
    "uploads",
    targetType === "user" ? "users" : "ads",
    id
  );
  const filePath = path.join(folderPath, fileName);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

export default deleteFile;
