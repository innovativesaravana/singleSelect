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
      <label className="optionLabel">
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
      isVisible: false,
      indictor: '\u25BC',
      displayProp: 'none',
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
        if (this.refs["list"].contains(e.target)||this.refs["optionLabel"].contains(e.target)) {
          this.showDropdown()
        } else {
          this.hideDropdown()
        }
    }
  }

   showDropdown = (e) => {
     this.setState({
       displayProp: 'block',
       indictor: '\u25B2',
       isVisible: true,
     });
   }

   hideDropdown = (e) => {
     this.setState({
       displayProp: 'none',
       indictor: '\u25BC',
       isVisible: false,
     });
   }

   optionClicked = (option) => {
     this.setState({
       selectedOption: option
     });
     this.hideDropdown()
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
     if(e.key === "ArrowDown") {
       if(!isVisible) {
        this.showDropdown()
      } else {
        let index = ((currentOptionIndex + 1) < options_length) ? (currentOptionIndex + 1) : (options_length - 1);
        this.setState({
          currentOptionIndex:  index
        });
      }
    } else if (e.key === "ArrowUp") {
      if(!isVisible) {
       return null;
     } else {
       let index = ((currentOptionIndex - 1) < 0) ? 0 : (currentOptionIndex - 1);
       this.setState({
         currentOptionIndex: index
       });
     }
   } else if (e.key === " ") {
     if(!isVisible) {
      return null;
    } else {
      this.setState({
        selectedOption: options[currentOptionIndex]
      });
    }
  } else if (e.key === "Enter") {
    if(!isVisible) {
     this.showDropdown()
   } else {
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
         ref={"dropdownContainer"}>
         <lablel className="buttonLabel">{this.state.selectedOption}</lablel>
         <span className="indicator">{this.state.indictor}</span>
         </div>

       <div className="dropdownContainer" style={{'position': 'absolute', 'left': '40%', 'top': '119', 'display': this.state.displayProp}}>
         <div className="search" ref={"list"}>
           <input className="searchBox" autoFocus="autofocus" onKeyDown={this.keyDownPressed} placeholder="Find Users/Groups..." onChange={this.handleInputTextChange}></input>
           <span className="searchIcon">&#128269;</span>
         </div>
         <ul className="list" ref={"optionLabel"}>
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
