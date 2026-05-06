import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageProps {
  searchParams: Promise<{ order?: string }>;
}

export default async function ConfirmationPage({ searchParams }: PageProps) {
  const { order } = await searchParams;

  return (
    <div className="container mx-auto flex flex-col items-center justify-center px-4 py-16 text-center">
      <CheckCircle className="mb-4 h-16 w-16 text-green-500" />
      <h1 className="mb-2 text-3xl font-bold">Order Confirmed!</h1>
      {order && <p className="text-muted-foreground mb-6">Order number: {order}</p>}
      <Button asChild>
        <Link href="/products">Continue Shopping</Link>
      </Button>
    </div>
  );
}
