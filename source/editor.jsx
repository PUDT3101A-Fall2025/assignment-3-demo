import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

// This is the main render function. It's set up as an event listener
// to be triggered by the initial page load
window.addEventListener("load", async () => {
  // Set up the root of our React application
  let root = createRoot(document.getElementById("root"));

  // Render our color scheme editor component in this root
  root.render(<Editor />);
});

// Load our color scheme name from local storage
let initialTitle =
  localStorage.getItem("color-scheme-title") ?? "My Color Scheme";

// Load our color scheme from local storage
let savedScheme = localStorage.getItem("color-scheme");
let initialColors;

if (savedScheme) {
  // If there's a saved scheme, parse it into a list
  initialColors = JSON.parse(savedScheme);
} else {
  // Otherwise, use a set of default colors
  initialColors = ["#8865AA", "#F5E67D", "#F2B47A", "#CC8E86", "#6D3162"];
}

// This is our main component, a color scheme editor
function Editor({}) {
  // This state holds the title of our color scheme
  let [title, setTitle] = useState(initialTitle);

  // This effect saves the title to local storage when it updates
  useEffect(() => {
    localStorage.setItem("color-scheme-title", title);
  }, [title]);

  // This state holds the set of colors as an array of color strings
  let [colors, setColors] = useState(initialColors);

  // This effect saves the list of colors to a JSON string in local storage
  useEffect(() => {
    localStorage.setItem("color-scheme", JSON.stringify(colors));
  }, [colors]);

  // This state stores whether the editor is in "shuffle" mode
  let [shuffle, setShuffle] = useState(false);

  // This effect starts the editor's "shuffle mode" if the shuffle value
  // changes
  useEffect(() => {
    if (shuffle) {
      // If shuffle changed to true, set up regular color shuffling
      let cancel = setInterval(() => {
        // Replace all of the colors with new random colors
        setColors((oldColors) => oldColors.map(() => randomColor()));
      }, 500);

      // This function stops the interval animation if shuffle changes to false
      return () => {
        clearInterval(cancel);
      };
    }
  }, [shuffle]);

  // This array will hold a React component for each color swatch
  let swatches = [];

  // For each color in the colors array, create a Swatch component
  for (let i = 0; i < colors.length; ++i) {
    let color = colors[i];
    swatches.push(
      <Swatch
        color={color}
        // Delete the color at this index
        onDelete={() => setColors(colors.toSpliced(i, 1))}
        // Change the color at this index
        onColorChange={(newColor) =>
          setColors(colors.toSpliced(i, 1, newColor))
        }
        // This specifies whether "x" buttons are displayed or not
        canBeDeleted={colors.length > 1}
      />
    );
  }

  return (
    <div id="editor">
      {/* This input tag updates the title state */}
      <input
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      ></input>
      {/* This button toggles the shuffle state */}
      <button onClick={() => setShuffle(!shuffle)}>
        {shuffle ? "Stop Shuffling" : "Shuffle"}
      </button>
      {/* This div contains the swatches and an add button if there are fewer than six colors*/}
      <div className="scheme">
        {swatches}
        {colors.length < 6 ? (
          <button
            className="new-swatch"
            onClick={() =>
              // Add new random color to the end of the color list
              setColors(colors.toSpliced(colors.length, 0, randomColor()))
            }
          >
            +
          </button>
        ) : null}
      </div>
    </div>
  );
}

// This component displays a single color in the color scheme
function Swatch({ color, onDelete, onColorChange, canBeDeleted }) {
  return (
    <div className="swatch" style={{ background: color }}>
      {
        // If it can be deleted, show a delete button
        canBeDeleted ? (
          <button className="delete" onClick={onDelete}>
            &#10006;
          </button>
        ) : null
      }
      <label>{color}</label>
      {/* This color picker input uses the onColorChange function to
          update the swatch's color */}
      <input
        className="picker"
        type="color"
        value={color}
        onChange={(event) => onColorChange(event.target.value)}
      ></input>
    </div>
  );
}

// Helper function for generating a random color as a hexidecimal string
function randomColor() {
  let value = Math.floor(Math.random() * 16777215).toString(16);
  return `#${value.padStart(6, "0")}`;
}
