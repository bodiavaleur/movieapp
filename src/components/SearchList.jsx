import React from 'react';

export default class SearchList extends React.Component {
  render() {
    try {
      const data = this.props.data.results.map(movie => (
        <li
          className='list-group-item transparency mb-4 boxshadow sl-item'
          onClick={this.props.onClickEvent(movie.id)}>
          <img
            id='img-list'
            className='img-thumbnail boxshadow float-left mr-4'
            src={'http://image.tmdb.org/t/p/w200' + movie.poster_path}
            alt={'NO POSTER'}
          />
          <h4>{movie.title}</h4>
          <p>{movie.overview}</p>
        </li>
      ));
      return <ul className='list-group'>{data}</ul>;
    } catch (err) {
      return;
    }
  }
}
