export function Footer() {
  return (
    <footer className="border-border/40 mt-auto border-t py-8">
      <div className="container mx-auto px-4 text-center">
        <p className="text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} TTE Store. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
