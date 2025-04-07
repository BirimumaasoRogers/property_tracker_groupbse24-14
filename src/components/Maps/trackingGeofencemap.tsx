"use client";

import { useEffect, useState } from "react";
import { GoogleMap, Marker, Polygon, useLoadScript } from "@react-google-maps/api";
import { fetchGeofence } from "@/app/services/geofenceService";
import { useSearchParams } from "next/navigation";

const DUMMY_GEOFENCE = [
    { lat: 0.3490, lng: 32.5840 },  // Top-right corner
    { lat: 0.3490, lng: 32.5810 },  // Bottom-right corner
    { lat: 0.3460, lng: 32.5810 },  // Bottom-left corner
    { lat: 0.3460, lng: 32.5840 },  // Top-left corner
];
  
const defaultCenter = { lat: 0.3314595942674423, lng: 32.57059696041971 };  //0.3314595942674423, 32.57059696041971

export default function TrackingGeofenceMap() {
    // Add client-side only check to prevent window access during SSR
    const [isMounted, setIsMounted] = useState(false);
    const searchParams = useSearchParams();
    
    useEffect(() => {
        setIsMounted(true);
    }, []);
    
    // Initialize states with valid default values
    const [property, setProperty] = useState<string | null>(null);
    const [itemLocation, setItemLocation] = useState(defaultCenter);
    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const [paths, setPaths] = useState<{lat: number; lng: number}[]>([]);
    const [geofenceColor, setGeofenceColor] = useState("green"); 
    const [isLoading, setIsLoading] = useState(true);
    
    // Get trackerId from URL params using Next.js hooks
    const trackerId = searchParams.get("trackerId");
    console.log("map trackerId", trackerId);

    // Load Google Maps API
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries: ["places","geometry"],
    });

    // Fetch location data when trackerId changes
    useEffect(() => {
        if (!trackerId || !isMounted) return;
        
        const fetchPropertyLocation = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/locations?trackerId=${trackerId}`);
                const data = await response.json();
                console.log("Location data response:", data);
                
                if (data.success && data.data && data.data.length > 0) {
                    const locationData = data.data[0];
                    // Validate coordinates before setting state
                    const lat = parseFloat(locationData.latitude);
                    const lng = parseFloat(locationData.longitude);
                    
                    if (!isNaN(lat) && !isNaN(lng) && isFinite(lat) && isFinite(lng)) {
                        const location = { lat, lng };
                        setItemLocation(location);
                        setMapCenter(location);

                    
                    } else {
                        console.error("Invalid coordinates:", locationData);
                        // Keep using default center if coordinates are invalid
                    }
                } else {
                    console.log("No location data found or empty response");
                }
            } catch (error) {
                console.error("Error fetching property location:", error);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchPropertyLocation();
    }, [trackerId, isMounted]);
    
    // Fetch geofence data
    useEffect(() => {
        if (!trackerId) return;

        const fetchGeofence = async () => {
            try {
                const response = await fetch(`/api/properties/${trackerId}`);
                const data = await response.json();
                console.log("Geofence data response:", data);

                if (data.success && data.data && data.data.geofence && data.data.geofence.length > 0) {
                    const geofenceCoordinates = data.data.geofence.map((point: { lat: any; lng: any }) => {
                        // Validate each coordinate
                        const lat = parseFloat(point.lat);
                        const lng = parseFloat(point.lng);
                        return {
                            lat: isNaN(lat) ? 0 : lat,
                            lng: isNaN(lng) ? 0 : lng
                        };
                    });

                    console.log("New geofence:", geofenceCoordinates);
                    setPaths([...geofenceCoordinates]); // Ensures a new reference is created
                } else {
                    console.log("No geofence data found or empty response");
                    setPaths(DUMMY_GEOFENCE);
                }
            } catch (error) {
                console.error("Error fetching geofence:", error);
                setPaths(DUMMY_GEOFENCE);
            }
        };
        checkIfItemOutsideGeofence(itemLocation, paths);
        fetchGeofence();

        checkIfItemOutsideGeofence(itemLocation, paths);
    }, [trackerId]);

    const checkIfItemOutsideGeofence = async (
        itemLocation: { lat: number; lng: number },
        paths: { lat: number; lng: number }[]
    ) => {
        if (typeof window !== "undefined" && google && google.maps && google.maps.geometry) {
            const polygon = new google.maps.Polygon({ paths });
            const point = new google.maps.LatLng(itemLocation.lat, itemLocation.lng);

            const isOutside = !google.maps.geometry.poly.containsLocation(point, polygon);

            if (isOutside) {
                // Update geofence color to red
                setGeofenceColor("red");

                // Send "out of bounds" message to the database
                try {
                    await fetch("/api/geofence-alert", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            message: "Item is out of bounds",
                            location: itemLocation,
                        }),
                    });
                    console.log("Out of bounds message sent to the database.");
                } catch (error) {
                    console.error("Failed to send out of bounds message:", error);
                }

                // Prompt the user for confirmation
                // const userConfirmed = window.confirm(
                //     "Your item has stepped out of the geofence boundary. Are you the one who moved it?"
                // );

                //  if (userConfirmed) {
                //     console.log("User confirmed they moved the item.");
                // } else {
                //     console.log("User denied moving the item.");
                // }
            } else {
                // Reset geofence color to green if the item is inside
                setGeofenceColor("green");
            }
        }
    };

    // Don't render anything during SSR
    if (!isMounted) return null;
    
    // Loading states
    if (!isLoaded) return <div>Loading maps...</div>;
    if (isLoading) return <div>Loading location data...</div>;

    // Validate mapCenter before rendering
    const validMapCenter = (
        typeof mapCenter.lat === 'number' && 
        !isNaN(mapCenter.lat) && 
        isFinite(mapCenter.lat) && 
        typeof mapCenter.lng === 'number' && 
        !isNaN(mapCenter.lng) && 
        isFinite(mapCenter.lng)
    ) ? mapCenter : defaultCenter;

   

    return(
        <div>
            <GoogleMap 
                mapContainerStyle={{width: "100%", height: "400px"}} 
                zoom={14} 
                center={validMapCenter}
                options={{
                    gestureHandling: "greedy",
                    scrollwheel: true,
                    disableDoubleClickZoom: false,
                    zoomControl: true,
                    mapTypeControl: false,
                }}>
               
                {/* Only render marker if coordinates are valid */}
                {itemLocation && typeof itemLocation.lat === 'number' && typeof itemLocation.lng === 'number' && (
                    <Marker position={itemLocation} />
                )}

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
            </GoogleMap>
        </div>
    );

    // const isItemOutsideGeofence(itemLocation: { lat: number; lng: number }, paths: { lat: number; lng: number }[]): boolean {
    //     if (typeof window !== "undefined" && google && google.maps && google.maps.geometry) {
    //         const polygon = new google.maps.Polygon({ paths });
    //         const point = new google.maps.LatLng(itemLocation.lat, itemLocation.lng);
    //         return !google.maps.geometry.poly.containsLocation(point, polygon);
    //     }
    //     return false;
    // }
        
}
