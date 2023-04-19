import './App.css';
import React, { useState, useEffect } from 'react';

function Pikachu(){
  const [pokemon, setPokemon] = useState([]);
  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon/charmander/')
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
    <>
    <h1>{pokemon.name}</h1>
    <img src={pokemon.sprites.front_default} alt='pikachu front'/>
    <img src={pokemon.sprites.back_default} alt='pikachu back'/>
    </>
  )
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Pikachu />
      </header>
    </div>
  );
}

export default App;
