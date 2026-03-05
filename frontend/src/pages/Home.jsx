import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import UseCases from '../components/UseCases';
import Benefits from '../components/Benefits';
import Pricing from '../components/Pricing';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <HowItWorks />
      <UseCases />
      <Benefits />
      <Pricing />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Home;