import imageCompression from "browser-image-compression";

export async function compressImage(file: File): Promise<File> {
  try {
    return await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1600,
      useWebWorker: true,
    });
  } catch (e) {
    console.warn("[compress] failed, using original:", e);
    return file;
  }
}
