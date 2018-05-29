import React from 'react';
import { shallow, mount } from 'enzyme';
import SingleSelect from '../src/singleSelect';
import sinon from 'sinon';

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


  describe('Header', () => {

    let wrapper = shallow(
      <SingleSelect />
    );

    it('should return a dropdown container' , () => {
      expect(wrapper.find('div.dropdown')).to.have.length(1);
    });

    it('should have a search box' , () => {
      expect(wrapper.find('input.searchBox')).to.have.length(1);
    });

    it('should display correct text on searchbox' , () => {
      expect(wrapper.find('input.searchBox').prop('placeholder')).to .eq("Find Users/Graphs...")
    });

    it('should display search icon on inputbox' , () => {
      expect(wrapper.find('span.searchIcon').text()).to.eq('🔍')
    });

    it('should auto focuse on searchbox' , () => {
      expect(wrapper.find('input.searchBox').prop('autofocus')).to .eq("autofocus")
    });

    it('should have a ul list' , () => {
      expect(wrapper.find('ul')).to.have.length(1);
    });

    it('should display given options name' , () => {
      wrapper.setState({options: ['Wilbert','Lily','Annalee','Lenita','Annetta','Alonso','Rory','Carola']})
      let options = wrapper.find('ul>li>label').map((op)=> op.text());
      expect(options).to.deep.equal(['Wilbert','Lily','Annalee','Lenita','Annetta','Alonso','Rory','Carola']);
    });
  }
  )
