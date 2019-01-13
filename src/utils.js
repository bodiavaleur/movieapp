export function getMovieData() {
  /* Get JSON object with movie data from TMDB API */
  const key = '61ebd99718473b328b06d99fe53a89df';
  let xhttp = new XMLHttpRequest();
  let randId = Math.round(Math.random() * 995);

  xhttp.open(
    'GET',
    `https://api.themoviedb.org/3/movie/${randId}?api_key=${key}&language=en-US`,
    false
  );

  xhttp.onload = function() {
    if (this.status === 200 && this.readyState === 4) {
      return this;
    }
  };

  xhttp.send();

  // Status Code - 34 : Resource Not Found
  // If movie can't be founded - call the function again, so it generate a new movie
  if (JSON.parse(xhttp.response).status_code === 34) {
    return getMovieData();
  }

  return JSON.parse(xhttp.response);
}
