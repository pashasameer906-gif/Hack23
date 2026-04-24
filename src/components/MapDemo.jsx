import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF, Circle, PolylineF } from '@react-google-maps/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Zap, MapPin, Loader2, AlertCircle, RefreshCw, BatteryCharging, Search, X, Navigation2, CalendarCheck } from 'lucide-react';
import { useMapSearch } from '../hooks/useMapSearch';
import BookingModal from './BookingModal';

const LIBRARIES = ['places'];
const PLACES_KEY = import.meta.env.VITE_PLACES_API_KEY;

const MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#0d1117' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
  { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#023e58' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#283d6a' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#304a7d' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#98a5be' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#2c6675' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e1626' }] },
];

function getStatusConfig(s) {
  if (s === 'OPERATIONAL') return { label: 'Available', color: '#00FF66' };
  if (s === 'CLOSED_TEMPORARILY') return { label: 'Closed', color: '#EF4444' };
  return { label: 'Unknown', color: '#F59E0B' };
}

export default function MapDemo() {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const [userLocation, setUserLocation] = useState(null);
  const [center, setCenter] = useState(null);
  const [destination, setDestination] = useState(null);
  const [stations, setStations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loadingStations, setLoadingStations] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [locationError, setLocationError] = useState(null);
  const [bookingStation, setBookingStation] = useState(null);

  const mapRef = useRef(null);
  const { suggestions, loading: loadingSuggestions, search: searchPlaces, computeRoute, setSuggestions } = useMapSearch();
  const [showDropdown, setShowDropdown] = useState(false);
  const [routePath, setRoutePath] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [navigatingTo, setNavigatingTo] = useState(null);

  const onMapLoad = useCallback((map) => { mapRef.current = map; }, []);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        const l = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(l); setCenter(l);
      },
      () => {
        const l = { lat: 12.9716, lng: 77.5946 };
        setUserLocation(l); setCenter(l);
        setLocationError('Location access denied. Using Bangalore as default.');
      }
    );
  }, []);

  const fetchStations = useCallback((c) => {
    if (!c) return;
    setLoadingStations(true);
    setSelected(null);

    const generateSimulatedStations = () => {
      // Scatter 6-8 simulated stations around the coordinate for demo purposes
      const count = Math.floor(Math.random() * 3) + 6;
      const sim = [];
      const brands = ['Charge Zone', 'Tata Power EV', 'Statiq Supercharger', 'BESCOM Fast Charger', 'Zeon Charging', 'Jio-bp pulse', 'Ather Grid'];
      for (let i = 0; i < count; i++) {
        const offsetLat = (Math.random() - 0.5) * 0.05;
        const offsetLng = (Math.random() - 0.5) * 0.05;
        const isClosed = Math.random() > 0.85;
        sim.push({
          place_id: `sim_${i}_${Date.now()}`,
          name: brands[Math.floor(Math.random() * brands.length)] + ' Station',
          vicinity: 'Public Charging Hub',
          lat: c.lat + offsetLat,
          lng: c.lng + offsetLng,
          business_status: isClosed ? 'CLOSED_TEMPORARILY' : 'OPERATIONAL',
          rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 to 5.0
          waitTime: Math.floor(Math.random() * 25) + 2,
          occupancy: Math.floor(Math.random() * 100),
          chargerType: i % 2 === 0 ? '150kW DC Fast' : '22kW AC',
        });
      }
      setStations(sim);
      setLoadingStations(false);
    };

    if (!window.google?.maps?.places?.PlacesService) {
      generateSimulatedStations();
      return;
    }

    const tempDiv = document.createElement('div');
    const svc = new window.google.maps.places.PlacesService(tempDiv);

    svc.nearbySearch(
      {
        location: new window.google.maps.LatLng(c.lat, c.lng),
        radius: 5000,
        type: 'electric_vehicle_charging_station',
      },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results?.length > 0) {
          setStations(
            results.slice(0, 9).map((p, i) => ({
              place_id: p.place_id,
              name: p.name || 'EV Station',
              vicinity: p.vicinity || '',
              lat: p.geometry.location.lat(),
              lng: p.geometry.location.lng(),
              business_status: p.business_status || 'OPERATIONAL',
              rating: p.rating || null,
              waitTime: Math.floor(Math.random() * 25) + 2,
              occupancy: Math.floor(Math.random() * 100),
              chargerType: i % 2 === 0 ? '150kW DC Fast' : '22kW AC',
            }))
          );
          setLoadingStations(false);
        } else {
          console.warn(`PlacesService nearbySearch failed with status: ${status}. Falling back to simulated demo stations.`);
          generateSimulatedStations();
        }
      }
    );
  }, []);


  useEffect(() => { if (isLoaded && center) fetchStations(center); }, [isLoaded, center, fetchStations]);

  const handleSelectPlace = useCallback((place) => {
    const finalizeSelection = (lat, lng, name, address) => {
      setSearchText(name);
      setShowDropdown(false);
      setSuggestions([]);
      
      const dest = { lat, lng, name, address };
      setDestination(dest);
      setCenter({ lat, lng });
      setSelected({ ...dest, isDestination: true });
      
      mapRef.current?.panTo({ lat, lng });
      mapRef.current?.setZoom(13);
      fetchStations({ lat, lng });
    };

    if (place.isNominatim) {
      const name = place.display_name?.split(',').slice(0, 2).join(', ') || '';
      finalizeSelection(place.lat, place.lng, name, place.display_name);
    } else {
      if (!window.google?.maps?.Geocoder) return;
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ placeId: place.place_id }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          const name = place.display_name?.split(',').slice(0, 2).join(', ') || '';
          finalizeSelection(location.lat(), location.lng(), name, place.display_name);
        } else {
          console.error('Geocoder failed due to: ' + status);
        }
      });
    }
  }, [fetchStations, setSuggestions]);

  const clearSearch = () => {
    setSearchText(''); setDestination(null); setSelected(null);
    setSuggestions([]); setShowDropdown(false);
    setRoutePath(null); setRouteInfo(null);
    if (userLocation) {
      setCenter(userLocation);
      mapRef.current?.panTo(userLocation);
      mapRef.current?.setZoom(14);
      fetchStations(userLocation);
    }
  };

  const handleNavigate = async (s) => {
    const origin = userLocation || center;
    if (!origin) return;
    setNavigatingTo(s.place_id || 'dest');
    
    // Clear previous route immediately
    setRoutePath(null);
    setRouteInfo(null);

    const route = await computeRoute(origin, { lat: s.lat, lng: s.lng });
    setNavigatingTo(null);

    if (route && route.path.length > 0) {
      setRoutePath(route.path);
      setRouteInfo({ duration: route.duration, distance: route.distance, destination: s.name });
      
      // Auto-fit bounds to show the entire route
      if (window.google?.maps?.LatLngBounds && mapRef.current) {
        const bounds = new window.google.maps.LatLngBounds();
        route.path.forEach(p => bounds.extend(p));
        mapRef.current.fitBounds(bounds);
      }
    } else {
      alert("Could not calculate a route to this location.");
    }
  };

  if (loadError) return (
    <section id="demo" className="py-24 bg-dark-800">
      <div className="max-w-7xl mx-auto px-4 text-center text-red-400">
        <AlertCircle className="w-12 h-12 mx-auto mb-4" />
        <p className="text-lg font-semibold">Failed to load Google Maps. Check your API key.</p>
      </div>
    </section>
  );

  return (
    <section id="demo" className="py-24 bg-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Live Map Demo</h2>
          <div className="w-20 h-1 bg-neon-blue mx-auto rounded-full mb-6" />
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            EV charging stations near your current location are loaded automatically.
            Search any city to explore stations worldwide.
          </p>
          {/* Live indicator */}
          <div className="mt-5 inline-flex items-center gap-2 bg-neon-green/10 border border-neon-green/20 text-neon-green text-sm font-semibold px-5 py-2 rounded-full">
            <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse inline-block" />
            Showing nearest EV stations within 5km of your location
          </div>

          {locationError && (
            <p className="text-yellow-400 text-sm mt-3 flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4" />{locationError}
            </p>
          )}
        </div>

        {/* Search Bar */}
        {isLoaded && (
          <div className="mb-6 max-w-2xl mx-auto relative z-30">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
              <input
                type="text"
                value={searchText}
                onChange={(e) => { setSearchText(e.target.value); searchPlaces(e.target.value); setShowDropdown(true); }}
                onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
                onKeyDown={(e) => e.key === 'Escape' && setShowDropdown(false)}
                placeholder="Search any city, place, or address worldwide…"
                className="w-full bg-dark-900 border border-dark-700 focus:border-neon-blue rounded-2xl pl-12 pr-12 py-4 text-white placeholder-gray-500 focus:outline-none transition-all shadow-[0_0_20px_rgba(0,240,255,0.08)]"
              />
              {loadingSuggestions && (
                <Loader2 className="absolute right-10 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-blue animate-spin" />
              )}
              {searchText && (
                <button onClick={clearSearch} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white z-10">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Dropdown */}
            <AnimatePresence>
              {showDropdown && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="absolute top-full mt-2 w-full bg-dark-900 border border-dark-700 rounded-2xl overflow-hidden shadow-2xl"
                >
                  {suggestions.map((s, i) => {
                    const parts = s.display_name?.split(',') || [];
                    const main = parts[0];
                    const secondary = parts.slice(1, 3).join(',').trim();
                    return (
                      <button
                        key={i}
                        onMouseDown={() => handleSelectPlace(s)}
                        className="w-full flex items-center gap-3 px-5 py-3 hover:bg-dark-800 transition-colors text-left border-b border-dark-700 last:border-0"
                      >
                        <MapPin className="w-4 h-4 text-neon-green flex-shrink-0" />
                        <div>
                          <p className="text-white text-sm font-medium">{main}</p>
                          {secondary && <p className="text-gray-500 text-xs">{secondary}</p>}
                        </div>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Destination banner */}
            <AnimatePresence>
              {destination && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="mt-3 flex items-center gap-3 px-4 py-2.5 bg-neon-green/10 border border-neon-green/20 rounded-xl text-sm"
                >
                  <Navigation2 className="w-4 h-4 text-neon-green flex-shrink-0" />
                  <span className="text-neon-green font-semibold truncate">{destination.name}</span>
                  <span className="text-gray-500">·</span>
                  <span className="text-gray-400 text-xs truncate">{destination.address}</span>
                </motion.div>
              )}
            </AnimatePresence>
            {/* Route Info Banner */}
            <AnimatePresence>
              {routeInfo && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="mt-3 flex items-center justify-between gap-3 px-5 py-3 bg-dark-900 border border-neon-blue/40 rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.1)] relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-neon-blue/5 pointer-events-none" />
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-neon-blue/10 rounded-lg">
                      <Navigation2 className="w-5 h-5 text-neon-blue" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">To {routeInfo.destination}</p>
                      <p className="text-gray-400 text-xs mt-0.5">
                        <span className="text-neon-green font-semibold">{routeInfo.duration} min</span> ({routeInfo.distance} km)
                      </p>
                    </div>
                  </div>
                  <button onClick={() => { setRoutePath(null); setRouteInfo(null); }} className="p-2 hover:bg-dark-700 rounded-lg text-gray-500 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Map */}
        <div
          className="relative rounded-3xl overflow-hidden border-2 border-dark-700 shadow-[0_0_60px_rgba(0,240,255,0.1)]"
          style={{ height: '560px' }}
        >
          {(!isLoaded || !center) ? (
            <div className="absolute inset-0 bg-dark-900 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-12 h-12 text-neon-green animate-spin" />
              <p className="text-gray-400">{!isLoaded ? 'Loading Google Maps…' : 'Detecting your location…'}</p>
            </div>
          ) : (
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={center}
              zoom={14}
              onLoad={onMapLoad}
              options={{ styles: MAP_STYLES, zoomControl: true, streetViewControl: false, mapTypeControl: false, fullscreenControl: true }}
              onClick={() => setSelected(null)}
            >
              {/* User location marker */}
              {userLocation && (
                <MarkerF
                  position={userLocation}
                  title="You are here"
                  icon={{
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 10, fillColor: '#00F0FF', fillOpacity: 1,
                    strokeColor: '#fff', strokeWeight: 2,
                  }}
                />
              )}

              {/* Destination marker */}
              {destination && (
                <MarkerF
                  position={{ lat: destination.lat, lng: destination.lng }}
                  title={destination.name}
                  onClick={() => setSelected({ ...destination, isDestination: true })}
                  icon={{
                    path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                    scale: 9, fillColor: '#FFD700', fillOpacity: 1,
                    strokeColor: '#fff', strokeWeight: 2,
                  }}
                />
              )}

              {/* Destination InfoWindow */}
              {selected?.isDestination && destination && (
                <InfoWindowF
                  position={{ lat: destination.lat, lng: destination.lng }}
                  onCloseClick={() => setSelected(null)}
                >
                  <div style={{ maxWidth: 240, fontFamily: 'sans-serif', padding: 4 }}>
                    <p style={{ fontWeight: 700, fontSize: 14, color: '#111', marginBottom: 4 }}>{destination.name}</p>
                    {destination.address && (
                      <p style={{ fontSize: 11, color: '#666', marginBottom: 12 }}>{destination.address}</p>
                    )}
                    <button
                      onClick={() => handleNavigate(destination)}
                      disabled={navigatingTo === (destination.place_id || 'dest')}
                      style={{ width: '100%', padding: '8px 0', background: '#00FF66', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                    >
                      {navigatingTo === (destination.place_id || 'dest') ? 'Calculating...' : 'Navigate Here'}
                    </button>
                  </div>
                </InfoWindowF>
              )}

              {/* Search radius circle */}
              <Circle
                center={center}
                radius={5000}
                options={{ strokeColor: '#00F0FF', strokeOpacity: 0.12, strokeWeight: 1, fillColor: '#00F0FF', fillOpacity: 0.03 }}
              />

              {/* EV Station markers */}
              {stations.map((s) => {
                const sc = getStatusConfig(s.business_status);
                return (
                  <MarkerF
                    key={s.place_id}
                    position={{ lat: s.lat, lng: s.lng }}
                    title={s.name}
                    onClick={() => setSelected(s)}
                    icon={{
                      path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z',
                      fillColor: sc.color, fillOpacity: 1,
                      strokeColor: '#fff', strokeWeight: 1,
                      scale: 1.8,
                      anchor: new window.google.maps.Point(12, 24),
                    }}
                  />
                );
              })}

              {/* Station InfoWindow */}
              {selected && !selected.isDestination && (
                <InfoWindowF
                  position={{ lat: selected.lat, lng: selected.lng }}
                  onCloseClick={() => setSelected(null)}
                >
                  <div style={{ maxWidth: 220, fontFamily: 'sans-serif', padding: 4 }}>
                    <p style={{ fontWeight: 700, fontSize: 13, color: '#111', marginBottom: 4 }}>{selected.name}</p>
                    <p style={{ fontSize: 11, color: '#666', marginBottom: 8 }}>{selected.vicinity}</p>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, background: selected.business_status === 'OPERATIONAL' ? '#dcfce7' : '#fee2e2', color: selected.business_status === 'OPERATIONAL' ? '#15803d' : '#dc2626', fontWeight: 600 }}>
                        {getStatusConfig(selected.business_status).label}
                      </span>
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, background: '#eff6ff', color: '#1d4ed8', fontWeight: 600 }}>
                        ~{selected.waitTime} min
                      </span>
                    </div>
                    <button
                      onClick={() => handleNavigate(selected)}
                      disabled={navigatingTo === selected.place_id}
                      style={{ width: '100%', padding: '6px 0', background: '#00FF66', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}
                    >
                      {navigatingTo === selected.place_id ? 'Calculating...' : 'Navigate'}
                    </button>
                  </div>
                </InfoWindowF>
              )}
              {/* Route Polyline */}
              {routePath && (
                <PolylineF
                  path={routePath}
                  options={{
                    strokeColor: '#00F0FF',
                    strokeOpacity: 0.8,
                    strokeWeight: 6,
                    geodesic: true,
                  }}
                />
              )}
            </GoogleMap>
          )}

          {/* Refresh button */}
          {isLoaded && center && (
            <button
              onClick={() => fetchStations(center)}
              disabled={loadingStations}
              className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-dark-900/90 backdrop-blur text-white border border-dark-700 hover:border-neon-green px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 ${loadingStations ? 'animate-spin text-neon-green' : ''}`} />
              {loadingStations ? 'Searching…' : 'Refresh'}
            </button>
          )}

          {loadingStations && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-dark-900/90 backdrop-blur border border-dark-700 px-5 py-2 rounded-full flex items-center gap-2 text-sm text-neon-green z-10">
              <Loader2 className="w-4 h-4 animate-spin" /> Finding EV stations…
            </div>
          )}
        </div>

        {/* Station Cards */}
        {stations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {stations.map((s) => {
              const sc = getStatusConfig(s.business_status);
              return (
                <motion.div
                  key={s.place_id}
                  whileHover={{ y: -3 }}
                  onClick={() => { setSelected(s); mapRef.current?.panTo({ lat: s.lat, lng: s.lng }); mapRef.current?.setZoom(16); }}
                  className={`bg-dark-900 rounded-2xl p-5 border cursor-pointer transition-all duration-300 ${selected?.place_id === s.place_id ? 'border-neon-green shadow-[0_0_20px_rgba(0,255,102,0.2)]' : 'border-dark-700 hover:border-neon-blue/50'}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 pr-2">
                      <div className="flex items-center gap-2 mb-1">
                        <BatteryCharging className="w-4 h-4 text-neon-green flex-shrink-0" />
                        <h4 className="font-semibold text-white text-sm line-clamp-1">{s.name}</h4>
                      </div>
                      <p className="text-gray-500 text-xs truncate pl-6">{s.vicinity}</p>
                    </div>
                    <span className="flex-shrink-0 flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full" style={{ background: sc.color + '20', color: sc.color }}>
                      <span className="w-1.5 h-1.5 rounded-full inline-block animate-pulse" style={{ background: sc.color }} />
                      {sc.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-yellow-400" />~{s.waitTime} min</span>
                    <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-neon-blue" />{s.chargerType}</span>
                    {s.rating && <span>⭐ {s.rating}</span>}
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                      <span>Occupancy</span>
                      <span className="font-mono">{s.occupancy}%</span>
                    </div>
                    <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${s.occupancy}%`, background: s.occupancy > 75 ? '#EF4444' : s.occupancy > 40 ? '#F59E0B' : '#00FF66' }} />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleNavigate(s); }}
                      disabled={navigatingTo === s.place_id}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-neon-blue/10 text-neon-blue border border-neon-blue/30 hover:bg-neon-blue hover:text-dark-900 text-xs font-bold transition-all disabled:opacity-50"
                    >
                      {navigatingTo === s.place_id ? <Loader2 className="w-3 h-3 animate-spin" /> : <MapPin className="w-3 h-3" />}
                      {navigatingTo === s.place_id ? 'Routing...' : 'Navigate'}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setBookingStation(s); }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-neon-green/10 text-neon-green border border-neon-green/30 hover:bg-neon-green hover:text-dark-900 text-xs font-bold transition-all"
                    >
                      <CalendarCheck className="w-3 h-3" /> Book Slot
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {isLoaded && center && !loadingStations && stations.length === 0 && (
          <div className="mt-8 text-center text-gray-500 py-12">
            <AlertCircle className="w-10 h-10 mx-auto mb-3 text-gray-600" />
            <p>No EV charging stations found within 5km.</p>
          </div>
        )}

        <BookingModal 
          open={!!bookingStation} 
          onClose={() => setBookingStation(null)} 
          defaultStation={bookingStation?.name} 
        />
      </div>
    </section>
  );
}
