# Pokemon Index

Built with NodeJS, Vanilla JS, HTML, and CSS.

NodeJS with express module was used to host the webpage locally and on the heroku hosting cloud service.

[Webpage hosted by Heroku](https://comp2537-pokedex.herokuapp.com/)

[Video Demostration](https://www.youtube.com/watch?v=SGr7_rFrUUI)
## Content
Content of the project folder:

```
Top level of project folder:
├── server.js
└── public

public folder:
├── css
├── skeleton
├── src
├── home.html
├── pokemon.html
└── search.html

css folder:
├── home.css
├── main.css
├── pokemon.css
└── search.css

skeleton folder:
├── header.html
├── navbar.html
└── pokeball.svg

src folder:
├── index.js
├── pokemon.js
├── search.js
└── util.js
```


Pokemon Index HTML Directory
-
### home.html
This webpage displays 9 random pokemons on a 3x3 grid layout. Each refresh on this page will fetch another random 9 pokemon to display.

### pokemon.html
The profile webpage where it will display a specific pokemon that the user have been redirected from either the home page or searched. If no user input was given going to this page, it will randomly fetch a pokemon and show all its relative stats.

### search.html
This webpage displays all pokemons by region. Features pagination with 9 pokemons per page. A search history is also featured. A filter option is given; Pokemon region, sort by ID or Name, search specific Pokemon, or filter by pokemon type.