import fs from "fs";
import path from "path";

const MIME_TYPES: Record<string, string> = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

interface UploadOptions {
  base64String: string;
  targetType: "user" | "ad";
  id: string;
  oldFileName?: string; 
}

const uploadFile = ({ base64String, targetType, id, oldFileName }: UploadOptions): string => {
  const matches = base64String.match(/^data:(.+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error("Le fichier Base64 est invalide.");
  }

  const fileType = matches[1];
  const fileExtension = MIME_TYPES[fileType] || "jpg";

  const folderPath = path.join(
    __dirname,
    "..",
    "..",
    "uploads",
    targetType === "user" ? "users" : "ads",
    id
  );

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  if (oldFileName) {
    const oldFilePath = path.join(folderPath, oldFileName);
    if (fs.existsSync(oldFilePath)) {
      fs.unlinkSync(oldFilePath);
    }
  }

  const uniqueFileName = `${Date.now()}.${fileExtension}`;

  const fileData = Buffer.from(matches[2], "base64");

  const fullPath = path.join(folderPath, uniqueFileName);
  fs.writeFileSync(fullPath, fileData);

  return uniqueFileName;
};

export default uploadFile;
