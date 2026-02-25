"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { changePassword } from "@/features/auth/api/change-password";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, Check } from "lucide-react";

const changePasswordSchema = z
  .object({
    old_password: z.string().min(1, "Old password is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).*$/,
        "Password must contain uppercase letters, numbers, and special characters"
      ),
    password_confirmation: z.string().min(6, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Password confirmation must match password",
    path: ["password_confirmation"],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

interface ChangePasswordFormProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
}

export default function ChangePasswordForm({
  open,
  onOpenChangeAction,
}: ChangePasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      old_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  const passwordValue = form.watch("password") ?? "";
  const passwordConfirmationValue = form.watch("password_confirmation") ?? "";
  const hasMinLength = passwordValue.length >= 8;
  const hasUpperCase = /[A-Z]/.test(passwordValue);
  const hasNumber = /\d/.test(passwordValue);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(passwordValue);
  const meetsRequirements = hasMinLength && hasUpperCase && hasNumber && hasSpecialChar;
  const passwordsMatch = passwordValue === passwordConfirmationValue;

  const onSubmit = async (data: ChangePasswordFormData) => {
    setIsLoading(true);
    try {
      await changePassword({
        old_password: data.old_password,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });

      toast.success("Password changed successfully");
      form.reset();
      onOpenChangeAction(false);
    } catch (error: any) {
      console.error("Change password failed:", error);
      toast.error(
        error?.response?.data?.message ||
        "Failed to change password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    onOpenChangeAction(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChangeAction}>
      <SheetContent side="right" className="sm:max-w-xl overflow-y-auto max-h-[100vh]">
        <SheetHeader>
          <SheetTitle>Change Password</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Old Password Field */}
            <FormField
              control={form.control}
              name="old_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        {...field}
                        type={showOldPassword ? "text" : "password"}
                        placeholder="Enter your current password"
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showOldPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <div className="flex items-center justify-between">
                    <FormMessage />
                    <p className="text-xs text-gray-500">Enter your current password</p>
                  </div>
                </FormItem>
              )}
            />

            {/* New Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        {...field}
                        type={showNewPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                    <div className="flex items-center justify-between">
                      <FormMessage />
                      <p className="text-xs text-gray-500">
                        At least 8 characters, uppercase, number, and special character
                      </p>
                    </div>
                </FormItem>
              )}
            />

            {/* Confirm Password Field */}
            <FormField
              control={form.control}
              name="password_confirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        {...field}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your new password (min. 6 characters)"
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <div className="flex items-center justify-between">
                    <FormMessage />
                    <p className="text-xs text-gray-500">Must match the password above</p>
                  </div>
                </FormItem>
              )}
            />

            {/* Password Requirements */}
            <div className="space-y-1 rounded border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-xs text-gray-600">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                Password must include
              </p>
              {[
                { label: "At least 8 characters", met: hasMinLength },
                { label: "At least 1 uppercase letter", met: hasUpperCase },
                { label: "At least 1 number", met: hasNumber },
                { label: "At least 1 special character", met: hasSpecialChar },
              ].map((requirement) => (
                <div key={requirement.label} className="flex items-center gap-2">
                  {requirement.met ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <span className="h-4 w-4" />
                  )}
                  <span className="text-gray-600">{requirement.label}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-6 mt-auto">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isLoading || !meetsRequirements || !passwordsMatch}
              >
                {isLoading ? "Changing..." : "Change Password"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
