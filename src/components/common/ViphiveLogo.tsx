interface ViphiveLogoProps {
  compact?: boolean;
}

export function ViphiveLogo({ compact = false }: ViphiveLogoProps) {
  if (compact) {
    return (
      <img
        src="/favicon.ico"
        alt="VIPHive"
        className="h-9 w-9 object-contain cursor-pointer rounded-lg"
      />
    );
  }

  return (
    <img
      src="/VIPHive_logo_light.png"
      alt="VIPHive - More than a marketplace"
      className="h-auto w-32 object-contain sm:w-40 bg-primary dark:bg-transparent cursor-pointer rounded-lg"
    />
  );
}
