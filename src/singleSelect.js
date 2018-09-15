import React, { Component } from "react";
import _ from "lodash";

export const Group = props => {
  const {
    name,
    values,
    options,
    groupOptions,
    index,
    imgHash,
    optionHover,
    optionClicked
  } = props;
  return (
    <div className={`group ${name}`}>
      {name !== "undefined" && <h5>{name}</h5>}
      <ul className="list">
        {_.map(groupOptions, option => {
          return (
            <Option
              option={option}
              options={options}
              index={index}
              imgHash={imgHash}
              optionHover={optionHover}
              optionClicked={optionClicked}
            />
          );
        })}
      </ul>
    </div>
  );
};

export const Option = props => {
  const { option, options, index, imgHash, optionHover, optionClicked } = props;
  const isActive = options[index] === option ? "active" : "";
  const default_icon =
    "https://s3.amazonaws.com/rapidapi-prod-fe_static/images/unknown_user.png";
  const img = _.isNil(imgHash[option]) ? default_icon : imgHash[option];
  return (
    <li
      className={`option ${isActive}`}
      onMouseEnter={() => optionHover(option)}
      onClick={() => optionClicked(option)}
      key={option}
    >
      <img src={img} alt="Avatar" />
      <label className="optionLabel">{option}</label>
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
      selectedOption: []
    };
  }

  transformInputData = data => {
    if (
      _.every(data, x => {
        return typeof x === "string";
      })
    ) {
      return {
        options: data,
        filteredOptions: data,
        isGrouped: false,
        groupData: [],
        imgHash: {},
        groupsName: []
      };
    } else if (
      _.every(data, x => {
        return typeof x === "object";
      })
    ) {
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
      const groupsName = _.reverse(_.keys(groupData));
      return {
        options: options,
        filteredOptions: options,
        isGrouped: true,
        groupData: groupData,
        imgHash: imgHash,
        groupsName: groupsName
      };
    } else {
      alert("invalid input data given");
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
    const defaultOptions = this.state.options;
    const isGrouped = typeof _.first(this.state.data) === "object"; //for chanege display view while filtering
    const filteredOptions = _.flatten(defaultOptions).filter(function(option) {
      return _.includes(_.toLower(option), _.toLower(input));
    });
    if (input === "") {
      this.setState({
        filteredOptions: defaultOptions,
        isGrouped: isGrouped
      });
    } else {
      this.setState({
        filteredOptions: filteredOptions,
        isGrouped: false //to change list view
      });
    }
  };

  keyDownPressed = e => {
    const options = this.state.filteredOptions;
    const options_length = options.length;
    const isVisible = this.state.isVisible;
    const currentOptionIndex = this.state.currentOptionIndex;
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
    const filteredOptions = this.state.filteredOptions;
    const currentOptionIndex = this.state.currentOptionIndex;
    const imgHash = this.state.imgHash;
    const optionHover = this.optionHover;
    const optionClicked = this.optionClicked;
    return (
      <div>
        <div
          className="firstButton"
          tabIndex="0"
          onKeyDown={this.keyDownPressed}
          id="firstButton"
        >
          <lablel className="buttonLabel">
            {_.isEmpty(this.state.selectedOption)
              ? "Select a name"
              : this.state.selectedOption}
          </lablel>
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
              _.map(this.state.groupsName, groupName => {
                const groupData = this.state.groupData[groupName];
                const groupOptions = _.map(groupData, "name");
                return (
                  <Group
                    name={groupName}
                    values={groupData}
                    options={filteredOptions}
                    index={currentOptionIndex}
                    imgHash={imgHash}
                    optionHover={optionHover}
                    optionClicked={optionClicked}
                    groupOptions={groupOptions}
                  />
                );
              })
            ) : (
              <ul className="list">
                {_.map(this.state.filteredOptions, option => {
                  return (
                    <Option
                      option={option}
                      options={filteredOptions}
                      index={currentOptionIndex}
                      imgHash={imgHash}
                      optionHover={optionHover}
                      optionClicked={optionClicked}
                    />
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  }
}
