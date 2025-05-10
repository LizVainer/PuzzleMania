import React from "react";

function App(props) {
  const handleStart = () => {
    props.onStart();
  };

  return React.createElement(
    "div",
    { className: "landing" },
    React.createElement("div", { className: "overlay" },
      React.createElement("h1", null, "🧩Welcome to Puzzle Mania!"),
      React.createElement("img", {
        src: "/src/assets/btnPlay.png",
        alt: "Play Button",
        className: "play-button",
        onClick: handleStart,
        onTouchStart: handleStart
      })
    )
  );
}

export default App;
