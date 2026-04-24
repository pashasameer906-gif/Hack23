import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Map, Database, BrainCircuit, ArrowRight } from 'lucide-react';

const Architecture = () => {
  const flow = [
    { icon: <Smartphone className="w-8 h-8" />, label: "User App" },
    { icon: <Map className="w-8 h-8 text-neon-blue" />, label: "Google Maps API" },
    { icon: <Database className="w-8 h-8 text-yellow-500" />, label: "Firebase Backend" },
    { icon: <BrainCircuit className="w-8 h-8 text-neon-green" />, label: "AI Engine" }
  ];

  return (
    <section className="py-24 bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">System Architecture</h2>
          <div className="w-20 h-1 bg-neon-green mx-auto rounded-full mb-8" />
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 max-w-5xl mx-auto">
          {flow.map((step, index) => (
            <React.Fragment key={index}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-dark-800 border border-dark-700 p-8 rounded-2xl flex flex-col items-center justify-center min-w-[160px] hover:border-neon-green/50 transition-colors relative group"
              >
                <div className="mb-4 bg-dark-900 p-4 rounded-xl group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                <h4 className="font-semibold text-center">{step.label}</h4>
              </motion.div>
              
              {index < flow.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 + 0.1 }}
                  className="hidden md:block text-dark-700"
                >
                  <ArrowRight className="w-8 h-8" />
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Architecture;
