import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Separator } from "@/components/ui/separator";

const nav = [
  { href: "/account", label: "Profile" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/addresses", label: "Addresses" },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="container mx-auto flex flex-1 gap-8 px-4 py-8">
        <aside className="hidden w-48 shrink-0 md:block">
          <nav className="space-y-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:text-foreground block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <Separator orientation="vertical" className="hidden md:block" />
        <main className="flex-1">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
