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
let prevPoke = []
let nextPoke = []

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
    <div class="container">
      <div class="row">
        <div class="col-sm">
          <h5>Previous</h5>
          <button class='btn adjacentPokeSelector'><img id="prev-sprite" alt="previous pokemon by id"></img></button>
        </div>
        <div class="col-sm">
          <div class="mx-auto form-inline">
            <input id="searchBar" class="form-control"/>
            <button class="btn btn-primary" onClick={onSubmit}>Submit</button>
          </div>
        </div>
        <div class="col-sm">
          <h5>Next</h5>
          <button class='btn adjacentPokeSelector'><img id="next-sprite" alt="next pokemon by id"></img></button>
        </div>
      </div>
    </div>
  )

}

async function onSubmit() {
  let userInput = document.getElementById("searchBar").value.toLowerCase().trim()
  getMainThree(userInput)
}

async function getMainThree(userInput) {
  currentPokeData = await findPokemon(userInput)

  if (currentPokeData !== null) {
    prevPoke = await findPokemon(currentPokeData.id - 1)
    nextPoke = await findPokemon(currentPokeData.id + 1)
    updatePage();
  }
  console.log(previouslySearched)
  if(!previouslySearched.find(pokemon => pokemon.name === currentPokeData.name) && currentPokeData !== null) {
    if(previouslySearched.length > 4){
      previouslySearched.shift();
    }
    previouslySearched.push(currentPokeData)
  }
}

function isPokeLocal(poke) {
  return (previouslySearched.concat(favData).concat(prevPoke).concat(nextPoke)).find(pokemon => pokemon.name === poke || pokemon.id === poke)
}

async function findPokemon(poke_name) {
  let putHere = []

  console.log(poke_name)

  if (poke_name !== "") {
    found = isPokeLocal(poke_name)
    console.log(found)
    if (found === undefined) {
      try{
        putHere = await getPokemonFromApi(poke_name)
      } catch {
        found = currentPokeData
        console.log("FAILED TO FIND POKEMON IN API")
      }

    }else{
      console.log("FOUND POKEMON LOCALLY")
      putHere = found
    }

    return putHere
  }
}

async function updateSearch() {
  document.getElementById("searchBar").value = ""
  
  let front = document.getElementById("prev-sprite")
  front.setAttribute('src', prevPoke.sprites.front_default)
  front.setAttribute('id', prevPoke.name)

  let back = document.getElementById("next-sprite")
  back.setAttribute('src', nextPoke.sprites.front_default)
  back.setAttribute('id', nextPoke.name)

  let but = document.getElementsByClassName("btn adjacentPokeSelector")

  for(let ton of but) {
    ton.onclick = fetchLocalPoke
  }
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
      <div>
        
      </div>
      <table id="desc" class="table table-dark table-bordered table-sm">
        <thead id="desc_head" class="thead-dark">
          <th scope="col">Name</th>
          <th scope="col">Type</th>
          <th scope="col">Height</th>
          <th scope="col">Weight</th>
        </thead>
        <tbody id="desc_body">
          <tr>
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
let pages = 3
let filteredPokeMoves = pokeMoves
let currentPage = 1
const tabCount = 5

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
      <nav id="pages-nav" aria-label="...">
      </nav>
    </div>
  )
}

function navigatePageTab(page, list){
  console.log(page,list)
  if(page !== null){
    page.setAttribute('class', "page-item active")
  }

  for(let el of list){
    if(page !== el || page == null){
      el.setAttribute('class', "page-item")
    }
  }
}

function updatePagesTab(reverse = false){
  let parent = document.getElementById('pages-nav')
  parent.innerHTML = ""

  let list = document.createElement('ul')
  list.setAttribute('class', 'pagination')

  let li = document.createElement('li')

  let but = document.createElement('button')
  but.setAttribute('class',  'page-link')
  but.onclick = tablePageChange
  but.innerHTML = "Previous"

  li.appendChild(but)
  list.append(li)

  li = document.createElement('li')

  but = document.createElement('button')
  but.setAttribute('class',  'page-link')
  but.onclick = tablePageChange
  but.innerHTML = reverse ? currentPage-4 : currentPage

  li.appendChild(but)
  list.append(li)
  
  let i = reverse ? currentPage-(tabCount-2) : currentPage+1
  for(i ; i < pages && i <= currentPage+tabCount-1 && i%tabCount !== 1; i++){
    li = document.createElement('li')
  
    but = document.createElement('button')
    but.setAttribute('class',  'page-link')
    but.onclick = tablePageChange
    but.innerHTML = i
  
    li.appendChild(but)
    list.append(li)

  }

  li = document.createElement('li')

  but = document.createElement('button')
  but.setAttribute('class',  'page-link')
  but.onclick = tablePageChange
  but.innerHTML = "Next"

  li.appendChild(but)
  list.append(li)

  navigatePageTab(null, list.children)

  parent.appendChild(list)

  return list.children

}

function tablePageChange(event) {
  let pageList = event.target.parentElement.parentElement.children
  console.log(pageList)
  let element = event.target.parentElement
  let contents = event.target.innerHTML
  let virtualPage = currentPage%5

  if(contents === "Previous" && currentPage > 1){
    console.log('prev')
    currentPage = Number(currentPage) - 1 
    console.log(currentPage, virtualPage)
    if(virtualPage === 1){
      console.log("here")
      pageList = updatePagesTab(true)
      virtualPage = tabCount
    }else if(virtualPage === 0){
      virtualPage = tabCount-1
    }else{
      virtualPage -= 1
    }
    element = pageList[virtualPage]
  }
  else if(contents === "Next" && currentPage < pages-1){
    console.log('next')
    currentPage = Number(currentPage) + 1
    if(virtualPage === 0){
      pageList = updatePagesTab()
    }
    virtualPage += 1
    console.log(pageList)
    element = pageList[virtualPage]
    console.log(element)
  }else if(contents !== "Next" && contents !== "Previous"){
    console.log('cont')
    currentPage = contents
  }else{
    console.log('uhh')
    return
  }
  console.log(pageList)

  navigatePageTab(
    element, 
    pageList)

    loadMovesTable()
  
}

async function updateMoves(){
  document.getElementById("moves-search-input").value = ""
  if(movesSearch.length === 0) {
    pokeMoves = currentPokeData.moves
  }
  console.log(pokeMoves)

  currentPage = 1

  filterMoves()

}

async function loadMovesTable(data) {
  let moves_html = ""
  let numCurrentPage = Number(currentPage)
  let tempMoves  = filteredPokeMoves.slice((numCurrentPage-1)*entryCount, numCurrentPage*entryCount)

  for(let move of tempMoves) {
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
  filteredPokeMoves = pokeMoves.filter(value => (value.move.name).includes(movesSearch))

  pages = filteredPokeMoves.length/entryCount

  loadMovesTable()
  updatePagesTab()
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
  getMainThree(element.id)
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
    return (
      <div className="fixed-top mt-3 w-25 bg-dark card">
          <a class="btn text-white btn-primary card-title" data-toggle="collapse" href="#favorites-collapse" role="button" aria-expanded="false" aria-controls="favorites-collapse">
            Favorites
          </a>
          <div id="favorites-collapse" class="collapse card-body">
            <div>
              <div class="alert alert-primary">Favorites Requires an Account</div>
            </div>
            <Auth supabaseClient={supabase} providers={[]} appearance={{ theme: ThemeSupa }} />)
          </div>
      </div>
    )
  }
  else {
    userid = session.user.id
    login = true
    updateFavorites()
    return (
      <div className="fixed-top w-25 bg-dark card">
          <a class="btn text-white btn-primary card-title" data-toggle="collapse" href="#favorites-collapse" role="button" aria-expanded="false" aria-controls="favorites-collapse">
            Favorites
          </a>
          <div id="favorites-collapse" class="collapse card-body">
            <Favorites />)
          </div>
      </div>
    )
  }
}




/* Favorites */

function Favorites() {
  return (
    <div id="favorites">
                  
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
        <AuthApp />
        <div className="mt-5 container">
          <div className="mx-auto row">
              <PreviousPokemon />
              <Search />
              <FavoriteButton />
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
