import { useState } from "react";
import { createRoot } from "react-dom/client";

import colorSchemes from "./colors.json"

window.addEventListener("load", async () => {
  try {
    let response = await fetch("https://www.colourlovers.com/api/palettes/top");
    console.log(response);
  } catch (error) {
    console.log(error);
  }

  let root = createRoot(document.getElementById("root"));
  root.render(<App schemes={colorSchemes}/>);
});

function App({ schemes }) {
  let schemeComponents = [];

  for (let scheme of schemes) {
    schemeComponents.push(
      <li key={scheme.id}>{scheme.title}</li>
    );
  }

  return <ul>{schemeComponents}</ul>;
}