let isSearching = true;
let showFavorites = false;
let api;

// start the indexedDB
let DB_NAME = "favoritesDB";
let db = indexedDB;
const dbRequest = db.open(DB_NAME, 2);
dbRequest.onupgradeneeded = (event) => {
  const db = event.target.result;

  // objectStore for movies
  let favoriteStore = db.createObjectStore("favorites", {
    keyPath: "IMDBID",
  });
  favoriteStore.createIndex("IMDBID", "IMDBID", { unique: true });
  favoriteStore.createIndex("title", "title", { unique: false });
  favoriteStore.createIndex("singleMovie", "singleMovie", { unique: true });

  // objectStore for APIKey
  let apiStore = db.createObjectStore("apikey", {
    keyPath: "key",
  });
};

dbRequest.onerror = (event) => {
  // Generic error handler for all errors targeted at this database's
  // requests!
  console.error(`Database error: ${event.target.errorCode}`);
};

// let user choose whether to search, show favorites, or both
let isSearchingBox = document.createElement("input");
isSearchingBox.setAttribute("id", "isSearching");
isSearchingBox.setAttribute("type", "checkbox");
isSearchingBox.checked = true;
let searchBoxLabel = document.createElement("label");
searchBoxLabel.setAttribute("for", "isSearching");
searchBoxLabel.innerText = "Search Mode";
isSearchingBox.addEventListener("change", (e) => {
  let form = document.getElementById("form");
  let results = document.getElementById("results");
  if (isSearchingBox.checked) {
    isSearching = true;
    form.hidden = false;
    results.hidden = false;
    if (api_key !== "") {
      document.getElementById("API_key_p").hidden = true;
    }
  } else {
    form.hidden = true;
    isSearching = false;
    results.hidden = true;
  }
});
document.getElementById("main-div").prepend(isSearchingBox, searchBoxLabel);

let showFavoritesBox = document.createElement("input");
showFavoritesBox.setAttribute("id", "showFavorites");
showFavoritesBox.setAttribute("type", "checkbox");
let favoritesBoxLabel = document.createElement("label");
favoritesBoxLabel.setAttribute("for", "showFavorites");
favoritesBoxLabel.innerText = "Show Favorites";
showFavoritesBox.addEventListener("change", (e) => {
  let favDiv = document.getElementById("favorites");
  if (showFavoritesBox.checked) {
    favDiv.hidden = false;
    showFavorites = true;
    displayFavorites();
  } else {
    favDiv.hidden = true;
    showFavorites = false;
  }
});

function displayFavorites() {
  let oldFaves = document.getElementById("favorites");
  while (oldFaves.firstChild) {
    oldFaves.removeChild(oldFaves.firstChild);
  }
  let db;
  const dbRequest = indexedDB.open(DB_NAME, 2);

  dbRequest.onerror = (event) => {
    // Generic error handler for all errors targeted at this database's
    // requests!
    console.error(`Database error: ${event.target.errorCode}`);
  };
  console.log(dbRequest);

  dbRequest.onsuccess = (event) => {
    db = event.target.result;
    const transaction = db.transaction(["favorites"]);
    const favoriteStore = transaction.objectStore("favorites");
    const request = favoriteStore.openCursor();
    request.onsuccess = (event) => {
      let cursor = event.target.result;
      if (cursor) {
        let newMovie = new SingleMovie(cursor.value.IMDBID);
        newMovie.setMovieFeatures(
          cursor.value.title,
          cursor.value.year,
          cursor.value.rating,
          cursor.value.released,
          cursor.value.poster
        );
        newMovie.setMovieNoteText(cursor.value.movieNoteText);
        console.log("fave line");
        document
          .getElementById("favorites")
          .appendChild(newMovie.getSingleMovieHTML());
        cursor.continue();
      }
      console.log("cursor is done");
    };
  };
}

document
  .getElementById("main-div")
  .prepend(showFavoritesBox, favoritesBoxLabel);

// get API Key from user
let api_key = "";

function hasKey() {
  let db;
  const dbRequest = indexedDB.open(DB_NAME, 2);

  dbRequest.onerror = (event) => {
    // Generic error handler for all errors targeted at this database's
    // requests!
    console.error(`Database error: ${event.target.errorCode}`);
  };

  dbRequest.onsuccess = (event) => {
    db = event.target.result;
    const transaction = db.transaction(["apikey"]);
    const apikeyStore = transaction.objectStore("apikey");
    const request = apikeyStore.openCursor();
    request.onsuccess = (event) => {
      let cursor = event.target.result;
      console.log("key cursor " + cursor);
      if (cursor !== null) {
        document.getElementById("API_key_p").hidden = true;
        api_key = cursor.value.key;
        console.log("hide key input");
      } else {
        document
          .getElementById("API_key")
          .addEventListener("input", function (event) {
            document.getElementById("api_small").innerText = "";
            api_key = event.target.value;
            if (api_key === "") {
              document.getElementById("api_small").innerText =
                "ERROR: Invalid Input";
              document.getElementById("api_small").style = "color:red";
            }
          });
        document.getElementById("API_key").required = true;
      }
    };

    request.onerror = (event) => {
      console.log(target.event.error);
    };
  };
}

window.onload = (e) => {
  hasKey();
};

// get the search type from the radio buttons
let search_type = "";
function select_search(event) {
  let search_input_text = "";
  if (event.target.matches("input[id='name']")) {
    search_type = "?t=";
    search_input_text = "Enter the movie name: ";
  } else {
    search_type = "?i=";
    search_input_text = "Enter the IMDB ID: ";
  }
  document.getElementById("search-input-label").innerText = search_input_text;
}

let imdb_id = document
  .getElementById("imdb_id")
  .addEventListener("click", select_search);

let movie_name = document
  .getElementById("name")
  .addEventListener("click", select_search);

// get search input
let search_value = "";
let movie_info = document
  .getElementById("search-input")
  .addEventListener("input", function (event) {
    search_value = encodeURIComponent(event.target.value);
    search_value = search_value.replaceAll("%20", "+");
    if (search_value === "") {
      document.getElementById("input-small").innerText = "ERROR: Invalid Input";
      document.getElementById("input-small").style = "color:Red";
    } else {
      document.getElementById("input-small").innerText = "";
    }
  });

// get year
let year = "";
document.getElementById("year").addEventListener("change", function (event) {
  let num = event.target.value;
  if (num !== null && num >= 1928 && num <= 2022) {
    year = "&y=" + num;
  } else {
    year = "";
  }
});

// get plot length
let plot = "";
document.getElementById("plot").addEventListener("change", function (event) {
  if (event.target.value === "full") {
    plot = "&plot=full";
  } else {
    plot = "";
  }
});

// create place to put search results and poster image on the page
let searchResults = document.createElement("div");
searchResults.setAttribute("id", "searchResults");

// fetch results upon pressing the submit button
let form = document
  .getElementById("form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // prevents page from reloading upon submit
    // clears any previous data for a clean slate
    let resultDiv = document.getElementById("results");

    while (resultDiv.firstChild) {
      resultDiv.removeChild(resultDiv.firstChild);
    }

    fetch(
      "https://www.omdbapi.com/" +
        search_type +
        search_value +
        year +
        plot +
        "&apikey=" +
        api_key
    )
      .then((result) => result.json())
      .then((output) => {
        if (output["Response"] === "True") {
          let newMovie = new SingleMovie(`${output["imdbID"]}`);
          newMovie.setMovieFeatures(
            output["Title"],
            output["Year"],
            output["Rated"],
            output["Released"],
            output["Poster"]
          );
          console.log("first line");
          resultDiv.appendChild(newMovie.getSingleMovieHTML());

          // add working apikey to the indexeddb
          let db2;
          const db2Request = indexedDB.open(DB_NAME, 2);

          db2Request.onerror = (event) => {
            // Generic error handler for all errors targeted at this database's
            // requests!
            console.error(`Database error: ${event.target.errorCode}`);
          };
          console.log(db2Request);

          db2Request.onsuccess = (event) => {
            db2 = event.target.result;
            const transaction2 = db2.transaction(["apikey"], "readwrite");
            const favoriteStore2 = transaction2.objectStore("apikey");
            const request2trans = favoriteStore2.openCursor(api_key);
            request2trans.onsuccess = (event) => {
              let cursor = event.target.result;
              if (cursor === null) {
                let item = [{ key: api_key }];
                favoriteStore2.add(item[0]);
              }
            };
          };
        } else {
          resultDiv.textContent = "ERROR: " + output["Error"];
          let image = document.createElement("img");
          image.src = "default_poster.png";
          resultDiv.appendChild(document.createElement("br"));
          resultDiv.appendChild(image);
        }
      })
      .catch((err) => {
        resultDiv.textContent = "ERROR in catch " + err;
        let image = document.createElement("img");
        image.src = "default_poster.png";
        resultDiv.appendChild(document.createElement("br"));
        resultDiv.appendChild(image);
      });
    if (api_key !== "") {
      document.getElementById("API_key_p").hidden = true;
    }
  });

class SingleMovie extends HTMLElement {
  constructor(IMDBID) {
    super();
    this.title = "";
    this.year = "";
    this.rating;
    this.releaseDate;
    this.posterIMG = "";
    this.favorite = false;
    this.movieNoteText = "";
    this.IMDBID = IMDBID;

    // create div to hold movie features
    this.movieDiv = document.createElement("div");
    this.movieDiv.setAttribute("id", this.IMDBID);
    this.movieDiv.setAttribute("class", "singleMovie");

    this.titleYearP = document.createElement("p");
    this.titleYearP.setAttribute("id", `titleYear-${this.IMDBID}`);
    this.titleYearP.setAttribute("class", "singleMovie");

    this.poster = document.createElement("img");
    this.poster.setAttribute("id", `poster-${this.IMDBID}`);
    this.poster.setAttribute("class", "singleMovie");

    this.ratingRelease = document.createElement("p");
    this.ratingRelease.setAttribute("id", `ratingRelease-${this.IMDBID}`);
    this.ratingRelease.setAttribute("class", "singleMovie");

    this.favoriteBox = document.createElement("input");
    this.favoriteBox.setAttribute("type", "checkbox");
    this.favoriteBox.setAttribute("id", `favoriteBox-${this.IMDBID}`);
    this.favoriteBox.setAttribute("class", "singleMovie");
    this.dbContainsMovie();

    this.favoriteBoxLabel = document.createElement("label");
    this.favoriteBoxLabel.setAttribute("for", `favoriteBox-${this.IMDBID}`);
    this.favoriteBoxLabel.innerText = "Add to favorites";

    this.favoriteBox.addEventListener("change", (e) => {
      let db2;
      const db2Request = indexedDB.open(DB_NAME, 2);

      db2Request.onerror = (event) => {
        // Generic error handler for all errors targeted at this database's
        // requests!
        console.error(`Database error: ${event.target.errorCode}`);
      };
      console.log(db2Request);

      if (this.favoriteBox.checked) {
        this.favorite = true;
        // start the indexedDB

        db2Request.onsuccess = (event) => {
          db2 = event.target.result;
          const transaction2 = db2.transaction(["favorites"], "readwrite");
          const favoriteStore2 = transaction2.objectStore("favorites");
          const item = [
            {
              poster: this.posterIMG,
              favorite: true,
              movieNoteText: this.movieNoteText,
              IMDBID: this.IMDBID,
              title: this.title,
              year: this.year,
              rating: this.rating,
              releaseDate: this.releaseDate,
            },
          ];
          this.movieNote.innerText = this.movieNoteText;
          const request2trans = favoriteStore2.put(item[0]);
          request2trans.onsuccess = (event) => {
            console.log("successfully added " + this.title + " to favorites");
          };
        };
      } else {
        this.favorite = false;
        db2Request.onsuccess = (event) => {
          db2 = event.target.result;
          const transaction2 = db2.transaction(["favorites"], "readwrite");
          const favoriteStore2 = transaction2.objectStore("favorites");
          const request2trans = favoriteStore2.delete(this.IMDBID);
          request2trans.onsuccess = (event) => {
            console.log(
              "successfully deleted " + this.title + " from favorites"
            );
          };
        };
      }
    });

    this.showMovieNote = document.createElement("button");
    this.showMovieNote.setAttribute("type", "button");
    this.showMovieNote.innerText = "Show Notes";
    this.showMovieNote.setAttribute("class", "singleMovie");
    this.showMovieNote.addEventListener("click", (e) => {
      if (this.movieNote.hidden) {
        this.movieNote.hidden = false;
        this.movieNoteButton.hidden = false;
        this.showMovieNote.innerText = "Hide note";
      } else {
        this.movieNote.hidden = true;
        this.movieNoteButton.hidden = true;
        this.showMovieNote.innerText = "Show note";
      }
    });

    this.movieNote = document.createElement("textarea");
    this.movieNote.setAttribute("id", `movieNote-${this.IMDBID}`);
    this.movieNote.setAttribute("class", "singleMovie");
    this.movieNote.addEventListener("input", autoResize, false);
    this.movieNote.hidden = true;
    function autoResize() {
      this.style.height = "auto";
      this.style.height = this.scrollHeight + "px";
    }

    this.movieNoteButton = document.createElement("button");
    this.movieNoteButton.setAttribute("type", "button");
    this.movieNoteButton.setAttribute("id", `movieNoteButton-${this.IMDBID}`);
    this.movieNoteButton.setAttribute("class", "singleMovie");
    this.movieNoteButton.hidden = true;
    this.movieNoteButton.innerText = "Save note";
    this.movieNoteButton.addEventListener("click", (e) => {
      let text = this.movieNote.value;
      this.movieNoteText = text;
      this.movieNote.innerText = text;
      let db2;
      const db2Request = indexedDB.open(DB_NAME, 2);

      // update indexeddb with new note
      db2Request.onerror = (event) => {
        // Generic error handler for all errors targeted at this database's
        // requests!
        console.error(`Database error: ${event.target.errorCode}`);
      };
      console.log(db2Request);
      if (this.favorite) {
        db2Request.onsuccess = (event) => {
          db2 = event.target.result;
          const transaction2 = db2.transaction(["favorites"], "readwrite");
          const favoriteStore2 = transaction2.objectStore("favorites");
          const item = [
            {
              poster: this.posterIMG,
              favorite: true,
              movieNoteText: this.movieNoteText,
              IMDBID: this.IMDBID,
              title: this.title,
              year: this.year,
              rating: this.rating,
              releaseDate: this.releaseDate,
            },
          ];
          const request2trans = favoriteStore2.put(item[0]);
          request2trans.onsuccess = (event) => {
            console.log("successfully added " + this.title + " to favorites");
          };
        };
      }
      console.log(this.movieNoteText);
    });

    this.movieDiv.appendChild(this.titleYearP);
    this.movieDiv.appendChild(this.poster);
    this.movieDiv.appendChild(this.ratingRelease);
    this.movieDiv.appendChild(this.movieNote);
    this.movieDiv.appendChild(document.createElement("br"));
    this.movieDiv.appendChild(this.movieNoteButton);
    this.movieDiv.appendChild(this.showMovieNote);
    this.movieDiv.appendChild(document.createElement("br"));
    this.movieDiv.appendChild(this.favoriteBox);
    this.movieDiv.appendChild(this.favoriteBoxLabel);
  }

  dbContainsMovie() {
    let db;
    const dbRequest = indexedDB.open(DB_NAME, 2);

    dbRequest.onerror = (event) => {
      // Generic error handler for all errors targeted at this database's
      // requests!
      console.error(`Database error: ${event.target.errorCode}`);
    };
    console.log(dbRequest);

    dbRequest.onsuccess = (event) => {
      db = event.target.result;
      const transaction = db.transaction(["favorites"]);
      const favoriteStore = transaction.objectStore("favorites");
      const request = favoriteStore.openCursor(this.IMDBID);
      request.onsuccess = (event) => {
        let cursor = event.target.result;
        console.log(cursor);
        if (cursor !== null) {
          this.favorite = true;
          this.favoriteBox.checked = true;
        } else {
          this.favoriteBox.checked = false;
        }
        console.log("favorie? " + this.favorite);
      };

      request.onerror = (event) => {
        console.log(target.event.error);
      };
    };
  }

  getSingleMovieHTML() {
    return this.movieDiv;
  }

  setMovieFeatures(title, year, rating, releaseDate, posterIMG) {
    this.title = title;
    this.year = year;
    this.titleYearP.innerText = `${this.title} (${this.year})`;

    this.rating = rating;
    this.releaseDate = releaseDate;
    this.ratingRelease.innerText = `Rating: ${this.rating}  Release Date: ${this.releaseDate}`;

    if (posterIMG) {
      this.posterIMG = posterIMG;
    } else {
      this.posterIMG = "./default_poster.png";
    }
    this.poster.setAttribute("src", posterIMG);
  }

  isFavorite(bool) {
    this.favorite = bool;
    this.favoriteBox.checked = this.favorite;
  }

  setMovieNoteText(text) {
    this.movieNoteText = text;
    this.movieNote.innerText = text;
  }

  getTitle() {
    return this.title;
  }

  getIMDBID() {
    return this.IMDBID;
  }
}

// Define the new element
customElements.define("single-movie", SingleMovie);
