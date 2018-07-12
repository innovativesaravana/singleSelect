import React from "react";
import { shallow, mount } from "enzyme";
import SingleSelect from "../src/singleSelect";
import sinon from "sinon";
import _ from "lodash";

describe("general features", () => {
  let values = [
    "Wilbert",
    "Lily",
    "Annalee",
    "Lenita",
    "Annetta",
    "Alonso",
    "Rory",
    "Carola"
  ];

  let wrapper = mount(<SingleSelect values={values} />);

  it("should show a dropdown button", () => {
    expect(wrapper.find("div.firstButton")).to.have.length(1);
  });

  it("should display given options name", () => {
    let options = wrapper.find("li>label").map(op => op.text());
    expect(options).to.deep.equal([
      "Wilbert",
      "Lily",
      "Annalee",
      "Lenita",
      "Annetta",
      "Alonso",
      "Rory",
      "Carola"
    ]);
  });

  it("should save selected value on state", () => {
    wrapper.setState({
      options: [
        "Wilbert",
        "Lily",
        "Annalee",
        "Lenita",
        "Annetta",
        "Alonso",
        "Rory",
        "Carola"
      ]
    });
    let option = wrapper.find("li").filterWhere(n => n.text() == "Lily");
    option.simulate("click");
    expect(wrapper.state().selectedOption).to.eq("Lily");
  });

  it("should display selected options on button", () => {
    wrapper.setState({
      options: [
        "Wilbert",
        "Lily",
        "Annalee",
        "Lenita",
        "Annetta",
        "Alonso",
        "Rory",
        "Carola"
      ]
    });
    let option = wrapper.find("li").filterWhere(n => n.text() == "Lily");
    option.simulate("click");
    expect(wrapper.find(".firstButton lablel").text()).to.eq("Lily");
  });
});

describe("Keyboard functionalities", () => {
  let values = [
    "Wilbert",
    "Lily",
    "Annalee",
    "Lenita",
    "Annetta",
    "Alonso",
    "Rory",
    "Carola"
  ];

  it("pressing enter should open the dropdown", () => {
    let wrapper = mount(<SingleSelect values={values} />);
    expect(wrapper.state().isVisible).to.eq(false);
    wrapper.find(".firstButton").simulate("keyDown", { key: "Enter" });
    expect(wrapper.state().isVisible).to.eq(true);
  });

  it("pressing downarrow should open the dropdown", () => {
    let wrapper = mount(<SingleSelect values={values} />);
    expect(wrapper.state().isVisible).to.eq(false);
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowDown" });
    expect(wrapper.state().isVisible).to.eq(true);
  });

  it("pressing downarrow again should navigate down the option", () => {
    let wrapper = mount(<SingleSelect values={values} />);
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowDown" });
    expect(wrapper.find("li.active").text()).to.eq("Wilbert");
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowDown" });
    expect(wrapper.find("li.active").text()).to.eq("Lily");
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowDown" });
    expect(wrapper.find("li.active").text()).to.eq("Annalee");
  });

  it("pressing up again should navigate up the option", () => {
    let wrapper = mount(<SingleSelect values={values} />);
    wrapper.find(".firstButton").simulate("keyDown", { key: "Enter" });
    expect(wrapper.find("li.active").text()).to.eq("Wilbert");
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowDown" });
    expect(wrapper.find("li.active").text()).to.eq("Lily");
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowUp" });
    expect(wrapper.find("li.active").text()).to.eq("Wilbert");
  });

  it("pressing enter over the option should select", () => {
    let wrapper = mount(<SingleSelect values={values} />);
    wrapper.find(".firstButton").simulate("keyDown", { key: "Enter" });
    expect(wrapper.state().selectedOption).to.eq("Select a name"); // default text
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowDown" });
    expect(wrapper.find("li.active").text()).to.eq("Lily");
    expect(wrapper.state().selectedOption).to.eq("Select a name"); // default text
    wrapper.find(".firstButton").simulate("keyDown", { key: "Enter" });
    expect(wrapper.state().selectedOption).to.eq("Lily");
  });

  it("selecting option should not close the dropdown", () => {
    let wrapper = mount(<SingleSelect values={values} />);
    wrapper.find(".firstButton").simulate("keyDown", { key: "Enter" });
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowDown" });
    expect(wrapper.find("li.active").text()).to.eq("Lily");
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowDown" });
    expect(wrapper.find("li.active").text()).to.eq("Annalee");
    wrapper.find(".firstButton").simulate("keyDown", { key: "Enter" });
    expect(wrapper.state().selectedOption).to.eq("Annalee");
    expect(wrapper.state().isVisible).to.eq(true);
  });

  it("pressing escape should close the dropdown", () => {
    let wrapper = mount(<SingleSelect values={values} />);
    expect(wrapper.state().isVisible).to.eq(false);
    wrapper.find(".firstButton").simulate("keyDown", { key: "Enter" });
    expect(wrapper.state().isVisible).to.eq(true);
    wrapper.find(".firstButton").simulate("keyDown", { key: "Escape" });
    expect(wrapper.state().isVisible).to.eq(false);
  });

  it("moving extreme down should keep last option active", () => {
    let wrapper = mount(<SingleSelect values={values} />);
    wrapper.find(".firstButton").simulate("keyDown", { key: "Enter" });
    let options = wrapper.find("li label").map(op => op.text());
    let lastIndex = _.findLastIndex(options);
    wrapper.setState({ currentOptionIndex: lastIndex });
    expect(wrapper.find("li.active").text()).to.eq("Carola");
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowDown" });
    expect(wrapper.find("li.active").text()).to.eq("Carola");
  });
});

describe("filter functionalities", () => {
  let values = [
    "Wilbert",
    "Lily",
    "Annalee",
    "Lenita",
    "Annetta",
    "Alonso",
    "Rory",
    "Carola"
  ];
  let wrapper = mount(<SingleSelect values={values} />);

  it("should filter work properly", () => {
    let inputBox = wrapper.find("input.searchBox");
    inputBox.simulate("change", { target: { value: "Ann" } });
    let options = wrapper.find("li>label").map(op => op.text());
    expect(options).to.deep.equal(["Annalee", "Annetta"]);
  });

  it("filter works for lowercase", () => {
    let inputBox = wrapper.find("input.searchBox");
    inputBox.simulate("change", { target: { value: "le" } });
    let options = wrapper.find("li>label").map(op => op.text());
    expect(options).to.deep.equal(["Annalee", "Lenita"]);
  });
});

describe("object input functionalities", () => {
  let values = [
    { name: "Lily", id: 1 },
    { name: "Annalee", id: 2 },
    { name: "Alonso", id: 3 },
    { name: "Howard", id: 4 },
    { name: "Rory", id: 5 },
    { name: "Wilbert", id: 6 }
  ];
  let wrapper = mount(<SingleSelect values={values} />);

  it("should show a dropdown button", () => {
    expect(wrapper.find("div.firstButton")).to.have.length(1);
  });

  it("should display given options name", () => {
    let options = wrapper.find("li>label").map(op => op.text());
    expect(options).to.deep.equal([
      "Lily",
      "Annalee",
      "Alonso",
      "Howard",
      "Rory",
      "Wilbert"
    ]);
  });

  it("should save selected value on state", () => {
    let option = wrapper.find("li").filterWhere(n => n.text() == "Lily");
    option.simulate("click");
    expect(wrapper.state().selectedOption).to.eq("Lily");
  });

  it("should display selected options on button", () => {
    let option = wrapper.find("li").filterWhere(n => n.text() == "Lily");
    option.simulate("click");
    expect(wrapper.find(".firstButton lablel").text()).to.eq("Lily");
  });
});

describe("object input keyboard functionalities", () => {
  let values = [
    { name: "Lily", id: 1 },
    { name: "Annalee", id: 2 },
    { name: "Alonso", id: 3 },
    { name: "Howard", id: 4 },
    { name: "Rory", id: 5 },
    { name: "Wilbert", id: 6 }
  ];

  it("pressing enter should open the dropdown", () => {
    let wrapper = mount(<SingleSelect values={values} />);
    expect(wrapper.state().isVisible).to.eq(false);
    wrapper.find(".firstButton").simulate("keyDown", { key: "Enter" });
    expect(wrapper.state().isVisible).to.eq(true);
  });

  it("pressing downarrow should open the dropdown", () => {
    let wrapper = mount(<SingleSelect values={values} />);
    expect(wrapper.state().isVisible).to.eq(false);
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowDown" });
    expect(wrapper.state().isVisible).to.eq(true);
  });

  it("pressing downarrow again should navigate down the option", () => {
    let wrapper = mount(<SingleSelect values={values} />);
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowDown" });
    expect(wrapper.find("li.active").text()).to.eq("Lily");
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowDown" });
    expect(wrapper.find("li.active").text()).to.eq("Annalee");
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowDown" });
    expect(wrapper.find("li.active").text()).to.eq("Alonso");
  });

  it("pressing up again should navigate up the option", () => {
    let wrapper = mount(<SingleSelect values={values} />);
    wrapper.find(".firstButton").simulate("keyDown", { key: "Enter" });
    expect(wrapper.find("li.active").text()).to.eq("Lily");
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowDown" });
    expect(wrapper.find("li.active").text()).to.eq("Annalee");
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowUp" });
    expect(wrapper.find("li.active").text()).to.eq("Lily");
  });

  it("pressing enter over the option should select", () => {
    let wrapper = mount(<SingleSelect values={values} />);
    wrapper.find(".firstButton").simulate("keyDown", { key: "Enter" });
    expect(wrapper.state().selectedOption).to.eq("Select a name"); // default text
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowDown" });
    expect(wrapper.find("li.active").text()).to.eq("Annalee");
    expect(wrapper.state().selectedOption).to.eq("Select a name"); // default text
    wrapper.find(".firstButton").simulate("keyDown", { key: "Enter" });
    expect(wrapper.state().selectedOption).to.eq("Annalee");
  });

  it("selecting option should not close the dropdown", () => {
    let wrapper = mount(<SingleSelect values={values} />);
    wrapper.find(".firstButton").simulate("keyDown", { key: "Enter" });
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowDown" });
    expect(wrapper.find("li.active").text()).to.eq("Annalee");
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowDown" });
    expect(wrapper.find("li.active").text()).to.eq("Alonso");
    wrapper.find(".firstButton").simulate("keyDown", { key: "Enter" });
    expect(wrapper.state().selectedOption).to.eq("Alonso");
    expect(wrapper.state().isVisible).to.eq(true);
  });

  it("pressing escape should close the dropdown", () => {
    let wrapper = mount(<SingleSelect values={values} />);
    expect(wrapper.state().isVisible).to.eq(false);
    wrapper.find(".firstButton").simulate("keyDown", { key: "Enter" });
    expect(wrapper.state().isVisible).to.eq(true);
    wrapper.find(".firstButton").simulate("keyDown", { key: "Escape" });
    expect(wrapper.state().isVisible).to.eq(false);
  });

  it("moving extreme down should keep last option active", () => {
    let wrapper = mount(<SingleSelect values={values} />);
    wrapper.find(".firstButton").simulate("keyDown", { key: "Enter" });
    let options = wrapper.find("li label").map(op => op.text());
    let lastIndex = _.findLastIndex(options);
    wrapper.setState({ currentOptionIndex: lastIndex });
    expect(wrapper.find("li.active").text()).to.eq("Wilbert");
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowDown" });
    expect(wrapper.find("li.active").text()).to.eq("Wilbert");
  });
});

describe("object input filter functionalities", () => {
  let values = [
    { name: "Lily", id: 1 },
    { name: "Annalee", id: 2 },
    { name: "Alonso", id: 3 },
    { name: "Howard", id: 4 },
    { name: "Rory", id: 5 },
    { name: "Wilbert", id: 6 }
  ];
  let wrapper = mount(<SingleSelect values={values} />);

  it("should filter work properly", () => {
    let inputBox = wrapper.find("input.searchBox");
    inputBox.simulate("change", { target: { value: "A" } });
    let options = wrapper.find("li>label").map(op => op.text());
    expect(options).to.deep.equal(["Annalee", "Alonso", "Howard"]);
  });

  it("filter works for lowercase", () => {
    let inputBox = wrapper.find("input.searchBox");
    inputBox.simulate("change", { target: { value: "le" } });
    let options = wrapper.find("li>label").map(op => op.text());
    expect(options).to.deep.equal(["Annalee"]);
  });
});

describe("group functionalities", () => {
  let values = [
    { name: "Lily", id: 1, group: "suggestedUsers" },
    { name: "Annalee", id: 2, group: "suggestedUsers" },
    { name: "Alonso", id: 3, group: "suggestedUsers" },
    { name: "Howard", id: 4, group: "suggestedGroups" },
    { name: "Rory", id: 5, group: "suggestedGroups" },
    { name: "Wilbert", id: 6, group: "suggestedGroups" },
    { name: "Carola", id: 7, group: "suggestedGroups" },
    { name: "Crazy", id: 8, group: "suggestedGroups" },
    { name: "Saro", id: 9, group: "suggestedGroups" }
  ];
  let wrapper = mount(<SingleSelect values={values} />);

  it("should filter work properly", () => {
    let inputBox = wrapper.find("input.searchBox");
    inputBox.simulate("change", { target: { value: "Annalee" } });
    let options = wrapper.find("li>label").map(op => op.text());
    expect(options).to.deep.equal(["Annalee"]);
  });

  it("filter works for lowercase", () => {
    let inputBox = wrapper.find("input.searchBox");
    inputBox.simulate("change", { target: { value: "le" } });
    let options = wrapper.find("li>label").map(op => op.text());
    expect(options).to.deep.equal(["Annalee"]);
  });
});

describe("grouped input functionalities", () => {
  let values = [
    { name: "Lily", id: 1, group: "suggestedUsers" },
    { name: "Annalee", id: 2, group: "suggestedUsers" },
    { name: "Alonso", id: 3, group: "suggestedUsers" },
    { name: "Howard", id: 4, group: "suggestedGroups" },
    { name: "Rory", id: 5 },
    { name: "Wilbert", id: 6, group: "suggestedGroups" },
    { name: "Carola", id: 7, group: "suggestedGroups" },
    { name: "Crazy", id: 8 },
    { name: "Saro", id: 9, group: "suggestedGroups" }
  ];

  let wrapper = mount(<SingleSelect values={values} />);

  it("should show a dropdown button", () => {
    expect(wrapper.find("div.firstButton")).to.have.length(1);
  });

  it("should display given options name", () => {
    let options = wrapper.find("li>label").map(op => op.text());
    expect(options).to.deep.equal([
      "Rory",
      "Crazy",
      "Howard",
      "Wilbert",
      "Carola",
      "Saro",
      "Lily",
      "Annalee",
      "Alonso"
    ]);
  });

  it("should save selected value on state", () => {
    let option = wrapper.find("li").filterWhere(n => n.text() == "Lily");
    option.simulate("click");
    expect(wrapper.state().selectedOption).to.eq("Lily");
  });

  it("should display selected options on button", () => {
    let option = wrapper.find("li").filterWhere(n => n.text() == "Lily");
    option.simulate("click");
    expect(wrapper.find(".firstButton lablel").text()).to.eq("Lily");
  });
});

describe("group input keyboard functionalities", () => {
  let values = [
    { name: "Lily", id: 1, group: "suggestedUsers" },
    { name: "Annalee", id: 2, group: "suggestedUsers" },
    { name: "Alonso", id: 3, group: "suggestedUsers" },
    { name: "Howard", id: 4, group: "suggestedGroups" },
    { name: "Rory", id: 5 },
    { name: "Wilbert", id: 6, group: "suggestedGroups" },
    { name: "Carola", id: 7, group: "suggestedGroups" },
    { name: "Crazy", id: 8 },
    { name: "Saro", id: 9, group: "suggestedGroups" }
  ];

  it("pressing enter should open the dropdown", () => {
    let wrapper = mount(<SingleSelect values={values} />);
    expect(wrapper.state().isVisible).to.eq(false);
    wrapper.find(".firstButton").simulate("keyDown", { key: "Enter" });
    expect(wrapper.state().isVisible).to.eq(true);
  });

  it("pressing downarrow should open the dropdown", () => {
    let wrapper = mount(<SingleSelect values={values} />);
    expect(wrapper.state().isVisible).to.eq(false);
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowDown" });
    expect(wrapper.state().isVisible).to.eq(true);
  });

  it("pressing downarrow again should navigate down the option", () => {
    let wrapper = mount(<SingleSelect values={values} />);
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowDown" });
    expect(wrapper.find("li.active").text()).to.eq("Rory");
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowDown" });
    expect(wrapper.find("li.active").text()).to.eq("Crazy");
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowDown" });
    expect(wrapper.find("li.active").text()).to.eq("Howard");
  });

  it("pressing up again should navigate up the option", () => {
    let wrapper = mount(<SingleSelect values={values} />);
    wrapper.find(".firstButton").simulate("keyDown", { key: "Enter" });
    expect(wrapper.find("li.active").text()).to.eq("Rory");
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowDown" });
    expect(wrapper.find("li.active").text()).to.eq("Crazy");
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowUp" });
    expect(wrapper.find("li.active").text()).to.eq("Rory");
  });

  it("pressing enter over the option should select", () => {
    let wrapper = mount(<SingleSelect values={values} />);
    wrapper.find(".firstButton").simulate("keyDown", { key: "Enter" });
    expect(wrapper.state().selectedOption).to.eq("Select a name"); // default text
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowDown" });
    expect(wrapper.find("li.active").text()).to.eq("Crazy");
    expect(wrapper.state().selectedOption).to.eq("Select a name"); // default text
    wrapper.find(".firstButton").simulate("keyDown", { key: "Enter" });
    expect(wrapper.state().selectedOption).to.eq("Crazy");
  });

  it("selecting option should not close the dropdown", () => {
    let wrapper = mount(<SingleSelect values={values} />);
    wrapper.find(".firstButton").simulate("keyDown", { key: "Enter" });
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowDown" });
    expect(wrapper.find("li.active").text()).to.eq("Crazy");
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowDown" });
    expect(wrapper.find("li.active").text()).to.eq("Howard");
    wrapper.find(".firstButton").simulate("keyDown", { key: "Enter" });
    expect(wrapper.state().selectedOption).to.eq("Howard");
    expect(wrapper.state().isVisible).to.eq(true);
  });

  it("pressing escape should close the dropdown", () => {
    let wrapper = mount(<SingleSelect values={values} />);
    expect(wrapper.state().isVisible).to.eq(false);
    wrapper.find(".firstButton").simulate("keyDown", { key: "Enter" });
    expect(wrapper.state().isVisible).to.eq(true);
    wrapper.find(".firstButton").simulate("keyDown", { key: "Escape" });
    expect(wrapper.state().isVisible).to.eq(false);
  });

  it("moving extreme down should keep last option active", () => {
    let wrapper = mount(<SingleSelect values={values} />);
    wrapper.find(".firstButton").simulate("keyDown", { key: "Enter" });
    let options = wrapper.find("li label").map(op => op.text());
    let lastIndex = _.findLastIndex(options);
    wrapper.setState({ currentOptionIndex: lastIndex });
    expect(wrapper.find("li.active").text()).to.eq("Alonso");
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowDown" });
    expect(wrapper.find("li.active").text()).to.eq("Alonso");
  });
});

describe("icon test", () => {
  let values = [
    { name: "Lily", id: 1, group: "suggestedUsers" },
    { name: "Annalee", id: 2, group: "suggestedUsers" },
    {
      name: "Carola",
      id: 3,
      group: "suggestedGroups",
      icon: "https://robohash.org/debitislaudantiumin.bmp?size=50x50&set=set1"
    }
  ];

  let wrapper = mount(<SingleSelect values={values} />);

  it("should show a given icon", () => {
    let option = wrapper.find("li").filterWhere(n => n.text() == "Lily");
    let icon = option.find("img");
    expect(icon.prop("src")).to.eq(
      "https://s3.amazonaws.com/rapidapi-prod-fe_static/images/unknown_user.png"
    );
  });

  it("should show a default icon when icon input not given", () => {
    let option = wrapper.find("li").filterWhere(n => n.text() == "Carola");
    let icon = option.find("img");
    expect(icon.prop("src")).to.eq(
      "https://robohash.org/debitislaudantiumin.bmp?size=50x50&set=set1"
    );
  });
});
