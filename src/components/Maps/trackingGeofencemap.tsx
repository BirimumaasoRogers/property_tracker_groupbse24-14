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
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries: ["places","geometry"],
    });

    const [property, setProperty] = useState<string | null>(null);
    const [itemLocation, setItemLocation] = useState(defaultCenter);
    const [paths, setPaths] = useState<{lat: number; lng: number}[]>([]);
    const [geofenceColor, setGeofenceColor] = useState("green"); 

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await fetch("/api/property"); // Replace with actual API route
                const data = await response.json();
                if (data.property) setProperty(data.property);
            } catch (error) {
                console.error("Error fetching property:", error);
            }
        };

        fetchProperty();
    }, []);

    
    //fetch data from db
    useEffect(() => {
        if (!property) return;

        const fetchGeofence = async () => {
            try {
                setPaths(DUMMY_GEOFENCE);
                // const coordinates = await fetchGeofence(property);
                // if (coordinates) {
                //   setPaths(coordinates);
                // }
              } catch (error) {
                console.error("Failed to fetch geofence:", error);
                setPaths(DUMMY_GEOFENCE);

              }
              setPaths(DUMMY_GEOFENCE);

            };
        fetchGeofence();
    }, [property]);

    
// simulate live tracking
    useEffect(() => {
        const interval = setInterval(() => {
            const newLocation = {
                lat: itemLocation.lat + (Math.random() - 0.5) * 0.001,
                lng: itemLocation.lng + (Math.random() - 0.5) * 0.001
            };
            setItemLocation(newLocation);

            const isOutside = isItemOutsideGeofence(newLocation, paths);
            if (isOutside) {
                setGeofenceColor("red");
                alert("⚠️ Item has moved out of the geofence!"); // Outside geofence
            } else {
                setGeofenceColor("green"); // Inside geofence
            }
        }, 5000); // Update location every 5 seconds   

           


        return () => clearInterval(interval);
    }, [itemLocation, paths]);

    if (!isLoaded) return <div>Loading...</div>;

    return(
        <div>
            

            <GoogleMap 
            mapContainerStyle={{width: "100%", height: "400px"}} zoom={14} center={defaultCenter}
            options={{
                gestureHandling: "greedy",
                    scrollwheel: true, // Allow zooming
                    disableDoubleClickZoom: false,
                    zoomControl: true, // Show zoom control buttons
                    mapTypeControl: false, // Optional: Hide map type control (optional)
                    // streetViewControl: false, // Optional: Hide street view control
                    // fullscreenControl: false, // Optional: Hide fullscreen control
            }}>
               
                <Marker position = {itemLocation}  />

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
    )
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
    