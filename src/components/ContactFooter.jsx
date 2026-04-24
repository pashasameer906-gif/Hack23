import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Zap, CheckCircle2, Loader2 } from 'lucide-react';

const ContactFooter = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setIsSubmitting(true);
    // Simulate network request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <footer className="bg-dark-900 border-t border-dark-700 pt-24 pb-8 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-neon-green/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 mb-20">
          {/* Contact Info */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Zap className="h-8 w-8 text-neon-green" />
              <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-green to-neon-blue">
                VoltWise AI
              </span>
            </div>
            <p className="text-xl text-gray-400 mb-8 max-w-md">
              Ready to revolutionize your EV charging experience? Get in touch with us today.
            </p>
            <div className="text-gray-300">
              <p className="font-bold mb-2">The Vibe Coders</p>
              <p>Akshaya Institute of Technology</p>
            </div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-dark-800 border border-dark-700 rounded-3xl p-8"
          >
            <h3 className="text-2xl font-bold mb-6">Send us a message</h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-green transition-colors"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-green transition-colors"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Message</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-green transition-colors resize-none"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              <button 
                disabled={isSubmitting}
                className="w-full bg-neon-green text-dark-900 font-bold py-4 rounded-xl hover:bg-[#00e65c] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>Sending... <Loader2 className="w-5 h-5 animate-spin" /></>
                ) : isSubmitted ? (
                  <>Message Sent! <CheckCircle2 className="w-5 h-5" /></>
                ) : (
                  <>Submit <Send className="w-5 h-5" /></>
                )}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-dark-700 pt-8 text-center">
          <p className="text-gray-400 italic mb-4 max-w-2xl mx-auto">
            "VoltWise AI enables smarter, faster, and greener EV charging decisions — for every driver, every journey."
          </p>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} VoltWise AI by The Vibe Coders. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default ContactFooter;
