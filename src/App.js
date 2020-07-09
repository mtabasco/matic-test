import React from 'react';
import './App.css';
import { approve, deposit, transfer, burn } from './js/matic';

function App() {

  return (
    <div>
      <div>
        <h1>Hola</h1>
        <button
          onClick={() => approve()}
        >APPROVE</button>
        <br/>
        <button
          onClick={() => deposit()}
        >DEPOSIT</button>
        <br/>
        <br/>
        <button
          onClick={() => transfer()}
        >TRANSFER</button>
        <br/>
        <button
          onClick={() => burn()}
        >BURN</button>
      </div>
    </div>
  );
}

export default App;
