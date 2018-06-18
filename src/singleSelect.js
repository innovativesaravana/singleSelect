import React, { Component } from 'react';
import _ from 'lodash';

export const Option =(props) => {
  return(
    <li
      className={`option ${props.isActive}`}
      onMouseEnter={() => props.obj.optionHover(props.option)}
      onClick={() => props.obj.optionClicked(props.option)}
      key={props.option}
    >
      <label>
        {props.option}
      </label>
    </li>
  )
}

export default class SingleSelect extends Component {

  constructor(props) {
    super(props);
    let options = props.values;
    this.state = {
      options: options,
      filteredOptions: options,
      dropdownOpacity: 0,
      isVisible: false,
      currentOptionIndex: 0,
      selectedOption: "Select a name"
    };
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.dropdownListener);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.dropdownListener);
  }

  dropdownListener = (e) => {
    if (this.refs["dropdownContainer"].contains(e.target)) {
      if (!this.state.isVisible) {
         this.showDropdown()
      } else {
        this.hideDropdown()
        }
      } else {
        if (this.refs["list"].contains(e.target)) {
          this.showDropdown()
        } else {
          this.hideDropdown()
        }
    }
  }

   showDropdown = (e) => {
     this.setState({
       dropdownOpacity: 100,
       isVisible: true,
     });
   }

   hideDropdown = (e) => {
     this.setState({
       dropdownOpacity: 0,
       isVisible: false,
     });
   }

   optionClicked = (option) => {
     this.setState({
       selectedOption: option
     });
   }

   optionHover = (option) => {
     this.setState({
       currentOptionIndex: this.state.options.findIndex(e => e === option)
     });
   }

   handleInputTextChange = e => {
     const input = e.target.value;
     let defaultOptions = this.state.options;
     let filteredOptions = _.flatten(defaultOptions).filter(function(option) { return  option.toLowerCase().includes(input.toLowerCase()); });
     if (input === "") {
       this.setState({
         filteredOptions : defaultOptions
       });
     } else {
       this.setState({
         filteredOptions : filteredOptions
       });
     }
   }

   keyDownPressed = (e) => {
     let options = this.state.filteredOptions
     let options_length = options.length
     let isVisible = this.state.isVisible
     let currentOptionIndex = this.state.currentOptionIndex;
     // this.showDropdown()
     if(e.key === "ArrowDown") {
       if(!isVisible) {
        this.showDropdown()
      } else {
        let index = ((currentOptionIndex + 1) < options_length) ? (currentOptionIndex + 1) : (options_length - 1);
        this.setState({
          currentOptionIndex:  index
        });
        // changeIndex
      }
    } else if (e.key === "ArrowUp") {
      if(!isVisible) {
       return null;
     } else {
       let index = ((currentOptionIndex - 1) < 0) ? 0 : (currentOptionIndex - 1);
       this.setState({
         currentOptionIndex: index
       });
       // changeIndex
     }
   } else if (e.key === " ") {
     if(!isVisible) {
      return null;
    } else {
      // selectcurrentoption
      this.setState({
        selectedOption: options[currentOptionIndex]
      });
    }
  } else if (e.key === "Enter") {
    if(!isVisible) {
     this.showDropdown()
   } else {
     // selectcurrentoption
     this.setState({
       selectedOption: options[currentOptionIndex]
     });
   }
  } else if (e.key === "Escape") {
    this.hideDropdown()
  }
     }

  render() {
     return (
       <div>
       <div className="firstButton"
         tabIndex="0"
         onKeyDown={this.keyDownPressed}
         ref={"dropdownContainer"}>{this.state.selectedOption}
         <span className="indicator">&#9662;</span>
         </div>

       <div className="dropdownContainer" style={{'width': 'auto', 'position': 'absolute', 'left': '40%', 'top': '119', 'display': 'block', 'opacity':this.state.dropdownOpacity}}>
         <div className="search" ref={"list"}>
           <input className="searchBox" autoFocus="autofocus" onKeyDown={this.keyDownPressed} placeholder="Find Users/Graphs..." onChange={this.handleInputTextChange}></input>
           <span className="searchIcon">&#128269;</span>
         </div>
         <ul className="list">
           {
             _.map(this.state.filteredOptions, option => {
               let options = this.state.filteredOptions
               let index = this.state.currentOptionIndex
               let isActive = (options[index] === option) ? "active" : "";
               return <Option isActive={isActive} option={option} obj={this}/>;
             })
           }
        </ul>
       </div>
       </div>
     );
   }
}
