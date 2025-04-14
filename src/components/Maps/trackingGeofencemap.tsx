"use client";

import { useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  Marker,
  Polygon,
  useLoadScript,
} from "@react-google-maps/api";
import { Button } from "@/components/ui/button";

const DUMMY_GEOFENCE = [
  { lat: 0.349, lng: 32.584 },
  { lat: 0.349, lng: 32.581 },
  { lat: 0.346, lng: 32.581 },
  { lat: 0.346, lng: 32.584 },
];

const defaultCenter = { lat: 0.3476, lng: 32.5825 };

export default function TrackingGeofenceMap() {
  const url = new URL(window.location.href);
  const trackerId = url.searchParams.get("trackerId");
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places", "geometry"],
  });

  const [itemLocation, setItemLocation] = useState(defaultCenter);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [paths, setPaths] = useState<{ lat: number; lng: number }[]>([]);
  const [geofenceColor] = useState("green");
  const [isLoading, setIsLoading] = useState(true);

  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    if (!trackerId) return;
    const fetchLocation = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/locations?trackerId=${trackerId}`);
        const data = await res.json();
        if (data.success && data.data?.length > 0) {
          const loc = data.data[0];
          const location = {
            lat: parseFloat(loc.latitude),
            lng: parseFloat(loc.longitude),
          };
          setItemLocation(location);
          setMapCenter(location);
        }
      } catch (err) {
        console.error("Error fetching location:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLocation();
  }, [trackerId]);

  useEffect(() => {
    if (!trackerId) return;
    const fetchGeofence = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/properties?trackerId=${trackerId}`);
        const data = await res.json();
        if (data.success && data.data?.length > 0) {
          const prop = data.data.find((p: any) => p.trackerId === trackerId);
          const geo = Array.isArray(prop?.geofence)
            ? prop.geofence.map((pt: any) => ({ lat: pt.lat, lng: pt.lng }))
            : DUMMY_GEOFENCE;
          setPaths([...geo]);
        }
      } catch (err) {
        console.error("Error fetching geofence:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGeofence();
  }, [trackerId]);

  const goToGeofence = () => {
    if (!mapRef.current || paths.length === 0) return;
    const bounds = new google.maps.LatLngBounds();
    paths.forEach((pt) => bounds.extend(pt));
    mapRef.current.fitBounds(bounds);
  };


  const pingItem = () => {
    if (markerRef.current) {
      markerRef.current.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(() => markerRef.current?.setAnimation(null), 1500);
    }
  };

  const goToItem = () => {
    console.log("📍 Going to item:", itemLocation);
  
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
        mapRef.current.setZoom(18  ); // Optional: zoom closer
      } catch (error) {
        console.error("Error centering on item:", error);
      }
    } else {
      console.warn("⚠️ Invalid item location:", itemLocation);
    }
  };
  
  if (!isLoaded) return <div>Loading maps...</div>;
  if (isLoading) return <div>Loading location data...</div>;

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
      <Button onClick={goToGeofence}>Go to Geofence</Button>
        <Button onClick={goToItem}>Go to Item</Button>
        <Button onClick={pingItem} variant="destructive">Ping Item</Button>
      </div>
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
      </GoogleMap>
    </div>
  );
}

export function isItemOutsideGeofence(
  itemLocation: { lat: number; lng: number },
  paths: { lat: number; lng: number }[]
): boolean {
  if (typeof window !== "undefined" && google.maps.geometry) {
    const polygon = new google.maps.Polygon({ paths });
    const point = new google.maps.LatLng(itemLocation.lat, itemLocation.lng);
    return !google.maps.geometry.poly.containsLocation(point, polygon);
  }
  return false;
}
