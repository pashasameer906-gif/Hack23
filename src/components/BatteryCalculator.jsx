import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BatteryCharging, Activity, Gauge } from 'lucide-react';

const BatteryCalculator = () => {
  const [currentBattery, setCurrentBattery] = useState(65);
  const [originalRange, setOriginalRange] = useState(400);
  const [currentRange, setCurrentRange] = useState(320);

  const batteryHealth = originalRange > 0 ? Math.round((currentRange / originalRange) * 100) : 0;
  const trueRemainingRange = Math.round((currentBattery / 100) * currentRange);

  return (
    <section id="battery-calculator" className="py-24 bg-dark-800 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-blue/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Battery Health & True Range Calculator</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Evaluate your EV's battery degradation and calculate the realistic usable range you have left based on current health.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Inputs Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-dark-900 border border-dark-700 rounded-3xl p-8 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-neon-blue/10 p-3 rounded-xl">
                <Gauge className="w-6 h-6 text-neon-blue" />
              </div>
              <h3 className="text-xl font-bold">Input Vehicle Data</h3>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <label>Current Battery Charge (%)</label>
                  <span className="text-neon-blue font-bold">{currentBattery}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={currentBattery}
                  onChange={(e) => setCurrentBattery(Number(e.target.value))}
                  className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-neon-blue"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Original Full Range (km)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={originalRange}
                    onChange={(e) => setOriginalRange(Number(e.target.value))}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
                  />
                  <span className="absolute right-4 top-3 text-gray-500 font-medium">km</span>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Current Estimated Full Range (km)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={currentRange}
                    onChange={(e) => setCurrentRange(Number(e.target.value))}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
                  />
                  <span className="absolute right-4 top-3 text-gray-500 font-medium">km</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">What the dashboard shows at 100% charge</p>
              </div>
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            <div className="bg-gradient-to-br from-dark-900 to-dark-800 border border-dark-700 rounded-3xl p-8 shadow-2xl relative overflow-hidden group hover:border-neon-green/30 transition-colors">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Activity className="w-24 h-24 text-neon-green" />
              </div>
              <h3 className="text-gray-400 font-medium mb-2">State of Health (SOH)</h3>
              <div className="flex items-end gap-3">
                <span className={`text-5xl font-black ${batteryHealth >= 80 ? 'text-neon-green' : batteryHealth >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {batteryHealth}%
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-4 font-mono bg-dark-900/50 p-3 rounded-lg border border-dark-700/50 inline-block">
                Formula: ({currentRange || 0} / {originalRange || 0}) × 100
              </p>
            </div>

            <div className="bg-gradient-to-br from-dark-900 to-dark-800 border border-dark-700 rounded-3xl p-8 shadow-2xl relative overflow-hidden group hover:border-neon-blue/30 transition-colors">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <BatteryCharging className="w-24 h-24 text-neon-blue" />
              </div>
              <h3 className="text-gray-400 font-medium mb-2">True Remaining Range</h3>
              <div className="flex items-end gap-3">
                <span className="text-5xl font-black text-neon-blue">{trueRemainingRange || 0}</span>
                <span className="text-xl font-bold text-gray-400 mb-1">km</span>
              </div>
              <p className="text-sm text-gray-500 mt-4 font-mono bg-dark-900/50 p-3 rounded-lg border border-dark-700/50 inline-block">
                Formula: ({currentBattery}% / 100) × {currentRange || 0}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BatteryCalculator;
