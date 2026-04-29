import imageCompression from "browser-image-compression";

export async function compressImage(file: File): Promise<File> {
  try {
    const compressed = await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1600,
      useWebWorker: true,
    });
    // 圧縮結果の File 名がブラウザによっては失われ、FormData 経由で
    // "blob" 扱いになり R2 上のキーが ".blob" 拡張子になるため、
    // 元のファイル名と type で明示的に再ラップする。
    return new File([compressed], file.name, {
      type: compressed.type || file.type,
    });
  } catch (e) {
    console.warn("[compress] failed, using original:", e);
    return file;
  }
}
