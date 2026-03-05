import React from 'react';
import Header from '../components/Header';
import Pricing from '../components/Pricing';
import Footer from '../components/Footer';

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-20">
        <Pricing />
      </div>
      <Footer />
    </div>
  );
};

export default PricingPage;
