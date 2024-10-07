document.getElementById('searchBtn').addEventListener('click', fetchPokemon);
document.getElementById('pokemonDropdown').addEventListener('change', handleDropdownSelection);

// Fetch Pokémon names on page load for the dropdown
window.onload = fetchPokemonNames;

function fetchPokemon() {
    const pokemonNameOrId = document.getElementById('pokemonName').value.toLowerCase().trim();
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNameOrId}`)
        .then(response => {
            if (!response.ok) throw new Error('Pokémon not found');
            return response.json();
        })
        .then(data => {
            displayPokemon(data);
            fetchEvolutionChain(data.species.url);
        })
        .catch(err => console.error(err));
}

function displayPokemon(data) {
    document.getElementById('pokemonDisplayName').textContent = data.name;
    document.getElementById('pokemonImage').src = data.sprites.front_default;
    document.getElementById('pokemonType').textContent = `Type: ${data.types.map(t => t.type.name).join(', ')}`;

    const statsList = document.getElementById('pokemonStats');
    statsList.innerHTML = '';
    data.stats.forEach(stat => {
        const statItem = document.createElement('li');
        statItem.textContent = `${stat.stat.name}: ${stat.base_stat}`;
        statsList.appendChild(statItem);
    });

    document.getElementById('pokemonCard').classList.remove('hidden');
}

function fetchPokemonNames() {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=1000')
        .then(response => response.json())
        .then(data => populateDropdown(data.results))
        .catch(err => console.error(err));
}

function populateDropdown(pokemonList) {
    const dropdown = document.getElementById('pokemonDropdown');
    pokemonList.forEach(pokemon => {
        const option = document.createElement('option');
        option.value = pokemon.name;
        option.textContent = pokemon.name;
        dropdown.appendChild(option);
    });
}

function handleDropdownSelection() {
    const selectedPokemon = document.getElementById('pokemonDropdown').value;
    document.getElementById('pokemonName').value = selectedPokemon;
    fetchPokemon();
}

function fetchEvolutionChain(speciesUrl) {
    fetch(speciesUrl)
        .then(response => response.json())
        .then(data => {
            fetch(data.evolution_chain.url)
                .then(response => response.json())
                .then(evolutionData => displayEvolutionChain(evolutionData.chain))
                .catch(err => console.error(err));
        })
        .catch(err => console.error(err));
}

function displayEvolutionChain(chain) {
    let evolution = chain;
    const stages = [];

    while (evolution) {
        stages.push({
            name: evolution.species.name,
            url: evolution.species.url
        });
        evolution = evolution.evolves_to[0];
    }

    stages.forEach((stage, index) => {
        document.getElementById(`evolution${index + 1}Name`).textContent = stage.name;
        fetch(`https://pokeapi.co/api/v2/pokemon/${stage.name}`)
            .then(response => response.json())
            .then(data => {
                document.getElementById(`evolution${index + 1}Image`).src = data.sprites.front_default;
            })
            .catch(err => console.error(err));
    });

    document.getElementById('evolutionChain').classList.remove('hidden');
}

function displayPokemon(data) {
    document.getElementById('pokemonDisplayName').textContent = data.name;
    // Use animated sprite from Pokémon Showdown (static version or shiny if available)
    const animatedSpriteUrl = `https://play.pokemonshowdown.com/sprites/xyani/${data.name}.gif`;
    document.getElementById('pokemonImage').src = animatedSpriteUrl;
    document.getElementById('pokemonImage').alt = `${data.name} animated sprite`;

    document.getElementById('pokemonType').textContent = `Type: ${data.types.map(t => t.type.name).join(', ')}`;

    const statsList = document.getElementById('pokemonStats');
    statsList.innerHTML = '';
    data.stats.forEach(stat => {
        const statItem = document.createElement('li');
        statItem.textContent = `${stat.stat.name}: ${stat.base_stat}`;
        statsList.appendChild(statItem);
    });

    document.getElementById('pokemonCard').classList.remove('hidden');
}


