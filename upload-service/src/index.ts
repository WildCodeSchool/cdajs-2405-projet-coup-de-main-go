import express, { Request, Response } from "express";
import { config } from "dotenv";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

config();

const port: number = parseInt(process.env.EXPRESS_PORT || "", 10);

const app = express();
app.use(express.json({ limit: "1mb" })); 
app.use(express.urlencoded({ extended: true, limit: "1mb" }))

interface MIME_TYPES_INTERFACE {
  [key: string]: string;
}

const MIME_TYPES: MIME_TYPES_INTERFACE = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const ensureDirectoryExists = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Paths for uploads
const uploadPaths = {
  user: path.join(__dirname, "uploads/users"),
  ad: path.join(__dirname, "uploads/ads"),
};

Object.values(uploadPaths).forEach(ensureDirectoryExists);

const saveBase64File = (
  base64String: string,
  folderPath: string,
  fileName: string
): string => {
  const matches = base64String.match(/^data:(.+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error("Le fichier en Base64 est invalide.");
  }

  const fileType = matches[1];
  const fileExtension = MIME_TYPES[fileType] || "jpg";
  const fileData = Buffer.from(matches[2], "base64");

  ensureDirectoryExists(folderPath);

  const completeFileName = `${fileName}.${fileExtension}`;
  const fullPath = path.join(folderPath, completeFileName);

  fs.writeFileSync(fullPath, fileData);
  return completeFileName;
};

const handleBase64Upload = (route: string, type: "user" | "ad") => {
  app.post(route, (req: Request, res: Response) => {
    try {
      const { base64File, userId, adId } = req.body;

      if (!base64File) {
        res.status(400).send("Aucun fichier Base64 fourni.");
        return;
      }

      const id = type === "user" ? userId : adId;
      if (!id) {
        res.status(400).send(`L'identifiant ${type} est requis.`);
        return;
      }

      const folderPath = path.join(uploadPaths[type], id);
      const uniqueFileName = `${Date.now()}_${uuidv4()}`;
      const savedFileName = saveBase64File(
        base64File,
        folderPath,
        uniqueFileName
      );

      res.json({ filename: savedFileName });
    } catch (error) {
      res
        .status(500)
        .send(
          `Erreur lors de l'upload du fichier : ${(error as Error).message}`
        );
    }
  });
};

handleBase64Upload("/upload-user-picture", "user");
handleBase64Upload("/upload-ad-picture", "ad");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(port, () => {
  console.log(`📸 Le serveur d'upload a démarré au port : ${port} !`);
});
