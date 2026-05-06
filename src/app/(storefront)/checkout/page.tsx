"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/stores/cart-store";
import { useCreateOrder } from "@/features/checkout/use-create-order";

const addressSchema = z.object({
  street: z.string().min(1, "Required"),
  city: z.string().min(1, "Required"),
  state: z.string().min(1, "Required"),
  zip: z.string().min(1, "Required"),
  country: z.string().min(2, "Required"),
});

type FormValues = z.infer<typeof addressSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { cartId } = useCartStore();
  const createOrder = useCreateOrder();

  const form = useForm<FormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: { street: "", city: "", state: "", zip: "", country: "US" },
  });

  async function onSubmit(values: FormValues) {
    if (!cartId) {
      toast.error("No cart found. Please add items first.");
      return;
    }
    try {
      const order = await createOrder.mutateAsync({
        cartId,
        shippingAddress: values,
      });
      toast.success(`Order placed! #${order.orderNumber}`);
      router.push(`/checkout/confirmation?order=${order.orderNumber}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to place order");
    }
  }

  if (!cartId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-4 text-3xl font-bold">Checkout</h1>
        <p className="text-muted-foreground">Your cart is empty. Add items before checking out.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-lg px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Checkout</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Shipping Address</h2>
          <Separator />
        </div>
        {(["street", "city", "state", "zip", "country"] as const).map((field) => (
          <div key={field} className="space-y-1">
            <Label htmlFor={field} className="capitalize">{field}</Label>
            <Input id={field} {...form.register(field)} />
            {form.formState.errors[field] && (
              <p className="text-destructive text-xs">{form.formState.errors[field]?.message}</p>
            )}
          </div>
        ))}
        <Button type="submit" className="w-full" disabled={createOrder.isPending}>
          {createOrder.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Place Order
        </Button>
      </form>
    </div>
  );
}
