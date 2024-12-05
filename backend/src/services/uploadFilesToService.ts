import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";

const clearFolder = (folderPath: string) => {
  if (fs.existsSync(folderPath)) {
    const files = fs.readdirSync(folderPath);
    files.forEach((file) => {
      const filePath = path.join(folderPath, file);
      fs.unlinkSync(filePath);
    });
  }
};

export default async function uploadFilesToService(
  filePaths: string | string[],
  targetType: "user" | "ad",
  id: string
): Promise<string | string[]> {
  const formData = new FormData();

  const targetFolder = path.resolve(
    process.cwd(),
    '..',
    'upload-service',
    'src',
    'uploads',
    targetType === "user" ? "users" : "pictures",
    id
  );
  clearFolder(targetFolder);

  if (targetType === "user") {
    formData.append("userId", id);
    const fileName = path.basename(filePaths as string);
    formData.append("file", fs.createReadStream(filePaths as string), fileName);
  } else {
    formData.append("adId", id);
    (filePaths as string[]).forEach((filePath) => {
      const fileName = path.basename(filePath);
      formData.append("files", fs.createReadStream(filePath), fileName);
    });
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

    if (targetType === "user") {
      return response.data.filename;
    } else {
      return response.data.filenames;
    }

  } catch (error) {
    console.error("Erreur lors de l'upload :", error);
    throw new Error("Upload service failed");
  }
}
