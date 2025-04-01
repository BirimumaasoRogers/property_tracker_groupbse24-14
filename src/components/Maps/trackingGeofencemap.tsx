"use client";

import { useEffect, useState } from "react";
import {GoogleMap, Marker, Polygon, useLoadScript } from "@react-google-maps/api";
import { fetchGeofence } from "@/app/services/geofenceService";

const DUMMY_GEOFENCE = [
    { lat: 0.3490, lng: 32.5840 },  // Top-right corner
    { lat: 0.3490, lng: 32.5810 },  // Bottom-right corner
    { lat: 0.3460, lng: 32.5810 },  // Bottom-left corner
    { lat: 0.3460, lng: 32.5840 },  // Top-left corner
];
  
const defaultCenter = { lat: 0.3476, lng: 32.5825 };

export default function TrackingGeofenceMap() {
    const url = new URL(window.location.href);
    const trackerId = url.searchParams.get("trackerId");
    console.log("trackerId", trackerId);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries: ["places","geometry"],
    });

    const [property, setProperty] = useState<string | null>(null);
    const [itemLocation, setItemLocation] = useState(defaultCenter);
    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const [paths, setPaths] = useState<{lat: number; lng: number}[]>([]);
    const [geofenceColor, setGeofenceColor] = useState("green"); 
    const [isLoading, setIsLoading] = useState(true);

    // Fetch location data only once when component mounts or trackerId changes
    useEffect(() => {
        if (!trackerId) return;
        
        const fetchPropertyLocation = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/locations?trackerId=${trackerId}`); // Added leading slash
                const data = await response.json();
                console.log("Location data response:", data);
                
                if (data.success && data.data && data.data.length > 0) {
                    const locationData = data.data[0];
                    const location = {
                        lat: locationData.latitude,
                        lng: locationData.longitude,
                    };
                    setItemLocation(location);
                    setMapCenter(location);
                 
                    // console.log("Updated geofence:", DUMMY_GEOFENCE);
                }
             else {
                console.log("No location data found or empty response");
            }
        } catch (error) {
            console.error("Error fetching property location:", error);
        } finally {
            setIsLoading(false);
        }
                
        };
        fetchPropertyLocation();
    }, [trackerId]); // Only depend on trackerId, not itemLocation


    
    //fetch data from db
    useEffect(() => {
        if (!trackerId) return;

        const fetchGeofence = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/properties?trackerId=${trackerId}`); // Added leading slash
                const data = await response.json();
                console.log("Geofence data response:", data);
                
                if (data.success && data.data && data.data.length > 0) {
                    const locationData = data.data.find((item: { trackerId: string }) => item.trackerId === trackerId);;

        
                    const geofenceCoordinates = Array.isArray(locationData.geofence)
                    ? locationData.geofence.map((point: { lat: number; lng: number }) => ({
                        lat: point.lat,
                        lng: point.lng
                    }))
                    : DUMMY_GEOFENCE;
                     console.log("New geofence geofence:", geofenceCoordinates);
                     setPaths([]); 
                    // setPaths(geofenceCoordinates);
                    setPaths([...geofenceCoordinates]); // Ensures a new reference is created

                    
                   // Update map center to match item location
                } else {
                    console.log("No location data found or empty response");
                }
            } catch (error) {
                console.error("Error fetching property location:", error);
            } finally {
                setIsLoading(false);
            }
           
        };
        
        fetchGeofence();
    }, [trackerId]);

    if (!isLoaded) return <div>Loading maps...</div>;
    if (isLoading) return <div>Loading location data...</div>;

    return(
        <div>
            <GoogleMap 
                mapContainerStyle={{width: "100%", height: "400px"}} 
                zoom={14} 
                center={mapCenter} // Use mapCenter instead of defaultCenter
                options={{
                    gestureHandling: "greedy",
                    scrollwheel: true,
                    disableDoubleClickZoom: false,
                    zoomControl: true,
                    mapTypeControl: false,
                }}>
               
                <Marker position={itemLocation} />

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
}

//when it crosses the boundary
export function isItemOutsideGeofence(itemLocation: { lat: number; lng: number }, paths: { lat: number; lng: number }[]): boolean {
    if (typeof window !== "undefined" && google.maps.geometry) {
        const polygon = new google.maps.Polygon({ paths });
        const point = new google.maps.LatLng(itemLocation.lat, itemLocation.lng);
        return !google.maps.geometry.poly.containsLocation(point, polygon);
    }
    return false;
}
    