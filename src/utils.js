function request(section, sectionOpt, content = '') {
  const key = '61ebd99718473b328b06d99fe53a89df';
  const url = `https://api.themoviedb.org/3/${section}/${sectionOpt}?api_key=${key}${content}`;
  return fetch(url)
    .then(res => res.json())
    .then(res => {
      if (res.status_code === 34) {
        return request(section, Math.round(Math.random() * 10000));
      } else if (res.status_code === 25) {
        return alert(res.status_message);
      }

      return res;
    });
}

export async function getMovieData(movieName) {
  return await request('movie', movieName, '&append_to_response=keywords');
}

export async function searchMovie(movieName) {
  return await request('search', 'movie', `&query=${movieName}`);
}

export async function searchMovieByTags(movieName, tagId) {
  if (!tagId) {
    movieName = movieName.split('#')[1].replace(' ', '%20');
    await request('search', 'keyword', `&query=${movieName}`).then(
      res => (tagId = res.results[0].id)
    );
  }
  return await request('keyword', `${tagId}/movies`);
}

export async function getVideo(movId) {
  return await request('movie', `${movId}/videos`);
}

export async function findMovieBy(vote = false, genres = '', page = false) {
  return await request(
    'discover',
    `movie`,
    `&page=${page}&vote_average.gte=${vote}&vote_count.gte=100&with_genres=${genres}`
  );
}

export function getGenresList() {
  return request('genre', 'movie/list');
}
