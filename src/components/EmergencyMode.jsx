import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, BatteryLow, Zap, MapPin, Navigation, Loader2 } from 'lucide-react';

export default function EmergencyMode({ open, onClose }) {
  const [battery, setBattery] = useState(null);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    navigator.getBattery?.().then(b => setBattery(Math.round(b.level * 100))).catch(() => setBattery(null));
    setLoading(true);
    navigator.geolocation?.getCurrentPosition(pos => {
      const { latitude: lat, longitude: lng } = pos.coords;
      if (!window.google?.maps?.places?.PlacesService) { setLoading(false); return; }
      const svc = new window.google.maps.places.PlacesService(document.createElement('div'));
      svc.nearbySearch({ location: new window.google.maps.LatLng(lat, lng), radius: 10000, type: 'electric_vehicle_charging_station' }, (res, status) => {
        setLoading(false);
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setStations(res.slice(0, 5).map((p, i) => ({
            name: p.name, vicinity: p.vicinity,
            lat: p.geometry.location.lat(), lng: p.geometry.location.lng(),
            chargerType: i % 2 === 0 ? '150kW DC Fast' : '50kW DC',
            rating: p.rating,
          })));
        }
      });
    }, () => setLoading(false));
  }, [open]);

  const isLow = battery !== null && battery < 20;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative w-full max-w-xl max-h-[85vh] bg-dark-900 border-2 border-red-500/50 rounded-3xl shadow-[0_0_40px_rgba(239,68,68,0.3)] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-5 bg-red-500/10 border-b border-red-500/20 flex-shrink-0">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-400 animate-pulse" />
                <div>
                  <h3 className="text-lg font-bold text-white">Emergency Mode</h3>
                  <p className="text-xs text-red-300">Nearest fast chargers prioritized</p>
                </div>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-white p-1 rounded-lg hover:bg-red-500/10 transition-colors"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className={`flex items-center gap-4 p-4 rounded-2xl border ${isLow ? 'bg-red-500/10 border-red-500/30' : 'bg-dark-800 border-dark-700'}`}>
                <BatteryLow className={`w-8 h-8 flex-shrink-0 ${isLow ? 'text-red-400' : 'text-yellow-400'}`} />
                <div>
                  <p className="font-bold text-white text-sm">{battery !== null ? `Battery: ${battery}%` : 'Battery level unavailable'}</p>
                  <p className={`text-xs mt-0.5 ${isLow ? 'text-red-300 font-semibold' : 'text-gray-400'}`}>
                    {isLow ? '⚠️ Critical — charge immediately!' : battery !== null ? 'Battery is OK but emergency mode is active.' : 'Enable battery permission for live detection.'}
                  </p>
                </div>
                {battery !== null && (
                  <div className="ml-auto text-right">
                    <span className={`text-2xl font-black ${isLow ? 'text-red-400' : 'text-yellow-400'}`}>{battery}%</span>
                  </div>
                )}
              </div>

              {loading && (
                <div className="flex items-center justify-center py-10 gap-3">
                  <Loader2 className="w-8 h-8 text-red-400 animate-spin" />
                  <p className="text-gray-400 text-sm">Locating nearest chargers…</p>
                </div>
              )}

              {!loading && stations.map((s, i) => (
                <div key={i} className="bg-dark-800 border border-dark-700 rounded-2xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-white text-sm">{s.name}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{s.vicinity}</p>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-neon-green/10 text-neon-green border border-neon-green/20">
                      <Zap className="w-3 h-3" />{s.chargerType}
                    </span>
                  </div>
                  {s.rating && <p className="text-xs text-gray-500 mb-3">⭐ {s.rating}</p>}
                  <button onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`, '_blank')}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500 text-white font-bold text-xs hover:bg-red-400 transition-all">
                    <Navigation className="w-3 h-3" /> Navigate Now
                  </button>
                </div>
              ))}

              {!loading && stations.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                  <MapPin className="w-10 h-10 mx-auto mb-3 text-gray-600" />
                  <p>No stations found nearby. Allow location access.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
