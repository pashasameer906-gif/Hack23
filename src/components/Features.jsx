import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Clock, AlertTriangle, Map, BarChart3, Navigation, CalendarCheck, Radio, BrainCircuit, X, BatteryLow, MapPin, Zap, CheckCircle2 } from 'lucide-react';
import EmergencyMode from './EmergencyMode';
import BookingModal from './BookingModal';

/* ── tiny inline modal ── */
function InfoModal({ title, icon, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
      />
      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 20 }}
        transition={{ type: 'spring', damping: 26, stiffness: 320 }}
        className="relative w-full max-w-lg max-h-[85vh] bg-dark-900 border border-dark-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 bg-dark-800 border-b border-dark-700 flex-shrink-0">
          <div className="flex items-center gap-3">{icon}<h3 className="font-bold text-white text-lg">{title}</h3></div>
          <button onClick={onClose} className="text-gray-500 hover:text-white p-1 rounded-lg hover:bg-dark-700 transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </motion.div>
    </div>
  );
}


const HOURS = ['6am','8am','10am','12pm','2pm','4pm','6pm','8pm','10pm'];
const LOAD  = [20,  35,   60,   80,   70,   85,   90,   55,   25 ];
const BEST  = [0,   1,    0,    0,    0,    0,    0,    0,    1  ]; // 1 = good slot

export default function Features() {
  const [modal, setModal] = useState(null); // 'wait'|'heatmap'|'route'|'booking'|'ai'|'live'|'future'
  const [emergency, setEmergency] = useState(false);
  const [batteryWarn, setBatteryWarn] = useState(false);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  // Auto-check battery on mount
  useEffect(() => {
    navigator.getBattery?.().then(b => {
      if (b.level * 100 < 20) { setBatteryWarn(true); }
      b.onlevelchange = () => { if (b.level * 100 < 20) setBatteryWarn(true); };
    }).catch(() => {});
  }, []);

  const scrollToMap = () => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });

  const features = [
    { icon: <Sparkles />, title: 'Smart Recommendation', sub: 'Find nearest stations', onClick: scrollToMap },
    { icon: <Clock />,     title: 'Wait Time Prediction', sub: 'Live wait estimates',  onClick: () => setModal('wait') },
    { icon: <AlertTriangle />, title: 'Emergency Mode', sub: battery_warn_label(batteryWarn), onClick: () => setEmergency(true), alert: batteryWarn },
    { icon: <Map />,       title: 'Heatmap Dashboard',   sub: 'Station activity map',  onClick: () => setModal('heatmap') },
    { icon: <BarChart3 />, title: 'Future Load Prediction', sub: 'Peak hour forecast', onClick: () => setModal('future') },
    { icon: <Navigation />, title: 'Route Planning',     sub: 'Open route planner',    onClick: () => setModal('route') },
    { icon: <CalendarCheck />, title: 'Booking Slot System', sub: 'Reserve a slot',    onClick: () => setModal('booking') },
    { icon: <Radio />,     title: 'Live Availability',   sub: 'Real-time stations',    onClick: scrollToMap },
    { icon: <BrainCircuit />, title: 'AI Best Time',     sub: 'Optimal charge window', onClick: () => setModal('ai') },
  ];

  return (
    <>
      {/* Battery warning banner */}
      <AnimatePresence>
        {batteryWarn && !emergency && (
          <motion.div initial={{ y: -60 }} animate={{ y: 0 }} exit={{ y: -60 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-red-500 text-white px-6 py-3 rounded-full shadow-lg font-semibold text-sm cursor-pointer"
            onClick={() => setEmergency(true)}>
            <BatteryLow className="w-4 h-4 animate-pulse" /> Battery &lt;20% — Tap for Emergency Mode
          </motion.div>
        )}
      </AnimatePresence>

      <section id="features" className="py-24 bg-dark-800 relative overflow-hidden">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-neon-blue/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Key Features</h2>
            <div className="w-20 h-1 bg-neon-green mx-auto rounded-full mb-8" />
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">Everything you need for a seamless EV charging experience.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }} onClick={f.onClick} whileTap={{ scale: 0.96 }}
                className={`relative bg-dark-900/50 backdrop-blur-sm border p-6 rounded-2xl flex flex-col items-center justify-center text-center group cursor-pointer transition-all duration-300 hover:-translate-y-1
                  ${f.alert ? 'border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:shadow-[0_0_30px_rgba(239,68,68,0.35)]'
                  : 'border-dark-700 hover:border-neon-blue hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]'}`}>
                <span className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border"
                  style={f.alert
                    ? { background: 'rgba(239,68,68,0.15)', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }
                    : { background: 'rgba(0,255,102,0.1)', color: '#00FF66', borderColor: 'rgba(0,255,102,0.3)' }}>
                  <span className="w-1.5 h-1.5 rounded-full inline-block animate-pulse"
                    style={{ background: f.alert ? '#ef4444' : '#00FF66' }} />
                  {f.alert ? 'ALERT' : 'LIVE'}
                </span>
                <div className={`transition-colors duration-300 mb-3 h-12 w-12 flex items-center justify-center rounded-full
                  ${f.alert ? 'text-red-400 bg-red-500/10 group-hover:bg-red-500/20' : 'text-gray-400 bg-dark-800 group-hover:text-neon-blue group-hover:bg-neon-blue/10'}`}>
                  {f.icon}
                </div>
                <h3 className="font-semibold text-gray-200 group-hover:text-white transition-colors text-sm">{f.title}</h3>
                <p className="text-xs text-gray-500 mt-1 group-hover:text-gray-400 transition-colors">{f.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Mode */}
      <EmergencyMode open={emergency} onClose={() => setEmergency(false)} />

      {/* Wait Time Prediction */}
      {modal === 'wait' && (
        <InfoModal title="Wait Time Prediction" icon={<Clock className="w-5 h-5 text-neon-blue" />} onClose={() => setModal(null)}>
          <p className="text-gray-400 text-sm mb-4">Estimated wait times at nearby EV stations based on live occupancy data.</p>
          {[
            { name: 'Charge Zone – Koramangala', wait: 4, occ: 35 },
            { name: 'BESCOM Fast Charger', wait: 12, occ: 72 },
            { name: 'Tata Power EV Hub', wait: 7, occ: 55 },
            { name: 'Greaves EV Station', wait: 2, occ: 20 },
            { name: 'Statiq Supercharger', wait: 18, occ: 88 },
          ].map((s, i) => (
            <div key={i} className="flex items-center justify-between bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 mb-2">
              <div><p className="text-white text-sm font-medium">{s.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-1.5 w-24 bg-dark-700 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${s.occ}%`, background: s.occ > 70 ? '#EF4444' : s.occ > 40 ? '#F59E0B' : '#00FF66' }} />
                  </div>
                  <span className="text-xs text-gray-500">{s.occ}%</span>
                </div>
              </div>
              <span className={`text-sm font-bold px-3 py-1 rounded-full ${s.wait < 8 ? 'bg-neon-green/10 text-neon-green' : s.wait < 15 ? 'bg-yellow-400/10 text-yellow-400' : 'bg-red-500/10 text-red-400'}`}>
                ~{s.wait} min
              </span>
            </div>
          ))}
        </InfoModal>
      )}

      {/* Heatmap Dashboard */}
      {modal === 'heatmap' && (
        <InfoModal title="Heatmap Dashboard" icon={<Map className="w-5 h-5 text-neon-blue" />} onClose={() => setModal(null)}>
          <p className="text-gray-400 text-sm mb-5">Station activity intensity across the day.</p>
          <div className="grid grid-cols-9 gap-1 mb-3">
            {LOAD.map((v, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-full rounded-md" style={{ height: `${v}px`, background: v > 70 ? '#EF4444' : v > 45 ? '#F59E0B' : '#00FF66', opacity: 0.85 }} />
                <span className="text-[10px] text-gray-500">{HOURS[i]}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-neon-green inline-block" />Low</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-yellow-400 inline-block" />Medium</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-red-500 inline-block" />High</span>
          </div>
        </InfoModal>
      )}

      {/* Future Load Prediction */}
      {modal === 'future' && (
        <InfoModal title="Future Load Prediction" icon={<BarChart3 className="w-5 h-5 text-neon-blue" />} onClose={() => setModal(null)}>
          <p className="text-gray-400 text-sm mb-5">AI predicts congestion for the next 12 hours so you can plan ahead.</p>
          {HOURS.slice(0, 6).map((h, i) => (
            <div key={i} className="flex items-center gap-3 mb-3">
              <span className="text-gray-400 text-xs w-10 flex-shrink-0">{h}</span>
              <div className="flex-1 h-3 bg-dark-700 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${LOAD[i + 3]}%`, background: LOAD[i + 3] > 70 ? '#EF4444' : LOAD[i + 3] > 45 ? '#F59E0B' : '#00FF66' }} />
              </div>
              <span className="text-xs font-mono text-gray-400 w-8">{LOAD[i + 3]}%</span>
            </div>
          ))}
        </InfoModal>
      )}

      {/* Route Planning */}
      {modal === 'route' && (
        <InfoModal title="Route Planning" icon={<Navigation className="w-5 h-5 text-neon-blue" />} onClose={() => setModal(null)}>
          <p className="text-gray-400 text-sm mb-5">Plan your EV journey with charging stops along the way.</p>
          <div className="space-y-3">
            {[['From', 'Your current location', '📍'],['To', 'Enter destination', '🏁'],['Via Charger', 'Best station on route', '⚡']].map(([label, val, emoji], i) => (
              <div key={i} className="bg-dark-800 border border-dark-700 rounded-xl px-4 py-3">
                <p className="text-xs text-gray-500 mb-1">{label}</p>
                <p className="text-white text-sm">{emoji} {val}</p>
              </div>
            ))}
            <button onClick={() => { window.open('https://www.google.com/maps/dir/?api=1', '_blank'); setModal(null); }}
              className="w-full py-3 bg-neon-green text-dark-900 font-bold rounded-xl hover:bg-[#00e65c] transition-all mt-2">
              Open Route Planner in Google Maps
            </button>
          </div>
        </InfoModal>
      )}

      {/* Booking Slot System */}
      <BookingModal 
        open={modal === 'booking'} 
        onClose={() => setModal(null)} 
        defaultStation="Charge Zone – Koramangala" 
      />

      {/* AI Best Time */}
      {modal === 'ai' && (
        <InfoModal title="AI Best Time Suggestion" icon={<BrainCircuit className="w-5 h-5 text-neon-blue" />} onClose={() => setModal(null)}>
          <p className="text-gray-400 text-sm mb-5">Based on historical patterns and live data, the AI recommends:</p>
          <div className="bg-neon-green/10 border border-neon-green/20 rounded-2xl p-5 mb-4 text-center">
            <p className="text-neon-green font-bold text-2xl mb-1">6:00 AM – 8:00 AM</p>
            <p className="text-gray-300 text-sm">⚡ Lowest wait · ₹ Cheapest rates · 🌿 Greenest energy mix</p>
          </div>
          {HOURS.map((h, i) => (
            <div key={i} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl mb-2 border ${BEST[i] ? 'bg-neon-green/10 border-neon-green/20' : 'bg-dark-800 border-dark-700'}`}>
              <span className={`text-xs font-bold w-10 ${BEST[i] ? 'text-neon-green' : 'text-gray-500'}`}>{h}</span>
              <div className="flex-1 h-2 bg-dark-700 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${LOAD[i]}%`, background: BEST[i] ? '#00FF66' : LOAD[i] > 70 ? '#EF4444' : '#F59E0B' }} />
              </div>
              {BEST[i] && <span className="text-neon-green text-xs font-bold">✓ Best</span>}
            </div>
          ))}
        </InfoModal>
      )}
    </>
  );
}

function battery_warn_label(warn) { return warn ? '⚠️ Battery critical!' : 'Auto-detects low battery'; }
