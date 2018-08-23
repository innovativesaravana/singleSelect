Hi Guys, This is a single select react component similar to the Jira filter dropdown.

Pre-reqirement
    1.Node (sudo apt-get install nodejs)
project setup
    1. git clone git@github.com:innovativesaravana/singleSelect.git
    2. cd single-select/
    3. npm install
    4. npm start
    # To run test
    5. npm test

Implemented features:

    Dropdown general:
    1. should display a single select dropdown
    2. should highlight the current option
    3. should close the dropdown after option selected by click
    4. should hide the dropdown while clicking outside
    5. should always autofocus on the input box
    6. dropdown input can be an array of strings or array of objects
    7. should work for grouped data
    8. if group name not present in input then it should be displayed on top.

    Dropdown button:
    1. should display up/down indicator
    2. Should display "Select a name" as default
    3. should display selected option name

    keyboard:
    1. should able to navigate using up/down keys
    2. should be able to open the dropdown by using the enter key
    3. should be able to select an option by using the enter key
    4. pressing escape should hide the dropdown

    Filter:
    1. should able to filter by upcase/downcase
    2. should have default text as "Find Users/Groups...."
    3. should have a search icon
    4. should ungroup the filtered options

    Icons:
    1. should have icon for each option
    2. should display default icon if icon input not available

    Scroll:
    1. should have scroll container
    2. keyboard navigation should scroll the dropdown
