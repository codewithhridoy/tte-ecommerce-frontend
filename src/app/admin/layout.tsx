import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Separator } from "@/components/ui/separator";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/inventory", label: "Inventory" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="container mx-auto flex flex-1 gap-8 px-4 py-8">
        <aside className="hidden w-48 shrink-0 md:block">
          <p className="text-muted-foreground mb-2 px-3 text-xs font-semibold uppercase tracking-wider">
            Admin
          </p>
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
    </div>
  );
}
