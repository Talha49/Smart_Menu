"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import toast from "react-hot-toast";
import { Lock, Mail, User, ArrowRight, CheckCircle2 } from "lucide-react";

import { AuthService } from "@/services/authService";

export default function SignupPage() {
    const router = useRouter();


    const handleSubmit = async (e) => {
        try {
            // 1. Register User
            await AuthService.signup({
                name: formData.name,
                email: formData.email,
                password: formData.password
            });

            // 2. Auto Login
            const loginResult = await signIn("credentials", {
                redirect: false,
                email: formData.email,
                password: formData.password,
            });

            if (loginResult?.error) {
                toast.error("Login failed after registration");
                router.push("/login");
            } else {
                toast.success("Account created successfully!");
                router.push("/onboarding"); // Redirect to onboarding instead of dashboard
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
            <div className="max-w-md w-full animate-fade-in">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold font-display bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent inline-block mb-2">
                        SmartMenu
                    </h1>
                    <p className="text-muted-foreground">Start your 14-day free trial</p>
                </div>

                <Card className="glass border-none shadow-xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl">Create an account</CardTitle>
                        <CardDescription>
                            Join thousands of restaurants growing with SmartMenu
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <Input
                                name="name"
                                label="Full Name"
                                placeholder="John Doe"
                                startIcon={<User className="h-4 w-4" />}
                                required
                                value={formData.name}
                                onChange={handleChange}
                            />
                            <Input
                                name="email"
                                label="Email"
                                type="email"
                                placeholder="name@example.com"
                                startIcon={<Mail className="h-4 w-4" />}
                                required
                                value={formData.email}
                                onChange={handleChange}
                            />
                            <div className="space-y-2">
                                <Input
                                    name="password"
                                    label="Password"
                                    type="password"
                                    startIcon={<Lock className="h-4 w-4" />}
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                {formData.password && (
                                    <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-300 ${getStrengthColor(strength)}`}
                                            style={{ width: `${strength}%` }}
                                        />
                                    </div>
                                )}
                            </div>
                            <Input
                                name="confirmPassword"
                                label="Confirm Password"
                                type="password"
                                startIcon={<CheckCircle2 className="h-4 w-4" />}
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity"
                                size="lg"
                                isLoading={loading}
                            >
                                Create Account
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                            <div className="text-center text-sm text-muted-foreground">
                                Already have an account?{" "}
                                <Link href="/login" className="text-primary font-medium hover:underline">
                                    Sign in
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}
