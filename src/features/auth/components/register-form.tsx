"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormLabel } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { paths } from "@/config/paths";
import { isAxiosError } from "axios";
import { useState } from "react";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { registerInputSchema, type RegisterInput } from "@/lib/auth";
import { register as registerApi } from "@/features/auth/api/register";
import Link from "next/link";

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerInputSchema),
    defaultValues: {
      username: "",
      first_name: "",
      last_name: "",
      phone_number: "",
      email: "",
      address: "",
      password: "",
      confirm_password: "",
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setError(null);
    try {
      await registerApi(data);
      toast.success("Registration successful. Please login.");
      router.replace(paths.home.getHref());
    } catch (err) {
      if (isAxiosError(err)) {
        const msg = err?.response?.data?.message?.en ?? err?.response?.data?.response?.message_en ?? "Registration failed.";
        setError(msg);
        toast.error(msg);
      } else {
        setError("Registration failed.");
        toast.error("Registration failed.");
      }
    }
  };

  return (
    <Form {...form}>
      <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Create account</h1>
          <p className="text-muted-foreground text-sm">Fill the form below to register.</p>
        </div>
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <>
                <FormLabel>Username</FormLabel>
                <Input placeholder="Username" {...field} />
              </>
            )}
          />
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <>
                <FormLabel>First name</FormLabel>
                <Input placeholder="First name" {...field} />
              </>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <>
                <FormLabel>Last name</FormLabel>
                <Input placeholder="Last name" {...field} />
              </>
            )}
          />
          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <>
                <FormLabel>Phone number</FormLabel>
                <Input placeholder="08123456789" {...field} />
              </>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <>
                <FormLabel>Email</FormLabel>
                <Input type="email" placeholder="email@example.com" {...field} />
              </>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <>
                <FormLabel>Address</FormLabel>
                <Input placeholder="Address" {...field} />
              </>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <>
                <FormLabel>Password</FormLabel>
                <Input type="password" placeholder="••••••••" {...field} />
              </>
            )}
          />
          <FormField
            control={form.control}
            name="confirm_password"
            render={({ field }) => (
              <>
                <FormLabel>Confirm password</FormLabel>
                <Input type="password" placeholder="••••••••" {...field} />
              </>
            )}
          />
          {error && <span className="text-red-500 text-sm">{error}</span>}
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? <Loader className="animate-spin mx-auto" /> : "Register"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account? <Link href={paths.home.getHref()} className="text-primary hover:underline">Login</Link>
          </p>
        </div>
      </form>
    </Form>
  );
}