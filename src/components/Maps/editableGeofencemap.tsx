"use client";

import { useEffect, useRef, useState } from "react";
import { GoogleMap, Polygon, Autocomplete, useLoadScript } from "@react-google-maps/api";
import { Input } from "../ui/input";

const mapContainerStyle = { width: "100%", height: "400px" };
const defaultCenter = { lat: 0.3476, lng: 32.5825 };

export default function GeofenceMap({ onPolygonChange }: { onPolygonChange: (coords: string) => void }) {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries: ["places"],
    });

    const [paths, setPaths] = useState<{ lat: number; lng: number }[]>([
        { lat: 0.350, lng: 32.580 },
        { lat: 0.350, lng: 32.585 },
        { lat: 0.345, lng: 32.585 },
        { lat: 0.345, lng: 32.580 }
    ]);
    const [center, setCenter] = useState(defaultCenter);
    const polygonRef = useRef<google.maps.Polygon | null>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    // Get user's current location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
                },
                () => console.log("Geolocation permission denied"),
                { enableHighAccuracy: true }
            );
        }
    }, []);

    // Handle polygon edits
    const handlePolygonEdit = () => {
        if (polygonRef.current) {
            const path = polygonRef.current.getPath();
            const newCoords = path.getArray().map((latLng) => ({
                lat: latLng.lat(),
                lng: latLng.lng(),
            }));
            setPaths(newCoords);
            onPolygonChange(JSON.stringify(newCoords));
        }
    };

    // Handle place selection from search bar
    const handlePlaceSelect = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if (place && place.geometry && place.geometry.location) {
                const newCenter = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                };
                setCenter(newCenter);
                
                // Update polygon coordinates relative to new center
                const offset = 0.005; // approximately 500 meters
                const newPaths = [
                    { lat: newCenter.lat + offset, lng: newCenter.lng - offset },
                    { lat: newCenter.lat + offset, lng: newCenter.lng + offset },
                    { lat: newCenter.lat - offset, lng: newCenter.lng + offset },
                    { lat: newCenter.lat - offset, lng: newCenter.lng - offset }
                ];
                setPaths(newPaths);
                onPolygonChange(JSON.stringify(newPaths));
            } else {
                console.warn("Selected place has no geometry data.");
            }
        }
    };

    if (!isLoaded) return <div>Loading...</div>;

    return (
        <>
            <div className="mb-4">
                <Autocomplete onLoad={(auto) => (autocompleteRef.current = auto)} onPlaceChanged={handlePlaceSelect}>
                    <Input type="text" placeholder="Search for a location" className="w-full p-2 border rounded" />
                </Autocomplete>
            </div>
            <div className="border rounded-sm">
                <GoogleMap mapContainerStyle={mapContainerStyle} zoom={12} center={center}>
                    <Polygon
                        paths={paths}
                        editable
                        draggable
                        onMouseUp={handlePolygonEdit}
                        onDragEnd={handlePolygonEdit}
                        onLoad={(polygon) => (polygonRef.current = polygon)}
                    />
                </GoogleMap>
            </div>
            <div className="mt-4">
                <label htmlFor="coordinates" className="block text-sm font-medium text-gray-700 mb-1">
                    Polygon Coordinates
                </label>
                <Input
                    id="coordinates"
                    value={JSON.stringify(paths)}
                    readOnly
                    className="w-full text-gray-400"
                />
            </div>

        </>
    );
}
