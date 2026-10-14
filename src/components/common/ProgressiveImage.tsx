import { useState, type ImgHTMLAttributes } from "react";
import { ImageOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { optimizeImageUrl } from "@/utils/optimize-image-url";

type ProgressiveImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "className" | "src"
> & {
  src?: string;
  width: number;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
};

export function ProgressiveImage({
  src,
  width,
  className,
  imageClassName,
  priority = false,
  onLoad,
  onError,
  ...props
}: ProgressiveImageProps) {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const isLoaded = loadedSrc === src;

  if (!src || !src.trim() || failedSrc === src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500",
          className,
        )}
        role="img"
        aria-label={props.alt || "Image unavailable"}
      >
        <ImageOff className="h-8 w-8" aria-hidden="true" />
      </div>
    );
  }

  const imageSrc = src;

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <img
        src={optimizeImageUrl(
          imageSrc,
          Math.max(24, Math.round(width / 8)),
          "low",
        )}
        alt=""
        aria-hidden="true"
        className={cn(
          "absolute inset-0 h-full w-full scale-105 object-cover blur-lg transition-opacity duration-500",
          isLoaded ? "opacity-0" : "opacity-100",
        )}
        width={width}
        height={props.height}
        decoding="async"
      />
      <img
        {...props}
        src={optimizeImageUrl(imageSrc, width)}
        className={cn(
          "relative h-full w-full object-cover transition-opacity duration-500",
          isLoaded ? "opacity-100" : "opacity-0",
          imageClassName,
        )}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        onLoad={(event) => {
          setLoadedSrc(imageSrc);
          onLoad?.(event);
        }}
        onError={(event) => {
          setFailedSrc(imageSrc);
          onError?.(event);
        }}
      />
    </div>
  );
}
