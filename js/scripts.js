// INITIALIZE -----------------------------------------------------------------------------
const init = () => {
    fetch("https://pokeapi.co/api/v2/generation/1/")
        .then(response => response.json())
        .then(json => pokeName(json))

    let input = document.querySelector("input")
    input.addEventListener("keyup", handleKeySearch)
}

// POKENAME -----------------------------------------------------------------------------
const pokeName = (data) => {
    let list = data.pokemon_species;

    list.forEach(pokemon => {

        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
            .then(response => response.json())
            .then(json => pokeData(json))
    }) // end of forEach

} // end of getPoName

// POKEDATA -----------------------------------------------------------------------------
const pokeData = (data) => {

    fetch(`https://pokeapi.co/api/v2/pokemon-species/${data.name}/`)
        .then(response => response.json())
        .then(json => evolve(json))

    //html structure
    let imgItem = document.createElement("img");
    let listItem = document.createElement("li");
    let header = document.createElement("h2");

    document.querySelector("ul").prepend(listItem)
    listItem.appendChild(header)
    listItem.appendChild(imgItem)

    // h2 content
    header.textContent = data.name

    // img content
    let sprite = data.sprites.front_default;
    imgItem.src = sprite


    const evolve = (e) => {

        // CLICK A LINK
        const handleClickLi = () => {

            //make article
            let article = document.createElement("article")
            listItem.appendChild(article)

            //change input (so it's the only one left)
            let input = document.querySelector("input")
            input.value = data.name
            handleKeySearch()

            //create p (ID)
            let p = document.createElement("p")
            article.appendChild(p)
            p.textContent = `ID: ${data.id}`

            // MOVES ---------------
            //create moves title
            let moves = document.createElement("h4")
            article.appendChild(moves)
            moves.textContent = `moves:`

            //create movelist
            let ul = document.createElement("ul")
            article.appendChild(ul)
            ul.classList.add("moves")

            for (i = 0; i < 4; i++) {
                let li = document.createElement("li")
                ul.appendChild(li)
                li.textContent = data.moves[i].move.name
            } //end of for

            // TYPES ---------------
            //create types title
            let types = document.createElement("h4")
            types.classList.add("typetitle")
            article.appendChild(types)
            types.textContent = `types:`

            //create typelist
            let typeUl = document.createElement("ul")
            article.appendChild(typeUl)
            typeUl.classList.add("types")

            data.types.forEach(e => {
                let type = document.createElement("li")
                typeUl.appendChild(type)
                type.textContent = e.type.name
            }) //end of forEach

            if (e.evolves_from_species == null) {
                let notEvolved = document.createElement("p")
                notEvolved.classList.add("notEvolved")
                article.appendChild(notEvolved)
                notEvolved.innerText = "This Pokémon is not evolved yet"
            } else {
                let evolutionTitle = document.createElement("h4")
                article.appendChild(evolutionTitle)
                evolutionTitle.innerText = "evolved from:"

                let evolution = document.createElement("p")
                evolution.classList.add("evolution")
                article.appendChild(evolution)
                evolution.innerText = e.evolves_from_species.name

                fetch(`https://pokeapi.co/api/v2/pokemon/${e.evolves_from_species.name}/`)
                    .then(response => response.json())
                    .then(json => evolvedSprite(json))

                const evolvedSprite = (a) => {
                    let evolvedSprite = document.createElement("img")
                    evolvedSprite.classList.add("evolvedSprite")
                    article.appendChild(evolvedSprite)
                    evolvedSprite.src = a.sprites.front_default
                } //end of evolvedSprite
            } //end of else
        } //end of handleClickLi

        listItem.addEventListener("click", handleClickLi);
    } //end of evolve

} //end of pokeData

// SEARCH FUNCTION -----------------------------------------------------------------------------
function handleKeySearch() {
    let input = document.querySelector("input")
    let filter = input.value.toUpperCase()
    let listItems = document.querySelectorAll("li")

    listItems.forEach(listItem => {
        let header = listItem.querySelector("h2")
        let text = header.innerText.toUpperCase()
        // text.indexOf(filter) > -1
        if (text.indexOf(filter) > -1) {
            listItem.style.display = ""
        } else {
            listItem.style.display = "none"
        } //end of else
    }) //end of forEach
} //end of handleKeySearch (function)


// RESET -----------------------------------------------------------------------------
$("button").click(function () {
    location.reload()
}) //end of click function

init();