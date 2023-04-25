import './App.css';
// import React, { useState, useEffect } from 'react';

let currentPokeData = null
let prevInput = ""
let pokeMoves = []
let movesSearch = ""

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function Search(){
  return (
    <div class="form-inline">
      <input id="searchBar" class="form-control"/>
      <button class="btn btn-primary" onClick={onSubmit}>Submit</button>
    </div>
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
      updatePage();
    }
  }
}



function PokeDesc(){
  return(
    <>
      <table id="desc" class="table table-dark table-bordered table-sm">
        <thead id="desc_head" class="thead-dark">
          <th scope="col">Name</th>
          <th scope="col">Type</th>
          <th scope="col">Height</th>
          <th scope="col">Weight</th>
        </thead>
        <tbody id="desc_body">
          <tr>
            <td id="name"></td>
            <td id="type"></td>
            <td id="height"></td>
            <td id="weight"></td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

function updateDesc(){
  document.getElementById("name").innerHTML = capitalizeFirstLetter(currentPokeData.name)
  document.getElementById("type").innerHTML = ""
  for(let type of currentPokeData.types) {
    document.getElementById("type").innerHTML += capitalizeFirstLetter(type.type.name) + " "
  }

  document.getElementById("height").innerHTML = currentPokeData.height + " dm"
  document.getElementById("weight").innerHTML = currentPokeData.weight + " hg"
}



function PokeImage() {
  return(
    <>
      <img class="img img-responsive" alt="" id="frontSprite"></img>
      <img class="img img-responsive" alt="" id="backSprite"></img>
    </>
  )
}

async function updateImage(){
  document.getElementById("frontSprite").setAttribute("src", currentPokeData.sprites.front_default);
  document.getElementById("frontSprite").setAttribute("alt", "Front Sprite of " + currentPokeData.name);

  document.getElementById("backSprite").setAttribute("src", currentPokeData.sprites.back_default);
  document.getElementById("backSprite").setAttribute("alt", "Back Sprite of " + currentPokeData.name);
}



function PokeAbilities(){
  return(
    <table id="abilities" class="table table-dark table-bordered table-sm">
      <thead id="abilities_head" class="thead-dark">
        <th scope="col">Name</th>
        <th scope="col">Description</th>
      </thead>
      <tbody id="abilities_body">

      </tbody>
    </table>
  )
}

async function updateAbilities() {
  let ability_html = ""
  console.log(currentPokeData.abilities)
  for(let {ability} of currentPokeData.abilities) {
    let response = await fetch(ability.url)
    let ability_data = await response.json();
    ability_html += "<tr scope='row'><td>" + capitalizeFirstLetter(ability.name) + "</td><td>" + ability_data.effect_entries[1].short_effect + "</td></tr>"
  }
  document.getElementById("abilities_body").innerHTML = ability_html
}




function PokeMoves(){
  return(
    <>
      <div class="input-group mb-4">
        <input type="text" class="form-control" id="moves-search-input" />
        <button class="btn btn-primary" id="moves-search" type="button">
          <i class="fa fa-search" onClick={filterMoves}>Search</i>
        </button>
      </div>
      <table id="moves" class="table table-dark table-bordered table-sm">
        <thead id="moves_head" class="thead-dark">
          <th scope="col">Name</th>
          <th scope="col">Description</th>
        </thead>
        <tbody id="moves_body">
        </tbody>
      </table>
    </>
  )
}

async function updateMoves(){
  let moves_html = ""
  document.getElementById("moves-search-input").value = ""
  if(movesSearch.length === 0) {
    pokeMoves = currentPokeData.moves
  }
  console.log(pokeMoves)
  for(let move of pokeMoves) {
    let response = await fetch(move.move.url)
    let move_data = await response.json();
    let desc = move_data.effect_entries[0]
    let chance = move_data.effect_chance
    if (desc != null) {
      moves_html += "<tr scope='row'><td>" + capitalizeFirstLetter(move.move.name) + "</td><td>" + desc.short_effect.replace("$effect_chance", chance) + "</td></tr>"
    }
  }
  document.getElementById("moves_body").innerHTML = moves_html
}

async function filterMoves() {
  movesSearch = document.getElementById("moves-search-input").value
  console.log(movesSearch)
  if (movesSearch.length > 0){
    pokeMoves = pokeMoves.filter(value => (value.move.name).includes(movesSearch))
  }
  updateMoves()
}




function PokeStats(){
  return(
    <table id="stats" class="table table-dark table-bordered table-sm">
      <thead id="stats_head" class="thead-dark">
        <th scope="col">Name</th>
        <th scope="col">Base Count</th>
        <th scope="col">Effort</th>
      </thead>
      <tbody id="stats_body">

      </tbody>
    </table>
  )
}

async function updateStats() {
  let stat_html = ""
      console.log(currentPokeData.stats)
      for(let stat of currentPokeData.stats) {
        stat_html += "<tr scope='row'><td>" + capitalizeFirstLetter(stat.stat.name) + "</td><td>" + stat.base_stat + "</td><td>" + stat.effort + "</td></tr>"
      }
      document.getElementById("stats_body").innerHTML = stat_html
}


async function updatePage() {
  document.getElementById("searchBar").value = ""
  updateAbilities()
  updateMoves()
  updateStats()
  updateImage()
  updateDesc()
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Search />
        <PokeImage />
        <PokeDesc />
        <PokeStats />
        <PokeAbilities />
        <PokeMoves />
      </header>
    </div>
  );
}

export default App;
