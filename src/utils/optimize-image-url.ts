const PEXELS_HOST = "images.pexels.com";

export function optimizeImageUrl(imageUrl: string | undefined, width: number) {
  if (!imageUrl) return imageUrl;

  try {
    const url = new URL(imageUrl);

    if (url.hostname !== PEXELS_HOST) return imageUrl;

    url.searchParams.set("auto", "compress");
    url.searchParams.set("cs", "tinysrgb");
    url.searchParams.set("w", String(width));
    return url.toString();
  } catch {
    return imageUrl;
  }
}
