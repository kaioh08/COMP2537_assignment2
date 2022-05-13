import { Util } from  './util.js';


class Index extends Util {
    constructor () {
        super()
    };

    async init() {
        await this.displayRandPokemon();
    };

    async displayRandPokemon() {
        let template = document.getElementById('poke-template');
        let cardGroup = document.getElementById('poke-container');

        for (let i = 0; i < 9; i++) {
            const pokemonObj = await this.searchPokemon(this.getRandomInt(0, 800));
            let card = template.content.cloneNode(true);
            card.querySelector('.poke-info').onclick = () => this.redirectToPokemonId(pokemonObj.id);
            card.querySelector('.poke-img').src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonObj.id}.png`;
            card.querySelector('.poke-name').innerHTML = this.capitaliseName(pokemonObj.name);
            cardGroup.appendChild(card);
        }
    };
};


const main = new Index();
main.init();