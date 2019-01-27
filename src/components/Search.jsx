import React from 'react';

export default class Search extends React.Component {
  render() {
    return (
      <div className='row'>
        <div className='col-xs-1 mx-auto my-4'>
          <input
            type='text'
            placeholder='Search'
            className='search'
            onClick={e => {
              e.target.value = this.props.query;
              this.props.onClickSearch(e);
            }}
            onChange={e => {
              this.props.onChangeEvent(e.target.value);
            }}
          />
        </div>
      </div>
    );
  }
}
