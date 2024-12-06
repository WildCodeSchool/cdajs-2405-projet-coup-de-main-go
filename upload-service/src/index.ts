import express, { Request, Response } from "express";
import multer from "multer";
import { config } from "dotenv";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

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

// Paths for uploads
const uploadPaths = {
  user: path.join(__dirname, "uploads/users"),
  ad: path.join(__dirname, "uploads/ads"),
};

Object.values(uploadPaths).forEach(ensureDirectoryExists);

const createStorage = (type: "user" | "ad") =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const id = type === "user" ? req.body.userId : req.body.adId;
      const folderPath = path.join(uploadPaths[type], id);
      ensureDirectoryExists(folderPath);
      cb(null, folderPath);
    },
    filename: (req, file, cb) => {
      const name = file.originalname.split(".").slice(0, -1).join(".");
      const extension = MIME_TYPES[file.mimetype] || "jpg";
      const uniqueId = uuidv4();
      cb(null, `${name}_${Date.now()}_${uniqueId}.${extension}`);
    },
  });

const createUploadRoute = (
  route: string,
  type: "user" | "ad",
  fieldName: string
) => {
  const upload = multer({ storage: createStorage(type) });

  app.post(route, upload.single(fieldName), (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).send("Aucun fichier uploadé.");
      return;
    }

    const uploadedFileName = (req.file as Express.Multer.File).filename;

    res.json({ filename: uploadedFileName });
  });
};

createUploadRoute("/upload-user-picture", "user", "file");
createUploadRoute("/upload-ad-picture", "ad", "file");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(port, () => {
  console.log(`📸 Le serveur d'upload a démarré au port : ${port} !`);
});
