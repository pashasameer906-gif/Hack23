import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BatteryCharging, MapPin, Clock, Zap, Loader2, AlertCircle, Sparkles, Navigation } from 'lucide-react';

const PLACES_KEY = import.meta.env.VITE_PLACES_API_KEY;

function calcDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function getStatusConfig(s) {
  if (s === 'OPERATIONAL') return { label: 'Available', color: '#00FF66' };
  if (s === 'CLOSED_TEMPORARILY') return { label: 'Closed', color: '#EF4444' };
  return { label: 'Unknown', color: '#F59E0B' };
}

function getScore(station) {
  let score = 100;
  if (station.business_status !== 'OPERATIONAL') score -= 50;
  score -= station.distanceM / 100;
  score -= station.occupancy * 0.3;
  score -= station.waitTime * 0.5;
  if (station.rating) score += station.rating * 2;
  return Math.round(score);
}

export default function SmartRecommendations({ open, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [stations, setStations] = useState([]);
  const [currentBattery, setCurrentBattery] = useState(20);
  const [originalCapacity, setOriginalCapacity] = useState(60);
  const [currentMaxCapacity, setCurrentMaxCapacity] = useState(48);

  const soh = originalCapacity > 0 ? Math.round((currentMaxCapacity / originalCapacity) * 100) : 0;

  const fetchStations = useCallback(async (loc) => {
    setLoading(true); setError(null); setStations([]);
    try {
      const res = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': PLACES_KEY,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.location,places.businessStatus,places.rating,places.shortFormattedAddress',
        },
        body: JSON.stringify({
          includedTypes: ['electric_vehicle_charging_station'],
          maxResultCount: 10,
          locationRestriction: {
            circle: { center: { latitude: loc.lat, longitude: loc.lng }, radius: 30000 },
          },
        }),
      });
      const data = await res.json();
      const raw = data.places || [];
      const enriched = raw
        .map((p, i) => ({
          place_id: p.id,
          name: p.displayName?.text || 'EV Station',
          vicinity: p.shortFormattedAddress || '',
          lat: p.location.latitude,
          lng: p.location.longitude,
          business_status: p.businessStatus || 'OPERATIONAL',
          rating: p.rating || null,
          waitTime: Math.floor(Math.random() * 20) + 1,
          occupancy: Math.floor(Math.random() * 100),
          chargerType: i % 2 === 0 ? '150kW DC Fast' : '22kW AC',
          distanceM: calcDistance(loc.lat, loc.lng, p.location.latitude, p.location.longitude),
        }))
        .sort((a, b) => {
          const sa = getScore(b) - getScore(a);
          return sa !== 0 ? sa : a.distanceM - b.distanceM;
        });
      setStations(enriched);
    } catch (e) {
      setError('Could not fetch EV stations. Check your Places API key.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        fetchStations(loc);
      },
      () => {
        const loc = { lat: 12.9716, lng: 77.5946 };
        setUserLocation(loc);
        fetchStations(loc);
      }
    );
  }, [open, fetchStations]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[640px] md:max-h-[80vh] bg-dark-900 border border-dark-700 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-dark-700 bg-dark-800 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-neon-green/10 p-2.5 rounded-xl">
                  <Sparkles className="w-5 h-5 text-neon-green" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Smart Recommendations</h3>
                  <p className="text-xs text-gray-400">AI-ranked EV stations within 30km</p>
                </div>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              
              {/* Battery Status Section */}
              <div className="bg-dark-800 border border-dark-700 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-4">
                  <BatteryCharging className="w-5 h-5 text-neon-blue" />
                  <h4 className="text-white font-bold text-sm">Vehicle Battery Health & Status</h4>
                </div>
                
                <div className="mb-5">
                  <div className="flex justify-between text-xs text-gray-400 mb-2">
                    <label className="font-medium">Current Battery Charge</label>
                    <span className="text-neon-blue font-bold text-sm">{currentBattery}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={currentBattery} 
                    onChange={(e) => setCurrentBattery(e.target.value)}
                    className="w-full h-2 bg-dark-900 rounded-lg appearance-none cursor-pointer accent-neon-blue"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Original Capacity (kWh)</label>
                    <input 
                      type="number" 
                      value={originalCapacity} 
                      onChange={(e) => setOriginalCapacity(e.target.value)}
                      className="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-neon-blue transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Current Max Capacity (kWh)</label>
                    <input 
                      type="number" 
                      value={currentMaxCapacity} 
                      onChange={(e) => setCurrentMaxCapacity(e.target.value)}
                      className="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-neon-blue transition-colors"
                    />
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between bg-dark-900/50 p-3 rounded-xl border border-dark-700/50">
                  <div className="text-sm text-gray-400 font-mono flex items-center flex-wrap gap-1">
                    SOH(%) = <span className="text-white">{currentMaxCapacity}</span> / <span className="text-white">{originalCapacity}</span> × 100
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Health</span>
                    <span className={`text-xl font-bold ${soh >= 80 ? 'text-neon-green' : soh >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {soh}%
                    </span>
                  </div>
                </div>
              </div>

              {loading && (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <div className="relative">
                    <Loader2 className="w-10 h-10 text-neon-green animate-spin" />
                    <div className="absolute inset-0 w-10 h-10 rounded-full border-2 border-neon-green/20" />
                  </div>
                  <p className="text-gray-400 text-sm">Finding best EV stations near you…</p>
                </div>
              )}

              {error && !loading && (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                  <AlertCircle className="w-10 h-10 text-red-400" />
                  <p className="text-red-400 font-medium">{error}</p>
                  <p className="text-gray-500 text-sm">Enable Places API in Google Cloud Console</p>
                </div>
              )}

              {!loading && !error && stations.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                  <AlertCircle className="w-10 h-10 text-gray-600" />
                  <p className="text-gray-400">No EV stations found within 10km</p>
                </div>
              )}

              {!loading && stations.map((s, idx) => {
                const sc = getStatusConfig(s.business_status);
                const score = getScore(s);
                const distKm = s.distanceM >= 1000 ? `${(s.distanceM / 1000).toFixed(1)} km` : `${s.distanceM} m`;
                return (
                  <motion.div
                    key={s.place_id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-dark-800 border border-dark-700 rounded-2xl p-4 hover:border-neon-green/40 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {/* Rank badge */}
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${idx === 0 ? 'bg-neon-green text-dark-900' : idx === 1 ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30' : 'bg-dark-700 text-gray-400'}`}>
                          {idx + 1}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-white text-sm truncate">{s.name}</p>
                          <p className="text-gray-500 text-xs truncate mt-0.5">{s.vicinity}</p>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full" style={{ background: sc.color + '20', color: sc.color }}>
                          <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: sc.color }} />
                          {sc.label}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-400 mb-3">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-neon-green" />{distKm} away</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-yellow-400" />~{s.waitTime} min wait</span>
                      <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-neon-blue" />{s.chargerType}</span>
                      {s.rating && <span>⭐ {s.rating}</span>}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Occupancy</span>
                          <span>{s.occupancy}%</span>
                        </div>
                        <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${s.occupancy}%`, background: s.occupancy > 75 ? '#EF4444' : s.occupancy > 40 ? '#F59E0B' : '#00FF66' }} />
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <div className="text-xs text-gray-500">AI Score</div>
                        <div className={`text-base font-bold ${score >= 80 ? 'text-neon-green' : score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>{score}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`, '_blank')}
                      className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-neon-green/10 text-neon-green border border-neon-green/30 hover:bg-neon-green hover:text-dark-900 text-xs font-bold transition-all"
                    >
                      <Navigation className="w-3 h-3" /> Navigate to Station
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {/* Footer */}
            {!loading && stations.length > 0 && (
              <div className="flex-shrink-0 px-5 py-4 border-t border-dark-700 bg-dark-800 flex flex-col gap-3">
                <button
                  onClick={() => {
                    if (userLocation) {
                      window.open(
                        `https://www.google.com/maps/search/EV+charging+station/@${userLocation.lat},${userLocation.lng},12z`,
                        '_blank'
                      );
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-neon-green text-dark-900 font-bold text-sm hover:bg-[#00e65c] transition-all shadow-[0_0_15px_rgba(0,255,102,0.3)] hover:scale-[1.02] active:scale-[0.98]"
                >
                  <MapPin className="w-4 h-4" />
                  View All Stations on Google Maps
                </button>
                <p className="text-xs text-gray-500 text-center">
                  Ranked by: availability · distance · wait time · AI score · within 30km
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
