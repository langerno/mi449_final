import './App.css';
import React, { useState, useEffect } from 'react';

function Pikachu(){
  const [charm, setCharm] = useState([])
  const [bulb, setBulb] = useState([])
  const [squirt, setSquirt] = useState([])

  const urls = ['https://pokeapi.co/api/v2/pokemon/charmander/', 
                'https://pokeapi.co/api/v2/pokemon/bulbasaur/', 
                'https://pokeapi.co/api/v2/pokemon/squirtle/',];

  const getData = async () => {
    const [result1, result2, result3] = await Promise.all(
      urls.map((url) => fetch(url).then((res) => res.json()))
    );
    setCharm(result1);
    setBulb(result2);
    setSquirt(result3)
  };

  getData();

  return (
    <>
      <h1>
        {charm.name} {bulb.name} {squirt.name}
      </h1>
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
