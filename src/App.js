import React from 'react';
import './App.css';
import {
  approve,
  deposit,
  transfer,
  burn,
  transferWithPurpose,
  stake,
  unstake,
  getStake
} from './js/matic';

function App() {

  return (
    <div>
      <div>
        <h1>Matic tests</h1>
        <button
          onClick={() => approve()}
        >APPROVE</button>
        <br />
        <button
          onClick={() => deposit()}
        >DEPOSIT</button>
        <br />
        <button
          onClick={() => burn()}
        >BURN</button>
        <br />
        <br />
        <button
          onClick={() => transfer()}
        >TRANSFER</button>
        <br />
        <button
          onClick={() => transferWithPurpose()}
        >TRANSFER WITH PURPOSE</button>
        <br />
        <button
          onClick={() => stake()}
        >STAKE</button>
         <br />
        <button
          onClick={() => unstake()}
        >UNSTAKE</button>
        <br/>
        <br/>
        <button
          onClick={() => getStake()}
        >GET STAKE</button>
      </div>
    </div>
  );
}

export default App;
