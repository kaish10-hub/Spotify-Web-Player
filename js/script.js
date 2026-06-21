console.log("Lets write JavaScript");

let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
  currFolder = folder;
  let response = await fetch(`${folder}/songs.json`);
  songs = await response.json();

  // Show all the songs in playlist
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li> <img class="invert" src="img/music.svg" alt="">
                            <div class="info">
                                <div>${decodeURI(song)}</div>
                                <div>Kaish</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>       
                                <img class="invert" src="img/play.svg" alt="">
                            </div> </li>`;

  }

  //   Attach an EventListener to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li"),
).forEach((e) => {
    e.addEventListener("click", () => {
      playMusic(
        e.querySelector(".info").firstElementChild.innerHTML.trim()
      );
    });
});

  return songs;
}

const playMusic = (track, pause = false) => {
  // let audio = new Audio("/songs/"+track)

  document.querySelectorAll(".songList li").forEach(li => {
    li.classList.remove("active");
    const songname = li.querySelector(".info").firstElementChild.textContent.trim()
    if (decodeURI(track) === songname){
      li.classList.add("active");
    }
  });
  currentSong.src = `${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "img/pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function displayAlbums() {

  let albums = await fetch("songs/albums.json");
  let folders = await albums.json();
  console.log(folders);

  let cardContainer = document.querySelector(".cardContainer");

  for (const folder of folders) {

    let response = await fetch(`songs/${folder}/info.json`);
    let data = await response.json();

    cardContainer.innerHTML += `
      <div data-folder="${folder}" class="card">
        <div class="play">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="https://www.w3.org/2000/svg"
          >
            <path
              d="M5 20V4L19 12L5 20Z"
              stroke="#141B34"
              fill="#000"
              stroke-width="1.5"
              stroke-linejoin="round"
            />
          </svg>
        </div>

        <img src="songs/${folder}/cover.jpg" alt="">

        <h2>${data.title}</h2>
        <p>${data.description}</p>
      </div>
    `;
  }

  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {

      songs = await getSongs(
        `songs/${item.currentTarget.dataset.folder}`
      );

      playMusic(songs[0]);
    });
  });
}

async function main() {
  // Get the list of all songs
  await getSongs("songs/ArijitSingh");
  playMusic(songs[0], true);

  // display all the albums on the page
  displayAlbums();

  // Attach an EventListener to play button
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "img/pause.svg";
    } else {
      currentSong.pause();
      play.src = "img/play.svg";
    }
  });

  // Listen for timeupdate event
  currentSong.addEventListener("timeupdate", () => {
    // console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songtime").innerHTML =
      `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  // Add an eventListener to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  // Add an eventListener for hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  // Add an eventListener for close
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  // Add an eventListener for previous and next
  previous.addEventListener("click", () => {
    currentSong.pause();
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    } else {
      playMusic(songs[songs.length - 1]);
    }
  });

  // Add an eventListener for previous and next
  next.addEventListener("click", () => {
    currentSong.pause();
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    } else {
      playMusic(songs[0]);
    }
  });

  // Add an eventListener to volume
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      console.log("Setting volume to ", e.target.value, "/ 100");
      currentSong.volume = parseInt(e.target.value) / 100;
      if(currentSong.volume>0){
        document.querySelector(".volume>img").src=document.querySelector(".volume>img").src.replace("img/mute.svg","img/volume.svg");
      }
    });

  // Add EventListener to mute the track
  document.querySelector(".volume>img").addEventListener("click",e=>{
    if(e.target.src.includes("img/volume.svg")){
      e.target.src=e.target.src.replace("img/volume.svg","img/mute.svg");
      currentSong.volume=0;
      document
    .querySelector(".range")
    .getElementsByTagName("input")[0].value=0;
    }else{
      currentSong.volume=0.1;
      e.target.src=e.target.src.replace("img/mute.svg","img/volume.svg");
      document
    .querySelector(".range")
    .getElementsByTagName("input")[0].value=10;
    }
  })
}

main();
