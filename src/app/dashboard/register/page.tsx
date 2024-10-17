"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z
  .object({
    username: z
      .string()
      .min(2, "Username must be at least 2 characters")
      .max(50, "Username must be at most 50 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Confirm Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // path of error
  });

export default function Login() {
  const [error, setError] = useState("");

  const router = useRouter();
  const { toast } = useToast();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Something went wrong");
      }

      toast({
        title: "Registration Successful",
        description: "You have successfully registered. Please log in.",
        variant: "default",
        style:{backgroundColor:"green", color:"white"}
      });

      router.push("/dashboard/login");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      console.error(error);
    }
  }

  //   const handleSubmit = async (e: React.FormEvent) => {
  //     e.preventDefault();

  //     const result = await signIn("credentials", {
  //       redirect: false, // Prevent automatic redirect, so we can handle it ourselves
  //       email,
  //       password,
  //     });

  //     console.log(result);

  //     if (result?.error) {
  //       setError(result.error); // Show error if login fails
  //       toast({
  //         title: "Login Failed",
  //         description: "Please check your email and password and try again.",
  //         variant: "destructive",
  //       });
  //       console.error(result.error);
  //     } else {
  //       // Redirect to dashboard on success
  //       router.push("/dashboard");
  //     }
  //   };

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="w-full flex justify-center">
            <Image
              src="https://res.cloudinary.com/dfmoqlbyl/image/upload/v1728984385/Rogers%20Stock/property-logo_mlwoue.png"
              alt="Image"
              width="100"
              height="100"
              className="rounded-full"
            />
          </div>
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Register</h1>
            <p className="text-balance text-muted-foreground">
              Register your details to create an account
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirm Password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full">
                Register
              </Button>
              {/* <Button variant="outline" className="w-full">
              Login with Google
            </Button> */}
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/dashboard/login" className="underline">
              Login
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="https://res.cloudinary.com/dfmoqlbyl/image/upload/v1728930996/Rogers%20Stock/Makerere-Uni_vc3r3s.jpg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
