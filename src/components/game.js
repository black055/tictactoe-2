import React, { useState } from "react";
import Board from "./board";

function Game() {
  /* Declare state */
  const [history, setHistory] = useState([
    {
      squares: Array(9).fill(null),
      newMove: null,
    },
  ]);
  const [xIsNext, setXIsNext] = useState(true);
  const [stepNumber, setStepNumber] = useState(0);
  const [size, setSize] = useState(3);
  const [winner, setWinner] = useState(null);
  const [line, setLine] = useState([]);
  const [isIncre, setIsIncre] = useState(true);

  function handleClick(i) {
    const currentHistory = history.slice(0, stepNumber + 1);
    const current = currentHistory[currentHistory.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares, size) != null || squares[i]) {
      return;
    }
    squares[i] = xIsNext ? "X" : "O";
    setHistory(currentHistory.concat([{ squares: squares, newMove: i }]));
    setStepNumber(currentHistory.length);

    let winner = calculateWinner(squares, size);
    if (winner) {
      let line = [];
      for (let k = 0; k < winner.line.length; k++) {
        line.push(winner.line[k].row * size + winner.line[k].col);
      }
      setWinner(winner.player);
      setLine(line);
    } else {
      setXIsNext(!xIsNext);
    }
  }

  function jumpTo(step) {
    const currentHistory = history.slice(0, step + 1);
    const current = currentHistory[currentHistory.length - 1];
    const squares = current.squares.slice();

    setStepNumber(step);
    setXIsNext(step % 2 === 0);
    let winner = calculateWinner(squares, size);
    if (winner != null) {
      let line = [];
      for (let k = 0; k < winner.line.length; k++) {
        line.push(winner.line[k].row * size + winner.line[k].col);
      }
      setWinner(winner.player);
      setLine(line);
    } else {
      setWinner(null);
      setLine([]);
    }
  }

  function handleChangeSize(e) {
    setHistory([
      {
        squares: Array(e.target.value ** 2).fill(null),
      },
    ]);
    setXIsNext(true);
    setStepNumber(0);
    setSize(e.target.value);
    setWinner(null);
    setLine([]);
  }

  function handleSort() {
    setIsIncre(!isIncre);
  }

  /* Render  */

  const currentHistory = history;
  const current = currentHistory[stepNumber];

  const moves = currentHistory.map((step, move) => {
    const desc = move
      ? "Go to move #" +
        move +
        " (" +
        Math.floor(step.newMove / size) +
        ", " +
        (step.newMove % size) +
        ")"
      : "Go to game start";

    if (move === stepNumber)
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>
            <strong>{desc}</strong>
          </button>
        </li>
      );
    else
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{desc}</button>
        </li>
      );
  });

  let status;
  if (winner != null) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <div className="screen">
      <div className="game-size-controller">
        <span>
          Size of the game:
          <input
            type="number"
            min="3"
            defaultValue="3"
            className="input-number"
            onChange={handleChangeSize}
          />
        </span>
      </div>

      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            line={line}
            onClick={(i) => handleClick(i)}
            size={size}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button className="sort-button" onClick={handleSort}>
            <strong>Sort: </strong> {isIncre ? "increasing" : "decreasing"}{" "}
          </button>
          <div className="text">
            History list: location each move in <strong>(row, col)</strong>{" "}
            format
          </div>
          <ol>{isIncre ? moves : moves.reverse()}</ol>
        </div>
      </div>
    </div>
  );
}

function to2DSquare(squares) {
  let result = Array(Math.sqrt(squares.length));
  for (let i = 0; i < result.length; i++) {
    result[i] = Array(Math.sqrt(squares.length)).fill(null);
  }

  for (let i = 0; i < result.length; i++) {
    for (let j = 0; j < result.length; j++) {
      result[i][j] = squares[i * result.length + j];
    }
  }
  return result;
}

function checkLine(line, winLength) {
  for (let i = 0, j = 0; i < line.length - 1; i = j) {
    if (line[i] != null) {
      for (j = i + 1; j < line.length && line[j] === line[i]; j++) {}
      // Nếu chuỗi kí tự đã đủ điều kiện thắng
      if (j - i >= winLength) {
        return line.length - j;
      }
    } else j = i + 1;
  }
  return null;
}

function calculateWinner(squares, size) {
  let newSquares = to2DSquare(squares);
  let winLength = size > 5 ? 5 : parseInt(size);
  // Kiểm tra các dòng
  for (let i = 0; i < newSquares.length; i++) {
    let isWin = checkLine(newSquares[i], winLength);
    if (isWin != null) {
      let line = [];
      for (let point = 0; point < winLength; point++) {
        line.push({
          row: i,
          col: newSquares.length - isWin - 1 - point,
        });
      }
      let result = {
        player: newSquares[i][newSquares.length - 1 - isWin],
        line: line,
      };
      return result;
    }
  }

  // Kiểm tra các cột
  for (let i = 0; i < newSquares.length; i++) {
    let isWin = checkLine(
      newSquares.map((e) => e[i]),
      winLength
    );
    if (isWin != null) {
      let line = [];
      for (let point = 0; point < winLength; point++) {
        line.push({
          row: newSquares.length - isWin - 1 - point,
          col: i,
        });
      }
      let result = {
        player: newSquares.map((e) => e[i])[newSquares.length - 1 - isWin],
        line: line,
      };
      return result;
    }
  }

  // Kiểm tra đường chéo theo hướng /
  for (let i = 0; i < 2 * newSquares.length - 1; i++) {
    let diagonal = [];
    let lastPoint;
    for (let j = 0; j < newSquares.length; j++) {
      let x = i - j;
      if (x >= 0 && x < newSquares.length) {
        diagonal.push(newSquares[j][x]);
        lastPoint = {
          row: j,
          col: x,
        };
      }
    }

    let isWin = checkLine(diagonal, winLength);
    if (isWin != null) {
      let line = [];
      for (let point = 0; point < winLength; point++) {
        if (size > 5) {
          line.push({
            row: lastPoint.row - isWin - point,
            col: lastPoint.col + isWin + point,
          });
        } else {
          line.push({
            row: lastPoint.row - point,
            col: lastPoint.col + point,
          });
        }
      }
      let result = {
        player: diagonal[diagonal.length - 1 - isWin],
        line: line,
      };
      return result;
    }
  }

  // Kiểm tra đường chéo theo hướng \
  for (let i = 0; i < 2 * newSquares.length - 1; i++) {
    let diagonal = [];
    let lastPoint;
    for (let j = 0; j < newSquares.length; j++) {
      let x = i - (newSquares.length - 1 - j);
      if (x >= 0 && x < newSquares.length) {
        diagonal.push(newSquares[j][x]);
        lastPoint = {
          row: j,
          col: x,
        };
      }
    }

    let isWin = checkLine(diagonal, winLength);
    if (isWin != null) {
      let line = [];
      for (let point = 0; point < winLength; point++) {
        if (size > 5) {
          line.push({
            row: lastPoint.row - isWin - point,
            col: lastPoint.col - isWin - point,
          });
        } else {
          line.push({
            row: lastPoint.row - point,
            col: lastPoint.col - point,
          });
        }
      }
      let result = {
        player: diagonal[diagonal.length - 1 - isWin],
        line: line,
      };
      return result;
    }
  }

  if (squares.includes(null) === false) {
    let result = {
      player: "draw",
      line: [],
    };
    return result;
  }

  return null;
}

export default Game;
