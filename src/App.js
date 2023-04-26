import './App.css';
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ajuqdoycpyvofiqvmtwn.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqdXFkb3ljcHl2b2ZpcXZtdHduIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODI1MjU0NTMsImV4cCI6MTk5ODEwMTQ1M30.Lw6T6Hr_Ui0DQa8mkzrObfyXkY-VT5Bs0LcQH1Mljgc"
const supabase = createClient(supabaseUrl, supabaseKey)

let currentPokeData = null
let pokeMoves = []
let movesSearch = ""
let previouslySearched = []
let found = undefined

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

async function insertEntry(name, fav) {
  const {error} = await supabase
                        .from('pokemon_fav')
                        .insert({Pokename: name, Favorites: fav})
  if(error !== null){
    console.log("Error entering pokemon to database:")
    console.log(error)
  }
}

async function checkEntry(name) {
  const {data, error} = await supabase
                        .from('pokemon_fav')
                        .select("*")
                        .eq("Pokename", name)

  console.log("Fetched from supabase: ")
  console.log(data)

  const row = data[0]
  let ret = 0
  if(row==null && error===null) {
    insertEntry(name, 0)
    ret = 0
  } else if(error===null) {
    ret = row.Favorites
  } else{
    ret = error
  }

  return ret
}



/* Search and submit */

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
  
  if (userInput !== "") {
    // Adding this to avoiding spamming API calls and to allow easy movement back to previous visits
    if(found === undefined && currentPokeData !== null) {
      previouslySearched.push(currentPokeData)
    }
    found = previouslySearched.find(pokemon => pokemon.name === userInput)
    if (found === undefined) {
      try{
        let response = await fetch("https://pokeapi.co/api/v2/pokemon/" + userInput +"/")
        currentPokeData = await response.json()
      } catch {
        found = currentPokeData
        console.log("FAILED TO FIND POKEMON")
      }

    }else{
      currentPokeData = found
    }
    console.log(currentPokeData)

    if (currentPokeData !== null) {
      updatePage();
    }
    console.log(previouslySearched)
  }
}

async function updateSearch() {
  document.getElementById("searchBar").value = ""
}





/* Vote buttons */

function VoteButtons() {
  return (
    <form>
      <p id="vote"></p>
      <button onClick={like} class="btn btn-secondary" type="button">Like</button>
      <button onClick={dislike} class="btn btn-secondary" type="button">Dislike</button>
    </form>
  )
}

function like() {
  addVote(true);
}

function dislike() {
  addVote(false);
}

async function updateVoteButtons(){
  let response = await checkEntry(currentPokeData.name)
  document.getElementById("vote").innerHTML = response
}

async function addVote(upvote) {
  let name = currentPokeData.name
  console.log(name)
  let result = await checkEntry(name)
  result += upvote ? 1 : -1
  const {error} = await supabase.from("pokemon_fav")
                                .update({Favorites : result})
                                .eq("Pokename", name)
  if(error != null) {
    console.log("Error updating favorites")
    console.log(error)
  }
  updateVoteButtons()
}




/* Pokemon description */


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





/* Pokemon images */

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






/* Pokemon abilties */

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






/* Pokemon Moves */


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



/* Pokemon stats */


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


/* Previous pokemon */


function PreviousPokemon() {
  return(
      <div id="prev-poke">
      </div>
  )
}

async function updatePrevPokemon() {
  let newHtml = ""
  for(let pokemon of previouslySearched) {
    newHtml += " <button class='btn prevPokeSelector'><img id=" + pokemon.name + " src='" + pokemon.sprites.front_default + " '/> </button>"
  }
  document.getElementById("prev-poke").innerHTML = newHtml
  let selectors = document.getElementsByClassName("btn prevPokeSelector")
  for(let but of selectors) {
    but.onclick = fetchPrevPoke
  }
}

function fetchPrevPoke(event) {
  let element = event.srcElement
  if (previouslySearched.some(pokemon => !(pokemon.name === currentPokeData.name))){
    previouslySearched.push(currentPokeData)
  }
  currentPokeData = previouslySearched.find(pokemon => pokemon.name === element.id)
  found = currentPokeData
  console.log("fetched old pokemon: " + currentPokeData.name)
  updatePage()
}




async function updatePage() {
  updateSearch()
  updateAbilities()
  updateMoves()
  updateStats()
  updateImage()
  updateDesc()
  updateVoteButtons()
  updatePrevPokemon()
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <PreviousPokemon />
        <Search />
        <PokeImage />
        <VoteButtons />
        <PokeDesc />
        <PokeStats />
        <PokeAbilities />
        <PokeMoves />
      </header>
    </div>
  );
}

export default App;
