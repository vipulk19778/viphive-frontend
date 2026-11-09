import { describe, expect, it } from "vitest";

import { optimizeImageUrl } from "./optimize-image-url";

describe("optimizeImageUrl", () => {
  it("returns undefined when the image URL is missing", () => {
    expect(optimizeImageUrl(undefined, 320)).toBeUndefined();
  });

  it("adds a small low-quality transformation for Pexels images", () => {
    const optimized = new URL(
      optimizeImageUrl(
        "https://images.pexels.com/photos/123/image.jpg",
        80,
        "low",
      )!,
    );

    expect(optimized.searchParams.get("w")).toBe("80");
    expect(optimized.searchParams.get("q")).toBe("20");
    expect(optimized.searchParams.get("auto")).toBe("compress");
  });

  it("adds Cloudinary transformations before the asset path", () => {
    expect(
      optimizeImageUrl(
        "https://res.cloudinary.com/demo/image/upload/products/item.jpg",
        640,
        "low",
      ),
    ).toBe(
      "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto:low,w_640/products/item.jpg",
    );
  });

  it("leaves other image hosts unchanged", () => {
    const imageUrl = "https://cdn.example.com/product.jpg";
    expect(optimizeImageUrl(imageUrl, 640)).toBe(imageUrl);
  });

  it("returns malformed URLs unchanged", () => {
    const imageUrl = "not-a-url";
    expect(optimizeImageUrl(imageUrl, 640)).toBe(imageUrl);
  });
});
