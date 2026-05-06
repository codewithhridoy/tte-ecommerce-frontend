"use client";

import { useSession } from "@/features/auth/use-session";
import { useLogout } from "@/features/auth/use-logout";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AccountPage() {
  const { data: user } = useSession();
  const logout = useLogout();
  const router = useRouter();

  async function handleLogout() {
    await logout.mutateAsync();
    toast.success("Signed out");
    router.push("/login");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Profile</h1>
      {user && (
        <div className="space-y-2 text-sm">
          <p><span className="text-muted-foreground">Email:</span> {user.email}</p>
          {user.fullName && <p><span className="text-muted-foreground">Name:</span> {user.fullName}</p>}
          <p><span className="text-muted-foreground">Role:</span> {user.role}</p>
        </div>
      )}
      <Button variant="outline" onClick={handleLogout} disabled={logout.isPending}>
        Sign out
      </Button>
    </div>
  );
}
