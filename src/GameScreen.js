import React, { useState, useRef } from "react";
import "./GameScreen.css";

function GameScreen() {
  const [tiles, setTiles] = useState(shuffle([...Array(9).keys()]));
  const [draggingIndex, setDraggingIndex] = useState(null);
  const dragImageRef = useRef(null);
  const [showWin, setShowWin] = useState(false);
  const [winFadeOut, setWinFadeOut] = useState(false);
  const touchStartIndex = useRef(null);

  const handleDragStart = (e, index) => {
    setDraggingIndex(index);
    e.dataTransfer.setData("text/plain", index);

    const tile = e.target.cloneNode(true);
    tile.style.position = "absolute";
    tile.style.top = "-1000px";
    tile.style.left = "-1000px";
    tile.style.width = "250px";
    tile.style.height = "250px";
    tile.style.transform = "scale(0.5)";
    tile.style.zIndex = "-1";
    document.body.appendChild(tile);
    dragImageRef.current = tile;
    e.dataTransfer.setDragImage(tile, 25, 25);
  };

  const handleDragEnd = () => {
    setDraggingIndex(null);
    if (dragImageRef.current) {
      document.body.removeChild(dragImageRef.current);
      dragImageRef.current = null;
    }
    document.activeElement.blur();
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    const fromIndex = draggingIndex;
    if (fromIndex === null || fromIndex === targetIndex) return;
    swapTiles(fromIndex, targetIndex);
  };

  const handleTouchStart = (index) => {
    touchStartIndex.current = index;
  };

  const handleTouchEnd = (index) => {
    const fromIndex = touchStartIndex.current;
    if (fromIndex === null || fromIndex === index) return;
    swapTiles(fromIndex, index);
    touchStartIndex.current = null;
  };

  const swapTiles = (fromIndex, targetIndex) => {
    const newTiles = [...tiles];
    [newTiles[fromIndex], newTiles[targetIndex]] = [newTiles[targetIndex], newTiles[fromIndex]];
    setTiles(newTiles);
    setDraggingIndex(null);

    if (isSolved(newTiles)) {
      setShowWin(true);
      setWinFadeOut(false);

      setTimeout(() => setWinFadeOut(true), 1600);
      setTimeout(() => {
        setShowWin(false);
        setTiles(shuffle([...Array(9).keys()]));
      }, 2200);
    }
  };

  return React.createElement("div", { className: "game-screen-wrapper" },
    React.createElement("div", { className: "game-canvas-wrapper" },
      React.createElement("div", { className: "game-canvas" },

        // 🧩 Title
        React.createElement("h2", { className: "puzzle-title" }, "Puzzle Away!"),

        // 📦 Game Box
        React.createElement("div", { className: "game-box", style: { position: "relative", zIndex: 0 } },

          // 🧱 Puzzle Grid
          React.createElement("div", { className: "puzzle-grid" },
            ...tiles.map((tileValue, visualIndex) =>
              React.createElement("div", {
                key: visualIndex,
                className: `tile ${tileValue === 8 ? "empty" : ""}`,
                tabIndex: -1,
                draggable: true,
                onDragStart: (e) => handleDragStart(e, visualIndex),
                onDragEnd: handleDragEnd,
                onDragOver: handleDragOver,
                onDrop: (e) => handleDrop(e, visualIndex),
                onTouchStart: () => handleTouchStart(visualIndex),
                onTouchEnd: () => handleTouchEnd(visualIndex),
                style: {
                  ...getTileStyle(tileValue),
                  left: `${(visualIndex % 3) * 33.33}%`,
                  top: `${Math.floor(visualIndex / 3) * 33.33}%`,
                  visibility: draggingIndex === visualIndex ? "hidden" : "visible",
                  cursor: "grab",
                  touchAction: "none",
                },
              })
            )
          ),

          // 🔄 Shuffle Button
          React.createElement("button", {
            className: "shuffle-button",
            onClick: () => {
              setTiles(shuffle([...Array(9).keys()]));
              setShowWin(false);
            }
          }, "Shuffle"),

          // 📷 Upload Button
          React.createElement("label", { className: "upload-button" },
            React.createElement("input", {
              type: "file",
              accept: "image/*",
              className: "upload-hidden-input",
              onChange: (e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    const imageUrl = reader.result;
                    document.documentElement.style.setProperty("--user-img", `url('${imageUrl}')`);
                  };
                  reader.readAsDataURL(file);
                }
              }
            })
          )
        )
      )
    ),

    // 🎉 Win Popup
    showWin && React.createElement("div", { className: "win-popup-wrapper" },
      React.createElement("div", {
        className: `win-popup${winFadeOut ? " fade-out" : ""}`
      }, "🎉 You Won!")
    )
  );
}

// ──────────────
// 🔁 Helpers
// ──────────────

function shuffle(array) {
  let current = array.length, temp, rand;
  while (current) {
    rand = Math.floor(Math.random() * current--);
    [array[current], array[rand]] = [array[rand], array[current]];
  }
  return array;
}

function isSolved(tiles) {
  return tiles.every((val, index) => val === index);
}

function getTileStyle(tileValue) {
  const row = Math.floor(tileValue / 3);
  const col = tileValue % 3;
  return {
    backgroundImage: "var(--user-img, url('/assets/background.png'))",
    backgroundSize: "300% 300%",
    backgroundPosition: `${(col / 2) * 100}% ${(row / 2) * 100}%`,
    position: "absolute",
    width: "33.33%",
    height: "33.33%",
  };
}

export default GameScreen;
