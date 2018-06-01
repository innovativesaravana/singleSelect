import React, { Component } from 'react';
import _ from 'lodash';

export default class SingleSelect extends Component {

  constructor(props) {
    super(props);
    let options = ['Wilbert','Lily','Annalee','Lenita','Annetta','Alonso','Rory','Carola'];
    this.state = {
      options: options,
      selectedOption: ""
    };
  }

  optionClicked = (option) => {
    this.setState({
      selectedOption: option
    });
  }


  render() {
    return (
      <div>
      <button className="firstButton"/>
      <div className="dropdown container"></div>
        <div className='scrollContainer'>
          <input className="searchBox" autofocus="autofocus" placeholder="Find Users/Graphs..."></input>
          <span className="searchIcon">&#128269;</span>
          <ul>
          {
            _.map(this.state.options, option => {
              return <li onClick={() => this.optionClicked(option)} key={option}><label>{option}</label></li>
            })
          }
          </ul>
        </div>
      </div>
    );
  }
}
