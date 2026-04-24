import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, Target } from 'lucide-react';

const USP = () => {
  const usps = [
    {
      title: "Predict station congestion hours before",
      icon: <Target className="w-8 h-8" />
    },
    {
      title: "Cheapest charging station recommendation",
      icon: <Zap className="w-8 h-8" />
    },
    {
      title: "Eco-friendly charging decision support",
      icon: <ShieldCheck className="w-8 h-8" />
    },
    {
      title: "Smart booking before reaching station",
      icon: <Target className="w-8 h-8" />
    },
    {
      title: "Emergency fast-routing support",
      icon: <Zap className="w-8 h-8" />
    },
    {
      title: "AI + Google Maps + Firebase integration",
      icon: <ShieldCheck className="w-8 h-8" />
    }
  ];

  return (
    <section id="usp" className="py-24 bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/3"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-blue">VoltWise AI</span> Stands Out</h2>
            <p className="text-xl text-gray-400 mb-8">
              We're not just another mapping tool. We are your intelligent co-pilot for electric mobility, solving real-world charging anxieties.
            </p>
            <div className="w-32 h-1 bg-neon-green rounded-full" />
          </motion.div>

          <div className="lg:w-2/3 grid sm:grid-cols-2 gap-6">
            {usps.map((usp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex items-center gap-4 bg-dark-800 p-6 rounded-2xl border border-dark-700 hover:border-neon-green/50 transition-colors duration-300"
              >
                <div className="text-neon-green bg-neon-green/10 p-3 rounded-xl">
                  {usp.icon}
                </div>
                <h4 className="font-medium text-lg text-gray-200">{usp.title}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default USP;
