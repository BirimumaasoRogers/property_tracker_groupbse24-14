'use client';
import { Divide, Plus } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "../ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import GeofenceMap from "../Maps/editableGeofencemap";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";

// Form Validation Schema
const formSchema = z.object({
    name: z.string().min(2, { message: "Name should have more than 2 characters" }),
    description: z.string().min(2, { message: "Description should have more than 2 characters" }),
    trackerId: z.string().min(2, { message: "Input a valid Tracker ID" }),
    phone: z.string().min(10, { message: "Phone number should be 10 digits or more" }),
    geofence: z.array(
        z.object({
            lat: z.number(),
            lng: z.number()
        })
    ).min(3, "Please draw a valid polygon with at least 3 points")
});

export default function PropertyRegisterForm({ onSuccess }: { onSuccess?: () => void }) {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            trackerId: "",
            phone: "",
            geofence: [],
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("PROPERTY FORM VALUES", values);
        try {
            setLoading(true);
            const response = await fetch('/api/properties', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Failed to create property');
            }

            toast.success('Property created successfully');
            setOpen(false);
            form.reset();
            if (onSuccess) {
                onSuccess(); // Useful if you're using SWR or React Query
            } else {
                router.refresh(); // Default fallback
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to create property');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="flex gap-2 bg-primary hover:bg-primary/90 hover:text-white/80 text-white/90">
                    <Plus size={16} />
                    <span>Add Property</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="contents">
                        <DialogHeader className="contents space-y-0 text-left">
                            <DialogTitle className="border-b px-6 py-4 text-base">Add property</DialogTitle>
                        </DialogHeader>
                        <DialogDescription className="sr-only">
                            Register your property here to be tagged.
                        </DialogDescription>
                        <div className="overflow-y-auto">
                            <div className="flex flex-col px-6 pt-4 pb-6 gap-4">
                                <div className="flex flex-col gap-4 sm:flex-row">
                                    <div className="flex-1 space-y-2">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input type="text" placeholder="Property Name" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4 sm:flex-row">
                                    <div className="flex-1 space-y-2">
                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Textarea placeholder="Property Description" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4 sm:flex-row">
                                    <div className="flex-1 space-y-2">
                                        <FormField
                                            control={form.control}
                                            name="trackerId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input type="text" placeholder="Tracker ID" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4 sm:flex-row">
                                    <div className="flex-1 space-y-2">
                                        <FormField
                                            control={form.control}
                                            name="phone"
                                            render={({ field }) => (
                                                <div>
                                                    <Label className="text-sm text-gray-500">Phone Number you want to receive notifications:</Label>
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input type="tel" placeholder="+1234567890" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                </div>
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="*:not-first:mt-2">
                                    <FormField
                                        control={form.control}
                                        name="geofence"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Label>Geofence Area</Label>
                                                <FormControl>
                                                    <GeofenceMap
                                                        onPolygonChange={(coords) => {
                                                            // Parse the string to array before setting the form value
                                                            field.onChange(JSON.parse(coords));
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="border-t px-6 py-4">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Saving...' : 'Save property'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}