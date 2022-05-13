export class Util {
    constructor() {
        this.end = 151;
        this.start = 0;
        this.pokemonType = 'all';
        this.searchType = 'id';
        this.currentPokemonSet = {};
        this.history = [];
        this.currentPage = 0;
        this.numPerPage = 9;
        this.loadSkeleton();
    };
    
    loadSkeleton() {
        // loads the skeleton of navbar.html and header.html
        $('#nav-bar').load('../skeleton/navbar.html');
        $('#header').load('../skeleton/header.html');
    };
    
    getRandomInt(min, max) {
        // random int with min and max
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    capitaliseName(string) {
        // captilises the first letter of the string var "string"
        return string[0].toUpperCase() + string.substring(1);
    };

    redirectToPokemonId(id) {
        // redirects user to the pokemon.html with the
        // query param id = "id"
        location.href = `pokemon.html?id=${id}`;
    };

    getPokemonID(url) {
        // splits the url and returns the int ID 
        return url.split('mon/')[1].split('/')[0]
    };

    async getPokemonByOffset() {
        /**
         * Fetches pokemon from the range of "start" and "end"
         * "start" and "end" represents the region the user is currently selected
         * stores the array "results" into "currentPokemonSet"
         */
        try {
            let response = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=${this.end}&offset=${this.start}`, {
                "method": "GET"
            })
            if (response.status !== 200) throw response.status;
            let body = await response.json();
            this.currentPokemonSet = body.results;
            return;
        } catch (e) { 
            console.log(e)
            return this.getPokemonByOffset();
        }
    };

    async getPokemonTypeByOffset() {
        /**
         * Fetches the pokemon by type using the type endpoint.
         * parse the pokemon array and store it into "currentPokemonSet"
         */
        try {
            let response = await fetch(`https://pokeapi.co/api/v2/type/${this.pokemonType}`, {
                "method": "GET"
            })
            if (response.status !== 200) throw response.status;
            let body = await response.json();
            this.currentPokemonSet = body.pokemon;
            return;
        } catch (e) { 
            console.log(e)
            return this.getPokemonTypeByOffset();
        }
    };

    async searchPokemon(searchParam) {
        try {
            let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchParam}`, {
                "method": "GET"
            })
            if (response.status !== 200) throw response.status;
            let body = await response.json();
            this.currentPokemonSet = body;
            this.history.push({ name: this.capitaliseName(body.name), id: body.id });
            return body;
        } catch (e) { 
            switch (e) {
                case 404:
                    alert('Pokemon not found')
                    break
                default:
                    console.log(e)
                    break
            }
            return;
        }
    };

    async populatePokemon() {
        // General Pokemon Populate function that creates a the cards in a for loop by the numPerPage variable
        let newIndex = this.currentPage * this.numPerPage;
        let template = document.getElementById('poke-template');
        let cardGroup = document.getElementById('poke-container');
        
        for (let i = 0; i < this.numPerPage; i++) {
            if (this.currentPokemonSet[i + newIndex] === undefined) return;
            const id = this.getPokemonID(this.currentPokemonSet[i + newIndex].url);
            let card = template.content.cloneNode(true);

            card.querySelector('.poke-info').onclick = () => this.redirectToPokemonId(id);
            card.querySelector('.poke-img').src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png` || null;
            card.querySelector('.poke-name').innerHTML = this.capitaliseName(this.currentPokemonSet[i + newIndex].name);
            cardGroup.appendChild(card);
        }
    };

    async displaySearchedPokemon(pokemonObj) {
        // Displays the pokemon from the param "pokemonObj" onto the "poke-container" div
        let template = document.getElementById('poke-template');
        let cardGroup = document.getElementById('poke-container');
        let card = template.content.cloneNode(true); 

        card.querySelector('.poke-info').onclick = () => this.redirectToPokemonId(pokemonObj.id);
        card.querySelector('.poke-img').src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonObj.id}.png` || null;
        card.querySelector('.poke-name').innerHTML = this.capitaliseName(pokemonObj.name);
        cardGroup.appendChild(card);
    };

    async displayFilteredPokemonForType() {
        /* Displays the filtered pokemons by type. 
         * Similar to the populatePokemon function; however,
         * a conditional if statement is used to only filter out 
         * the chosen pokemon type by the range of "start" and "end"
         * this was done to read which pokemon region the user have chosen
         * so it will filter only the chosen pokemon type by region 
         */
        let newIndex = this.currentPage * this.numPerPage;
        let template = document.getElementById('poke-template');
        let cardGroup = document.getElementById('poke-container');

        for (let i = 0; i < this.numPerPage; i++) {
            if (this.currentPokemonSet[i + newIndex] === undefined) return;
            const id = this.getPokemonID(this.currentPokemonSet[i + newIndex].pokemon.url);
            if (id >= this.start && id <= this.end) {
                let card = template.content.cloneNode(true);
                card.querySelector('.poke-info').onclick = () => this.redirectToPokemonId(id);
                card.querySelector('.poke-img').src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png` || nul;
                card.querySelector('.poke-name').innerHTML = this.capitaliseName(this.currentPokemonSet[i + newIndex].pokemon.name);
                cardGroup.appendChild(card);
            }
            else this.numPerPage++;
        }
    };
};