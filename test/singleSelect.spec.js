import React from 'react';
import { shallow, mount } from 'enzyme';
import SingleSelect from '../src/singleSelect';
import sinon from 'sinon';
import _ from 'lodash';

//
// Step 1 (single select with array of strings)
// 1.Create a dropdown (single select mode)
// 2.on down button show values from an array of strings
// 3.on pressing return key the dropdown should show apart from clicking the component
// when expanded, the cursor should be on the search text box with ability to move from one value to another by using arrow keys
// on pressing return key the dropdown should close with selected value if any
// on clicking outside or pressing escape, the operation should cancel.
// when the control is at the bottom of the page, the expansion should be upwards
// when control is at top of page or relatively above, the expansion should be downwards
// when control is at the extreme right or left it should open appropriately
// Upon selection should display the value, also store value in variable.
// If selection given show value by default
//
// Step 1a: (Styling)
//   Hover style
//   Arrow key should be present.
//   Search should have magnifying glass icon
//   If previously a value is selected, scroll to the point and show selected value
//   Proper alignment of entries, search, icons should be take care off
//   outside click should hide dropdown
//
// Step 2: (single select with array of objects)
// The dropdown should work with array of objects in format {label: , value:}
// If it data object is not in default format, then key and value should be specified.
//   {name: 'Howard', id: 23}
//
// Step 3: Simple Search
//     if value of strings, on typing search each string and show match
//     if value is object, search label and show match
//
// Step 4: Introduce Grouping.
// If data is not an array but a Hash then the hash key will be the group name
// If the hashkey has a Label Map then the label map should be used.
//
// Step 5: Introducing Icons
// Introduce icon for groups
// If iconkey specified try to pull icon from each entry
// If each entry is a string or the entry does not have a mentioned icon key, then dont display, but leave space
//
// Step 6: Introducing Function source
// When function call function check the return value
// if return value is string array or object array or hash (grouping) do accordingly
// if return value is a promise, evaluate promise and do accordingly
// on promise returned, then spinner should come until data is available
//
// Step 7: Search Revisit
//   Allow search frequency
//   Allow minimum search text
//   Allow external search function
//     which can return direct values
//     which could return a promise
//
// Step 8: Server Request
//   Prepare a backend of values in rails with sqllite
//   When promise, previous server requests must cancel.
//

describe('general features', () => {
  let values = ['Wilbert','Lily','Annalee','Lenita','Annetta','Alonso','Rory','Carola']

  let wrapper = mount(
    <SingleSelect values={values}/>
  );

  it('should show a dropdown button' , () => {
      expect(wrapper.find('div.firstButton')).to.have.length(1);
  });

  it('Clicking dropdown button shows a dropdown container' , () => {
    let dropdownContainer = wrapper.find('div.dropdownContainer');
    // expect(dropdownContainer.prop('style').opacity).to.eq(0);
    wrapper.find('.firstButton').simulate('click');
    // expect(dropdownContainer.prop('style').opacity).to.eq(100);
  });

  it('should display given options name' , () => {
    let options = wrapper.find('li>label').map((op)=> op.text());
    expect(options).to.deep.equal(['Wilbert','Lily','Annalee','Lenita','Annetta','Alonso','Rory','Carola']);
  });

  it('should save selected value on state' , () => {
    wrapper.setState({options: ['Wilbert','Lily','Annalee','Lenita','Annetta','Alonso','Rory','Carola']})
    let option = wrapper.find('li').filterWhere(n => n.text() == 'Lily');
    option.simulate("click");
    expect(wrapper.state().selectedOption).to.eq('Lily');
  });

  it('should display selected options on button' , () => {
    wrapper.setState({options: ['Wilbert','Lily','Annalee','Lenita','Annetta','Alonso','Rory','Carola']})
    let option = wrapper.find('li').filterWhere(n => n.text() == 'Lily');
    option.simulate("click");
    expect(wrapper.find(".firstButton lablel").text()).to.eq('Lily');
  });
});

describe('Keyboard functionalities', () => {
  let values = ['Wilbert','Lily','Annalee','Lenita','Annetta','Alonso','Rory','Carola']

  it('pressing enter should open the dropdown' , () => {
    let wrapper = mount(<SingleSelect values={values} />);
    expect(wrapper.state().isVisible).to.eq(false);
    wrapper.find(".firstButton").simulate("keyDown", { key: "Enter" });
    expect(wrapper.state().isVisible).to.eq(true);
  });

  it('pressing downarrow should open the dropdown' , () => {
    let wrapper = mount(<SingleSelect values={values} />);
    expect(wrapper.state().isVisible).to.eq(false);
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowDown" });
    expect(wrapper.state().isVisible).to.eq(true);
  });

  it('pressing downarrow again should navigate down the option' , () => {
    let wrapper = mount(<SingleSelect values={values} />);
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowDown" });
    expect(wrapper.find('li.active').text()).to.eq('Wilbert');
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowDown" });
    expect(wrapper.find('li.active').text()).to.eq('Lily');
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowDown" });
    expect(wrapper.find('li.active').text()).to.eq('Annalee');
  });

  it('pressing up again should navigate up the option' , () => {
    let wrapper = mount(<SingleSelect values={values} />);
    wrapper.find(".firstButton").simulate("keyDown", { key: "Enter" });
    expect(wrapper.find('li.active').text()).to.eq('Wilbert');
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowDown" });
    expect(wrapper.find('li.active').text()).to.eq('Lily');
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowUp" });
    expect(wrapper.find('li.active').text()).to.eq('Wilbert');
  });

  it('pressing enter over the option should select' , () => {
    let wrapper = mount(<SingleSelect values={values} />);
    wrapper.find(".firstButton").simulate("keyDown", { key: "Enter" });
    expect(wrapper.state().selectedOption).to.eq('Select a name'); // default text
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowDown" });
    expect(wrapper.find('li.active').text()).to.eq('Lily');
    expect(wrapper.state().selectedOption).to.eq('Select a name'); // default text
    wrapper.find(".firstButton").simulate("keyDown", { key: "Enter" });
    expect(wrapper.state().selectedOption).to.eq('Lily');
  });

  it('pressing space over the option should select' , () => {
    let wrapper = mount(<SingleSelect values={values} />);
    wrapper.find(".firstButton").simulate("keyDown", { key: "Enter" });
    expect(wrapper.state().selectedOption).to.eq('Select a name'); // default text
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowDown" });
    expect(wrapper.find('li.active').text()).to.eq('Lily');
    expect(wrapper.state().selectedOption).to.eq('Select a name'); // default text
    wrapper.find(".firstButton").simulate("keyDown", { key: " " });
    expect(wrapper.state().selectedOption).to.eq('Lily');
  });

  it('selecting option should not close the dropdown' , () => {
    let wrapper = mount(<SingleSelect values={values} />);
    wrapper.find(".firstButton").simulate("keyDown", { key: "Enter" });
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowDown" });
    expect(wrapper.find('li.active').text()).to.eq('Lily');
    wrapper.find(".firstButton").simulate("keyDown", { key: " " });
    expect(wrapper.find('li.active').text()).to.eq('Lily');
    expect(wrapper.state().selectedOption).to.eq('Lily');
    expect(wrapper.state().isVisible).to.eq(true);
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowDown" });
    expect(wrapper.find('li.active').text()).to.eq('Annalee');
    wrapper.find(".firstButton").simulate("keyDown", { key: "Enter" });
    expect(wrapper.state().selectedOption).to.eq('Annalee');
    expect(wrapper.state().isVisible).to.eq(true);
  });

  it('pressing escape should close the dropdown' , () => {
    let wrapper = mount(<SingleSelect values={values} />);
    expect(wrapper.state().isVisible).to.eq(false);
    wrapper.find(".firstButton").simulate("keyDown", { key: "Enter" });
    expect(wrapper.state().isVisible).to.eq(true);
    wrapper.find(".firstButton").simulate("keyDown", { key: "Escape" });
    expect(wrapper.state().isVisible).to.eq(false);
  });

  it('moving extreme down should keep last option active' , () => {
    let wrapper = mount(<SingleSelect values={values} />);
    wrapper.find(".firstButton").simulate("keyDown", { key: "Enter" });
    let options = wrapper.find('li label').map((op)=> op.text());
    let lastIndex = _.findLastIndex(options)
    wrapper.setState({currentOptionIndex: lastIndex})
    expect(wrapper.find('li.active').text()).to.eq('Carola');
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowDown" });
    expect(wrapper.find('li.active').text()).to.eq('Carola');
  });
});

describe('filter functionalities', () => {
  let values = ['Wilbert','Lily','Annalee','Lenita','Annetta','Alonso','Rory','Carola'];
  let wrapper = mount(<SingleSelect values={values} />);

  it('should filter work properly' , () => {
    let inputBox = wrapper.find('input.searchBox');
    inputBox.simulate("change", { target: { value: "Ann" } });
    let options = wrapper.find('li>label').map((op)=> op.text());
    expect(options).to.deep.equal(['Annalee','Annetta']);
  });

  it('filter works for lowercase' , () => {
    let inputBox = wrapper.find('input.searchBox');
    inputBox.simulate("change", { target: { value: "le" } });
    let options = wrapper.find('li>label').map((op)=> op.text());
    expect(options).to.deep.equal(['Annalee','Lenita']);
  });

});


describe('object input functionalities', () => {
  let values = [{name: 'Lily', id: 1}, {name: 'Annalee', id: 2}, {name: 'Alonso', id: 3}, {name: 'Howard', id: 4}, {name: 'Rory', id: 5}, {name: 'Wilbert', id: 6}];
  let wrapper = mount(<SingleSelect values={values} />);

  it('should show a dropdown button' , () => {
      expect(wrapper.find('div.firstButton')).to.have.length(1);
  });

  it('should display given options name' , () => {
    let options = wrapper.find('li>label').map((op)=> op.text());
    expect(options).to.deep.equal(['Lily','Annalee','Alonso','Howard','Rory','Wilbert']);
  });

  it('should save selected value on state' , () => {
    let option = wrapper.find('li').filterWhere(n => n.text() == 'Lily');
    option.simulate("click");
    expect(wrapper.state().selectedOption).to.eq('Lily');
  });

  it('should display selected options on button' , () => {
    let option = wrapper.find('li').filterWhere(n => n.text() == 'Lily');
    option.simulate("click");
    expect(wrapper.find(".firstButton lablel").text()).to.eq('Lily');
  });

});

describe('object input keyboard functionalities', () => {
  let values = [{name: 'Lily', id: 1}, {name: 'Annalee', id: 2}, {name: 'Alonso', id: 3}, {name: 'Howard', id: 4}, {name: 'Rory', id: 5}, {name: 'Wilbert', id: 6}];

  it('pressing enter should open the dropdown' , () => {
    let wrapper = mount(<SingleSelect values={values} />);
    expect(wrapper.state().isVisible).to.eq(false);
    wrapper.find(".firstButton").simulate("keyDown", { key: "Enter" });
    expect(wrapper.state().isVisible).to.eq(true);
  });

  it('pressing downarrow should open the dropdown' , () => {
    let wrapper = mount(<SingleSelect values={values} />);
    expect(wrapper.state().isVisible).to.eq(false);
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowDown" });
    expect(wrapper.state().isVisible).to.eq(true);
  });

  it('pressing downarrow again should navigate down the option' , () => {
    let wrapper = mount(<SingleSelect values={values} />);
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowDown" });
    expect(wrapper.find('li.active').text()).to.eq('Lily');
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowDown" });
    expect(wrapper.find('li.active').text()).to.eq('Annalee');
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowDown" });
    expect(wrapper.find('li.active').text()).to.eq('Alonso');
  });

  it('pressing up again should navigate up the option' , () => {
    let wrapper = mount(<SingleSelect values={values} />);
    wrapper.find(".firstButton").simulate("keyDown", { key: "Enter" });
    expect(wrapper.find('li.active').text()).to.eq('Lily');
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowDown" });
    expect(wrapper.find('li.active').text()).to.eq('Annalee');
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowUp" });
    expect(wrapper.find('li.active').text()).to.eq('Lily');
  });

  it('pressing enter over the option should select' , () => {
    let wrapper = mount(<SingleSelect values={values} />);
    wrapper.find(".firstButton").simulate("keyDown", { key: "Enter" });
    expect(wrapper.state().selectedOption).to.eq('Select a name'); // default text
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowDown" });
    expect(wrapper.find('li.active').text()).to.eq('Annalee');
    expect(wrapper.state().selectedOption).to.eq('Select a name'); // default text
    wrapper.find(".firstButton").simulate("keyDown", { key: "Enter" });
    expect(wrapper.state().selectedOption).to.eq('Annalee');
  });

  it('pressing space over the option should select' , () => {
    let wrapper = mount(<SingleSelect values={values} />);
    wrapper.find(".firstButton").simulate("keyDown", { key: "Enter" });
    expect(wrapper.state().selectedOption).to.eq('Select a name'); // default text
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowDown" });
    expect(wrapper.find('li.active').text()).to.eq('Annalee');
    expect(wrapper.state().selectedOption).to.eq('Select a name'); // default text
    wrapper.find(".firstButton").simulate("keyDown", { key: " " });
    expect(wrapper.state().selectedOption).to.eq('Annalee');
  });

  it('selecting option should not close the dropdown' , () => {
    let wrapper = mount(<SingleSelect values={values} />);
    wrapper.find(".firstButton").simulate("keyDown", { key: "Enter" });
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowDown" });
    expect(wrapper.find('li.active').text()).to.eq('Annalee');
    wrapper.find(".firstButton").simulate("keyDown", { key: " " });
    expect(wrapper.find('li.active').text()).to.eq('Annalee');
    expect(wrapper.state().selectedOption).to.eq('Annalee');
    expect(wrapper.state().isVisible).to.eq(true);
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowDown" });
    expect(wrapper.find('li.active').text()).to.eq('Alonso');
    wrapper.find(".firstButton").simulate("keyDown", { key: "Enter" });
    expect(wrapper.state().selectedOption).to.eq('Alonso');
    expect(wrapper.state().isVisible).to.eq(true);
  });

  it('pressing escape should close the dropdown' , () => {
    let wrapper = mount(<SingleSelect values={values} />);
    expect(wrapper.state().isVisible).to.eq(false);
    wrapper.find(".firstButton").simulate("keyDown", { key: "Enter" });
    expect(wrapper.state().isVisible).to.eq(true);
    wrapper.find(".firstButton").simulate("keyDown", { key: "Escape" });
    expect(wrapper.state().isVisible).to.eq(false);
  });

  it('moving extreme down should keep last option active' , () => {
    let wrapper = mount(<SingleSelect values={values} />);
    wrapper.find(".firstButton").simulate("keyDown", { key: "Enter" });
    let options = wrapper.find('li label').map((op)=> op.text());
    let lastIndex = _.findLastIndex(options)
    wrapper.setState({currentOptionIndex: lastIndex})
    expect(wrapper.find('li.active').text()).to.eq('Wilbert');
    wrapper.find(".firstButton").simulate("keyDown", { key: "ArrowDown" });
    expect(wrapper.find('li.active').text()).to.eq('Wilbert');
  });

});

describe('object input filter functionalities', () => {
  let values = [{name: 'Lily', id: 1}, {name: 'Annalee', id: 2}, {name: 'Alonso', id: 3}, {name: 'Howard', id: 4}, {name: 'Rory', id: 5}, {name: 'Wilbert', id: 6}];
  let wrapper = mount(<SingleSelect values={values} />);

  it('should filter work properly' , () => {
    let inputBox = wrapper.find('input.searchBox');
    inputBox.simulate("change", { target: { value: "A" } });
    let options = wrapper.find('li>label').map((op)=> op.text());
    expect(options).to.deep.equal(['Annalee', 'Alonso', 'Howard']);
  });

  it('filter works for lowercase' , () => {
    let inputBox = wrapper.find('input.searchBox');
    inputBox.simulate("change", { target: { value: "le" } });
    let options = wrapper.find('li>label').map((op)=> op.text());
    expect(options).to.deep.equal(['Annalee']);
  });

});


describe('group functionalities', () => {
  let values = [{name: 'Lily', id: 1, group: 'suggestedUsers'}, {name: 'Annalee', id: 2, group: 'suggestedUsers'}, {name: 'Alonso', id: 3, group: 'suggestedUsers'},
    {name: 'Howard', id: 4, group: 'suggestedGroups'}, {name: 'Rory', id: 5, group: 'suggestedGroups'}, {name: 'Wilbert', id: 6, group: 'suggestedGroups'},
    {name: 'Carola', id: 7, group: 'suggestedGroups'}, {name: 'Crazy', id: 8, group: 'suggestedGroups'}, {name: 'Saro', id: 9, group: 'suggestedGroups'}];
  let wrapper = mount(<SingleSelect values={values} />);

  it('should filter work properly' , () => {
  });

  it('filter works for lowercase' , () => {
  });

});

// update css
// change display method
// should work for object
// introduce Grouping
// introduce icon
//fix focus bug
