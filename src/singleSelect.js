import React, { Component } from 'react';
import _ from 'lodash';

export default class SingleSelect extends Component {

  constructor(props) {
    super(props);
    let options = ['Wilbert','Lily','Annalee','Lenita','Annetta','Alonso','Rory','Carola'];
    this.state = {
      options: options,
    };
  }


  render() {
    return (
      <div>
      <div className="dropdown container"></div>
        <input className="searchBox" autofocus="autofocus" placeholder="Find Users/Graphs..."></input>
        <span className="searchIcon">&#128269;</span>
        <ul>
        {
          _.map(this.state.options, option => {
            return <li key={option}><label>{option}</label></li>
          })
        }
        </ul>
      </div>
    );
  }
}
