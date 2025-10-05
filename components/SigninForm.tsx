"use client";

import { signinSchema } from "@/schemas/signInSchema"
import { useSignIn } from "@clerk/nextjs"
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card"
import { Button, Divider, Input } from "@heroui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { CircleAlert, Eye, EyeOff, Lock, Mail } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import z from "zod"

export default function SignInForm() {
    const router = useRouter();
    const { signIn, isLoaded, setActive } = useSignIn();
    const [isSubmimtting, setIsSubmitting] = useState(false);
    const [showPassword, setshowPassword] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<z.infer<typeof signinSchema>>({
        resolver: zodResolver(signinSchema),
        defaultValues: {
            identifier: "",
            password: ""
        }
    });

    const onSubmit = async (data: z.infer<typeof signinSchema>) => {
        if (!isLoaded) return;
        setIsSubmitting(true);
        setAuthError(null);

        try {
            const result = await signIn.create({
                identifier: data.identifier,
                password: data.password
            });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId })
                router.push("/dashboard")
            } else {
                setAuthError("Sign in could not be completed. Please try again")
            }
        } catch (error: any) {
            setAuthError(
                error.errors?.[0].message || "An error occurred during sign in process"
            )
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
            <Card className="w-full max-w-md shadow-[0_8px_30px_rgb(57,255,20,0.3)] bg-white text-black rounded-xl px-6 py-8">
                <CardHeader className=" flex flex-col text-center mb-4">
                    <h1 className="text-3xl font-extrabold text-black">🚀 Welcome Back</h1>
                    <p className="text-sm text-gray-600 mt-1">Sign in to your neon-powered dashboard</p>
                </CardHeader>

                {authError && (
                    <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 flex items-center gap-2 shadow-sm">
                        <CircleAlert className="h-5 w-5 flex-shrink-0 text-red-600" />
                        <p className="text-sm">{authError}</p>
                    </div>
                )}

                <CardBody className="space-y-6 px-0">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Email Input */}
 {/* Email Input */}
<div>
  <label htmlFor="email" className="text-sm font-medium text-black mb-1 block">Email</label>
  <div className="relative">
    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#39FF14] pointer-events-none" />
    <input
      id="email"
      type="email"
      placeholder="you@example.com"
      {...register("identifier")}
      className={`
        w-full bg-white text-black border border-gray-300 rounded-md 
        pl-10 pr-3 py-2 text-sm
        focus:outline-none focus:border-[#39FF14] focus:ring-2 focus:ring-[#39FF14] 
        placeholder:text-gray-400
      `}
    />
    {errors.identifier && <p className="text-red-600 text-xs mt-1">{errors.identifier.message}</p>}
  </div>
</div>

{/* Password Input */}
<div>
  <label htmlFor="password" className="text-sm font-medium text-black mb-1 block">Password</label>
  <div className="relative">
    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#39FF14] pointer-events-none" />
    <input
      id="password"
      type={showPassword ? "text" : "password"}
      placeholder="••••••••"
      {...register("password")}
      className={`
        w-full bg-white text-black border border-gray-300 rounded-md 
        pl-10 pr-10 py-2 text-sm
        focus:outline-none focus:border-[#39FF14] focus:ring-2 focus:ring-[#39FF14] 
        placeholder:text-gray-400
      `}
    />
    <button
      type="button"
      onClick={() => setshowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#39FF14] hover:text-[#2ecc71] focus:outline-none"
    >
      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
    </button>
    {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>}
  </div>
</div>


                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full bg-[#39FF14] text-black font-semibold hover:bg-[#2ecc71] focus:ring-2 focus:ring-[#39FF14] focus:outline-none transition duration-150"
                            isLoading={isSubmimtting}
                        >
                            {isSubmimtting ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>
                </CardBody>

                <CardFooter className="flex justify-center mt-6">
                    <p className="text-sm text-gray-600">
                        Don’t have an account?{" "}
                        <Link href="/sign-up" className="text-[#39FF14] hover:underline font-semibold">Sign Up</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
