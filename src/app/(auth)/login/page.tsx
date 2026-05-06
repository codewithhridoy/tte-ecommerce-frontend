"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft, Loader2, MailCheck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useLogin } from "@/features/auth/use-login";
import { useCompleteLogin } from "@/features/auth/use-complete-login";

const credentialsSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Required"),
});

type CredentialsValues = z.infer<typeof credentialsSchema>;

interface OtpState {
  userId: string;
  resendAllowedAt: string;
  email: string;
  password: string;
}

function useCountdown(targetIso: string) {
  const [secondsLeft, setSecondsLeft] = useState(() =>
    Math.max(0, Math.ceil((new Date(targetIso).getTime() - Date.now()) / 1000)),
  );

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  useEffect(() => {
    setSecondsLeft(Math.max(0, Math.ceil((new Date(targetIso).getTime() - Date.now()) / 1000)));
  }, [targetIso]);

  return secondsLeft;
}

const OTP_LENGTH = 6;

function OtpForm({ otpState, onBack, next }: { otpState: OtpState; onBack: () => void; next: string }) {
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>(Array(OTP_LENGTH).fill(null));
  const completeLogin = useCompleteLogin();
  const login = useLogin();
  const [resendAllowedAt, setResendAllowedAt] = useState(otpState.resendAllowedAt);
  const secondsLeft = useCountdown(resendAllowedAt);
  const canResend = secondsLeft === 0;
  const progress = Math.max(0, Math.min(1, secondsLeft / 60));

  const code = digits.join("");
  const isComplete = code.length === OTP_LENGTH;

  const handleDigitChange = useCallback((index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, []);

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        if (digits[index]) {
          setDigits((prev) => {
            const next = [...prev];
            next[index] = "";
            return next;
          });
        } else if (index > 0) {
          inputRefs.current[index - 1]?.focus();
          setDigits((prev) => {
            const next = [...prev];
            next[index - 1] = "";
            return next;
          });
        }
        e.preventDefault();
      } else if (e.key === "ArrowLeft" && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [digits],
  );

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i] ?? "";
    setDigits(next);
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isComplete || completeLogin.isPending) return;
    try {
      await completeLogin.mutateAsync({ userId: otpState.userId, code });
      toast.success("Welcome back!");
      router.push(next);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid code");
      setDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    }
  }

  async function handleResend() {
    if (!canResend || login.isPending) return;
    try {
      const result = await login.mutateAsync({ email: otpState.email, password: otpState.password });
      setResendAllowedAt(result.data.resendAllowedAt);
      setDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
      toast.success("A new code has been sent to your email");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to resend code");
    }
  }

  const circumference = 2 * Math.PI * 20;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="bg-card w-full max-w-sm space-y-6 rounded-lg border p-8">
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground mt-1 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold">Check your email</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            We sent a 6-digit code to{" "}
            <span className="text-foreground font-medium">{otpState.email}</span>
          </p>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="bg-primary/10 rounded-full p-4">
          <MailCheck className="text-primary h-8 w-8" />
        </div>
      </div>

      <Separator />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label className="text-center block text-sm">Enter verification code</Label>
          <div className="flex justify-center gap-2" onPaste={handlePaste}>
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={[
                  "border-input bg-background focus:border-primary h-12 w-10 rounded-md border text-center text-lg font-semibold outline-none transition-all",
                  "focus:ring-primary/20 focus:ring-2",
                  digit ? "border-primary bg-primary/5" : "",
                  completeLogin.isPending ? "opacity-50" : "",
                ].join(" ")}
                disabled={completeLogin.isPending}
                autoComplete={i === 0 ? "one-time-code" : "off"}
                autoFocus={i === 0}
              />
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={!isComplete || completeLogin.isPending}>
          {completeLogin.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Verify &amp; sign in
        </Button>
      </form>

      <div className="flex flex-col items-center gap-3">
        <p className="text-muted-foreground text-xs">{"Didn't receive a code?"}</p>

        {canResend ? (
          <Button
            variant="outline"
            size="sm"
            onClick={handleResend}
            disabled={login.isPending}
            className="gap-2 transition-all"
          >
            {login.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" />
            )}
            Resend code
          </Button>
        ) : (
          <div className="flex items-center gap-2.5">
            <div className="relative h-12 w-12">
              <svg className="h-12 w-12 -rotate-90" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" fill="none" className="stroke-muted" strokeWidth="3" />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="none"
                  className="stroke-primary transition-all duration-1000 ease-linear"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold tabular-nums">
                {secondsLeft}
              </span>
            </div>
            <p className="text-muted-foreground text-xs">
              Resend in <span className="text-foreground font-medium tabular-nums">{secondsLeft}s</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/account";
  const login = useLogin();
  const [otpState, setOtpState] = useState<OtpState | null>(null);

  const form = useForm<CredentialsValues>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: CredentialsValues) {
    try {
      const result = await login.mutateAsync(values);
      setOtpState({
        userId: result.data.userId,
        resendAllowedAt: result.data.resendAllowedAt,
        email: values.email,
        password: values.password,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    }
  }

  if (otpState) {
    return <OtpForm otpState={otpState} onBack={() => setOtpState(null)} next={next} />;
  }

  return (
    <div className="bg-card w-full max-w-sm space-y-6 rounded-lg border p-8">
      <div>
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="text-muted-foreground mt-1 text-sm">Welcome back to TTE Store</p>
      </div>
      <Separator />
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" {...form.register("email")} />
          {form.formState.errors.email && (
            <p className="text-destructive text-xs">{form.formState.errors.email.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            {...form.register("password")}
          />
          {form.formState.errors.password && (
            <p className="text-destructive text-xs">{form.formState.errors.password.message}</p>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={login.isPending}>
          {login.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Continue
        </Button>
      </form>
      <p className="text-muted-foreground text-center text-sm">
        No account?{" "}
        <Link href="/register" className="text-foreground underline">
          Register
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
