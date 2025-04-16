"use client";

import { useLoadScript } from "@react-google-maps/api";
import { useEffect, useState } from "react";

type Props = {
  location: { lat: number; lng: number };
  polygonPath: { lat: number; lng: number }[];
  onResult: (result: "Within Bounds" | "Out of Bounds") => void;
};

export default function GeofenceStatusChecker({ location, polygonPath, onResult }: Props) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["geometry"],
  });

  useEffect(() => {
    if (isLoaded && window?.google?.maps?.geometry) {
      const point = new google.maps.LatLng(location.lat, location.lng);
      const polygon = new google.maps.Polygon({ paths: polygonPath });

      const isInside = google.maps.geometry.poly.containsLocation(point, polygon);
      onResult(isInside ? "Within Bounds" : "Out of Bounds");
    }
  }, [isLoaded, location, polygonPath]);

  return null; // doesn't render anything visual
}
