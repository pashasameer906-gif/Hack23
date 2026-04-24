import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Link, Mail } from 'lucide-react';

const Team = () => {
  const members = [
    { name: "Mohammed Maaz", role: "Team Member" },
    { name: "Adarsh NT", role: "Team Member" },
    { name: "Sameer Pasha", role: "Team Member" },
    { name: "Noor Fathima", role: "Team Member" }
  ];

  return (
    <section id="team" className="py-24 bg-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-neon-blue/10 border border-neon-blue/30 text-neon-blue text-sm font-bold mb-4">
              THE VIBE CODERS
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Meet The Team</h2>
            <div className="w-20 h-1 bg-neon-blue mx-auto rounded-full mb-4" />
            <p className="text-gray-400">Akshaya Institute of Technology</p>
          </motion.div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {members.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-dark-900 border border-dark-700 rounded-2xl p-6 text-center hover:border-neon-blue/50 transition-colors group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-green to-neon-blue transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              
              <div className="w-24 h-24 mx-auto bg-dark-800 rounded-full mb-6 border-2 border-dark-700 group-hover:border-neon-blue flex items-center justify-center overflow-hidden transition-colors">
                <span className="text-3xl font-bold text-gray-600 group-hover:text-neon-blue transition-colors">
                  {member.name.charAt(0)}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
              <p className="text-neon-blue text-sm mb-6">{member.role}</p>
              
              <div className="flex justify-center gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors"><Globe className="w-5 h-5" /></a>
                <a href="#" className="text-gray-400 hover:text-[#0a66c2] transition-colors"><Link className="w-5 h-5" /></a>
                <a href="#" className="text-gray-400 hover:text-red-500 transition-colors"><Mail className="w-5 h-5" /></a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
