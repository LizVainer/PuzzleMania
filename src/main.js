import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.js";
import MainGame from "./GameScreen.js";
import "./index.css";

function Root() {
  const [screen, setScreen] = useState("home");

  return React.createElement(
    React.StrictMode,
    null,
    screen === "home"
      ? React.createElement(App, { onStart: () => setScreen("game") })
      : React.createElement(MainGame)
  );
}

// ✅ This line must match the function above
createRoot(document.getElementById("root")).render(React.createElement(Root));
