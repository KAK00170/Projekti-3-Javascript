const API_KEY = "60f5ab3eebeb84d6563693d6d3bb97b1";

const nappi = document.getElementById("nappiHae");
const input = document.getElementById("artistiHaku");
const albumsDiv = document.getElementById("albums");

//Napista haetaan artistin albumit
nappi.addEventListener("click", () => {
  const artisti = input.value;
  if (artisti) {
    haeAlbumit(artisti);  //Haetaan albuit
  } else {
    albumsDiv.innerHTML = "Kirjoita artistin nimi";   //Jos kenttä tyhjä
  }
});
//Enter haku
$('#artistiHaku').on('keypress', function(e) {
  if (e.which === 13) { // Enter-näppäin
    $('#nappiHae').click();
  }
});

//Artistit haetaan lastFM:n API:sta
async function haeAlbumit(artisti) {
  try { //Api pyyntö
    const url = `https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${artisti}&api_key=${API_KEY}&format=json`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.topalbums && data.topalbums.album) { //Löytyykö
      const albumit = data.topalbums.album.slice(0, 10);  //10 top albumia
      näytäAlbumit(artisti, albumit); //Näytetään albumit
    }} catch {
    albumsDiv.innerHTML = "Tietojen haku epäonnistui."; //Jos ei toimi
  }
}

//Näyttää albumit
async function näytäAlbumit(artisti, albumit) {
  albumsDiv.innerHTML = ""; // Poistetaan vanhat haut

  for (const album of albumit) { 
    const kuva = album.image?.find((img) => img.size === "large")?.["#text"]; //Haetaan albumien kuvat

    const albumDiv = document.createElement("div"); //Albumeille divit
    albumDiv.className = "albumi";
    //Albumien sisältö
    albumDiv.innerHTML = ` 
      <img src="${kuva}" alt="${album.name}">
      <h3>${album.name}</h3>
      <p><strong>Artisti:</strong> ${artisti}</p>
      <div class="kappaleet-overlay">Ladataan kappaleet...</div>
    `;
    $(albumsDiv).append($(albumDiv).hide().fadeIn(1000));  //Fadein näkyviin

    const kappaleetOverlay = albumDiv.querySelector(".kappaleet-overlay");
    const kappaleet = await haeKappaleet(artisti, album.name);

    //Kappaleet overlayssä
    kappaleetOverlay.innerHTML = `
      <p><strong>Kappaleet:</strong></p>
      <ul>${kappaleet.map((k) => `<li>${k}</li>`).join("")}</ul>
    `;
    albumDiv.addEventListener("click", () => {
      window.open(album.url); // Avaa Last.fm uudessa välilehdessä
    });
  }
}
//Hover "popout"
$(document).on("mouseenter", ".albumi", function() {
  $(this).stop().animate({
    marginTop: "-10px",    
    marginBottom: "10px",
  }, 200);
});
//Palautuu takaisin kun hiiri poistuu alueelta
$(document).on("mouseleave", ".albumi", function() {
  $(this).stop().animate({
    marginTop: "0px",
    marginBottom: "0px",
  }, 200);
});

//Kappaleet albumille
async function haeKappaleet(artisti, albuminNimi) { //Api pyyntö
    const url = `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${API_KEY}&artist=${artisti}&album=${albuminNimi}&format=json`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.album && data.album.tracks && data.album.tracks.track) {   //
      const kappaleet = data.album.tracks.track.map((t) => t.name);
      return kappaleet.slice(0, 50);  //Laittaa max 50 kappaletta albumista
    }
    return [];
    }

let i = 0;
setInterval(() => {     //Taustan värin vaihto 5s välein
  $("body").animate(
    { backgroundColor: ["#a1abb6", "#9c8fd4d8"][i++ % 2] }, 5000);
  }, 5000);