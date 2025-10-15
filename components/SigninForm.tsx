"use client";

import { signinSchema } from "@/schemas/signInSchema";
import { useSignIn } from "@clerk/nextjs";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Button, Divider, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert, Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

export default function SignInForm() {
  const router = useRouter();
  const { signIn, isLoaded, setActive } = useSignIn();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    if (!isLoaded || isSubmitting) return;
    setIsSubmitting(true);
    setAuthError(null);

    try {
      const result = await signIn.create({
        identifier: data.identifier,
        password: data.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        setAuthError("Sign in could not be completed. Please try again.");
      }
    } catch (error: any) {
      // Clerk error shapes vary — pick a sensible fallback
      const message =
        error?.errors?.[0]?.message ||
        error?.longMessage ||
        error?.message ||
        "An error occurred during sign in.";
      setAuthError(String(message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
      <Card className="w-full max-w-md rounded-xl shadow-[0_12px_40px_rgba(16,24,28,0.06)] border border-gray-100 overflow-hidden">
        {/* Header */}
        <CardHeader className="px-8 pt-8 pb-2">
          <div className="flex flex-col items-center text-center gap-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-black">Welcome Back</h1>
            <p className="text-sm text-gray-600">Sign in to your neon-powered dashboard</p>
          </div>
        </CardHeader>

        {/* Error area (accessible) */}
        {authError && (
          <div
            role="alert"
            aria-live="assertive"
            className="mx-6 mt-4 rounded-md border-l-4 border-[#FF6B6B] bg-red-50 px-4 py-3 flex items-start gap-3"
          >
            <CircleAlert className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="text-sm text-red-700">{authError}</div>
          </div>
        )}

        <CardBody className="px-8 py-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            {/* Email */}
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-gray-800 mb-2">
                Email
              </label>

              <div
                className={`relative rounded-md shadow-sm ${
                  isSubmitting ? "opacity-60 pointer-events-none" : ""
                }`}
              >
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39FF14]">
                  <Mail className="h-5 w-5" />
                </span>

                <input
                  id="identifier"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  aria-invalid={!!errors.identifier}
                  {...register("identifier")}
                  className={`block w-full rounded-md border px-3 py-2 pl-10 pr-3 text-sm bg-white text-black placeholder:text-gray-400
                    focus:outline-none focus:border-[#39FF14] focus:ring-2 focus:ring-[#39FF14]/30 transition
                    ${errors.identifier ? "border-red-300" : "border-gray-200"}`}
                />
              </div>
              {errors.identifier && (
                <p className="mt-1 text-xs text-red-600" role="alert">
                  {errors.identifier.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-800 mb-2">
                Password
              </label>

              <div className={`relative rounded-md ${isSubmitting ? "opacity-60 pointer-events-none" : ""}`}>
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39FF14]">
                  <Lock className="h-5 w-5" />
                </span>

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  aria-invalid={!!errors.password}
                  {...register("password")}
                  className={`block w-full rounded-md border px-3 py-2 pl-10 pr-10 text-sm bg-white text-black placeholder:text-gray-400
                    focus:outline-none focus:border-[#39FF14] focus:ring-2 focus:ring-[#39FF14]/30 transition
                    ${errors.password ? "border-red-300" : "border-gray-200"}`}
                />

                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#39FF14] hover:text-[#2ecc71] focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {errors.password && (
                <p className="mt-1 text-xs text-red-600" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <div>
              <Button
                type="submit"
                className={`w-full flex items-center justify-center gap-2 rounded-md px-4 py-2 font-semibold transition
                  ${isSubmitting ? "cursor-wait" : "hover:shadow-[0_10px_40px_rgba(57,255,20,0.10)]"}`}
                style={{
                  background: "#39FF14",
                  color: "#000",
                  boxShadow: isSubmitting ? "0 8px 36px rgba(57,255,20,0.18)" : undefined,
                }}
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                {/* Custom spinner when submitting (in case the Button's isLoading doesn't show one) */}
                {isSubmitting && (
                  <span className="inline-block h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                )}
                <span>{isSubmitting ? "Signing in…" : "Sign In"}</span>
              </Button>
            </div>
          </form>

          {/* Divider + forgot */ }
          <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
            <Link href="/forgot-password" className="hover:text-[#39FF14]">
              {/* Forgot password? */}
            </Link>
            <Link href="/sign-up" className="text-[#39FF14] hover:underline font-semibold">
              Create account
            </Link>
          </div>
        </CardBody>

        <CardFooter className="px-8 py-6 text-center">
          <p className="text-xs text-gray-500">By signing in you agree to our <Link href="/terms" className="underline">Terms</Link> & <Link href="/privacy" className="underline">Privacy</Link>.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
