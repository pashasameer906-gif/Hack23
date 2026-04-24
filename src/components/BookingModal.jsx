import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CalendarCheck, CheckCircle2, Download } from 'lucide-react';

export default function BookingModal({ open, onClose, defaultStation = 'Charge Zone – Koramangala' }) {
  const [submitted, setSubmitted] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    date: '',
    timeSlot: '6:00 AM – 6:30 AM',
    vehicleType: '',
  });
  
  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSubmitted(false);
      setBookingDetails({ date: '', timeSlot: '6:00 AM – 6:30 AM', vehicleType: '' });
    }, 300);
  };

  const generateWordDoc = () => {
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Booking Details</title></head>
      <body style="font-family: Arial, sans-serif;">
        <h1 style="color: #22c55e;">VoltWise AI - Booking Confirmed</h1>
        <hr />
        <h3>Booking Details:</h3>
        <ul>
          <li><strong>Station:</strong> ${defaultStation}</li>
          <li><strong>Date:</strong> ${bookingDetails.date}</li>
          <li><strong>Time Slot:</strong> ${bookingDetails.timeSlot}</li>
          <li><strong>Vehicle Type:</strong> ${bookingDetails.vehicleType}</li>
          <li><strong>Booked On:</strong> ${new Date().toLocaleString()}</li>
        </ul>
        <br />
        <p>Thank you for choosing VoltWise AI! Please arrive 5 minutes early.</p>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `VoltWise_Booking_${bookingDetails.date || 'Receipt'}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    generateWordDoc();
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
                <form onSubmit={handleSubmit} className="space-y-4">
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
                      value={bookingDetails.date}
                      onChange={(e) => setBookingDetails({ ...bookingDetails, date: e.target.value })}
                      className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-green text-sm" 
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Time Slot</label>
                    <select 
                      value={bookingDetails.timeSlot}
                      onChange={(e) => setBookingDetails({ ...bookingDetails, timeSlot: e.target.value })}
                      className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-green text-sm"
                    >
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
                    <select 
                      required 
                      value={bookingDetails.vehicleType}
                      onChange={(e) => setBookingDetails({ ...bookingDetails, vehicleType: e.target.value })}
                      className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-green text-sm"
                    >
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
                  <div className="flex gap-3 mt-2">
                    <button onClick={generateWordDoc} className="px-5 py-2.5 bg-dark-800 text-gray-300 border border-dark-700 rounded-xl font-semibold text-sm hover:text-white transition-all flex items-center gap-2">
                      <Download className="w-4 h-4" /> Receipt
                    </button>
                    <button onClick={handleClose} className="px-8 py-2.5 bg-neon-green/10 text-neon-green border border-neon-green/30 rounded-xl font-semibold text-sm hover:bg-neon-green/20 transition-all">
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
