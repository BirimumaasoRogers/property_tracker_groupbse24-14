"use client";

import { useEffect, useState } from "react";
import {GoogleMap, Marker, Polygon, useLoadScript } from "@react-google-maps/api";
// import { isItemOutsideGeofence } from "../utils/trackingService";

const defaultCenter = { lat: 0.3476, lng: 32.5825 };

export default function TrackingGeofenceMap() {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries: ["places"],
    });

    const [itemLocation, setItemLocation] = useState(defaultCenter);
    const [paths, setPaths] = useState<{lat: number; lng: number}[]>([]);

    useEffect(() =>{
        const savedGeofence = localStorage.getItem("geofence");
        if (savedGeofence){
            setPaths(JSON.parse(savedGeofence));
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const newLocation = {
                lat: itemLocation.lat + (Math.random() - 0.5) * 0.001,
                lng: itemLocation.lng + (Math.random() - 0.5) * 0.001
            };
            setItemLocation(newLocation);

            // if (isItemOutsideGeofence(newLocation, paths)) {
            //     alert("⚠️ Item has moved out of the geofence!");
            // }
        }, 5000);


        return () => clearInterval(interval);
    }, [itemLocation, paths]);

    if (!isLoaded) return <div>Loading...</div>;

    return(
        <div>
            
            <GoogleMap mapContainerStyle={{width: "100%", height: "400px"}} zoom={12} center={defaultCenter}>
                <Marker position = {itemLocation} />
                <Polygon paths = {paths} />
            </GoogleMap>
        </div>
    )
    }

    export function isItemOutsideGeofence(itemLocation: { lat: number; lng: number }, paths: { lat: number; lng: number }[]): boolean {
        if (typeof window !== "undefined" && google.maps.geometry) {
            const polygon = new google.maps.Polygon({ paths });
            const point = new google.maps.LatLng(itemLocation.lat, itemLocation.lng);
            return !google.maps.geometry.poly.containsLocation(point, polygon);
        }
        return false;
    }
    