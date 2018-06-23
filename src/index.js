import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import SingleSelect from './singleSelect';
{
  let values = [{name: 'Lily', id: 1, group: 'suggestedUsers'}, {name: 'Annalee', id: 2, group: 'suggestedUsers'}, {name: 'Alonso', id: 3, group: 'suggestedUsers'},
    {name: 'Howard', id: 4, group: 'suggestedGroups'}, {name: 'Rory', id: 5}, {name: 'Wilbert', id: 6, group: 'suggestedGroups'},
    {name: 'Carola', id: 7, group: 'suggestedGroups'}, {name: 'Crazy', id: 8}, {name: 'Saro', id: 9, group: 'suggestedGroups'}];

  ReactDOM.render(<SingleSelect values={values}/>, document.getElementById('root'));
}
