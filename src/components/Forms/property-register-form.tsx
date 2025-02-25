'use client';
import { CheckIcon, Plus } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useId, useState } from "react";
import {
    Dialog,
    DialogClose,
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

// Form Validation Schema
// Update the form schema
const formSchema = z.object({
    name: z.string().min(2, { message: "Name should have more than 2 characters" }),
    geofence: z.array(
        z.object({
            lat: z.number(),
            lng: z.number()
        })
    ).min(3, "Please draw a valid polygon with at least 3 points")
});

export default function PropertyRegisterForm() {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            geofence: [],
        },
    });

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
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