import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/src/assets/hero-bg.png" 
          alt="EV Charging Station" 
          className="w-full h-full object-cover opacity-40 scale-105 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900/60 via-dark-900/80 to-dark-900" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-green/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="backdrop-blur-[2px] p-8 md:p-12 rounded-3xl border border-white/5 bg-white/[0.02]"
        >
          <span className="inline-block py-1 px-4 rounded-full bg-dark-800/80 border border-dark-700 text-neon-blue text-xs md:text-sm font-semibold mb-8 backdrop-blur-md">
            VoltWise AI – Smart EV Charging Optimization System
          </span>
          <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
            Smarter, Faster, and <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green via-neon-blue to-neon-green bg-[length:200%_auto] animate-gradient-flow">Greener</span> Charging Decisions
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            Eliminate range anxiety with our AI-powered platform. Find the nearest, cheapest, and least congested charging stations with real-time route optimization.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a href="#demo" className="group flex items-center justify-center gap-3 px-10 py-5 rounded-full bg-neon-green text-dark-900 font-bold hover:bg-[#00e65c] transition-all duration-300 shadow-[0_0_30px_rgba(0,255,102,0.3)] hover:scale-105 active:scale-95">
              <MapPin className="w-5 h-5" />
              Find Charging Station
            </a>
            <a href="#features" className="group flex items-center justify-center gap-3 px-10 py-5 rounded-full bg-white/5 text-white font-semibold border border-white/10 hover:border-neon-blue hover:bg-white/10 transition-all duration-300 backdrop-blur-md hover:scale-105 active:scale-95">
              Explore Features
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </motion.div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdHRlcm4gaWQ9InNtYWxsR3JpZCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNMTAgMEwwIDBMMCAxMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSJ1cmwoI3NtYWxsR3JpZCkiLz48cGF0aCBkPSJNNDAgMEwwIDBMMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] z-0 pointer-events-none opacity-50" />
    </section>
  );
};

export default Hero;
