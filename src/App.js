import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';

function Pokemon(){
  const [pokemon, setPokemon] = useState([]);
  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon/pikachu/')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setPokemon(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  return (
    <h1>{pokemon.name}</h1>
  )
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <Pokemon/>
      </header>
    </div>
  );
}

export default App;
