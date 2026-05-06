interface ComingSoonProps {
  feature?: string;
}

export function ComingSoon({ feature }: ComingSoonProps) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
      <div className="text-muted-foreground text-5xl">🚧</div>
      <h2 className="text-2xl font-semibold">Coming Soon</h2>
      {feature && (
        <p className="text-muted-foreground max-w-sm">
          {feature} will be available here once the API ships those endpoints.
        </p>
      )}
    </div>
  );
}
