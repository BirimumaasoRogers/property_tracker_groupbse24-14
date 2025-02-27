"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { ClipLoader } from "react-spinners";

// Form Validation Schema
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
  // Form Handling
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Submit Handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    await authClient.signIn.email(
      values,
      {
        onSuccess: () => {
          toast.success("You have successfully logged in");
          setLoading(false);
          router.push("/dashboard");
        },
        onError: (error) => {
          toast.error(error?.error?.message || "Failed to sign you in");
          setLoading(false);
        },
      }
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-6", className)} {...props}>
        {/* Header */}
        <div className="flex justify-center gap-2">
          <a href="#" className="flex items-center gap-2 text-4xl font-bold">
            PTGS Dashboard
          </a>
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Login</h1>
          <p className="text-sm text-muted-foreground">Enter your email and password to access your account</p>
        </div>

        {/* Form Fields */}
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="email" placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" className="w-full h-12" disabled={loading}>
            {loading ? <ClipLoader color="#ffffff" size={16} /> : "LOGIN"}
          </Button>

          {/* Forgot Password */}
          <div className="flex justify-center items-center">
            <Link href="/auth/recover" className="text-sm underline-offset-4 hover:underline">
              Forgot your password?
            </Link>
          </div>

          {/* Signup Redirect */}
          <p className="flex justify-center items-center">
            Don&apos;t have an account?&nbsp;
            <Link href="/signup" className="underline-offset-4 underline">
              Signup
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
}