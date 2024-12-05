import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";
import { Ad } from "../entities/Ad";
import { dataSource } from "../datasource/index";
import { User } from "../entities/User";

const deleteFileFromPath = (filePath: string) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

export default async function uploadFilesToService(
  filePath: string,
  targetType: "user" | "ad",
  id: string,
  pictureKey?: "picture1" | "picture2" | "picture3"
): Promise<string> {
  const formData = new FormData();

  const targetFolder = path.resolve(
    process.cwd(),
    "..",
    "upload-service",
    "src",
    "uploads",
    targetType === "user" ? "users" : "ads",
    id
  );

  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder, { recursive: true });
  }

  // Get the old file path from the database
  let oldFilePath = "";
  if (targetType === "ad") {
    const ad = await dataSource.manager.findOneBy(Ad, { id });
    if (ad && pictureKey && ad[pictureKey]) {
      oldFilePath = path.join(targetFolder, ad[pictureKey]);
    }
  } else {
    const user = await dataSource.manager.findOneBy(User, { id });
    if (user && user.picture) {
      oldFilePath = path.join(targetFolder, user.picture);
    }
  }

  // Remove the old file
  if (oldFilePath) {
    deleteFileFromPath(oldFilePath);
  }

  if (targetType === "user") {
    formData.append("userId", id);
    const fileName = path.basename(filePath);
    formData.append("file", fs.createReadStream(filePath), fileName);
  } else {
    formData.append("adId", id);
    const fileName = path.basename(filePath);
    formData.append("file", fs.createReadStream(filePath), fileName);
  }

  const targetUrl =
    targetType === "user"
      ? `${process.env.UPLOAD_SERVICE_URL}/upload-user-picture`
      : `${process.env.UPLOAD_SERVICE_URL}/upload-ad-picture`;

  try {
    const response = await axios.post(targetUrl, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    return response.data.filename;
  } catch (error) {
    console.error("Erreur lors de l'upload :", error);
    throw new Error("Upload service failed");
  }
}
