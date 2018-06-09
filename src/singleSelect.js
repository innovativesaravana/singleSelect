import React, { Component } from 'react';
import _ from 'lodash';

export default class SingleSelect extends Component {

  constructor(props) {
      super(props);
      let options = props.values;
      this.state = {
        options: options,
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
         this.hideDropdown()
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

     keyDownPressed = (e) => {
       let options = this.state.options
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

       // if (_.isEmpty(options)) {
       //   return null;
       // } else if (e.key === "Enter") {
       //    if(this.state.dropdownOpacity == '0') {
       //     this.showDropdown
       //   } else {
       //     this.hideDropdown
       //   }
       // }
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
         <ul>
           {
             _.map(this.state.options, option => {
               let options = this.state.options
               let index = this.state.currentOptionIndex
               let isActive = (options[index] === option) ? "active" : "";
               return <li className={`option ${isActive}`} onMouseEnter={() => this.optionHover(option)} onClick={() => this.optionClicked(option)} key={option}><label>{option}</label></li>
             })
           }
        </ul>
       </div>
       </div>
     );
   }
}

// export default class SingleSelect extends Component {
//
//   constructor(props) {
//     super(props);
//     let options = ['Wilbert','Lily','Annalee','Lenita','Annetta','Alonso','Rory','Carola'];
//     this.state = {
//       options: options,
//       selectedOption: ""
//     };
//   }
//
//   componentDidMount() {
//      document.addEventListener("mousedown", this.hideListListener);
//    }
//
//    componentWillUnmount() {
//      document.removeEventListener("mousedown", this.hideListListener);
//    }
//
//    hideListListener = (e) => {
//      if (!this.refs["container"].contains(e.target)) {
//        this.hideDropdown()
//      }
//
//    }
//
//    showDropdown = (option) => {
//
//    }
//
//    hideDropdown = (option) => {
//
//    }
//
//   optionClicked = (option) => {
//     this.setState({
//       selectedOption: option
//     });
//   }
//
//
//   render() {
//     return (
//       <div>
//       <button className="firstButton"/>
//       <div className="dropdown container"></div>
//         <div className='scrollContainer'>
//           <input className="searchBox" autofocus="autofocus" placeholder="Find Users/Graphs..."></input>
//           <span className="searchIcon">&#128269;</span>
//           <ul>
//           {
//             _.map(this.state.options, option => {
//               return <li onClick={() => this.optionClicked(option)} key={option}><label>{option}</label></li>
//             })
//           }
//           </ul>
//         </div>
//       </div>
//     );
//   }
// }
