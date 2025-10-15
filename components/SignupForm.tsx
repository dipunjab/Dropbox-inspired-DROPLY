"use client";

import { useForm } from "react-hook-form";
import { useSignUp } from "@clerk/nextjs";
import z from "zod";
import { signUpSchema } from "@/schemas/signUpSchema";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button, Card, CardBody, CardFooter, CardHeader, Divider } from "@heroui/react";
import { CheckCircle, CircleAlert, Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";

type SignUpData = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const router = useRouter();
  const { signUp, isLoaded, setActive } = useSignUp();

  const [verifying, setVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [resendCount, setResendCount] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      passwrodConfirmation: "",
    },
  });

  const inputBase =
    "block w-full rounded-md border px-3 py-2 pl-10 pr-10 text-sm bg-white text-black placeholder:text-gray-400 transition focus:outline-none";

const onSubmit = async (data: SignUpData) => {
  if (!isLoaded || isSubmitting) return;
  setIsSubmitting(true);
  setAuthError(null);
  setVerificationError(null);

  try {
    const tCreateStart = Date.now();
    const result = await signUp.create({
      emailAddress: data.email,
      password: data.password,
    });
    console.log("signUp.create ms:", Date.now() - tCreateStart);

    setVerifying(true);
    setResendCount(0);

    (async () => {
      try {
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      } catch (err: any) {
        console.warn("prepareEmailAddressVerification failed:", err);
        setVerificationError(
          err?.errors?.[0]?.message || err?.longMessage || err?.message || "Failed to send code. Please try Resend."
        );
      }
    })();

  } catch (error: any) {
    const message =
      error?.errors?.[0]?.message || error?.longMessage || error?.message || "Signup failed.";
    setAuthError(String(message));
  } finally {
    setIsSubmitting(false);
  }
};

  const handleVerificationSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;
    setIsSubmitting(true);
    setVerificationError(null);

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        setVerificationError("Verification incomplete. Please try again.");
      }
    } catch (error: any) {
      const message =
        error?.errors?.[0]?.message || error?.longMessage || error?.message || "Verification failed.";
      setVerificationError(String(message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!isLoaded || !signUp) return;
    setIsSubmitting(true);
    setVerificationError(null);

    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setResendCount((c) => c + 1);
    } catch (error: any) {
      setVerificationError(error?.errors?.[0]?.message || "Failed to resend code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Verification screen
  if (verifying) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
        <Card className="w-full max-w-md bg-white shadow-[0_12px_40px_rgba(16,24,28,0.06)] rounded-xl overflow-hidden">
          <CardHeader className="px-8 pt-8 pb-2">
            <div className="text-center">
              <h1 className="text-2xl font-extrabold text-black">Verify Your Email</h1>
              <p className="mt-1 text-sm text-gray-600">Enter the 6-digit code we emailed you.</p>
            </div>
          </CardHeader>

          <Divider />

          <CardBody className="px-8 py-6">
            {verificationError && (
              <div role="alert" className="mb-4 rounded-md border-l-4 border-[#FF6B6B] bg-red-50 px-4 py-3 flex items-start gap-3">
                <CircleAlert className="h-5 w-5 text-red-600 mt-0.5" />
                <div className="text-sm text-red-700">{verificationError}</div>
              </div>
            )}

            <form onSubmit={handleVerificationSubmit} className="space-y-4">
              <div>
                <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-800 mb-2">
                  Verification Code
                </label>
                <input
                  id="verificationCode"
                  type="text"
                  inputMode="numeric"
                  maxLength={8}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className={`${inputBase} border-gray-200 focus:border-[#39FF14] focus:ring-2 focus:ring-[#39FF14]/30`}
                  placeholder="123456"
                  disabled={isSubmitting}
                />
              </div>

              <Button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-md px-4 py-2 font-semibold"
                style={{ background: "#39FF14", color: "#000", boxShadow: isSubmitting ? "0 8px 36px rgba(57,255,20,0.18)" : undefined }}
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Verifying…" : "Verify Email"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Didn&apos;t get a code?{" "}
              <button
                type="button"
                onClick={handleResend}
                className="text-[#39FF14] hover:underline font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Resending…" : "Resend"}
              </button>
              {resendCount > 0 && <div className="mt-2 text-xs text-gray-500">Resent {resendCount} time(s)</div>}
            </div>
          </CardBody>

          <CardFooter className="px-8 py-6 text-center">
            <p className="text-xs text-gray-500">If you didn&apos;t receive the email, check your spam folder or try a different address.</p>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Default sign-up form
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
      <Card className="w-full max-w-md bg-white shadow-[0_12px_40px_rgba(16,24,28,0.06)] rounded-xl overflow-hidden">
        <CardHeader className="px-8 pt-8 pb-2">
          <div className="text-center">
            <h1 className="text-2xl sm:text-2xl font-extrabold text-black">Create your account</h1>
            <p className="mt-1 text-sm text-gray-600">Sign up to start managing your files</p>
          </div>
        </CardHeader>

        <Divider />

        <CardBody className="px-8 py-6">
          {authError && (
            <div role="alert" className="mb-4 rounded-md border-l-4 border-[#FF6B6B] bg-red-50 px-4 py-3 flex items-start gap-3">
              <CircleAlert className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="text-sm text-red-700">{authError}</div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-2">
                Email
              </label>
              <div className="relative rounded-md">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39FF14]">
                  <Mail className="h-5 w-5" />
                </span>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  {...register("email")}
                  disabled={isSubmitting}
                  className={`${inputBase} border-gray-200 focus:border-[#39FF14] focus:ring-2 focus:ring-[#39FF14]/30`}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-800 mb-2">
                Password
              </label>
              <div className="relative rounded-md">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39FF14]">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...register("password")}
                  disabled={isSubmitting}
                  className={`${inputBase} border-gray-200 focus:border-[#39FF14] focus:ring-2 focus:ring-[#39FF14]/30 pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#39FF14] hover:text-[#2ecc71] focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="passwrodConfirmation" className="block text-sm font-medium text-gray-800 mb-2">
                Confirm Password
              </label>
              <div className="relative rounded-md">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39FF14]">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  id="passwrodConfirmation"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...register("passwrodConfirmation")}
                  disabled={isSubmitting}
                  className={`${inputBase} border-gray-200 focus:border-[#39FF14] focus:ring-2 focus:ring-[#39FF14]/30 pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#39FF14] hover:text-[#2ecc71] focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.passwrodConfirmation && <p className="mt-1 text-xs text-red-600">{errors.passwrodConfirmation.message}</p>}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 text-sm text-gray-600">
              <CheckCircle className="h-5 w-5 text-[#39FF14] mt-0.5" />
              <p>
                By signing up, you agree to our{" "}
                <Link href="/terms" className="text-[#39FF14] hover:underline font-medium">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-[#39FF14] hover:underline font-medium">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>

            {/* Submit */}
            <div>
              <Button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-md px-4 py-2 font-semibold"
                style={{ background: "#39FF14", color: "#000", boxShadow: isSubmitting ? "0 8px 36px rgba(57,255,20,0.18)" : undefined }}
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting && <span className="inline-block h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />}
                <span>{isSubmitting ? "Creating account…" : "Create Account"}</span>
              </Button>
            </div>
          </form>
        </CardBody>

        <CardFooter className="px-8 py-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-[#39FF14] hover:underline font-medium">
            Sign In
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
