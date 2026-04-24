import React from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, Leaf, Clock, MapPin } from 'lucide-react';

const Impact = () => {
  const impacts = [
    { value: "40%", label: "Reduced Waiting Times", icon: <Clock className="w-6 h-6" /> },
    { value: "25%", label: "Lower Charging Costs", icon: <TrendingDown className="w-6 h-6" /> },
    { value: "100%", label: "Greener Choices", icon: <Leaf className="w-6 h-6" /> },
    { value: "10x", label: "Better Journey Planning", icon: <MapPin className="w-6 h-6" /> },
  ];

  return (
    <section id="impact" className="py-24 bg-dark-900 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-neon-green/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Project Impact</h2>
          <div className="w-20 h-1 bg-neon-green mx-auto rounded-full mb-8" />
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Measurable results driving sustainable energy usage and improved user convenience.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {impacts.map((impact, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
              className="bg-dark-800 border border-dark-700 rounded-3xl p-8 text-center hover:border-neon-green/50 transition-colors group"
            >
              <div className="text-neon-green bg-neon-green/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                {impact.icon}
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">{impact.value}</div>
              <div className="text-gray-400 font-medium">{impact.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Impact;
