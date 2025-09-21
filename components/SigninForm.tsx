"use client"

import { signinSchema } from "@/schemas/signInSchema"
import { useSignIn } from "@clerk/nextjs"
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card"
import { Button, Divider, Input } from "@heroui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle, CircleAlert, Eye, EyeOff, Lock, Mail } from "lucide-react"
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
        if (!isLoaded) {
            return
        }
        setIsSubmitting(true)
        setAuthError(null)

        try {
            const result = await signIn.create({
                identifier: data.identifier,
                password: data.password
            });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId })
                router.push("/dashboard")
            } else {
                console.error("Sign-in incomplete", result);
                
                setAuthError("Sign in could not be completed. Please try again")
            }

        } catch (error: any) {
            setAuthError(
                error.errors?.[0].message || "An error occured during sign in process"
            )
        } finally {
            setIsSubmitting(false)
        }

    }

    return (
        <Card className="w-full max-w-md border boder-default-200 bg-default-50 shadow-xl">
            <CardHeader className="flex flex-col gap-1 items-center pb-2">
                <h1>Welcome Back</h1>
                <p className="text-default-500 text-center">Sign In to access your secure cloud storage</p>
            </CardHeader>

            <Divider />

            <CardBody className="py-6">
                {authError && (
                    <div className="bg-danger-50 text-danger-700 p-4 rounded-lg mb-6 flex items-center gap-2">
                        <CircleAlert className="h-5 w-5 flex-shrink-0" />
                        <p>{authError}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-default-900">Email</label>

                        <Input
                            id="email"
                            type="email"
                            placeholder="email@your.com"
                            startContent={<Mail className="h-4 w-4 text-default-500" />}
                            isInvalid={!!errors.identifier}
                            errorMessage={errors.identifier?.message}
                            {...register("identifier")}
                            className="w-full"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium text-default-900">Password</label>

                        <Input
                            id="password"
                            type={showPassword ? "text" : "passwrod"}
                            placeholder="......."
                            startContent={<Lock className="h-4 w-4 text-default-500" />}
                            endContent={
                                <Button isIconOnly variant="light" size="sm" onClick={() => setshowPassword(!showPassword)} type="button">
                                    {showPassword ? (<EyeOff className="h-4 w-4 text-default-500" />) : <Eye className="h-4 w-4 text-default-500" />}
                                </Button>
                            }
                            isInvalid={!!errors.password}
                            errorMessage={errors.password?.message}
                            {...register("password")}
                            className="w-full"
                        />
                    </div>
                    

                    

                    <Button
                        type="submit"
                        color="primary"
                        className="w-full"
                        isLoading={isSubmimtting}
                    >
                        {isSubmimtting ? "signing in..." : "Sign In"}
                    </Button>
                </form>
            </CardBody>

            <CardFooter className="flex justify-center py-4">
                <p className="text-sm text-default-600">
                    Dont have an account?{" "}
                    <Link href="/sign-up" className="text-primary hover:underline font-medium">Sign Up</Link>
                </p>

            </CardFooter>
        </Card>
    )
} 