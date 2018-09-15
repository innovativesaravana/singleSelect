import React, { Component } from "react";
import _ from "lodash";

export const Group = props => {
  return (
    <div className={`group ${props.name}`}>
      {props.name === "undefined" ? false : <h5>{props.name}</h5>}
      <ul className="list">
        {_.map(_.map(props.values, "name"), option => {
          return <Option option={option} obj={props.obj} />;
        })}
      </ul>
    </div>
  );
};

export const Option = props => {
  var options = props.obj.state.filteredOptions;
  var index = props.obj.state.currentOptionIndex;
  var isActive = options[index] === props.option ? "active" : "";
  var default_icon =
    "https://s3.amazonaws.com/rapidapi-prod-fe_static/images/unknown_user.png";
  var img = _.isNil(props.obj.state.imgHash[props.option])
    ? default_icon
    : props.obj.state.imgHash[props.option];
  return (
    <li
      className={`option ${isActive}`}
      onMouseEnter={() => props.obj.optionHover(props.option)}
      onClick={() => props.obj.optionClicked(props.option)}
      key={props.option}
    >
      <img
        style={{
          height: "10%",
          width: "10%",
          borderRadius: "50%",
          marginTop: "4px"
        }}
        src={img}
        alt="Avatar"
      />
      <label className="optionLabel">{props.option}</label>
    </li>
  );
};

export default class SingleSelect extends Component {
  constructor(props) {
    super(props);

    const data = props.values;
    this.state = {
      ...this.transformInputData(data),
      data: data,
      isVisible: false,
      indictor: "\u25BC",
      currentOptionIndex: 0,
      containerClassName: "",
      selectedOption: "Select a name",
    };
  }

  transformInputData = data => {
    if (typeof _.first(data) === "string") {
      return {
        "options": data,
        "filteredOptions": data,
        "isGrouped": false,
        "groupData": [],
        "imgHash": {},
      };
    } else if (typeof _.first(data) === "object") {
      const groupData = _.groupBy(data, "group");
      const options = _.chain(groupData)
        .values()
        .reverse()
        .flatten()
        .map("name")
        .value();
      const img = _.chain(groupData)
        .values()
        .reverse()
        .flatten()
        .map("icon")
        .value();
      const imgHash = _.zipObject(options, img);
      return {
        "options": options,
        "filteredOptions": options,
        "isGrouped": true,
        "groupData": groupData,
        "imgHash": imgHash,
      };
    }
  };

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

  dropdownListener = e => {
    if (document.getElementById("firstButton").contains(e.target)) {
      if (!this.state.isVisible) {
        this.showDropdown();
      } else {
        this.hideDropdown();
      }
    } else {
      if (document.getElementById("dropdownContainer").contains(e.target)) {
        this.showDropdown();
      } else {
        this.hideDropdown();
      }
    }
  };

  showDropdown = e => {
    this.setState({
      containerClassName: "visible",
      indictor: "\u25B2",
      isVisible: true
    });
  };

  hideDropdown = e => {
    this.setState({
      containerClassName: "",
      indictor: "\u25BC",
      isVisible: false
    });
  };

  optionClicked = option => {
    this.setState({
      selectedOption: option
    });
    this.hideDropdown();
  };

  optionHover = option => {
    this.setState({
      currentOptionIndex: this.state.options.findIndex(e => e === option)
    });
  };

  focusListener = e => {
    if (this.state.isVisible) {
      document.getElementById("searchBox").focus();
      document.getElementsByClassName("scrollContainer")[0].scrollTop =
        this.state.currentOptionIndex * 10;
    } else {
      document.getElementById("firstButton").focus();
    }
  };

  handleInputTextChange = e => {
    const input = e.target.value;
    let defaultOptions = this.state.options;
    let isGrouped = typeof _.first(this.state.data) === "object";
    let filteredOptions = _.flatten(defaultOptions).filter(function(option) {
      return option.toLowerCase().includes(input.toLowerCase());
    });
    if (input === "") {
      this.setState({
        filteredOptions: defaultOptions,
        isGrouped: isGrouped
      });
    } else {
      this.setState({
        filteredOptions: filteredOptions,
        isGrouped: false
      });
    }
  };

  keyDownPressed = e => {
    let options = this.state.filteredOptions;
    let options_length = options.length;
    let isVisible = this.state.isVisible;
    let currentOptionIndex = this.state.currentOptionIndex;
    if (e.key === "ArrowDown") {
      if (!isVisible) {
        this.showDropdown();
      } else {
        let index =
          currentOptionIndex + 1 < options_length
            ? currentOptionIndex + 1
            : options_length - 1;
        this.setState({
          currentOptionIndex: index
        });
      }
    } else if (e.key === "ArrowUp") {
      if (!isVisible) {
        return null;
      } else {
        let index = currentOptionIndex - 1 < 0 ? 0 : currentOptionIndex - 1;
        this.setState({
          currentOptionIndex: index
        });
      }
    } else if (e.key === "Enter") {
      if (!isVisible) {
        this.showDropdown();
      } else {
        this.setState({
          selectedOption: options[currentOptionIndex]
        });
      }
    } else if (e.key === "Escape") {
      this.hideDropdown();
    }
  };

  render() {
    return (
      <div>
        <div
          className="firstButton"
          tabIndex="0"
          onKeyDown={this.keyDownPressed}
          id="firstButton"
        >
          <lablel className="buttonLabel">{this.state.selectedOption}</lablel>
          <span className="indicator">{this.state.indictor}</span>
        </div>

        <div
          className={`dropdownContainer ${this.state.containerClassName}`}
          id="dropdownContainer"
        >
          <div className="search">
            <input
              className="searchBox"
              id="searchBox"
              onKeyDown={this.keyDownPressed}
              placeholder="Type text to filter"
              onChange={this.handleInputTextChange}
            />
            <span className="searchIcon">&#128269;</span>
          </div>
          <div className="scrollContainer">
            {this.state.isGrouped ? (
              _.map(_.reverse(_.keys(this.state.groupData)), groupName => {
                return (
                  <Group
                    name={groupName}
                    values={this.state.groupData[groupName]}
                    obj={this}
                  />
                );
              })
            ) : (
              <ul className="list">
                {_.map(this.state.filteredOptions, option => {
                  return <Option option={option} obj={this} />;
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  }
}
