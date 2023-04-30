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

function SearchBar() {
  return (
    <div class="mx-auto form-inline">
      <input id="searchBar" class="form-control"/>
      <button class="btn btn-primary" onClick={onSubmit}>Submit</button>
    </div>
  )
}

function WelcomeSearchBar() {
  return (
    <div class="mb-2 mx-auto form-inline">
      <input id="welcomeSearchBar" class="form-control mb-2"/>
      <button class="btn btn-primary" data-dismiss="modal" onClick={onSubmit}>Submit</button>
    </div>
  )
}

function Header(){
  return (
    <div class="container">
      <div class="row">
        <div class="col-sm">
          <h5>Previous</h5>
          <button class='btn adjacentPokeSelector' onClick={fetchLocalPoke}><img id="prev-sprite" alt=""></img></button>
        </div>
        <div class="col-sm">
          <SearchBar />
        </div>
        <div class="col-sm">
          <h5>Next</h5>
          <button class='btn adjacentPokeSelector' onClick={fetchLocalPoke}><img id="next-sprite" alt=""></img></button>
        </div>
      </div>
    </div>
  )

}

async function onSubmit(event) {
  let userInput = event.target.parentElement.children[0].value.toLowerCase().trim()
  getMainThree(userInput)
}

async function getMainThree(userInput) {
  
  currentPokeData = await findPokemon(userInput)

  if (currentPokeData !== null) {
    prevPoke = await findPokemon(currentPokeData.id - 1)
    nextPoke = await findPokemon(currentPokeData.id + 1)
    updatePage();

    if(!previouslySearched.find(pokemon => pokemon.name === currentPokeData.name)) {
      if(previouslySearched.length > 4){
        previouslySearched.shift();
      }
      previouslySearched.push(currentPokeData)
    }
  }
}

function isPokeLocal(poke) {
  return (previouslySearched.concat(favData).concat(prevPoke).concat(nextPoke)).find(pokemon => pokemon.name === poke || pokemon.id === poke)
}

async function findPokemon(poke_name) {
  let putHere = []

  if (poke_name !== "") {
    found = isPokeLocal(poke_name)
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
  front.setAttribute('alt', prevPoke.name)

  let back = document.getElementById("next-sprite")
  back.setAttribute('src', nextPoke.sprites.front_default)
  back.setAttribute('alt', nextPoke.name)
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
  if(login && currentPokeData !== null){
    if (!favData.includes(currentPokeData)) {
      newHtml = "<i type='button' class='position-absolute top-0 start-100 translate-middle p-2 text-warning bi-star'></i>"
      element.onclick = addToFavorite
    }else { 
      newHtml = "<i type='button' class='position-absolute top-0 start-100 translate-middle p-2 text-warning bi-star-fill'></i>"
      element.onclick = unfavorite
    }
    document.getElementById("favoriteButton").innerHTML = newHtml
  }else{
    element.innerHTML = ""
  }
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

  document.getElementById("height").innerHTML = (currentPokeData.height * 0.32808).toFixed(2) + " ft"
  document.getElementById("weight").innerHTML = (currentPokeData.weight / 4.5359237).toFixed(2) + " lbs"
}





/* Pokemon images */

function PokeImage() {
  return(
    <div class="ml-5">
      <div className="bg-dark text-white card" style={{width: 450}}>
        <FavoriteButton />
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
          <div class="card-img-title">
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
          <div class="card-img-title">
            <h5 class="card-title">
              Shiny Sprites
            </h5>
          </div>
      </div>
    </div>
  )
}

async function updateImage(){
  let frontDefault = currentPokeData.sprites.front_default
  frontDefault = frontDefault ? frontDefault : 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png'
  document.getElementById("frontSprite").setAttribute("src", frontDefault);
  document.getElementById("frontSprite").setAttribute("alt", "Front Sprite of " + currentPokeData.name);

  let backDefault = currentPokeData.sprites.back_default
  backDefault = backDefault ? backDefault : 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png'
  document.getElementById("backSprite").setAttribute("src", backDefault);
  document.getElementById("backSprite").setAttribute("alt", "Back Sprite of " + currentPokeData.name);

  let frontShiny = currentPokeData.sprites.front_shiny
  frontShiny = frontShiny ? frontShiny : 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png'
  document.getElementById("shinyFront").setAttribute("src", frontShiny);
  document.getElementById("shinyFront").setAttribute("alt", "Front Sprite of Shiny " + currentPokeData.name);

  let backShiny = currentPokeData.sprites.back_shiny
  backShiny = backShiny ? backShiny : 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png'
  document.getElementById("shinyBack").setAttribute("src", backShiny);
  document.getElementById("shinyBack").setAttribute("alt", "Back Sprite of Shiny" + currentPokeData.name);
}






/* Pokemon abilties */

function PokeAbilities(){
  return(
    <div>
      <h3> Abilties </h3>
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
  for(let {ability} of currentPokeData.abilities) {
    let response = await fetch(ability.url)
    let ability_data = await response.json();
    ability_html += "<tr scope='row'><td>" + capitalizeFirstLetter(ability.name) + "</td><td>" + ability_data.effect_entries[1].short_effect + "</td><td><button id='" + (ability.url) +"' type='button' class='btn btn-primary abilties' data-toggle='modal' data-target='#exampleModalCenter'>Details</button></td></tr>"
  }

  document.getElementById("abilities_body").innerHTML = ability_html
  for(let but of document.getElementsByClassName("btn btn-primary abilties")){
    but.onclick = onAbiltiesDetails
  }
}

async function onAbiltiesDetails(event) {
  let button = event.target
  let abilityUrl = button.id
  let ability = await fetch(abilityUrl)
  ability = await ability.json()

  let newFill = document.createElement("div")
  newFill.innerHTML = ability.effect_entries[1].effect.replace("$effect_chance", ability.effect_chance)

  fillModal(newFill, "Ability Details")

}


/* Expanded Definition Modal */ 

function ExpandedDef(){
  return (
    <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalTitle">Move Details</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div id="expanded-info" class="modal-body">
          </div>
        </div>
      </div>
    </div>
  )
}

function fillModal(element, title) {
  let modalElementBody = document.getElementById("expanded-info")
  modalElementBody.innerHTML= ""
  modalElementBody.appendChild(element)

  let modalElementTitle = document.getElementById("modalTitle")
  modalElementTitle.innerHTML = title
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
      <h3>Moves</h3>
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
      <nav id="pages-nav" class="mx-auto" aria-label="...">
      </nav>
    </div>
  )
}

function navigatePageTab(page, list){
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
  let element = event.target.parentElement
  let contents = event.target.innerHTML
  let virtualPage = currentPage%5

  if(contents === "Previous" && currentPage > 1){
    currentPage = Number(currentPage) - 1 
    if(virtualPage === 1){
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
    currentPage = Number(currentPage) + 1
    if(virtualPage === 0){
      pageList = updatePagesTab()
    }
    virtualPage += 1
    element = pageList[virtualPage]

  }else if(contents !== "Next" && contents !== "Previous"){
    currentPage = contents
  }else{
    return
  }
 
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

  currentPage = 1

  filterMoves()

}

async function loadMovesTable(data) {
  let moves_html = ""
  let numCurrentPage = Number(currentPage)
  let tempMoves  = filteredPokeMoves.slice((numCurrentPage-1)*entryCount, numCurrentPage*entryCount)

  for(let i = 0 ; i < tempMoves.length ; i++){
    let move = tempMoves[i]
    let response = await fetch(move.move.url)
    let move_data = await response.json();
    let desc = move_data.effect_entries[0]
    let chance = move_data.effect_chance
    if (desc != null) {
      moves_html += "<tr scope='row'><td>" + capitalizeFirstLetter(move.move.name) + "</td><td>" + desc.short_effect.replace("$effect_chance", chance) + "</td> <td><button id='" + (move.move.url) +"' type='button' class='btn btn-primary moves' data-toggle='modal' data-target='#exampleModalCenter'>Details</button></td></tr>"
    }
  }
  document.getElementById("moves_body").innerHTML = moves_html
  for(let but of document.getElementsByClassName("btn btn-primary moves")){
    but.onclick = onMovesDetails
  }
}

async function filterMoves() {
  movesSearch = document.getElementById("moves-search-input").value.toLowerCase().trim()
  filteredPokeMoves = pokeMoves.filter(value => (value.move.name).includes(movesSearch))

  pages = filteredPokeMoves.length/entryCount

  loadMovesTable()
  updatePagesTab()
}

async function onMovesDetails(event){
  let button = event.target
  let moveUrl = button.id
  let move = await fetch(moveUrl)
  move = await move.json()

  let newFill = document.createElement("div")
  newFill.innerHTML = move.effect_entries[0].effect.replace("$effect_chance", move.effect_chance)

  let newTable = document.createElement("table")
  newTable.setAttribute('class', "table table-light table-sm")
  newFill.appendChild(newTable)


  // Set up table frame
  let newTableHead = document.createElement("thead")
  newTableHead.setAttribute('class', "thead thead-dark")
  newTable.appendChild(newTableHead)

  let newTableBody = document.createElement("tbody")
  newTable.appendChild(newTableBody)

  let newTableRow = document.createElement("tr")
  newTableBody.appendChild(newTableRow)

  let accuracy = document.createElement("th")
  accuracy.setAttribute('scope', "col")
  newTableHead.appendChild(accuracy)
  let accuracyData = document.createElement("td")
  newTableRow.appendChild(accuracyData)

  let pp = document.createElement("th")
  pp.setAttribute('scope', "col")
  newTableHead.appendChild(pp)
  let ppData = document.createElement("td")
  newTableRow.appendChild(ppData)
  
  let power = document.createElement("th")
  power.setAttribute('scope', "col")
  newTableHead.appendChild(power)
  let powerData = document.createElement("td")
  newTableRow.appendChild(powerData)

  let damageType = document.createElement("th")
  damageType.setAttribute('scope', "col")
  newTableHead.appendChild(damageType)
  let damageTypeData = document.createElement("td")
  newTableRow.appendChild(damageTypeData)


  // FIll data frame
  pp.innerHTML = "PP"
  ppData.innerHTML = move.pp ? move.pp : 'N/A'

  power.innerHTML = "Power"
  powerData.innerHTML = move.power ? move.power : 'N/A'

  damageType.innerHTML = "Damage Type"
  damageTypeData.innerHTML = capitalizeFirstLetter(move.damage_class.name)

  accuracy.innerHTML = "Accuracy"
  accuracyData.innerHTML = move.accuracy ? move.accuracy : 'N/A'


  fillModal(newFill, "Move Details")
}


/* Pokemon stats */


function PokeStats(){
  return(
    <div>
      <h3> Base Stats and Effort </h3>
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
      for(let stat of currentPokeData.stats) {
        stat_html += "<tr scope='row'><td>" + capitalizeFirstLetter(stat.stat.name) + "</td><td>" + stat.base_stat + "</td><td>" + stat.effort + "</td></tr>"
      }
      document.getElementById("stats_body").innerHTML = stat_html
}


/* Previous pokemon */


function PreviousPokemon() {
  return(
    <>
    <h5>History</h5>
      <div id="prev-poke">
      </div>
    </>
  )
}

async function updatePrevPokemon() {
  let newHtml = ""
  for(let pokemon of previouslySearched) {
    newHtml += " <button class='btn prevPokeSelector'><img alt=" + pokemon.name + " src='" + pokemon.sprites.front_default + " '/> </button>"
  }
  document.getElementById("prev-poke").innerHTML = newHtml
  let selectors = document.getElementsByClassName("btn prevPokeSelector")
  for(let but of selectors) {
    but.onclick = fetchLocalPoke
  }
}

function fetchLocalPoke(event) {
  let element = event.target
  getMainThree(element.alt)
}




/* Login */

function AuthApp() {
  const [session, setSession] = useState(null)
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
    updateFavoriteButton()
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
          let d = await getPokemonFromApi(fav.id)
          tempData.push(d)
        } catch {
          console.log("FAILED TO GET POKEMON FROM API: ")
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
      newHtml += " <button class='btn favPokeSelector'><img alt=" + fav.name + " src='" + fav.sprites.front_default + " '/> </button>"
    }

    document.getElementById("favorites").innerHTML = newHtml

    let selectors = document.getElementsByClassName("btn favPokeSelector")
    for(let but of selectors) {
      but.onclick = fetchLocalPoke
    }
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


/* Welcome Component */

function Welcome(){
  return(
    <div class="modal fade" id="welcomeModal" tabindex="-1" role="dialog" aria-labelledby="welcomeModal">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-body">
            <div>
              <h1>Welcome to the Pokedex!</h1>
              <p>All Pokemon data on this website is pulled from <a href='https://www.pokeapi.co'>pokeapi.co</a>. Some newer Pokemon may have incomplete or non-existent data. If you haven't already, you can also Log In via the Favorites menu in the top left to save your favorite Pokemon</p>
              <h6>Enter any Pokemon Name and click Submit to begin</h6>
            </div>
            <WelcomeSearchBar />
          </div>
        </div>
      </div>
    </div>
  )
}

function doThings(){
  document.getElementById("App-header").setAttribute('class',  "App-header")
  document.getElementById("welcome").innerHTML = ""
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
  return(
    <div className="App">
      <Welcome />
      <div id="App-header" className="App-header">
      <AuthApp />
      <div className="mt-5 container">
        <div className="mx-auto row">
            <PreviousPokemon />
            <Header />
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
      <ExpandedDef />
    </div>
  )
}

export default App;
