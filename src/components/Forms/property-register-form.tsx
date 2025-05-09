'use client';
import { Divide, Plus } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useState } from "react";
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
    trackerId: z
        .string()
        .min(2, { message: "Input a valid Tracker ID" })
        .regex(/^TRK/, { message: "Tracker ID must start with 'TRK'" }),
    phone: z.string()
        .min(10, { message: "Phone number should be at least 10 digits" }) // Adjusted min length slightly if needed for local numbers before +256
        .regex(/^\d+$/, { message: "Phone number must contain only digits" }),
    geofence: z.array(
        z.object({
            lat: z.number(),
            lng: z.number()
        })
    ).min(3, "Please draw a valid polygon with at least 3 points")
});

export default function PropertyRegisterForm({
    onSuccess,
    initialValues,
    editMode = false,
    open,
    setOpen,
}: {
    onSuccess?: (propertyId: string) => void,
    initialValues?: any,
    editMode?: boolean,
    open: boolean,
    setOpen: (open: boolean) => void,
}) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    console.log("INITIAL VALUES",initialValues);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialValues || {
            name: "",
            description: "",
            trackerId: "",
            phone: "",
            geofence: [],
        },
    });

    // Update form values when initialValues change (for edit mode)
    useEffect(() => {
        if (initialValues) {
            form.reset(initialValues);
        }
    }, [initialValues]);

    // Submit Handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        let formattedPhone = values.phone.trim();
        if (!formattedPhone.startsWith("+")) {
            if (formattedPhone.startsWith("0")) {
                formattedPhone = formattedPhone.substring(1);
            }
            formattedPhone = "+256" + formattedPhone;
        }
        const submitValues = { ...values, phone: formattedPhone };

        try {
            setLoading(true);
            const response = await fetch(
                editMode && initialValues?._id
                    ? `/api/properties/${initialValues._id}`
                    : '/api/properties',
                {
                    method: editMode ? 'PUT' : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(submitValues),
                }
            );
            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || (editMode ? 'Failed to update property' : 'Failed to create property'));
            }

            toast.success(editMode ? 'Property updated successfully' : 'Property created successfully');
            setOpen(false);
            form.reset();
            if (onSuccess) {
                onSuccess(result.data._id);
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : (editMode ? 'Failed to update property' : 'Failed to create property'));
        } finally {
            setLoading(false);
        }
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="flex flex-col gap-0 overflow-y-visible p-4 sm:max-w-lg [&>button:last-child]:top-3.5">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="contents w-full">
                        <DialogHeader>
                            <DialogTitle>{editMode ? "Edit Property" : "Add property"}</DialogTitle>
                        </DialogHeader>
                        <DialogDescription className="sr-only">
                            Register your property here to be tagged.
                        </DialogDescription>
                        <div className="overflow-y-auto">
                            <div className="flex flex-col mx-1 pt-4 pb-6 gap-4">
                                <div className="flex flex-col gap-4 sm:flex-row">
                                    <div className="flex-1 space-y-2">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            type="text"
                                                            placeholder="Property Name"
                                                            {...field}
                                                            onChange={
                                                                (e) => {
                                                                    field.onChange(e)
                                                                    form.trigger("name")
                                                                }
                                                            }
                                                        />
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
                                                        <Textarea
                                                            placeholder="Property Description"
                                                            {...field}
                                                            onChange={
                                                                (e) => {
                                                                    field.onChange(e)
                                                                    form.trigger("description")
                                                                }
                                                            }
                                                        />
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
                                                        <Input
                                                            type="text"
                                                            placeholder="Tracker ID"
                                                            {...field}
                                                            onChange={
                                                                (e) => {
                                                                    field.onChange(e)
                                                                    form.trigger("trackerId")
                                                                }
                                                            }
                                                        />
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
                                                            <Input
                                                                type="tel"
                                                                placeholder="+256234567890"
                                                                {...field}
                                                                onChange={
                                                                    (e) => {
                                                                        field.onChange(e)
                                                                        form.trigger("phone")
                                                                    }
                                                                }
                                                            />
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
                                                        onPolygonChange={(coords) => field.onChange(JSON.parse(coords))}
                                                        initialPaths={form.watch("geofence")?.map(({ lat, lng }) => ({ lat, lng }))}
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
                                {loading ? (editMode ? 'Updating...' : 'Saving...') : (editMode ? 'Update property' : 'Save property')}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}