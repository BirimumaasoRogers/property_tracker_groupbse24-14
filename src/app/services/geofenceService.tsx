
    export async function fetchGeofence(property: string) {

        const DUMMY_GEOFENCE = [
            { lat: 0.3490, lng: 32.5840 },  // Top-right corner
            { lat: 0.3490, lng: 32.5810 },  // Bottom-right corner
            { lat: 0.3460, lng: 32.5810 },  // Bottom-left corner
            { lat: 0.3460, lng: 32.5840 },  // Top-left corner
          ];
          
        try {
            const response = await fetch(`/api/geofence?property=${property}`);
            const data = await response.json();
    
            if (data && data.coordinates) {
                return data.coordinates;
            }
                return DUMMY_GEOFENCE;
        } catch (error) {
            console.error("Error fetching geofence:", error);
        }
        return DUMMY_GEOFENCE;
    }
     
