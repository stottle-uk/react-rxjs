import React from 'react';
import './App.css';
import Header from './layout/components/Header';
import Page from './pages/Page';

const App = () => {
  return (
    <div className="App">
      <Header />
      <Page />
    </div>
  );
};

export default App;
