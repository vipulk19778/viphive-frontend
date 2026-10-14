const PEXELS_HOST = "images.pexels.com";
const CLOUDINARY_HOST = "res.cloudinary.com";

export function optimizeImageUrl(
  imageUrl: string | undefined,
  width: number,
  quality: "auto" | "low" = "auto",
) {
  if (!imageUrl) return imageUrl;

  try {
    const url = new URL(imageUrl);

    if (url.hostname === CLOUDINARY_HOST) {
      const uploadMarker = "/upload/";
      const uploadIndex = url.pathname.indexOf(uploadMarker);

      if (uploadIndex === -1) return imageUrl;

      const transformation = `f_auto,q_auto${quality === "low" ? ":low" : ""},w_${width}`;
      url.pathname = `${url.pathname.slice(0, uploadIndex + uploadMarker.length)}${transformation}/${url.pathname.slice(uploadIndex + uploadMarker.length)}`;
      return url.toString();
    }

    if (url.hostname !== PEXELS_HOST) return imageUrl;

    url.searchParams.set("auto", "compress");
    url.searchParams.set("cs", "tinysrgb");
    url.searchParams.set("w", String(width));
    if (quality === "low") url.searchParams.set("q", "20");
    return url.toString();
  } catch {
    return imageUrl;
  }
}
