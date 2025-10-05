"use client";

import { useForm } from "react-hook-form";
import { useSignUp } from "@clerk/nextjs";
import z from "zod";
import { signUpSchema } from "@/schemas/signUpSchema";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button, Card, CardBody, CardFooter, CardHeader, Divider } from "@heroui/react";
import { CheckCircle, CircleAlert, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import Link from "next/link";

export default function SignUpForm() {
  const router = useRouter();
  const [verifying, setVerifying] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const { signUp, isLoaded, setActive } = useSignUp();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      passwrodConfirmation: "",
    },
  });

  const inputClass =
    "w-full bg-white text-black border border-gray-300 rounded-md pl-10 pr-3 py-2 text-sm focus:outline-none focus:border-[#39FF14] focus:ring-2 focus:ring-[#39FF14] placeholder:text-gray-400";

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    if (!isLoaded) return;
    setIsSubmitting(true);
    setAuthError(null);

    try {
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setVerifying(true);
    } catch (error: any) {
      setAuthError(error?.errors?.[0].message || "Signup failed.");
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
        setVerificationError("Verification incomplete. Try again.");
      }
    } catch (error: any) {
      setVerificationError(error?.errors?.[0].message || "Verification failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
      <Card className="w-full max-w-md bg-white shadow-xl rounded-xl p-6">
        <CardHeader className="text-center space-y-1">
          <h1 className="text-xl font-semibold text-black">Verify Your Email</h1>
          <p className="text-sm text-gray-500">Enter the 6-digit code we emailed you.</p>
        </CardHeader>
        <Divider />
        <CardBody className="py-6">
          {verificationError && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 flex items-center gap-2">
              <CircleAlert className="h-5 w-5 flex-shrink-0" />
              <p>{verificationError}</p>
            </div>
          )}
          <form onSubmit={handleVerificationSubmit} className="space-y-6">
            <div>
              <label htmlFor="verificationCode" className="block text-sm font-medium text-black mb-1">Verification Code</label>
              <input
                id="verificationCode"
                type="text"
                placeholder="123456"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className={inputClass}
              />
            </div>
            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              {isSubmitting ? "Verifying..." : "Verify Email"}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-500">
            Didn&apos;t get a code?{" "}
            <button
              type="button"
              onClick={async () => {
                await signUp?.prepareEmailAddressVerification({ strategy: "email_code" });
              }}
              className="text-[#39FF14] hover:underline font-medium"
            >
              Resend
            </button>
          </div>
        </CardBody>
      </Card>
      </div>
    );
  }

  return (
<div className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
    <Card className="w-full max-w-md bg-white shadow-xl rounded-xl p-6">
      <CardHeader className="text-center space-y-1 flex flex-col">
        <h1 className="text-xl font-semibold text-black">Create Your Account</h1>
        <p className="text-sm text-gray-500">Sign up to start managing your files</p>
      </CardHeader>
      <Divider />
      <CardBody className="py-6">
        {authError && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 flex items-center gap-2">
            <CircleAlert className="h-5 w-5" />
            <p>{authError}</p>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-black mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#39FF14]" />
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className={inputClass}
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-black mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#39FF14]" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                className={inputClass + " pr-10"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#39FF14] hover:text-green-500"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="passwrodConfirmation" className="block text-sm font-medium text-black mb-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#39FF14]" />
              <input
                id="passwrodConfirmation"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("passwrodConfirmation")}
                className={inputClass + " pr-10"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#39FF14] hover:text-green-500"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.passwrodConfirmation && <p className="text-xs text-red-500 mt-1">{errors.passwrodConfirmation.message}</p>}
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <CheckCircle className="h-5 w-5 text-[#39FF14] mt-0.5" />
            <p>By signing up, you agree to our Terms of Service and Privacy Policy.</p>
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create Account"}
          </Button>
        </form>
      </CardBody>

      <CardFooter className="text-sm text-center text-gray-600 py-4">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-[#39FF14] hover:underline font-medium ml-1">Sign In</Link>
      </CardFooter>
    </Card>
    </div>
  );
}
