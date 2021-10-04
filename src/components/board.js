import React from "react";
import Square from "./square";

function Board({line, squares, onClick, size}) {
  return (
    <div>
      {renderBoard(line, squares, onClick, size)}
    </div>
  );
}

function renderSquare(i, line, squares, onClick) {
  return (
    <Square
      key={i}
      highlight={line.includes(i)}
      value={squares[i]}
      onClick={() => onClick(i)}
    />
  );
}

function renderBoard(line, squares, onClick, size) {
  var boardHTML = [];

  for (let i = 0; i < size; i++) {
    let temp = [];
    for (let j = 0; j < size; j++) {
      temp.push(renderSquare(size * i + j, line, squares, onClick));
    }
    boardHTML.push(
      <div key={"row_" + i} className="board-row">
        {temp}
      </div>
    );
  }

  return boardHTML;
}

export default Board;
