import React from 'react';
import { motion } from 'framer-motion';

const TechStack = () => {
  const stack = [
    {
      category: "Frontend",
      techs: ["React.js", "Tailwind CSS", "JavaScript", "HTML5", "CSS3"],
      color: "border-blue-500"
    },
    {
      category: "Backend",
      techs: ["Node.js", "Firebase", "Firestore Database"],
      color: "border-yellow-500"
    },
    {
      category: "Navigation & APIs",
      techs: ["Google Maps API", "Geolocation API"],
      color: "border-green-500"
    },
    {
      category: "AI / ML Engine",
      techs: ["Python", "Machine Learning Models", "Wait Time Prediction", "Load Forecasting"],
      color: "border-purple-500"
    }
  ];

  return (
    <section className="py-24 bg-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Technology Stack</h2>
          <div className="w-20 h-1 bg-neon-blue mx-auto rounded-full mb-8" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stack.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`bg-dark-900 rounded-2xl p-6 border-t-4 ${item.color} border-x border-b border-dark-700 hover:-translate-y-2 transition-transform duration-300`}
            >
              <h3 className="text-xl font-bold mb-6">{item.category}</h3>
              <ul className="space-y-3">
                {item.techs.map((tech, j) => (
                  <li key={j} className="flex items-center gap-2 text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
                    <span>{tech}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
