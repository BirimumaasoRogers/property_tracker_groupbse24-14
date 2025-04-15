"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
    GoogleMap,
    Marker,
    Polygon,
    Polyline,
    useLoadScript,
} from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

const DUMMY_GEOFENCE = [
    { lat: 0.349, lng: 32.584 },
    { lat: 0.349, lng: 32.581 },
    { lat: 0.346, lng: 32.581 },
    { lat: 0.346, lng: 32.584 },
];

const defaultCenter = { lat: 0.3314595942674423, lng: 32.57059696041971 };

export default function TrackingGeofenceMap({ pingItem }: { pingItem: boolean }) {
    const [isMounted, setIsMounted] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const trackerId = searchParams.get("trackerId");
    const chaseMode = searchParams.get("chaseMode") === "true";
    console.log("current chase mode", chaseMode);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries: ["places", "geometry"],
    });

    const [itemLocation, setItemLocation] = useState(defaultCenter);
    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const [paths, setPaths] = useState<{ lat: number; lng: number }[]>([]);
    const [geofenceColor, setGeofenceColor] = useState("green");
    const [isLoading, setIsLoading] = useState(true);
    const [pathHistory, setPathHistory] = useState<{ lat: number; lng: number }[]>([]);
    console.log("pathHistory", pathHistory);

    const mapRef = useRef<google.maps.Map | null>(null);
    const markerRef = useRef<google.maps.Marker | null>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Update the fetchLocationHistory function
    const fetchLocationHistory = async () => {
        if (!trackerId) return;
        
        try {
            console.log("Fetching location history for trackerId:", trackerId);
            const res = await fetch(`/api/locations/history?trackerId=${trackerId}`);
            const data = await res.json();
            console.log("Path history fetched data:", data);
            
            if (data.success && Array.isArray(data.data) && data.data.length > 0) {
                // Convert the location history to path coordinates
                const pathCoordinates = data.data.map((location: any) => {
                    const lat = parseFloat(location.latitude);
                    const lng = parseFloat(location.longitude);
                    return {
                        lat: isFinite(lat) ? lat : 0,
                        lng: isFinite(lng) ? lng : 0,
                    };
                }).filter((coord: any) => coord.lat !== 0 && coord.lng !== 0);
                
                console.log("Processed path coordinates:", pathCoordinates);
                
                // Filter pathCoordinates to start from when the item leaves the geofence
                const geofenceCoordinates = paths.length > 0 ? paths : DUMMY_GEOFENCE;
                const startIndex = pathCoordinates.findIndex((coord: any) => {
                    const point = new google.maps.LatLng(coord.lat, coord.lng);
                    const polygon = new google.maps.Polygon({ paths: geofenceCoordinates });
                    return !google.maps.geometry.poly.containsLocation(point, polygon);
                });
                
                const filteredPathCoordinates = startIndex !== -1 ? pathCoordinates.slice(startIndex) : [];
                console.log("Filtered path coordinates:", filteredPathCoordinates);
                
                if (filteredPathCoordinates.length > 0) {
                    setPathHistory(filteredPathCoordinates);
                    
                    if (chaseMode && filteredPathCoordinates.length > 1 && mapRef.current) {
                        const bounds = new google.maps.LatLngBounds();
                        filteredPathCoordinates.forEach((point: any) => {
                            if (isFinite(point.lat) && isFinite(point.lng)) {
                                bounds.extend(new google.maps.LatLng(point.lat, point.lng));
                            }
                        });
                        mapRef.current.fitBounds(bounds);
                    }
                } else {
                    console.log("No valid coordinates found in location history after leaving geofence");
                }
            } else {
                console.log("No location history data found or invalid data format");
            }
        } catch (err) {
            console.error("Error fetching location history:", err);
        }
    };

    // Make sure to call fetchLocationHistory when chaseMode changes
    useEffect(() => {
        if (trackerId && chaseMode) {
            fetchLocationHistory();
        }
    }, [trackerId, chaseMode]);

    useEffect(() => {
        if (trackerId) {
            fetchLocationHistory();
        }
    }, [trackerId]);

    // Fetch location
    useEffect(() => {
        if (!trackerId || !isMounted) return;
        const fetchLocation = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/locations?trackerId=${trackerId}`);
                const data = await res.json();

                if (data.success && data.data?.length > 0) {
                    const { latitude, longitude } = data.data[0];
                    const lat = parseFloat(latitude);
                    const lng = parseFloat(longitude);
                    if (isFinite(lat) && isFinite(lng)) {
                        const location = { lat, lng };
                        setItemLocation(location);
                        setMapCenter(location);
                    }
                }
            } catch (err) {
                console.error("Error fetching location:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLocation();
    }, [trackerId, isMounted]);

    // Fetch geofence
    useEffect(() => {
        if (!trackerId) return;

        const fetchGeofence = async () => {
            try {
                const res = await fetch(`/api/properties/${trackerId}`);
                const data = await res.json();

                if (data.success && Array.isArray(data.data?.geofence)) {
                    const geofenceCoordinates = data.data.geofence.map((point: any) => ({
                        lat: parseFloat(point.lat),
                        lng: parseFloat(point.lng),
                    }));
                    setPaths(geofenceCoordinates);
                    checkIfItemOutsideGeofence(itemLocation, geofenceCoordinates);
                } else {
                    setPaths(DUMMY_GEOFENCE);
                }
            } catch (err) {
                console.error("Error fetching geofence:", err);
                setPaths(DUMMY_GEOFENCE);
            }
        };

        fetchGeofence();
    }, [trackerId]);

    useEffect(() => {
        if (pingItem && markerRef.current) {
            markerRef.current.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(() => markerRef.current?.setAnimation(null), 1500);
        }
    }, [pingItem]); // Trigger effect when pingItem changes

    if (!isMounted) return null;
    if (!isLoaded) return <div className="w-full h-full sm:h-[400px] bg-muted rounded-md"></div>;
    if (isLoading) return <div className="w-full h-full sm:h-[400px] bg-muted rounded-md"></div>;

    // Check geofence
    const checkIfItemOutsideGeofence = async (
        location: { lat: number; lng: number },
        polygonPath: { lat: number; lng: number }[]
    ) => {
        if (typeof window !== "undefined" && google.maps?.geometry) {
            const polygon = new google.maps.Polygon({ paths: polygonPath });
            const point = new google.maps.LatLng(location.lat, location.lng);
            const isOutside = !google.maps.geometry.poly.containsLocation(point, polygon);

            if (isOutside) {
                setGeofenceColor("red");
                try {
                    await fetch("/api/geofence-alert", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ message: "Item is out of bounds", location }),
                    });
                } catch (err) {
                    console.error("Alert send failed:", err);
                }
            } else {
                setGeofenceColor("green");
            }
        }
    };

    // Widget Controls
    const goToGeofence = () => {
        if (!mapRef.current || paths.length === 0) return;
        const bounds = new google.maps.LatLngBounds();
        paths.forEach((pt) => bounds.extend(pt));
        mapRef.current.fitBounds(bounds);
    };

    const goToItem = () => {
        if (
            mapRef.current &&
            itemLocation &&
            typeof itemLocation.lat === "number" &&
            typeof itemLocation.lng === "number" &&
            !isNaN(itemLocation.lat) &&
            !isNaN(itemLocation.lng)
        ) {
            try {
                mapRef.current.panTo(itemLocation);
                mapRef.current.setZoom(18);
            } catch (err) {
                console.error("Error centering on item:", err);
            }
        } else {
            console.warn("Invalid item location:", itemLocation);
        }
    };

    

    // Add a function to toggle chase mode
    const toggleChaseMode = () => {
        const url = new URL(window.location.href);
        const currentChaseMode = url.searchParams.get("chaseMode") === "true";
        url.searchParams.set("chaseMode", (!currentChaseMode).toString());
        router.push(url.pathname + url.search);
        router.refresh();
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-4">
                <Button onClick={goToGeofence}>Go to Geofence</Button>
                <Button onClick={goToItem}>Go to Property</Button>
                <Button 
                    onClick={toggleChaseMode}
                    variant={chaseMode ? "default" : "outline"}
                >
                    {chaseMode ? "Disable Chase Mode" : "Enable Chase Mode"}
                </Button>
            </div>
            
            {chaseMode && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
                    Chase Mode Active - Tracking path history
                </div>
            )}
            
            <div className="border border-gray-300 rounded-lg">
                <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "400px" }}
                    zoom={14}
                    center={mapCenter}
                    onLoad={(map) => {
                        mapRef.current = map;
                    }}

                    options={{
                        gestureHandling: "greedy",
                        scrollwheel: true,
                        zoomControl: true,
                        mapTypeControl: false,
                    }}
                >
                    <Marker
                        position={itemLocation}
                        onLoad={(marker) => (markerRef.current = marker)}
                    />

                    {paths.length > 0 && (
                        <Polygon
                            paths={paths}
                            options={{
                                strokeColor: geofenceColor,
                                strokeOpacity: 0.8,
                                strokeWeight: 2,
                                fillColor: geofenceColor,
                                fillOpacity: 0.35,
                            }}
                        />
                    )}
                    
                    {pathHistory.length > 0 && chaseMode && (
                        <Polyline
                            path={pathHistory}
                            options={{
                                strokeColor: "blue",
                                strokeOpacity: 0.8,
                                strokeWeight: 2,
                            }}
                        />
                    )}
                </GoogleMap>
            </div>
        </div>
    );
}
