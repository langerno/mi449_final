"use client";

import './App.css';

import { createClient} from '@supabase/supabase-js'
import { useState, useEffect } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

const supabaseUrl = 'https://ajuqdoycpyvofiqvmtwn.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqdXFkb3ljcHl2b2ZpcXZtdHduIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODI1MjU0NTMsImV4cCI6MTk5ODEwMTQ1M30.Lw6T6Hr_Ui0DQa8mkzrObfyXkY-VT5Bs0LcQH1Mljgc"
const supabase = createClient(supabaseUrl, supabaseKey)


let currentPokeData = null
let pokeMoves = []
let movesSearch = ""
let previouslySearched = []
let found = undefined
let userid = ""
let favData = []
let login = false

async function getPokemonFromApi(poke) {
  let response = await fetch("https://pokeapi.co/api/v2/pokemon/" + poke +"/")
  let pokeman = await response.json()
  console.log("FOUND POKEMON IN API")
  return pokeman
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}



/* Search and submit */

function Search(){
  return (
    <div class="w-25 mx-auto form-inline">
      <input id="searchBar" class="form-control"/>
      <button class="btn btn-primary" onClick={onSubmit}>Submit</button>
    </div>
  )

}

async function onSubmit() {
  let userInput = document.getElementById("searchBar").value.toLowerCase().trim()
  findPokemon(userInput)
}

async function findPokemon(poke_name) {
  if (poke_name !== "") {
    found = (previouslySearched.concat(favData)).find(pokemon => pokemon.name === poke_name)

    if (found === undefined) {
      try{
        currentPokeData = await getPokemonFromApi(poke_name)
      } catch {
        found = currentPokeData
        console.log("FAILED TO FIND POKEMON IN API")
      }

    }else{
      console.log("FOUND POKEMON LOCALLY")
      currentPokeData = found
    }

    if (currentPokeData !== null) {
      updatePage();
    }
    console.log(previouslySearched)
    if(found === undefined && currentPokeData !== null) {
      if(previouslySearched.length > 4){
        previouslySearched.shift();
      }
      previouslySearched.push(currentPokeData)
    }
  }
}

async function updateSearch() {
  document.getElementById("searchBar").value = ""
}





/* Favorite button */

function FavoriteButton() {
  return (
    <div id="favoriteButton">
    </div>
  )
}

async function updateFavoriteButton(){
  let newHtml = ""
  let element = document.getElementById("favoriteButton")
  if (!favData.includes(currentPokeData)) {
    newHtml = "<button type='button' class='btn btn-light'>Favorite</button>"
    element.onclick = addToFavorite
  }else {
    newHtml = "<button type='button' class='btn btn-warning'>Favorite</button>"
    element.onclick = unfavorite
  }
  document.getElementById("favoriteButton").innerHTML = newHtml
}



/* Pokemon description */


function PokeDesc(){
  return(
    <>
      <table id="desc" class="table table-dark table-bordered table-sm">
        <thead id="desc_head" class="thead-dark">
          <th scope="col"></th>
          <th scope="col">Name</th>
          <th scope="col">Type</th>
          <th scope="col">Height</th>
          <th scope="col">Weight</th>
        </thead>
        <tbody id="desc_body">
          <tr>
            <td><FavoriteButton></FavoriteButton></td>
            <td id='name'></td>
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
    <div class="ml-5">
      <div className="bg-dark text-white card" style={{width: 450}}>
        <div className="card-img container">
            <div className="card-img row">
              <div className="col-sm">
                <img class="w-100 img-fluid" alt="" id="frontSprite"></img>
              </div>
              <div className="col-sm">
                <img class="w-100 img-fluid" alt="" id="backSprite"></img>
              </div>
            </div>
          </div>
          <div class="card-img-overlay">
            <h5 class="card-title">
              Default Sprites
            </h5>
          </div>
      </div>
      <div className="bg-dark text-white card" style={{width: 450}}>
        <div className="card-img container">
            <div className="card-img row">
              <div className="col-sm">
                <img class="w-100 img-fluid" alt="" id="shinyFront"></img>
              </div>
              <div className="col-sm">
                <img class="w-100 img-fluid" alt="" id="shinyBack"></img>
              </div>
            </div>
          </div>
          <div class="card-img-overlay">
            <h5 class="card-title">
              Shiny Sprites
            </h5>
          </div>
      </div>
    </div>
  )
}

async function updateImage(){
  document.getElementById("frontSprite").setAttribute("src", currentPokeData.sprites.front_default);
  document.getElementById("frontSprite").setAttribute("alt", "Front Sprite of " + currentPokeData.name);

  document.getElementById("backSprite").setAttribute("src", currentPokeData.sprites.back_default);
  document.getElementById("backSprite").setAttribute("alt", "Back Sprite of " + currentPokeData.name);

  document.getElementById("shinyFront").setAttribute("src", currentPokeData.sprites.front_shiny);
  document.getElementById("shinyFront").setAttribute("alt", "Front Sprite of Shiny " + currentPokeData.name);

  document.getElementById("shinyBack").setAttribute("src", currentPokeData.sprites.back_shiny);
  document.getElementById("shinyBack").setAttribute("alt", "Back Sprite of Shiny" + currentPokeData.name);
}






/* Pokemon abilties */

function PokeAbilities(){
  return(
    <div>
      <h5> Abilties </h5>
      <table id="abilities" class="table table-dark table-bordered table-sm">
        <thead id="abilities_head" class="thead-dark">
          <th scope="col">Name</th>
          <th scope="col">Description</th>
        </thead>
        <tbody id="abilities_body">

        </tbody>
      </table>
    </div>
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

let entryCount = 10
let pages = 0
let filteredPokeMoves = pokeMoves

function PokeMoves(){
  return(
    <div>
      <h5>Moves</h5>
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
    </div>
  )
}

async function updateMoves(){
  let moves_html = ""
  document.getElementById("moves-search-input").value = ""
  if(movesSearch.length === 0) {
    pokeMoves = currentPokeData.moves
  }
  console.log(pokeMoves)

  pages = pokeMoves.length/entryCount

  filterMoves()

  for(let move of filteredPokeMoves) {
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
  movesSearch = document.getElementById("moves-search-input").value.toLowerCase().trim()
  console.log(movesSearch)
  filteredPokeMoves = pokeMoves.filter(value => (value.move.name).includes(movesSearch))
  filteredPokeMoves = filteredPokeMoves.slice(0, entryCount)
  console.log(filteredPokeMoves)
}



/* Pokemon stats */


function PokeStats(){
  return(
    <div>
      <h5> Base Stats and Effort </h5>
      <table id="stats" class="table table-dark table-bordered table-sm">
        <thead id="stats_head" class="thead-dark">
          <th scope="col">Name</th>
          <th scope="col">Base Count</th>
          <th scope="col">Effort</th>
        </thead>
        <tbody id="stats_body">

        </tbody>
      </table>
    </div>
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
    but.onclick = fetchLocalPoke
  }
}

function fetchLocalPoke(event) {
  let element = event.srcElement
  findPokemon(element.id)
}




/* Login */

function AuthApp() {
  const [session, setSession] = useState(null)
  console.log('AUTH APP COMPONENT')
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    
    return () => subscription.unsubscribe()
  }, [])

  if(session != null) {
    console.log(session.user.id)
  }

  if (!session) {
    login = false
    return (<Auth supabaseClient={supabase} providers={[]} appearance={{ theme: ThemeSupa }} />)
  }
  else {
    userid = session.user.id
    login = true
    updateFavorites()
    return (<Favorites />)
  }
}




/* Favorites */

function Favorites() {
  return (
    <div className="fixed-top w-25 bg-dark card">
        <a class="btn text-white btn-primary card-title" data-toggle="collapse" href="#favorites-collapse" role="button" aria-expanded="false" aria-controls="favorites-collapse">
          Favorites
        </a>
        <div id="favorites-collapse" class="collapse card-body">
          <div id="favorites">
              
          </div>
        </div>
    </div>
  )
}

async function getFavs() {
  let tempData = []
  if(userid !== "") {
    let {data, error} = await supabase.from('user_favs').select('fav_pokemon').eq('username', userid)
    if(error) {
      console.log("Error finding user in database: ")
      console.log(error)
    }

    if(data.length < 1) {
      console.log("User not found, making new row")
      let {error} = await supabase.from('user_favs').insert({username : userid, fav_pokemon : []})
      if(error) {
        console.log("Error inserting new user into database")
        console.log(error)
      }
    }else{
      for(let fav of data[0].fav_pokemon) {
        try{
          console.log(data)
          let d = await getPokemonFromApi(fav.id)
          tempData.push(d)
        } catch {
          console.log("FAILED TO GET POKEMON FROM API: " + fav)
          console.log(fav)
        }
    }
    }

    favData = tempData
  }
}

async function updateFavorites() {
  if(login) {
    await getFavs()
    let newHtml = ""
    for(let fav of favData) {
      newHtml += " <button class='btn favPokeSelector'><img id=" + fav.name + " src='" + fav.sprites.front_default + " '/> </button>"
    }

    if(newHtml.length < 1) {
      newHtml="No Favorite Pokemon to Display"
    }

    document.getElementById("favorites").innerHTML = newHtml

    let selectors = document.getElementsByClassName("btn favPokeSelector")
    for(let but of selectors) {
      but.onclick = fetchLocalPoke
    }
    console.log(document.getElementById("favorites"))
  } else {

  }
}

async function addToFavorite() {
  if (!favData.includes(currentPokeData)){
    favData.push(currentPokeData)
    await updateDbFavs()
  }
  updateFavorites()
  updateFavoriteButton()
}

async function unfavorite() {
  for (var i = favData.length - 1; i >= 0; i--) {
    if (favData[i] === currentPokeData) {
        favData.splice(i, 1);
        await updateDbFavs()
    }
  }
  updateFavorites()
  updateFavoriteButton()
}

async function updateDbFavs() {
  await supabase.from('user_favs').update({fav_pokemon : favData}).eq('username', userid)
}




async function updatePage() {
  updateSearch()
  updateAbilities()
  updateMoves()
  updateStats()
  updateImage()
  updateDesc()
  updateFavoriteButton()
  updatePrevPokemon()
}

function App() {

  return (
    <div className="App">
      <div className="App-header">
        <Favorites/>
        <div className="mt-5 container">
          <div className="mx-auto row">
              <PreviousPokemon />
              <Search />
          </div>
          <div className="row">
            <PokeDesc />
          </div>
          <div className='mt-3 row'>
            <div className='mx-auto col-sm mb-3'>
              <PokeImage />
            </div>
            <div className='col-sm'>
              <PokeStats />
            </div>
          </div>
          <div className="row">
            <div className='col-sm'>
              <PokeAbilities />
            </div>
          </div>
            <PokeMoves />
          </div>
        </div>
    </div>
  );
}

export default App;
