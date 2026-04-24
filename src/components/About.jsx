import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Route, Map, BatteryCharging } from 'lucide-react';

const About = () => {
  const points = [
    {
      icon: <Cpu className="w-6 h-6 text-neon-green" />,
      title: "AI-Powered",
      desc: "Smart recommendations based on real-time data."
    },
    {
      icon: <Map className="w-6 h-6 text-neon-blue" />,
      title: "Nearest & Cheapest",
      desc: "Find stations that fit your budget and proximity."
    },
    {
      icon: <Route className="w-6 h-6 text-neon-green" />,
      title: "Smart Route Planning",
      desc: "Integrated charging stop suggestions on your journey."
    },
    {
      icon: <BatteryCharging className="w-6 h-6 text-neon-blue" />,
      title: "Least Congested",
      desc: "Avoid long queues with live occupancy updates."
    }
  ];

  return (
    <section id="about" className="py-24 bg-dark-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">About VoltWise AI</h2>
          <div className="w-20 h-1 bg-neon-green mx-auto rounded-full mb-8" />
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            VoltWise AI is an intelligent EV charging optimization platform designed to eliminate range anxiety and make charging your electric vehicle seamless.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {points.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-dark-900 p-8 rounded-2xl border border-dark-700 hover:border-neon-green/50 transition-all duration-300 group"
            >
              <div className="bg-dark-800 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {point.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{point.title}</h3>
              <p className="text-gray-400 leading-relaxed">{point.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
