import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, CheckCircle2 } from 'lucide-react';

const ProblemSolution = () => {
  const problems = [
    "Long waiting times at charging stations",
    "High and unpredictable charging costs",
    "No intelligent system to choose the best charging station",
    "Poor route planning for EV users",
    "No live occupancy updates"
  ];

  const solutions = [
    "AI-powered best station recommendation",
    "Real-time waiting time prediction",
    "Smart charging cost optimization",
    "Emergency low-battery mode",
    "Live EV station mapping on Google Maps"
  ];

  return (
    <section className="py-24 bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">The Challenge vs <span className="text-neon-green">Our Solution</span></h2>
          <div className="w-20 h-1 bg-neon-blue mx-auto rounded-full mb-8" />
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Problem Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-red-900/10 border border-red-500/20 p-8 rounded-3xl"
          >
            <div className="flex items-center gap-4 mb-8">
              <XCircle className="w-8 h-8 text-red-500" />
              <h3 className="text-2xl font-bold">The Problem</h3>
            </div>
            <ul className="space-y-6">
              {problems.map((prob, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                  <span className="text-gray-300 text-lg">{prob}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Solution Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-neon-green/5 border border-neon-green/20 p-8 rounded-3xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-neon-green/10 rounded-full blur-[50px] -mr-10 -mt-10" />
            
            <div className="flex items-center gap-4 mb-8 relative z-10">
              <CheckCircle2 className="w-8 h-8 text-neon-green" />
              <h3 className="text-2xl font-bold">The Solution</h3>
            </div>
            <ul className="space-y-6 relative z-10">
              {solutions.map((sol, i) => (
                <li key={i} className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-neon-green flex-shrink-0" />
                  <span className="text-gray-200 text-lg">{sol}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;
