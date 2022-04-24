import React from 'react';
import Features from './components/Features/Features';
import Header from './components/Header/Header';
import LandingPage from './components/LandingPage/LandingPage';
import Pricing from './components/Pricing/Pricing';
import './index.css';

function App() {
  return (
    <div className='app'>
      <Header />
      <main>
        <LandingPage />
        <Features />
        <Pricing />
      </main>
    </div>
  );
}

export default App;
