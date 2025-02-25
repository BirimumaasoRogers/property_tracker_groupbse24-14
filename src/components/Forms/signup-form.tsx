"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ClipLoader } from "react-spinners"
import { useState } from "react"

const formSchema = z
    .object({
        name: z.string().min(1, {
            message: "Name must be longer than one character.",
        }),
        email: z.string().email({
            message: "Please enter a valid email address.",
        }),
        password: z.string().min(8, {
            message: "Password must be 8 characters or more.",
        }),
        confirmPassword: z.string().min(8, {
            message: "Password must be 8 characters or more.",
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match.",
        path: ["confirmPassword"], // This ensures the error is associated with confirmPassword
    });


export function SignupForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"form">) {
    // Define form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    const router = useRouter()

    // Submit Handler
    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        // console.log(values)
        setLoading(true)

        // const { data, error } = 
        await authClient.signUp.email({
            image: "https://example.com/image.png",
            ...values
        }, {
            onSuccess: () => {
                toast("You have successfully signed up")
                setLoading(false)
                router.push(`/login`)
            },
            onError: (error) => {
                toast(error?.error?.message || "Failed to sign you up")
                setLoading(false)
            },
        });
    }


    const [loading, setLoading] = useState(false)

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-6", className)} {...props}>
                <div className="flex justify-center gap-2">
                    <a href="#" className="flex font-passion-one items-center gap-2 text-4xl font-bold">
                        PTGS Dashboard
                    </a>
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Signup</h1>
                    <p className="text-balance text-xs text-muted-foreground">
                        Enter your email and password to access your account
                    </p>
                </div>
                <div className="grid gap-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Email" {...field} />
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
                                    <Input placeholder="Password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Confirm Password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full">
                        SIGNUP

                        {loading ? (
                            <ClipLoader color="#ffffff" size={16} />
                        ) : null}
                    </Button>

                    <div className="flex justify-center items-center">
                        <a
                            href="/auth/recover"
                            className="text-sm underline-offset-4 hover:underline"
                        >
                            Forgot your password?
                        </a>
                    </div>

                    <p className="flex justify-center items-center">
                        Already have an account? &nbsp;
                        <span>
                            <Link
                                href="/login"
                                className=" underline-offset-4 underline"
                            >
                                Login
                            </Link>
                        </span>
                    </p>
                </div>
            </form>
        </Form>
    )
}
