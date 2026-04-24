import { useState, useRef, useCallback } from 'react';

const ROUTES_KEY = import.meta.env.VITE_ROUTES_API_KEY;

function decodePoly(encoded) {
  const pts = []; let i = 0, lat = 0, lng = 0;
  while (i < encoded.length) {
    let b, shift = 0, result = 0;
    do { b = encoded.charCodeAt(i++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    lat += result & 1 ? ~(result >> 1) : result >> 1;
    shift = 0; result = 0;
    do { b = encoded.charCodeAt(i++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    lng += result & 1 ? ~(result >> 1) : result >> 1;
    pts.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }
  return pts;
}

// Fallback: use google.maps.DirectionsService (available via Maps JS API key)
function routeViaDirectionsService(origin, dest) {
  return new Promise((resolve) => {
    if (!window.google?.maps?.DirectionsService) { resolve(null); return; }
    const svc = new window.google.maps.DirectionsService();
    svc.route(
      {
        origin: new window.google.maps.LatLng(origin.lat, origin.lng),
        destination: new window.google.maps.LatLng(dest.lat, dest.lng),
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK' && result.routes?.[0]) {
          const leg = result.routes[0].legs[0];
          const path = result.routes[0].overview_path.map((p) => ({
            lat: p.lat(),
            lng: p.lng(),
          }));
          resolve({
            path,
            duration: Math.round(leg.duration.value / 60),
            distance: (leg.distance.value / 1000).toFixed(1),
          });
        } else {
          console.warn('DirectionsService fallback failed:', status);
          resolve(null);
        }
      }
    );
  });
}

export function useMapSearch() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const timer = useRef(null);

  const search = useCallback((query) => {
    clearTimeout(timer.current);
    if (!query || query.length < 2) { setSuggestions([]); return; }

    timer.current = setTimeout(() => {
      setLoading(true);
      
      const fetchNominatim = async () => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=6&addressdetails=1`, { headers: { 'Accept-Language': 'en' } });
          const data = await res.json();
          setSuggestions(data.map(p => ({
            place_id: p.place_id,
            display_name: p.display_name,
            lat: parseFloat(p.lat),
            lng: parseFloat(p.lon),
            isNominatim: true
          })));
        } catch { setSuggestions([]); }
        finally { setLoading(false); }
      };

      if (!window.google?.maps?.places?.AutocompleteService) {
        fetchNominatim();
        return;
      }
      
      const svc = new window.google.maps.places.AutocompleteService();
      svc.getPlacePredictions(
        { input: query },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions.map(p => ({
              place_id: p.place_id,
              display_name: p.description,
              isNominatim: false
            })));
            setLoading(false);
          } else if (status === 'REQUEST_DENIED' || status === 'OVER_QUERY_LIMIT' || status === 'ZERO_RESULTS') {
            console.warn(`Google Places Autocomplete returned ${status}. Falling back to OpenStreetMap.`);
            fetchNominatim();
          } else {
            setSuggestions([]);
            setLoading(false);
          }
        }
      );
    }, 350);
  }, []);

  const computeRoute = useCallback(async (origin, dest) => {
    // Primary: Google Routes API v2 with the dedicated Routes API key
    try {
      const res = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': ROUTES_KEY,
          'X-Goog-FieldMask': 'routes.polyline.encodedPolyline,routes.duration,routes.distanceMeters',
        },
        body: JSON.stringify({
          origin: { location: { latLng: { latitude: origin.lat, longitude: origin.lng } } },
          destination: { location: { latLng: { latitude: dest.lat, longitude: dest.lng } } },
          travelMode: 'DRIVE',
        }),
      });
      const data = await res.json();
      const r = data.routes?.[0];
      if (r?.polyline?.encodedPolyline) {
        // duration comes as e.g. "1523s" — strip the trailing "s"
        const durationSeconds = parseInt(String(r.duration).replace('s', ''), 10);
        return {
          path: decodePoly(r.polyline.encodedPolyline),
          duration: Math.round(durationSeconds / 60),
          distance: (r.distanceMeters / 1000).toFixed(1),
        };
      }
      console.warn('Routes API returned no route, falling back to DirectionsService. Response:', data);
    } catch (e) {
      console.warn('Routes API fetch failed, falling back to DirectionsService:', e.message);
    }

    // Fallback: google.maps.DirectionsService (uses Maps API key, always available in browser)
    return routeViaDirectionsService(origin, dest);
  }, []);

  return { suggestions, loading, search, computeRoute, setSuggestions };
}
