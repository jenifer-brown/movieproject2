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
    titleP.setAttribute("id", `titleYear-${this.IMDBID}`);
    titleP.setAttribute("class", "singleMovie");

    this.poster = document.createElement("img");
    poster.setAttribute("id", `poster-${this.IMDBID}`);
    this.poster.setAttribute("class", "singleMovie");

    this.ratingRelease = document.createElement("p");
    this.ratingRelease.setAttribute("id", `ratingRelease-${this.IMDBID}`);
    this.ratingRelease.setAttribute("class", "singleMovie");

    this.favoriteBox = document.createElement("input");
    this.favoriteBox.setAttribute("type", "checkbox");
    this.favoriteBox.setAttribute("id", `favoriteBox-${this.IMDBID}`);
    this.favoriteBox.setAttribute("class", "singleMovie");
    this.favoriteBox.checked = this.favorite;
    this.favoriteBox.addEventListener("change", (e) => {
      if (this.favoriteBox.checked) {
        this.favorite = true;
      } else {
        this.favorite = false;
      }
    });

    this.movieNote = document.createElement("textarea");
    this.movieNote.setAttribute("id", `movieNote-${this.IMDBID}`);
    this.movieNote.setAttribute("class", "singleMovie");
    this.movieNote.addEventListener("input", autoResize, false);
    function autoResize() {
      this.style.height = "auto";
      this.style.height = this.scrollHeight + "px";
    }

    this.movieNoteButton = document.createElement("button");
    this.movieNoteButton.setAttribute("type", "button");
    this.movieNoteButton.setAttribute("id", `movieNoteButton-${this.IMDBID}`);
    this.movieNoteButton.setAttribute("class", "singleMovie");
    this.movieNoteButton.innerText = "Save note";
    this.movieNoteButton.addEventListener("click", (e) => {
      let text = this.movieNote.value;
      this.movieNoteText = text;
    });

    this.movieDiv.appendChild(this.titleYearP);
    this.movieDiv.appendChild(this.poster);
    this.movieDiv.appendChild(this.ratingRelease);
    this.movieDiv.appendChild(this.movieNote);
    this.movieDiv.appendChild(this.movieNoteButton);
    this.movieDiv.appendChild(this.favoriteBox);
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

  getMovieNoteText() {
    return this.movieNoteText;
  }

  getTitle() {
    return this.title;
  }

  getIMDBID() {
    return this.IMDBID;
  }
}

// Define the new element
customElements.define("singlemovie", SingleMovie);
