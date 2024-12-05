import express, { Request, Response } from "express";
import multer from "multer";
import { config } from "dotenv";
import fs from "fs";
import path from "path";

config();

const port: number = parseInt(process.env.EXPRESS_PORT || "", 10);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

const userUploadPath = path.join(__dirname, "uploads/users");
const adUploadPath = path.join(__dirname, "uploads/pictures");

ensureDirectoryExists(userUploadPath);
ensureDirectoryExists(adUploadPath);

const userStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.body.userId;
    const userFolderPath = path.join(userUploadPath, userId);
    ensureDirectoryExists(userFolderPath);
    cb(null, userFolderPath);
  },
  filename: (req, file, cb) => {
    const name = file.originalname.split(".").slice(0, -1).join(".");
    const extension = MIME_TYPES[file.mimetype] || "jpg";
    cb(null, `${name}_${Date.now()}.${extension}`);
  },
});

const adStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const adId = req.body.adId;
    const adFolderPath = path.join(adUploadPath, adId);
    ensureDirectoryExists(adFolderPath);
    cb(null, adFolderPath);
  },
  filename: (req, file, cb) => {
    const name = file.originalname.split(".").slice(0, -1).join(".");
    const extension = MIME_TYPES[file.mimetype] || "jpg";
    cb(null, `${name}_${Date.now()}.${extension}`);
  },
});

const uploadUserPicture = multer({ storage: userStorage });
const uploadAdPictures = multer({ storage: adStorage });

// Route pour uploader une photo de profil (1 fichier)
app.post(
  "/upload-user-picture",
  uploadUserPicture.single("file"),
  (req: express.Request, res: express.Response): void => {
    if (!req.file) {
      res.status(400).send("Aucun fichier uploadé.");
      return;
    }

    const uploadedFileName = (req.file as Express.Multer.File).filename;

    res.json({ filename: uploadedFileName });
  }
);

// Route pour uploader des images d'annonces (3 fichiers max)
app.post(
  "/upload-ad-picture",
  uploadAdPictures.array("files", 3),
  (req: express.Request, res: express.Response): void => {
    if (!req.files || req.files.length === 0) {
      res.status(400).send("Aucun fichier uploadé.");
      return;
    }

    const uploadedFileNames = (req.files as Express.Multer.File[]).map(
      (file: Express.Multer.File) => file.filename
    );

    res.json({ filenames: uploadedFileNames });
  }
);

app.listen(port, () => {
  console.log(`📸 Le serveur d'upload a démarré au port : ${port} !`);
});
