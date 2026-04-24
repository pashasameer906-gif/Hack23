import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CalendarCheck, CheckCircle2 } from 'lucide-react';

export default function BookingModal({ open, onClose, defaultStation = 'Charge Zone – Koramangala' }) {
  const [submitted, setSubmitted] = useState(false);
  
  const handleClose = () => {
    onClose();
    setTimeout(() => setSubmitted(false), 300); // reset state after animation
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 20 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative w-full max-w-lg bg-dark-900 border border-dark-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 bg-dark-800 border-b border-dark-700 flex-shrink-0">
              <div className="flex items-center gap-3">
                <CalendarCheck className="w-5 h-5 text-neon-blue" />
                <h3 className="font-bold text-white text-lg">Booking Slot System</h3>
              </div>
              <button onClick={handleClose} className="text-gray-500 hover:text-white p-1 rounded-lg hover:bg-dark-700 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {!submitted ? (
                <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Station</label>
                    <input 
                      type="text" 
                      defaultValue={defaultStation}
                      readOnly
                      className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-gray-300 focus:outline-none text-sm opacity-80"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Date</label>
                    <input 
                      type="date" 
                      required
                      className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-green text-sm" 
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Time Slot</label>
                    <select className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-green text-sm">
                      <option>6:00 AM – 6:30 AM</option>
                      <option>7:00 AM – 7:30 AM</option>
                      <option>8:00 AM – 8:30 AM</option>
                      <option>9:00 AM – 9:30 AM</option>
                      <option>10:00 AM – 10:30 AM</option>
                      <option>11:00 AM – 11:30 AM</option>
                      <option>12:00 PM – 12:30 PM</option>
                      <option>1:00 PM – 1:30 PM</option>
                      <option>2:00 PM – 2:30 PM</option>
                      <option>3:00 PM – 3:30 PM</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Vehicle Type</label>
                    <select required className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-green text-sm">
                      <option value="">Select your vehicle</option>
                      <option value="SUV">SUV</option>
                      <option value="Sedan">Sedan</option>
                      <option value="Hatchback">Hatchback</option>
                      <option value="Bike">Bike (2-Wheeler)</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full py-3 bg-neon-green text-dark-900 font-bold rounded-xl hover:bg-[#00e65c] transition-all mt-2">
                    Confirm Booking
                  </button>
                </form>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 gap-4 text-center">
                  <CheckCircle2 className="w-16 h-16 text-neon-green" />
                  <h4 className="text-white font-bold text-xl">Slot Confirmed!</h4>
                  <p className="text-gray-400 text-sm max-w-sm">
                    Your EV charging slot at <strong className="text-white">{defaultStation}</strong> has been reserved. You'll get a reminder 15 mins before your time.
                  </p>
                  <button onClick={handleClose} className="mt-2 px-8 py-2.5 bg-neon-green/10 text-neon-green border border-neon-green/30 rounded-xl font-semibold text-sm hover:bg-neon-green/20 transition-all">
                    Done
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
