import React, { Component } from 'react';
import _ from 'lodash';

export const Group =(props) => {
  return(
    <div>
    {
      (props.name === "undefined") ? (
        false
      ) : (
        <h5>{props.name}</h5>
      )
    }
      <ul className="list">
      {
        _.map(_.map(props.values, 'name'), option => {
          return <Option option={option} obj={props.obj}/>;
        })
      }
      </ul>
    </div>
  )
}

export const Option =(props) => {
  var options = props.obj.state.filteredOptions
  var index = props.obj.state.currentOptionIndex
  var isActive = (options[index] === props.option) ? "active" : "";
  return(
    <li
      className={`option ${isActive}`}
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
    var options = [];
    let data = props.values;
    var isGrouped = false;
    var groupData = [];
    if(typeof(_.first(data)) === "string") {
      var options = data;
    } else if (typeof(_.first(data)) === "object") {
      var options = _.map(data, 'name');
      var groupData = _.groupBy(data, 'group');
      var isGrouped = true;
      var options = _.map(_.flatten(_.reverse(_.values(groupData))), 'name');
    }


    this.state = {
      options: options,
      data: data,
      filteredOptions: options,
      isGrouped: isGrouped,
      groupData: groupData,
      isVisible: false,
      indictor: '\u25BC',
      displayProp: 'none',
      currentOptionIndex: 0,
      selectedOption: "Select a name"
    };
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.dropdownListener);
    document.addEventListener("mouseup", this.focusListener);
    document.addEventListener("keyup", this.focusListener);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.dropdownListener);
    document.addEventListener("mouseup", this.focusListener);
    document.addEventListener("keyup", this.focusListener);
  }

  dropdownListener = (e) => {
    if (this.refs["dropdownContainer"].contains(e.target)) {
      if (!this.state.isVisible) {
         this.showDropdown()
      } else {
        this.hideDropdown()
        }
      } else {
        if (this.refs["searchBox"].contains(e.target)) {
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

   focusListener = e => {
     if (this.state.isVisible) {
       document.getElementsByClassName("searchBox")[0].focus()
     } else {
       document.getElementsByClassName("firstButton")[0].focus()
     }
   }

   handleInputTextChange = e => {
     const input = e.target.value;
     let defaultOptions = this.state.options;
     let isGrouped = (typeof(_.first(this.state.data)) === "object")
     let filteredOptions = _.flatten(defaultOptions).filter(function(option) { return  option.toLowerCase().includes(input.toLowerCase()); });
     if (input === "") {
       this.setState({
         filteredOptions : defaultOptions,
         isGrouped: isGrouped
       });
     } else {
       this.setState({
         filteredOptions : filteredOptions,
         isGrouped: false
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

       <div className="dropdownContainer" ref={"searchBox"} style={{'position': 'absolute', 'left': '40%', 'top': '119', 'display': this.state.displayProp}}>
         <div className="search" ref={"searchBox"}>
           <input ref='nameInputField' className="searchBox" onKeyDown={this.keyDownPressed} placeholder="Find Users/Groups..." onChange={this.handleInputTextChange}></input>
           <span className="searchIcon">&#128269;</span>
         </div>
            {
              (this.state.isGrouped) ? (
                // _.map(this.state.groupData ,(values,groupName)=>{
                //   return <Group name={groupName} values={values} obj={this}/>
                // })
                _.map(_.reverse(_.keys(this.state.groupData)) ,groupName=>{
                 return <Group name={groupName} values={this.state.groupData[groupName]} obj={this}/>
               })
              ) : (
                <ul className="list" ref={"optionLabel"}>
                {
                  _.map(this.state.filteredOptions, option => {
                    return <Option option={option} obj={this}/>;
                  })
                }
                </ul>
              )
            }
       </div>
       </div>
     );
   }
}

// _.filter(data, function(d) { return (_.keys(d).includes("group"))})

// let options = this.state.filteredOptions
// let index = this.state.currentOptionIndex
// let isActive = (options[index] === option) ? "active" : "";
// return <Option isActive={isActive} option={option} obj={this}/>;
