const RADIO_NAME = 'Radio Suara Soneta';

// Change Azuracast Stream URL Here, .
const URL_STREAMING = 'https://a2.siar.us/listen/suarasoneta/radio.mp3';

// API URL Azuracast Now Playing
const API_URL = 'https://a2.siar.us/api/nowplaying/41';

// Visit https://api.vagalume.com.br/docs/ to get your API key
const API_KEY = "18fe07917957c289983464588aabddfb";

// Change DEFAULT COVER
const DEFAULT_COVER_ART = 'https://a2.siar.us/static/uploads/suarasoneta/album_art.1676019486.png';

// Variable to control history display: true = display / false = hides
let showHistory = true; 

window.onload = function () {
  var page = new Page;
  page.changeTitlePage();
  page.setVolume();

  var player = new Player();
  player.play();

  getStreamingData();
  // Interval to get streaming data in miliseconds
  setInterval(function () {
    getStreamingData();
  }, 4000);

  var coverArt = document.getElementsByClassName('cover-album')[0];

  coverArt.style.height = coverArt.offsetWidth + 'px';
}

// DOM control
function Page() {
  this.changeTitlePage = function (title = RADIO_NAME) {
    document.title = title;
  };

  this.refreshCurrentSong = function (song, artist) {
    var currentSong = document.getElementById('currentSong');
    var currentArtist = document.getElementById('currentArtist');

    if (song !== currentSong.innerHTML) {
      // Animate transition
      currentSong.className = 'animated flipInY text-uppercase';
      currentSong.innerHTML = song;

      currentArtist.className = 'animated flipInY text-capitalize';
      currentArtist.innerHTML = artist;

      // Refresh modal title
      document.getElementById('lyricsSong').innerHTML = song + ' - ' + artist;

      // Remove animation classes
      setTimeout(function () {
        currentSong.className = 'text-uppercase';
        currentArtist.className = 'text-capitalize';
      }, 2000);
    }
  }

  this.refreshHistoric = function (info, n) {
    var $historicDiv = document.querySelectorAll('#historicSong article');
    var $songName = document.querySelectorAll('#historicSong article .music-info .song');
    var $artistName = document.querySelectorAll('#historicSong article .music-info .artist');

    // Default cover art
    var urlCoverArt = DEFAULT_COVER_ART; 
    
   // Get cover art for song history
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        var data = JSON.parse(this.responseText);
        var artworkUrl100 = (data.resultCount) ? data.results[0].artworkUrl100 : urlCoverArt;

        document.querySelectorAll('#historicSong article .cover-historic')[n].style.backgroundImage = 'url(' + artworkUrl100 + ')';
      }
      // Formating characters to UTF-8
      var music = info.song.title.replace(/&amp;/g, '&');;
      var songHist = music.replace(/&amp;/g, '&');

      var artist = info.song.artist.replace(/&apos;/g, '\'');
      var artistHist = artist.replace(/&amp;/g, '&');

      $songName[n].innerHTML = songHist;
      $artistName[n].innerHTML = artistHist;

      // Add class for animation
      $historicDiv[n].classList.add('animated');
      $historicDiv[n].classList.add('slideInRight');
    }
    xhttp.open('GET', 'https://itunes.apple.com/search?term=' + info.song.artist + ' ' + info.song.title + '&media=music&limit=1', true)
    xhttp.send();

    setTimeout(function () {
      for (var j = 0; j < 2; j++) {
        $historicDiv[j].classList.remove('animated');
        $historicDiv[j].classList.remove('slideInRight');
      }
    }, 2000);
  }
  
  // Artist Covers - Below 
   this.refreshCover = function (song = '', artist) {
        // Default cover art
        var urlCoverArt = DEFAULT_COVER_ART; 
     
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            var coverArt = document.getElementById('currentCoverArt');
            var coverBackground = document.getElementById('bgCover');

            // Get cover art URL on iTunes API
            if (this.readyState === 4 && this.status === 200) {
                var data = JSON.parse(this.responseText);
                var artworkUrl100 = (data.resultCount) ? data.results[0].artworkUrl100 : urlCoverArt;

                // If it returns any data, changes the image resolution or sets the default
                urlCoverArt = (artworkUrl100 != urlCoverArt) ? artworkUrl100.replace('100x100bb', '1200x1200bb') : urlCoverArt;
                var urlCoverArt96 = (artworkUrl100 != urlCoverArt) ? urlCoverArt.replace('1200x1200bb', '96x96bb') : urlCoverArt;
                var urlCoverArt128 = (artworkUrl100 != urlCoverArt) ? urlCoverArt.replace('1200x1200bb', '128x128bb') : urlCoverArt;
                var urlCoverArt192 = (artworkUrl100 != urlCoverArt) ? urlCoverArt.replace('1200x1200bb', '192x192bb') : urlCoverArt;
                var urlCoverArt256 = (artworkUrl100 != urlCoverArt) ? urlCoverArt.replace('1200x1200bb', '256x256bb') : urlCoverArt;
                var urlCoverArt384 = (artworkUrl100 != urlCoverArt) ? urlCoverArt.replace('1200x1200bb', '384x384bb') : urlCoverArt;

                coverArt.style.backgroundImage = 'url(' + urlCoverArt + ')';
                coverArt.className = 'animated bounceInLeft';

                coverBackground.style.backgroundImage = 'url(' + urlCoverArt + ')';

                setTimeout(function () {
                    coverArt.className = '';
                }, 2000);

                if ('mediaSession' in navigator) {
                    navigator.mediaSession.metadata = new MediaMetadata({
                        title: song,
                        artist: artist,
                        artwork: [{
                                src: urlCoverArt96,
                                sizes: '96x96',
                                type: 'image/png'
                            },
                            {
                                src: urlCoverArt128,
                                sizes: '128x128',
                                type: 'image/png'
                            },
                            {
                                src: urlCoverArt192,
                                sizes: '192x192',
                                type: 'image/png'
                            },
                            {
                                src: urlCoverArt256,
                                sizes: '256x256',
                                type: 'image/png'
                            },
                            {
                                src: urlCoverArt384,
                                sizes: '384x384',
                                type: 'image/png'
                            },
                            {
                                src: urlCoverArt,
                                sizes: '512x512',
                                type: 'image/png'
                            }
                        ]
                    });
                }
            }
        }
        xhttp.open('GET', 'https://itunes.apple.com/search?term=' + artist + ' ' + song + '&media=music&limit=1', true);
        xhttp.send();
    }

  this.changeVolumeIndicator = function (volume) {
    document.getElementById('volIndicator').innerHTML = volume;

    if (typeof (Storage) !== 'undefined') {
      localStorage.setItem('volume', volume);
    }
  }

  this.setVolume = function () {
    if (typeof (Storage) !== 'undefined') {
      var volumeLocalStorage = (!localStorage.getItem('volume')) ? 100 : localStorage.getItem('volume');
      document.getElementById('volume').value = volumeLocalStorage;
      document.getElementById('volIndicator').innerHTML = volumeLocalStorage;
    }
  }

  this.refreshLyric = function (currentSong, currentArtist) {
    var xhttp = new XMLHttpRequest();
    try {
      xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          var data = JSON.parse(this.responseText);

          var openLyric = document.getElementsByClassName('lyrics')[0];

          if (data.type === 'exact' || data.type === 'aprox') {
            var lyric = data.mus[0].text;

            document.getElementById('lyric').innerHTML = lyric.replace(/\n/g, '<br />');
            openLyric.style.opacity = "1";
            openLyric.setAttribute('data-toggle', 'modal');
          } else {
            openLyric.style.opacity = "0.3";
            openLyric.removeAttribute('data-toggle');

            var modalLyric = document.getElementById('modalLyrics');
            modalLyric.style.display = "none";
            modalLyric.setAttribute('aria-hidden', 'true');
            (document.getElementsByClassName('modal-backdrop')[0]) ? document.getElementsByClassName('modal-backdrop')[0].remove() : '';
          }
        } else {
          document.getElementsByClassName('lyrics')[0].style.opacity = "0.3";
          document.getElementsByClassName('lyrics')[0].removeAttribute('data-toggle');
        }
      }
    } catch (err) {
      console.log("Errot get data from: " + err);
    }
    xhttp.crossOrigin = "anonymous";
    xhttp.open('GET', 'https://api.vagalume.com.br/search.php?apikey=' + API_KEY + '&art=' + currentArtist + '&mus=' + currentSong.toLowerCase(), true);
    xhttp.send()
  }
}

var audio = new Audio(URL_STREAMING);

// Player control
function Player() {
  this.play = function () {
    audio.play();

    var defaultVolume = document.getElementById('volume').value;

    if (typeof (Storage) !== 'undefined') {
      if (localStorage.getItem('volume') !== null) {
        audio.volume = intToDecimal(localStorage.getItem('volume'));
      } else {
        audio.volume = intToDecimal(defaultVolume);
      }
    } else {
      audio.volume = intToDecimal(defaultVolume);
    }
    document.getElementById('volIndicator').innerHTML = defaultVolume;
  };

  this.pause = function () {
    audio.pause();
  };
}

// On play, change the button to pause
audio.onplay = function () {
  var botao = document.getElementById('playerButton');
  var bplay = document.getElementById('buttonPlay');
  if (botao.className === 'fa fa-play') {
    botao.className = 'fa fa-pause';
    bplay.firstChild.data = 'PAUSE';
  }
}

// On pause, change the button to play
audio.onpause = function () {
  var botao = document.getElementById('playerButton');
  var bplay = document.getElementById('buttonPlay');
  if (botao.className === 'fa fa-pause') {
    botao.className = 'fa fa-play';
    bplay.firstChild.data = 'PLAY';
  }
}

// Unmute when volume changed
audio.onvolumechange = function () {
  if (audio.volume > 0) {
    audio.muted = false;
  }
}


document.getElementById('volume').oninput = function () {
  audio.volume = intToDecimal(this.value);

  var page = new Page();
  page.changeVolumeIndicator(this.value);
}

function togglePlay() {
  if (!audio.paused) {
    audio.pause();
  } else {
    audio.load();
    audio.play();
  }
}

function volumeUp() {
  var vol = audio.volume;
  if (audio) {
    if (audio.volume >= 0 && audio.volume < 1) {
      audio.volume = (vol + .01).toFixed(2);
    }
  }
}

function volumeDown() {
  var vol = audio.volume;
  if (audio) {
    if (audio.volume >= 0.01 && audio.volume <= 1) {
      audio.volume = (vol - .01).toFixed(2);
    }
  }
}

function mute() {
  if (!audio.muted) {
    document.getElementById('volIndicator').innerHTML = 0;
    document.getElementById('volume').value = 0;
    audio.volume = 0;
    audio.muted = true;
  } else {
    var localVolume = localStorage.getItem('volume');
    document.getElementById('volIndicator').innerHTML = localVolume;
    document.getElementById('volume').value = localVolume;
    audio.volume = intToDecimal(localVolume);
    audio.muted = false;
  }
}

function getStreamingData() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      if (this.response.length === 0) {
        console.log('%cdebug', 'font-size: 22px');
      }

      var data = JSON.parse(this.responseText);
      // console.log('Received data:', data); // Add this line for debugging

      var page = new Page();

      // Formating characters to UTF-8
      let title = data.now_playing.song.title.replace(/&apos;/g, '\'');
      let artist = data.now_playing.song.artist.replace(/&apos;/g, '\'');

      // Change the title
      document.title = artist + ' - ' + title + ' | ' + RADIO_NAME;

      if (document.getElementById('currentSong').innerHTML !== title) {
        page.refreshCover(title, artist);
        page.refreshCurrentSong(title, artist);
        page.refreshLyric(title, artist);

        for (var i = 0; i < 2; i++) {
          page.refreshHistoric(data.song_history[i], i);
        }
      }
    }
  };

  var d = new Date();

  // Requisition with timestamp to prevent cache on mobile devices
  xhttp.open('GET', API_URL);
  xhttp.send();
}

// Player control by keys
document.addEventListener('keydown', function (k) {
  var k = k || window.event;
  var key = k.keyCode || k.which;

  var slideVolume = document.getElementById('volume');

  var page = new Page();

  switch (key) {
    // Arrow up
    case 38:
      volumeUp();
      slideVolume.value = decimalToInt(audio.volume);
      page.changeVolumeIndicator(decimalToInt(audio.volume));
      break;
    // Arrow down
    case 40:
      volumeDown();
      slideVolume.value = decimalToInt(audio.volume);
      page.changeVolumeIndicator(decimalToInt(audio.volume));
      break;
    // Spacebar
    case 32:
      togglePlay();
      break;
    // P
    case 80:
      togglePlay();
      break;
    // M
    case 77:
      mute();
      break;
    // 0
    case 48:
      audio.volume = 0;
      slideVolume.value = 0;
      page.changeVolumeIndicator(0);
      break;
    // 0 numeric keyboard
    case 96:
      audio.volume = 0;
      slideVolume.value = 0;
      page.changeVolumeIndicator(0);
      break;
    // 1
    case 49:
      audio.volume = .1;
      slideVolume.value = 10;
      page.changeVolumeIndicator(10);
      break;
    // 1 numeric key
    case 97:
      audio.volume = .1;
      slideVolume.value = 10;
      page.changeVolumeIndicator(10);
      break;
    // 2
    case 50:
      audio.volume = .2;
      slideVolume.value = 20;
      page.changeVolumeIndicator(20);
      break;
    // 2 numeric key
    case 98:
      audio.volume = .2;
      slideVolume.value = 20;
      page.changeVolumeIndicator(20);
      break;
    // 3
    case 51:
      audio.volume = .3;
      slideVolume.value = 30;
      page.changeVolumeIndicator(30);
      break;
    // 3 numeric key
    case 99:
      audio.volume = .3;
      slideVolume.value = 30;
      page.changeVolumeIndicator(30);
      break;
    // 4
    case 52:
      audio.volume = .4;
      slideVolume.value = 40;
      page.changeVolumeIndicator(40);
      break;
    // 4 numeric key
    case 100:
      audio.volume = .4;
      slideVolume.value = 40;
      page.changeVolumeIndicator(40);
      break;
    // 5
    case 53:
      audio.volume = .5;
      slideVolume.value = 50;
      page.changeVolumeIndicator(50);
      break;
    // 5 numeric key
    case 101:
      audio.volume = .5;
      slideVolume.value = 50;
      page.changeVolumeIndicator(50);
      break;
    // 6 
    case 54:
      audio.volume = .6;
      slideVolume.value = 60;
      page.changeVolumeIndicator(60);
      break;
    // 6 numeric key
    case 102:
      audio.volume = .6;
      slideVolume.value = 60;
      page.changeVolumeIndicator(60);
      break;
    // 7
    case 55:
      audio.volume = .7;
      slideVolume.value = 70;
      page.changeVolumeIndicator(70);
      break;
    // 7 numeric key
    case 103:
      audio.volume = .7;
      slideVolume.value = 70;
      page.changeVolumeIndicator(70);
      break;
    // 8
    case 56:
      audio.volume = .8;
      slideVolume.value = 80;
      page.changeVolumeIndicator(80);
      break;
    // 8 numeric key
    case 104:
      audio.volume = .8;
      slideVolume.value = 80;
      page.changeVolumeIndicator(80);
      break;
    // 9
    case 57:
      audio.volume = .9;
      slideVolume.value = 90;
      page.changeVolumeIndicator(90);
      break;
    // 9 numeric key
    case 105:
      audio.volume = .9;
      slideVolume.value = 90;
      page.changeVolumeIndicator(90);
      break;
  }
});

function intToDecimal(vol) {
  return vol / 100;
}

function decimalToInt(vol) {
  return vol * 100;
}