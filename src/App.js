import './App.css';
// import React, { useState, useEffect } from 'react';

let currentPokeData = null
let prevInput = null

function Search(){
  return (
    <div class="mb-3">
      <input id="searchBar" class="form-control" aria-describedby="emailHelp"/>
    </div>
  )

}

function SubmitButton(){
  return(
    <>
      <button onClick={onSubmit}>Submit</button>
    </>
  )
}

async function onSubmit() {
  let userInput = document.getElementById("searchBar").value.toLowerCase()
  
  // Adding this to avoiding spamming API calls
  if (userInput !== prevInput) {
    prevInput = userInput
    let response = await fetch("https://pokeapi.co/api/v2/pokemon/" + userInput +"/")
    currentPokeData = await response.json();

    console.log(currentPokeData)

    if (currentPokeData !== null) {
      document.getElementById("frontSprite").setAttribute("src", currentPokeData.sprites.front_default);
      document.getElementById("frontSprite").setAttribute("alt", "Front Sprite of " + currentPokeData.name);

      document.getElementById("backSprite").setAttribute("src", currentPokeData.sprites.back_default);
      document.getElementById("backSprite").setAttribute("alt", "Back Sprite of " + currentPokeData.name);

      document.getElementById("name").innerHTML = currentPokeData.name
      document.getElementById("height").innerHTML = currentPokeData.height + " decimeters"
    }
  }
}

function PokeDesc(){
  return(
    <>
      <h1 id="name">Welcome to your Pokedex!</h1>
      <p id="height">Enter any pokemon name and click submit for data regarding it</p>
    </>
  )
}

function PokeImage() {
  return(
    <>
      <img alt="" id="frontSprite"></img>
      <img alt="" id="backSprite"></img>
    </>
  )
}


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Search />
        <SubmitButton />
        <PokeImage />
        <PokeDesc />
      </header>
    </div>
  );
}

export default App;
