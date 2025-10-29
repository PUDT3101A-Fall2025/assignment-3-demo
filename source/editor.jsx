import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

window.addEventListener("load", async () => {
  let root = createRoot(document.getElementById("root"));
  root.render(<Editor />);
});

let defaultColors = JSON.parse(localStorage.getItem("color-scheme"));

if (!defaultColors) {
  defaultColors = [
    "#8865AA",
    "#F5E67D",
    "#F2B47A",
    "#CC8E86",
    "#6D3162"
  ]
}

function Editor({ }) {
  let [title, setTitle] = useState("My Color Scheme");
  let [colors, setColors] = useState(defaultColors);

  let [shuffle, setShuffle] = useState(false);

  useEffect(() => {
    localStorage.setItem("color-scheme", JSON.stringify(colors));
  }, [colors]);

  useEffect(() => {
    if (shuffle) {
      let cancel = setInterval(() => {
        setColors(oldColors => oldColors.map(() => randomColor()))
      }, 500);

      return () => { clearInterval(cancel) };
    }
  }, [shuffle]);

  let swatches = [];

  for (let i = 0; i < colors.length; ++i) {
    let color = colors[i];
    swatches.push(
      <Swatch
        color={color}
        onDelete={() => setColors(colors.toSpliced(i, 1))}
        onColorChange={(newColor) => setColors(colors.toSpliced(i, 1, newColor))}
        canBeDeleted={colors.length > 1}
      />
    );
  }

  return <div id="editor">
    <input type="text" value={title} onChange={(event) => setTitle(event.target.value)}></input>
    <button onClick={() => setShuffle(!shuffle)}>{ shuffle ? "Stop Shuffling" : "Shuffle" }</button>
    <div className="scheme">
      {swatches}
      {(colors.length < 6) ? <button className="new-swatch" onClick={
        () => setColors(colors.toSpliced(colors.length, 0, randomColor()))
      }>+</button> : null}
    </div>
  </div>;
}

function Swatch({ color, onDelete, onColorChange, canBeDeleted }) {
  return <div className="swatch" style={{background: color}}>
    {canBeDeleted ? 
      <button className="delete" onClick={onDelete}>&#10006;</button> : null}
    <label>{color}</label>
    <input
      className="picker"
      type="color"
      value={color}
      onChange={(event) => onColorChange(event.target.value)}>  
    </input>
  </div>
}

function randomColor() {
  let value = Math.floor(Math.random() * 16777215).toString(16);
  return `#${value.padStart(6, '0')}`;
}