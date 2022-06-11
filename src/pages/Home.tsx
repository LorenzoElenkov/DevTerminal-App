import React from 'react';

import LandingPage from '../components/LandingPage/LandingPage';
import Features from '../components/Features/Features';
import Pricing from '../components/Pricing/Pricing';

const Home = () => {
  return (
      <>
        <LandingPage />
        <Features />
        <Pricing />
      </>
  )
}

export default Home;