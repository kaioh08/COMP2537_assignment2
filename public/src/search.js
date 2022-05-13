import { Util } from './util.js';


class Search extends Util {
    async init() {
        this.resetToDefaultFilter();
        await this.getPokemonByOffset();
        this.populatePokemon();

        $('#pokemon-type').change(() => this.chooseType());
        $('#region').change(() => this.chooseRegion());
        $('#search-sort').change(() => this.sortBy());
        $('#findPokemon').click(() => this.findPokemon());

        $('#first').click(() => this.changePage(0))
        $('#prev').click(() => this.prevPage())
        $('#next').click(() => this.nextPage())
        $('#last').click(() => this.changePage(this.getPageNum() - 1))
    };   
    
    resetToDefaultFilter() {
        $('#pokemon-type').val('all');
        $('#region').val('kanto');
        $('#search-sort').val('id');
    };

    prevPage() {
        if (this.currentPage > 0) {
            this.currentPage--;
            this.changePage(this.currentPage);
        } 
        return;
    };

    nextPage() {
        if (this.currentPage < this.getPageNum() - 1) {
            this.currentPage++;
            this.changePage(this.currentPage);
        }
        return;
    };
    
    changePage(page) { // "page" param is used mainly for first and last button
        this.currentPage = page
        $('#poke-container').empty()
        if ($('#pokemon-type').val() !== 'all') return this.displayFilteredPokemonForType();
        else return this.populatePokemon();
    };
    
    getPageNum() {
        return Math.ceil(this.currentPokemonSet.length / this.numPerPage)
    };
  
    populateHistory() {
        $('.search-history').empty();
        this.history.forEach(element => {
            $('.search-history').append(`
                <div class="search-history-links">
                    <a href="../pokemon.html?id=${element.id}">${element.name}</a>
                </div>
            `)
        })
    };

    sortBy() {
        this.searchType = $('#search-sort').val();
        if (this.searchType === 'name') {
            this.currentPokemonSet.sort((a, b) => {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
                return 0;
            })
            $('#poke-container').empty()
            this.populatePokemon()
        }
        if (this.searchType === 'id') {
            this.currentPokemonSet.sort((a, b) => {
                return this.getPokemonID(a.url) - this.getPokemonID(b.url)
            })
            $('#poke-container').empty()
            this.populatePokemon()
        }
    };

    async chooseType() {
        this.pokemonType = $('#pokemon-type').val()
        $('#poke-container').empty()
        if (this.pokemonType === 'all') {
            await this.getPokemonByOffset()
            this.populatePokemon()
            return;
        }
        else {
            await this.getPokemonTypeByOffset()
            this.displayFilteredPokemonForType()
        }
    };
 
    async chooseRegion() {
        const region = $('#region').val();
        switch (region) {
            case 'kanto':
                this.start = 1
                this.end = 151
                break
            case 'johto':
                this.start = 152
                this.end = 251
                break
            case 'hoenn':
                this.start = 252
                this.end = 386
                break
            case 'sinnoh':
                this.start = 387
                this.end = 494
                break
            case 'unova':
                this.start = 495
                this.end = 649
                break
            case 'kalos':
                this.start = 650
                this.end = 721
                break
            case 'alola':
                this.start = 722
                this.end = 809
                break
            case 'galar':
                this.start = 810
                this.end = 898
                break
            default:
                console.log('This shouldnt happen')
                break
        }
        $('#poke-container').empty();
        await this.getPokemonByOffset();
        await this.populatePokemon();
    };

    async findPokemon() {
        $('#poke-container').empty()
        const searchParam = $('#pokemonName').val().toLowerCase()
        if (searchParam === '') {
            await this.getPokemonByOffset()
            this.populatePokemon()
        }
        let pokemonObj = await this.searchPokemon(searchParam)
        this.displaySearchedPokemon(pokemonObj)
        this.populateHistory()
    };
}

const main = new Search();
main.init();