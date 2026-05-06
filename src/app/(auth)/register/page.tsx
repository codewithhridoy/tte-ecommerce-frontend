"use client";

import Link from "next/link";
import { useState } from "react";
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
import { useRegister } from "@/features/auth/use-register";
import { useSendOtp } from "@/features/auth/use-send-otp";
import { useVerifyOtp } from "@/features/auth/use-verify-otp";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(10, "At least 10 characters"),
  fullName: z.string().min(1, "Required"),
});

const otpSchema = z.object({
  code: z.string().min(4, "Enter the verification code").max(10, "Code is too long"),
});

type FormValues = z.infer<typeof schema>;
type OtpValues = z.infer<typeof otpSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const register = useRegister();
  const sendOtp = useSendOtp();
  const verifyOtp = useVerifyOtp();
  const [registeredUser, setRegisteredUser] = useState<{ id: string; email: string } | null>(null);
  const [otpMeta, setOtpMeta] = useState<{ expiresAt: string; resendAllowedAt: string } | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", fullName: "" },
  });

  const otpForm = useForm<OtpValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { code: "" },
  });

  async function onSubmit(values: FormValues) {
    try {
      const result = await register.mutateAsync(values);
      const user = result.data.user;
      setRegisteredUser({ id: user.id, email: user.email });
      const otp = await sendOtp.mutateAsync({ purpose: "email_verification" });
      setOtpMeta(otp.data);
      toast.success("Account created. Check your email for the verification code.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    }
  }

  async function onVerify(values: OtpValues) {
    if (!registeredUser) return;

    try {
      await verifyOtp.mutateAsync({
        userId: registeredUser.id,
        purpose: "email_verification",
        code: values.code,
      });
      toast.success("Email verified");
      router.push("/account");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Verification failed");
    }
  }

  async function handleResend() {
    try {
      const otp = await sendOtp.mutateAsync({ purpose: "email_verification" });
      setOtpMeta(otp.data);
      toast.success("Verification code sent");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to resend code");
    }
  }

  if (registeredUser) {
    return (
      <div className="bg-card w-full max-w-sm space-y-6 rounded-lg border p-8">
        <div>
          <h1 className="text-2xl font-semibold">Verify email</h1>
          <p className="text-muted-foreground mt-1 text-sm">{registeredUser.email}</p>
        </div>
        <Separator />
        <form onSubmit={otpForm.handleSubmit(onVerify)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="code">Verification code</Label>
            <Input id="code" inputMode="numeric" autoComplete="one-time-code" {...otpForm.register("code")} />
            {otpForm.formState.errors.code && (
              <p className="text-destructive text-xs">{otpForm.formState.errors.code.message}</p>
            )}
            {otpMeta && (
              <p className="text-muted-foreground text-xs">
                Expires {new Date(otpMeta.expiresAt).toLocaleTimeString()}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={verifyOtp.isPending}>
            {verifyOtp.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify email
          </Button>
        </form>
        <Button variant="outline" className="w-full" onClick={handleResend} disabled={sendOtp.isPending}>
          {sendOtp.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Resend code
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card w-full max-w-sm space-y-6 rounded-lg border p-8">
      <div>
        <h1 className="text-2xl font-semibold">Create account</h1>
        <p className="text-muted-foreground mt-1 text-sm">Join TTE Store today</p>
      </div>
      <Separator />
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" autoComplete="name" {...form.register("fullName")} />
          {form.formState.errors.fullName && (
            <p className="text-destructive text-xs">{form.formState.errors.fullName.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" {...form.register("email")} />
          {form.formState.errors.email && (
            <p className="text-destructive text-xs">{form.formState.errors.email.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" autoComplete="new-password" {...form.register("password")} />
          {form.formState.errors.password && (
            <p className="text-destructive text-xs">{form.formState.errors.password.message}</p>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={register.isPending}>
          {register.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create account
        </Button>
      </form>
      <p className="text-muted-foreground text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-foreground underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
