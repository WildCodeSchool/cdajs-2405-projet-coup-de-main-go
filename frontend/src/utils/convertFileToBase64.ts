export function convertFileToBase64(file: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (reader.result) {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("File reading failed"));
        }
      } else {
        reject(new Error("File reading failed"));
      }
    };
    reader.onerror = (error) => reject(error);
  });
}
