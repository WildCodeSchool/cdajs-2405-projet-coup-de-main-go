import axios from "axios";
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
  base64Data: string,
  targetType: "user" | "ad",
  id: string,
  pictureKey?: "picture1" | "picture2" | "picture3"
): Promise<string> {
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

  if (oldFilePath) {
    deleteFileFromPath(oldFilePath);
  }

  const targetUrl =
    targetType === "user"
      ? `${process.env.UPLOAD_SERVICE_URL}/upload-user-picture`
      : `${process.env.UPLOAD_SERVICE_URL}/upload-ad-picture`;

  try {
    const payload = {
      base64File: base64Data,
      userId: targetType === "user" ? id : undefined,
      adId: targetType === "ad" ? id : undefined,
    };

    const response = await axios.post(targetUrl, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data.filename;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 413) {
      throw new Error("Un ou plusieurs fichiers sont trop volumineux. Taille maximale : 1 Mo.");
    } else {
      throw new Error("Upload service failed");
    }
  }
}
