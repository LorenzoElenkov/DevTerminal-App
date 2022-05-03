import React, { useEffect, useState } from 'react';
import Features from './components/Features/Features';
import Header from './components/Header/Header';
import SearchPage from './components/Inside/SearchPage/SearchPage';
import LandingPage from './components/LandingPage/LandingPage';
import Login from './components/Login/Signup/Login';
import Signup from './components/Login/Signup/Signup';
import Pricing from './components/Pricing/Pricing';
import './index.css';

function App() {
  const [testing, setTesting] = useState('');
  

  return (
    <div className='app'>
      <Header abc={setTesting}/>
      {/* <main>
        <LandingPage />
        <Features />
        <Pricing />
      </main> */}
      <SearchPage />
      {testing === 'login' ? <Login close={setTesting}/> : testing === 'signup' ? <Signup close={setTesting}/> : null}
    </div>
  );
}

export default App;
