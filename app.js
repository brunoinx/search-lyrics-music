const form = document.querySelector("#form");
const searchInput = document.querySelector("#search");
const songsContainer = document.querySelector("#songs-container");
const prevAndNextContainer = document.querySelector("#prev-and-next-container");

const apiURL = `https://api.lyrics.ovh`;

const fetchData = async (url) => {
  const response = await fetch(url);
  return await response.json();
};

const getMoreSongs = async (url) => {
  const data = await fetchData(`https://cors-anywhere.herokuapp.com/${url}`);
  insertSongsIntoPage(data);
};

const insertPrevAndNextButtons = ({ prev, next }) => {
  prevAndNextContainer.innerHTML = `
    ${
      prev
        ? `<button class="btn" onclick="getMoreSongs('${prev}')">Anteriores< button>`
        : ""
    }
    ${
      next
        ? `<button class="btn" onclick="getMoreSongs('${next}')">Proxímas</button>`
        : ""
    }
  `;
};

const insertSongsIntoPage = ({ data, prev, next }) => {
  songsContainer.innerHTML = data
    .map(
      ({ artist: { name }, title }) => `
    <li class="song">
      <span class="song-artist"><strong>${name}</strong> - ${title}</span>
      <button class="btn" data-artist="${name}" data-song-title="${title}">Ver letra</button>
    </li>  
  `
    )
    .join("");

  if (prev || next) {
    insertPrevAndNextButtons({ prev, next });
    return;
  }

  prevAndNextContainer.innerHTML = "";
};

const fetchSongs = async (term) => {
  const data = await fetchData(`${apiURL}/suggest/${term}`);
  insertSongsIntoPage(data);
};

// Ouvidor do Evento de enviar o form
const handleFormSubmit = (e) => {
  e.preventDefault();
  const searchTerm = searchInput.value.trim();
  searchInput.value = "";
  searchInput.focus();

  if (!searchTerm) {
    songsContainer.innerHTML = `<li class="warning-message">Por Favor, insira uma mensagem válida.</li>`;
    return;
  }

  fetchSongs(searchTerm);
};

form.addEventListener("submit", handleFormSubmit);

const insertLyricsIntoPage = ({ lyrics, artist, songTitle }) => {
  songsContainer.innerHTML = `
    <li class="lyrics-container">
      <h2><strong>${songTitle} - ${artist}</strong></h2>
      <p class="lyrics">${lyrics}</p>
    </li>
  `;
};

	const fetchLyrics = async (artist, songTitle) => {
		const data = await fetchData(`${apiURL}/v1/${artist}/${songTitle}`);

		try {
			const lyrics = await data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");
			insertLyricsIntoPage({ lyrics, artist, songTitle });
		} catch (error) {
			songsContainer.innerHTML = `<h2 class="title-warning">A letra de ${artist} - ${songTitle} não está disponível...</h2>`;
			error = console.log("Não está disponível");
		}

	};

const handleSongsContainerClick = (e) => {
  const clickedElement = e.target;

  if (clickedElement.tagName === "BUTTON") {
    const artist = clickedElement.getAttribute("data-artist");
    const songTitle = clickedElement.getAttribute("data-song-title");

    prevAndNextContainer.innerHTML = "";
    fetchLyrics(artist, songTitle);
  }
};

songsContainer.addEventListener("click", handleSongsContainerClick);
