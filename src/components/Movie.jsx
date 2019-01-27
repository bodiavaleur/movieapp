import React from 'react';
import YouTube from 'react-youtube';
import { getGenresList } from '../utils';

export default class Movie extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showTags: false,
      showVideo: false,
      showSettings: false,
      videoData: null,
      genres: []
    };
  }

  handleClickNext() {
    return () => {
      this.props.clickNext();
      this.setState({
        showTags: false,
        showSettings: false,
        showVideo: false
      });
    };
  }

  toggleTags() {
    return () => {
      this.setState({ showTags: !this.state.showTags, showSettings: false });
    };
  }

  toggleSettings() {
    return () => {
      this.setState({
        showSettings: !this.state.showSettings,
        showTags: false
      });
    };
  }

  hideVideo() {
    this.setState({ showVideo: false });
  }

  poster() {
    return (
      <div className='col-xs col-lg-6 my-4 d-md-flex justify-content-center'>
        <img
          className='img-thumbnail boxshadow'
          src={this.props.poster_path}
          alt='poster'
          onClick={this.handleClickNext()}
          id='moviePoster'
        />
      </div>
    );
  }

  movieDetails() {
    return (
      <div className='row' id='movieDetails'>
        <div className='col'>
          <h1 className='my-4 text-xs-center'>
            {this.props.title + ` (${this.props.release_date.split('-')[0]})`}
          </h1>
          <hr />
          <div className='details mb-4'>
            <span id='votes' className='mr-3'>
              <i className='fas fa-star text-warning' />
              {this.props.vote_average} {`(${this.props.vote_count})`}
            </span>
            <span id='genres'>
              {this.props.genres.map(genre => genre.name).join(', ')}
            </span>
            <p className='mt-4'>{this.props.overview}</p>
          </div>
        </div>
      </div>
    );
  }

  moviePrefs() {
    const isTagsAvailable = !!this.props.keywords;
    const vdata = () => {
      return this.props.video_data.then(res =>
        this.setState({ videoData: res, showVideo: !this.state.showVideo })
      );
    };

    return (
      <div className='row' id='moviePrefs'>
        <div className='col'>
          <button>
            <a
              className='btn'
              href={`https://www.imdb.com/title/${this.props.imdb_id}/`}
              target='_blank'
              rel='noopener noreferrer'>
              <i className='fab fa-imdb' />
            </a>
          </button>
          <button
            className={isTagsAvailable ? 'btn' : 'btn disabled'}
            onClick={this.toggleTags()}>
            <i className='fas fa-hashtag' />
          </button>
          <button className='btn' onClick={() => vdata()}>
            <i className='fas fa-film' />
          </button>
          <button className='btn' onClick={this.toggleSettings()}>
            <i className='fas fa-cog' />
          </button>
        </div>
      </div>
    );
  }

  renderKeywords() {
    if (this.props.keywords) {
      const keywords = this.props.keywords.keywords.map(kw => {
        const tag = '#' + kw.name;
        return (
          <label className='chbox m-1'>
            <input
              id='chbox'
              type='checkbox'
              onChange={e => this.props.clickTag(tag, kw.id)}
            />
            <span className='kw p-1'>{tag}</span>
          </label>
        );
      });
      return <div className='transparency p-2'>{keywords}</div>;
    }
  }

  renderVideo() {
    if (this.state.videoData.results.length !== 0) {
      return (
        <YouTube
          className='embed-responsive yt-border boxshadow'
          videoId={this.state.videoData.results[0].key}
          opts={{ width: '480', height: '360' }}
        />
      );
    }

    return (
      <div className='alert alert-dark' role='alert'>
        Trailer is not available
      </div>
    );
  }

  renderSettings() {
    const content = (
      <form className='form-settings'>
        <input
          onChange={e => this.props.setRange(e.target.value)}
          type='range'
          min='3'
          max='8'
          value={this.props.voteRange}
          className='custom-range w-50'
          id='vote-range'
        />
        <div>
          Show movies greater than <b>{this.props.voteRange}</b>
          <i className='fas fa-star text-warning ml-1' />
        </div>
      </form>
    );
    console.log(this.props.genresList);
    const genres = (
      <div>
        {this.state.genres.genres.map(el => (
          <button
            className={
              this.props.genresList === el.id ? 'btn btn-selected' : 'btn'
            }
            onClick={() => this.props.setGenresList(el.id)}>
            {el.name}
          </button>
        ))}
        <button className='btn' onClick={() => this.props.setGenresList('')}>
          All
        </button>
      </div>
    );

    return (
      <div className='transparency m-4 p-3' id='settings'>
        {content}
        {genres}
      </div>
    );
  }

  async getGenres() {
    return await this.setState({
      genres: await getGenresList().then(res => res)
    });
  }

  componentDidMount() {
    this.getGenres();
  }

  render() {
    return (
      <div>
        <div className='row'>
          <div
            className='bg'
            style={{ backgroundImage: `url(${this.props.poster_path})` }}
          />
          {this.poster()}
          <div className='col movie-info transparency boxshadow my-4 '>
            {this.movieDetails()}
            {this.moviePrefs()}
          </div>
        </div>
        <div className='row'>
          <div className='col-lg-6'>
            {this.state.showVideo ? this.renderVideo() : null}
          </div>
          <div className='col-lg-6'>
            {this.state.showSettings ? this.renderSettings() : null}
            {this.state.showTags ? this.renderKeywords() : null}
            {this.state.showPrefs ? this.renderPrefs() : null}
          </div>
        </div>
      </div>
    );
  }
}
