import React from 'react';
import {
  getMovieData,
  searchMovie,
  searchMovieByTags,
  findMovieBy,
  getVideo,
  getGenresList
} from '../utils';
import '../main.css';
import Search from './Search';
import SearchList from './SearchList';
import Movie from './Movie';

class MovieApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movieData: undefined,
      showMovie: true,
      showSearchList: false,
      searchData: null,
      searchQuery: '',
      voteRange: 5,
      pages: 0,
      genresList: ''
    };

    this.getNextMovie = this.getNextMovie.bind(this);
    this.onClickSearch = this.onClickSearch.bind(this);
    this.performSearch = this.performSearch.bind(this);
    this.selectMovie = this.selectMovie.bind(this);
    this.toggleSearch = this.toggleSearch.bind(this);
    this.setVoteRange = this.setVoteRange.bind(this);
    this.setGenresList = this.setGenresList.bind(this);
  }

  getNextMovie() {
    let next = async () => {
      let page = Math.round(Math.random() * this.state.pages);
      page = page <= 0 ? 1 : page;
      let movieList = await findMovieBy(
        this.state.voteRange,
        this.state.genresList,
        page
      ).then(res => res);
      let pickMovie = Math.round(Math.random() * movieList.results.length - 1);
      pickMovie = pickMovie < 0 ? 0 : pickMovie;
      const data = await getMovieData(movieList.results[pickMovie].id).then(
        res => res
      );
      this.setState({
        movieData: data,
        pages: movieList.total_pages,
        showMovie: true,
        showSearchList: false
      });
    };

    return next;
  }

  setVoteRange() {
    return async range => {
      this.setState({ voteRange: range, pages: 0 });
    };
  }

  setGenresList() {
    return genre =>
      this.setState({
        genresList: genre,
        pages: 0
      });
  }

  async getGenres() {
    return getGenresList().then(res => res);
  }

  selectMovie(name) {
    return async () => {
      this.setState({
        movieData: await getMovieData(name).then(res => res),
        showMovie: !this.state.showMovie,
        showSearchList: !this.state.showSearchList
      });
    };
  }

  renderMovieDetails() {
    if (!this.state.movieData) {
      return null;
    }

    if (this.state.showMovie) {
      let data = this.state.movieData;
      let poster = 'http://image.tmdb.org/t/p/w500' + data.poster_path;
      return (
        <Movie
          id={data.id}
          video_data={getVideo(data.id)}
          poster_path={poster}
          title={data.title}
          imdb_id={data.imdb_id}
          release_date={data.release_date}
          vote_average={data.vote_average}
          vote_count={data.vote_count}
          genres={data.genres}
          overview={data.overview}
          keywords={data.keywords}
          clickNext={this.getNextMovie()}
          clickTag={this.performSearch()}
          setRange={this.setVoteRange()}
          setGenresList={this.setGenresList()}
          genresList={this.state.genresList}
          voteRange={this.state.voteRange}
        />
      );
    }

    return null;
  }

  renderSearch() {
    if (this.state.showSearchList) {
      return (
        <SearchList
          data={this.state.searchData}
          onClickEvent={this.selectMovie}
        />
      );
    }

    return null;
  }

  performSearch() {
    return async (movieName, tagId = false) => {
      // If search contain text - show search, otherwise - hide
      const showSearch = { showMovie: false, showSearchList: true };
      const hideSearch = { showMovie: true, showSearchList: false };
      const toggle = movieName ? showSearch : hideSearch;

      if (/#\w+/gi.test(movieName)) {
        return this.setState({
          searchData: await searchMovieByTags(movieName, tagId).then(
            res => res
          ),
          showSearchList: true,
          showMovie: false,
          searchQuery: movieName
        });
      } else if (/^#$/.test(movieName) || /^\s$/.test(movieName)) {
        return;
      } else {
        return this.setState({
          searchData: await searchMovie(movieName).then(res => res),
          searchQuery: movieName,
          ...toggle
        });
      }
    };
  }

  onClickSearch() {
    return e => {
      if (e.target.value) {
        this.toggleSearch();
      }
    };
  }

  toggleSearch() {
    return this.setState({
      showMovie: !this.state.showMovie,
      showSearchList: !this.state.showSearchList
    });
  }

  componentDidMount() {
    this.getNextMovie()();
  }

  render() {
    return (
      <div className='container'>
        <Search
          onClickSearch={this.onClickSearch()}
          onChangeEvent={this.performSearch()}
          query={this.state.searchQuery}
        />
        {this.renderSearch()}
        {this.renderMovieDetails()}
      </div>
    );
  }
}

export default MovieApp;
