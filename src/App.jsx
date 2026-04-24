import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import USP from './components/USP';
import MapDemo from './components/MapDemo';
import Impact from './components/Impact';
import Team from './components/Team';
import About from './components/About';
import ContactFooter from './components/ContactFooter';

function App() {
  return (
    <div className="bg-dark-900 min-h-screen font-sans text-white selection:bg-neon-green/30 selection:text-neon-green">
      <Navbar />
      <Hero />
      <Features />
      <USP />
      <MapDemo />
      <Impact />
      <Team />
      <About />
      <ContactFooter />
    </div>
  );
}

export default App;
