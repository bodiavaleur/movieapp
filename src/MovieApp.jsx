import React from 'react';
import { getMovieData } from './utils';
import './main.css';

class MovieApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movieData: getMovieData()
    };
  }

  searchMovie() {
    return () => {
      this.setState({ movieData: getMovieData() });
    };
  }

  render() {
    let data = this.state.movieData;
    let poster = 'http://image.tmdb.org/t/p/w500' + data.poster_path;
    return (
      <div className='container'>
        <div id='bg' style={{ backgroundImage: `url(${poster})` }} />
        {/* <div className='row'>
          <div className='col-xs-1 mx-auto my-4'>
            <input type='text' placeholder='Search' className='search' />
          </div>
        </div> */}
        <div className='row'>
          <div className='col-xs col-lg-6 my-4 d-md-flex justify-content-center'>
            <img
              className='img-thumbnail boxshadow'
              src={poster}
              onClick={this.searchMovie()}
            />
          </div>
          <div className='col movie-info boxshadow my-4 '>
            <h1 className='my-4 text-xs-center'>
              {data.title + ` (${data.release_date.split('-')[0]})`}
            </h1>
            <hr />
            <div className='details mb-4'>
              <span id='votes' className='mr-3'>
                <i className='fas fa-star text-warning' />
                {data.vote_average}
              </span>
              <span id='genres'>
                {data.genres.map(genre => genre.name).join(', ')}
              </span>
            </div>
            <p>{data.overview}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default MovieApp;
