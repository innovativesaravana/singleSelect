import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import SingleSelect from "./singleSelect";
import tempData from "./tempData.json";

ReactDOM.render(
  <SingleSelect values={tempData} />,
  document.getElementById("root")
);
