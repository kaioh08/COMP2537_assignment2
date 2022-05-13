import { Util } from  './util.js';


class Pokemon extends Util {
    constructor() {
        super()
    };

    async init() {
        await this.populatePokemonInfo();
    };

    async populatePokemonInfo() {
        const params = new URL(window.location.href)
        const pokemonObj = await this.searchPokemon(params.searchParams.get('id') || this.getRandomInt(0, 900));
        const otherPokemonObj = await this.getOtherPokemonInfo(pokemonObj.id);
        
        const typeArray = pokemonObj.types.map(({ type }) => type.name)
        const abilityArray = pokemonObj.abilities.map(({ ability }) => ability.name)

        this.populateType(typeArray);
        this.populateAbility(abilityArray);

        $('.poke-img').attr('src', pokemonObj.sprites.other["official-artwork"].front_default || pokemonObj.sprites.front_default);
        $('.poke-id').html(pokemonObj.id);
        $('.poke-name').html(this.capitaliseName(pokemonObj.name));
        $('.poke-height').html(pokemonObj.height + "cm");
        $('.poke-weight').html(pokemonObj.weight + "g");

        $('.description').html(this.getEnDescription(otherPokemonObj.flavor_text_entries));
        $('.hp').html(pokemonObj.stats[0].base_stat);
        $('.attack').html(pokemonObj.stats[1].base_stat);
        $('.defense').html(pokemonObj.stats[2].base_stat);
        $('.special-attack').html(pokemonObj.stats[3].base_stat);
        $('.special-defense').html(pokemonObj.stats[4].base_stat);
        $('.speed').html(pokemonObj.stats[5].base_stat);
    };

    async getOtherPokemonInfo(id) {
        try {
            let response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`, {
                "method": "GET"
            })
            if (response.status !== 200) throw response.status;
            let body = await response.json();
            return body;
        } catch (e) { 
            console.log(e)
            return this.getOtherPokemonInfo(id);
        }
    };

    populateType(typeArray) {
        let template = document.getElementById('type-template');
        let cardGroup = document.getElementById('type-container');

        for (let i = 0; i < typeArray.length; i++) {
            let card = template.content.cloneNode(true);
            card.querySelector('.type').innerHTML = this.capitaliseName(typeArray[i]);
            cardGroup.appendChild(card);
        }
    };

    populateAbility(abilityArray) {
        let template = document.getElementById('ability-template');
        let cardGroup = document.getElementById('ability-container');

        for (let i = 0; i < abilityArray.length; i++) {
            let card = template.content.cloneNode(true);
            card.querySelector('.ability').innerHTML = this.capitaliseName(abilityArray[i]);
            cardGroup.appendChild(card);
        }
    };

    getEnDescription(descArray) {
        for (let i = 0; i < descArray.length; i++) {
            if (descArray[i].language.name === 'en') return descArray[i].flavor_text;
        }
    }
};


const main = new Pokemon();
main.init();