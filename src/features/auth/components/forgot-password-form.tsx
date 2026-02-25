"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { ForgotPasswordInput, forgotPasswordInputSchema } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormLabel } from "@/components/ui/form";
import { useState } from "react";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { api } from "@/lib/api-client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface ForgotPasswordFormProps {
    className?: string;
    onSuccessAction?: () => void;
}

export default function ForgotPasswordForm({
    className,
    onSuccessAction,
    ...props
}: ForgotPasswordFormProps & React.ComponentProps<"form">) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const form = useForm<ForgotPasswordInput>({
        resolver: zodResolver(forgotPasswordInputSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (data: ForgotPasswordInput) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.post('/auth/forgot_password_request', data, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            console.log("API Response:", response?.data);

            // Check for success - be more lenient with the response check
            const isSuccessResponse = response?.data === true || 
                                    response?.status === 200 || 
                                    response?.status === 201 ||
                                    response?.data?.message?.en === "Success" || 
                                    response?.data?.message?.id === "Sukses" ||
                                    response?.data?.success === true;

            if (isSuccessResponse) {
                console.log("Success state set to true");
                setIsSuccess(true);
                toast.success("Reset link sent successfully. Please check your email.");
            } else {
                throw new Error("Failed to send password reset email");
            }
        } catch (error) {
            console.error("Error in forgot password:", error);
            if (isAxiosError(error)) {
                const errorMessage = error?.response?.data?.response?.message_en || error?.response?.data?.message?.en || error?.response?.data?.message?.id || "Failed to send password reset email";
                setError(errorMessage);
                toast.error(errorMessage);
            } else {
                const message = "An unexpected error occurred";
                setError(message);
                toast.error(message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // const handleStartOver = () => {
    //     setIsSuccess(false);
    //     setError(null);
    //     form.reset();
    // };

    // Call success action when form is successfully submitted
    React.useEffect(() => {
        if (isSuccess) {
            onSuccessAction?.();
        }
    }, [isSuccess, onSuccessAction]);

    return (
        <>
                    <Form {...form}>
                        <form
                    className={cn("flex flex-col gap-6", className)}
                            {...props}
                            onSubmit={form.handleSubmit(onSubmit)}
                >
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h1 className="text-2xl font-bold">Forgot Password</h1>
                        <p className="text-muted-foreground text-sm text-balance">
                           {"Enter your email address and we'll send you a link to reset your password"}
                        </p>
                    </div>
                    <div className="grid gap-6">
                        <div className="grid gap-3">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field, fieldState }) => (
                                    <>
                                            <FormLabel htmlFor="email">Email Address</FormLabel>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="Enter your email address"
                                                required
                                                {...field}
                                            />
                                        {fieldState.error && (
                                                <p className="text-sm text-red-500">{fieldState.error.message}</p>
                                            )}
                                    </>
                                    )}
                                />
                            </div>
                            {Boolean(error) && (
                            <span className="text-red-500 text-sm">{String(error)}</span>
                            )}
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader className="animate-spin mr-2 h-4 w-4" />
                                        Sending...
                                    </>
                                ) : (
                                    "Send Reset Link"
                                )}
                            </Button>
                    </div>
                        </form>
                    </Form>

            {/* Success Modal - Custom Implementation */}
            {isSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
                        {/* Header */}
                        <div className="text-center mb-4">
                            {/* Logo Image */}
                            <div className="flex justify-center mb-3">
                                <Image
                                    src="/image/ic_bpro_color.png"
                                    alt="Logo"
                                    width={80}
                                    height={80}
                                    priority
                                />
                            </div>
                            <h2 className="text-2xl font-bold text-green-600">Email Sent Successfully!</h2>
                            <p className="text-muted-foreground text-base mt-2">
                                {"We've sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password."}
                            </p>
                        </div>

                        {/* Info Box */}
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-6">
                            <p className="text-blue-800 font-medium">📧 Check your email</p>
                            <p className="text-blue-600 text-sm mt-1">Click the reset link in your email to continue</p>
                        </div>

                        {/* OK Button */}
                        <Button 
                            onClick={() => {
                                console.log("OK button clicked, redirecting to login");
                                router.push("/");
                            }} 
                            className="w-full"
                        >
                            OK
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}

export { ForgotPasswordForm };
