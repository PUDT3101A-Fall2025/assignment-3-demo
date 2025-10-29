import { useState } from "react";
import { createRoot } from "react-dom/client";

import colorSchemes from "./colors.json"

window.addEventListener("load", async () => {
  let root = createRoot(document.getElementById("root"));
  root.render(<Editor />);
});

let defaultColors = [
  "#8865AA",
  "#F5E67D",
  "#F2B47A",
  "#CC8E86",
  "#6D3162"
];

function Editor({ schemes }) {
  let [colors, setColors] = useState(defaultColors);

  let swatches = [];

  for (let i = 0; i < colors.length; ++i) {
    let color = colors[i];
    swatches.push(<Color color={color} key={color} />);
  }

  return <div id="editor">
    <div className="scheme">
      {swatches}
      <button className="new-swatch">+</button>
    </div>
  </div>;
}

function Color({color}) {
  return <div className="swatch" style={{background: color}}>
    <button className="delete">&#10006;</button>
    <label>{color}</label>
    <input className="picker" type="color" value={color}></input>
  </div>
}