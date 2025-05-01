"use client";
import { useEffect, useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
    ChevronLeft,
    ChevronRight,
    Copy,
    LocateFixed,
    MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import ChaseModeAlert from "@/components/chase-mode-alert";
import PropertyRegisterForm from "@/components/Forms/property-register-form";
import TrackingGeofenceMap from "@/components/Maps/trackingGeofencemap";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";

export default function DashboardPage() {
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    const [properties, setProperties] = useState([]);
    const [locationData, setLocationData]: any = useState(null);
    const [propertyDetails, setPropertyDetails] = useState([]);
    const [geofenceStatus, setGeofenceStatus] = useState("Within Bounds");
    const [pingItem, setPingItem] = useState(false); // Ensure pingItem is a boolean state
    const [showChaseModeAlert, setShowChaseModeAlert] = useState(false);
    const [pathHistory, setPathHistory] = useState<{ lat: number; lng: number }[]>([]);
    const [selectedProperty, setSelectedProperty] = useQueryState("propertyId", {
        defaultValue: "",
    });
    const [trackerId, setTrackerId] = useQueryState("trackerId", {
        defaultValue: "",
    });
    const [chaseMode, setChaseMode] = useQueryState("chaseMode", {
        defaultValue: "false",
    });

    const selectedPropertyDetails: any = propertyDetails.find(
        (property: any) => property._id === selectedProperty
    );

    useEffect(() => {
        setIsMounted(true);
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        const response = await fetch("/api/properties");
        const data = await response.json();
        if (data.success) {
            setProperties(data.data);
            if (!selectedProperty) {
                setSelectedProperty(data.data[0]?._id);
                setTrackerId(data.data[0]?.trackerId);
            }
        }
    };

    const handlePropertyCreationSuccess = (newPropertyId: string) => {
        setSelectedProperty(newPropertyId);
        fetchProperties(); // Refresh properties list
    };

    const fetchLocationData = async (trackerId: string) => {
        console.log("Fetching location data for trackerId:", trackerId);
        const response = await fetch(`/api/locations?trackerId=${trackerId}`);
        const data = await response.json();
        console.log("Location data:", data);
        if (data.success) {
            setLocationData(data.data);
            fetchPropertyDetails(selectedProperty);
        }
    };

    const fetchPropertyDetails = async (propertyId: string) => {
        const response = await fetch(`/api/properties?propertyId=${propertyId}`);
        const data = await response.json();
        if (data.success) {
            setPropertyDetails(data.data);
            const property = data.data.find((prop: any) => prop._id === propertyId);
            if (property) {
                setTrackerId(property.trackerId);
            }
        }
    };

    

    useEffect(() => {
        if (trackerId && selectedProperty) {
            fetchLocationData(trackerId);
        }
    }, [trackerId, selectedProperty]);

    const checkIfItemWithinBounds = (
        location: { lat: number; lng: number },
        polygonPath: { lat: number; lng: number }[]
    ) => {
        if (
            typeof window !== "undefined" &&
            typeof window.google !== "undefined" &&
            window.google.maps?.geometry
        ) {
            const polygon = new window.google.maps.Polygon({ paths: polygonPath });
            const point = new window.google.maps.LatLng(location.lat, location.lng);
            const isWithinBounds = window.google.maps.geometry.poly.containsLocation(point, polygon);

            setGeofenceStatus(isWithinBounds ? "Within Bounds" : "Out of Bounds");
            if (!isWithinBounds) {
                setShowChaseModeAlert(true);
            }
        }
    };

    const handlePing = () => {
        setPingItem(true);
        setTimeout(() => setPingItem(false), 1500); // Reset pingItem after animation duration
    };

    const handlePopupConfirm = () => {
        setShowChaseModeAlert(false);
        // Activate chase mode
        if (trackerId && selectedProperty) {
            setChaseMode("true").then(() => {
                // Optionally refresh the page or component to trigger the chase mode view
                router.refresh();
            });
        }
    };

    const handlePopupCancel = () => {
        setShowChaseModeAlert(false);
    };

    useEffect(() => {
        if (locationData && locationData.length > 0 && selectedPropertyDetails?.geofence) {
            const location = {
                lat: parseFloat(locationData[0].latitude),
                lng: parseFloat(locationData[0].longitude),
            };
            checkIfItemWithinBounds(location, selectedPropertyDetails.geofence);
        }
    }, [locationData, selectedPropertyDetails]);

    function formatDate(dateString: string | undefined) {
        if (!dateString) {
            return "Invalid Date";
        }
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return "Invalid Date";
        }
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        }).format(date);
    }

    if (!isMounted) return null;

    return (

        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
            {showChaseModeAlert && <ChaseModeAlert open={showChaseModeAlert} onConfirm={handlePopupConfirm} onCancel={handlePopupCancel} />}
            <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                    <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
                        <CardHeader className="pb-3">
                            <CardTitle>Your Property</CardTitle>
                            <CardDescription className="max-w-lg text-balance leading-relaxed">
                                Introducing our Dynamic Property Tracking Dashboard for Seamless
                                Management.
                            </CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <PropertyRegisterForm onSuccess={handlePropertyCreationSuccess} />
                        </CardFooter>
                    </Card>
                    <Card className="w-full sm:col-span-2">
                        <CardHeader className="pb-2">
                            <CardTitle className="">Select a property</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col justify-between gap-4">
                            <div className="[--ring:var(--color-indigo-300)] *:not-first:mt-2 in-[.dark]:[--ring:var(--color-indigo-900)]">
                                <Select onValueChange={setSelectedProperty} value={selectedProperty}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select property" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {properties.map((property: any) => (
                                            <SelectItem key={property._id} value={property._id}>
                                                {!property ? "Select Property" : property.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">
                                    <span className="font-semibold text-black">NOTE: </span>
                                    Please select a property from the options above</p>
                            </div>
                        </CardContent>
                        {/* <CardFooter>
                            <Progress value={25} aria-label="25% increase" />
                        </CardFooter> */}
                    </Card>
                </div>
                <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-semibold">Live Tracking</h2>
                    <div className="overflow-hidden shadow-sm">
                        <TrackingGeofenceMap pingItem={pingItem} /> {/* Pass pingItem as a prop */}
                    </div>
                </div>
            </div>
            <div>
                <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
                    <CardHeader className="flex flex-row items-center justify-between bg-muted/50">
                        <div className="">
                            <CardTitle className="group flex items-center gap-2 text-lg">
                                {selectedPropertyDetails ? (
                                    <>
                                        {selectedPropertyDetails.name} {/* Display property name */}
                                    </>
                                ) : (
                                    <span>No Registered Devices</span>
                                )}
                            </CardTitle>
                        </div>
                        <div className="flex items-center gap-1">
                            {selectedPropertyDetails ? (
                                <Button size="sm" variant="outline" className="h-8 gap-1" onClick={handlePing}>
                                    <LocateFixed className="h-3.5 w-3.5" />
                                    <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                                        Ping {selectedPropertyDetails.name} {/* Dynamic ping */}
                                    </span>
                                </Button>
                            ) : null}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button size="icon" variant="outline" className="h-8 w-8">
                                        <MoreVertical className="h-3.5 w-3.5" />
                                        <span className="sr-only">More</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>Edit Property</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>Delete Property</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 text-sm">
                        {selectedPropertyDetails ? (
                            <>
                                <div className="grid gap-3">
                                    <div className="font-semibold">Item Details</div>
                                    <ul className="grid gap-3">
                                        <li className="flex items-center justify-between">
                                            <span className="text-muted-foreground">Name</span>
                                            <span>{selectedPropertyDetails.name || "No Name"}</span> {/* Display property name */}
                                        </li>
                                        <li className="flex items-center justify-between">
                                            <span className="text-muted-foreground">Description</span>
                                            <span>{selectedPropertyDetails.description || 'No Description'}</span> {/* Display property description */}
                                        </li>
                                    </ul>
                                </div>
                                <Separator className="my-4" />
                                <div className="grid gap-3">
                                    <div className="font-semibold">GPS Information</div>
                                    <ul className="grid gap-3">
                                        <li className="flex items-center justify-between">
                                            <span className="text-muted-foreground">Coordinates</span>
                                            <span>
                                                {locationData?.[0]?.latitude ?? "N/A"}, {locationData?.[0]?.longitude ?? "N/A"}
                                            </span>
                                        </li>
                                        <li className="flex items-center justify-between">
                                            <span className="text-muted-foreground">Created </span>
                                            <span>
                                                <time dateTime={selectedPropertyDetails?.createdAt}>{formatDate(selectedPropertyDetails?.createdAt)}</time> {/* Display createdAt */}
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                                <Separator className="my-4" />
                                <div className="grid gap-3">
                                    <div className="font-semibold">Tracking Information</div>
                                    <dl className="grid gap-3">
                                        <div className="flex items-center justify-between">
                                            <dt className="text-muted-foreground">Property Status</dt>
                                            <dd className={`px-2 py-1 rounded-full ${geofenceStatus === "Within Bounds" ? "bg-green-200" : "bg-red-200"}`}>
                                                {geofenceStatus}
                                            </dd>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <dt className="text-muted-foreground">GPS Status</dt>
                                            <dd className="px-2 py-1 rounded-full bg-green-200">Active</dd>
                                        </div>
                                    </dl>
                                </div>
                            </>
                        ) : (
                            <div className="flex justify-center items-center h-full">
                                <svg width="164" height="119" viewBox="0 0 164 119" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M60.3769 58.9647C59.5128 60.3664 53.7461 64.4192 49.1102 69.7638C44.4704 75.1128 40.9615 81.7535 40.2809 83.0083C39.7711 83.9469 39.242 84.8705 38.7107 85.792C38.1964 84.0663 37.6472 82.356 37.0706 80.6543C36.0353 77.602 35.0175 74.5418 33.8984 71.5311C33.4308 70.2738 32.9932 68.9915 32.4798 67.7567C31.7777 66.0747 31.0769 64.3905 30.3747 62.7085C29.6394 60.9407 28.7848 59.248 27.9666 57.5329C27.6393 56.8438 27.3362 56.1254 26.9721 55.4613C26.3713 54.3618 25.7687 53.2629 25.1661 52.1634C23.6045 49.3094 21.8917 46.5918 20.1373 43.9073C19.9082 42.9299 19.4898 42.0116 18.8823 41.315C18.833 41.2569 18.7823 41.2004 18.7335 41.1445C18.4519 40.8118 13.2875 41.4614 9.97614 40.3976C6.3434 39.2304 4.53196 36.3523 4.11328 36.2129" stroke="black" strokeWidth="8.2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M98.6348 57.3293C100.005 57.8398 101.426 58.3251 102.603 59.1987C103.824 60.1064 105.024 61.0103 106.113 62.0675C107.018 62.9448 107.877 63.863 108.68 64.8283C109.586 65.9207 110.513 67.0109 111.347 68.1547L114.826 72.9318C115.944 74.4649 117.063 75.9958 118.18 77.5268C118.95 78.5824 119.785 79.5976 120.608 80.6176C120.524 80.5121 120.441 80.4072 120.356 80.3017C121.431 81.5274 122.492 82.7551 123.631 83.9272C124.706 85.0321 125.829 86.0877 126.971 87.1287C127.865 87.9445 128.763 88.7551 129.678 89.5479C131.729 84.6124 133.829 79.6994 136.053 74.8316C138.121 70.3022 140.256 65.8037 142.319 61.2722C143.263 58.9054 144.188 56.5413 145.04 54.1404C145.487 52.8838 145.921 51.6236 146.385 50.3733C146.616 49.7463 146.849 49.1193 147.114 48.5023C147.562 47.4672 147.928 46.3748 148.783 45.5695C151.362 45.1979 153.297 44.7631 154.587 44.2651C155.877 43.7671 157.481 42.8358 159.399 41.4712" stroke="black" strokeWidth="8.2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M60.4865 58.7488C60.4815 61.2384 60.3851 63.73 60.1495 66.2118C59.9943 67.8441 59.8408 69.4764 59.6573 71.1071C59.2792 74.4688 62.3476 105.344 62.3476 106.8C62.3476 107.963 62.2476 109.12 62.1079 110.276C62.0673 110.547 62.0289 110.818 61.991 111.09C61.9732 111.214 61.9554 111.341 61.9714 111.465C61.9727 111.97 62.0979 112.447 62.3485 112.892" stroke="black" strokeWidth="8.2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M98.6348 57.2463C98.9313 58.2388 99.2577 59.2384 99.4645 60.243C99.6731 61.2562 104.698 105.57 105.11 107.512C105.254 108.694 105.389 109.868 105.386 111.056C105.384 111.727 105.379 112.397 105.362 113.068C105.355 113.492 105.338 113.912 105.367 114.337" stroke="black" strokeWidth="8.2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M64.7884 14.9755C70.064 8.13252 76.777 3.09539 85.9785 5.1115C111.909 10.7919 106.921 50.8893 81.2701 52.6952C60.5 54.1584 52.7294 18.7744 69.4968 13.8151" stroke="black" strokeWidth="8.2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                        <div className="text-xs text-muted-foreground">
                            Updated <time dateTime={selectedPropertyDetails?.updatedAt}>{formatDate(selectedPropertyDetails?.updatedAt)}</time> {/* Display updatedAt */}
                        </div>
                        <Pagination className="ml-auto mr-0 w-auto">
                            <PaginationContent>
                                <PaginationItem>
                                    <Button size="icon" variant="outline" className="h-6 w-6">
                                        <ChevronLeft className="h-3.5 w-3.5" />
                                        <span className="sr-only">Previous Order</span>
                                    </Button>
                                </PaginationItem>
                                <PaginationItem>
                                    <Button size="icon" variant="outline" className="h-6 w-6">
                                        <ChevronRight className="h-3.5 w-3.5" />
                                        <span className="sr-only">Next Order</span>
                                    </Button>
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </CardFooter>
                </Card>
            </div>
        </main>
    );
}