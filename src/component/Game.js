import React from "react";
import Board from "./Board";
import "./css/game-style.css";
import pvm from "./image/pvm.jpg";
import pvp from "./image/pvp.jpg";

class Game extends React.Component {
  // contructor game
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      player: null,
      oponent: null,
      isXNext: true,
      mode: null,
      timeDefault: 30,
      change: false
    };

    setInterval(() => {
      if (this.state.mode === "pva") {
        if (this.state.player) {
          if (
            (this.state.player === "X" && !this.state.isXNext) ||
            (this.state.player === "O" && this.state.isXNext)
          ) {
            const history = this.state.history.slice(
              0,
              this.state.history.length + 1
            );
            const current = history[history.length - 1];
            const squares = current.squares.slice();
            !this.calculateWinner(squares) && this.autoPlay(history, squares);
          }
        }
      }
    }, 1000);
  }

  //ham xu ly tinh toan nuoc di tu dong
  autoPlay(history, squares) {
    /*
      let bestMove = this.findBestMove(squares)
      squares[bestMove] = this.state.oponent;
        this.setState({
          history: history.concat([
            {
              squares: squares
            }
          ]),
          stepNumber: history.length,
          isXNext: !this.state.isXNext,
          change: true
        });
    */
    let step = null;
    do {
      step = Math.floor(Math.random() * 9) + 0;
      if (!squares[step]) {
        squares[step] = this.state.oponent;
        this.setState({
          history: history.concat([
            {
              squares: squares
            }
          ]),
          stepNumber: history.length,
          isXNext: !this.state.isXNext,
          change: true
        });
        return;
      }
    } while (squares[step]);
  }

  // xu ly khi click 1 o co
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.history.length + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (!squares[i] && !this.calculateWinner(squares)) {
      this.state.isXNext ? (squares[i] = "X") : (squares[i] = "0");
      this.setState({
        history: history.concat([
          {
            squares: squares
          }
        ]),
        isXNext: !this.state.isXNext,
        stepNumber: history.length,
        change: false
      });
    } else return;
  }

  //ham xu ly lich su
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      isXNext: step % 2 === 0
    });
  }

  restartBoard(){
    this.setPlayer(this.state.player)
      this.setState({
          history: [{
              squares: Array(9).fill(null)
          }],
          stepNumber: 0,
          change: false,
      })
      this.timeForOnePlayer()
  }
  //ham chay lai game
  restartGame() {
   
    this.setState({
      history: [{ squares: Array(9).fill(null) }],
      player: null,
      stepNumber: 0,
      mode: null,
      change: false,
      timeDefault: 30
    });

    this.timeForOnePlayer();
  }

  //khoi tao nguoi dung
  setPlayer(player) {
    if (player === "O") {
      this.setState({
        player: player,
        oponent: "X",
        isXNext: false
      });
    } else {
      this.setState({
        player: player,
        oponent: "O",
        isXNext: true
      });
    }
  }

  setMode(mode) {
    this.setState({
      mode: mode
    });
  }

  //tinh toan nguoi thang
  calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  }

  timeForOnePlayer() {
    this.interval = setInterval(() => {
      if (this.state.player) {
        let time = this.state.timeDefault - 1;
        let change = this.state.change;
        if (change) {
          this.setState({
            timeDefault: 30,
            change: false
          });
        }
        if (!change && time >= 0) {
          this.setState({
            timeDefault: time
          });
        }
        if (time < 0) {
          alert("Ban da thua cuoc");
          clearInterval(this.interval);
        }
      }
    }, 1000);
  }

  componentDidMount() {
    this.timeForOnePlayer();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  /* ====This is part of algrothim minimax ===  */
  isMovesLeft(squares) {
    for (let i = 0; i < 9; i++) {
      if (squares[i] === null) return true;
    }

    return false;
  }

  //evaluate
  evaluate(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  }

  minimax(squares, depth, isMax) {
    let winner = this.evaluate(squares);

    if (winner === this.state.oponent) return 10 - depth;

    if (winner === this.state.player) return -10 - depth;

    if (!this.isMovesLeft(squares)) return 0;

    if (isMax) {
      let best = -1000;
      for (let cell = 0; cell < 9; cell++) {
        if (squares[cell] === null) {
          squares[cell] = this.state.oponent;
          best = Math.max(best, this.minimax(squares, depth + 1, !isMax));
          squares[cell] = null;
        }
      }
      return best;
    } else {
      let best = 1000;

      for (let i = 0; i < 9; i++) {
        if (squares[i] === null) {
          squares[i] = this.state.player;
          best = Math.min(best, this.minimax(squares, depth + 1, !isMax));
          squares[i] = null;
        }
      }
      return best;
    }
  }

  findBestMove(squares) {
    let bestVal = -1000;
    let bestMove = null;
    for (let i = 0; i < 9; i++) {
      if (squares[i] === null) {
        squares[i] = this.state.oponent;
        let moveVal = this.minimax(squares, 0, false);
        squares[i] = null;
        if (moveVal > bestVal) {
          bestMove = i;
          bestVal = moveVal;
        }
      }
    }
    return bestMove;
  }

  /* === end algrothim ==== */

  // render
  render() {
    let time = this.state.timeDefault;
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const squares = current.squares;

    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    const winner = this.calculateWinner(squares);
    if (winner) clearInterval(this.interval);
    const status = winner
      ? "Winner: " + winner
      : !this.state.player
      ? "Please choose player!"
      : this.state.isXNext
      ? "Next player: X"
      : "Next player: 0";

    if (!this.state.mode) {
      return (
        <div className="game">
          <h1>Tic-Tac-Toe Game</h1>
          <div className="choose-mode">
            <h2>Please choose mode to play game</h2>
            <button className="setMode" onClick={() => this.setMode("pvp")}>
              <img src={pvp} alt="person vs person"></img>
            </button>
            <button className="setMode" onClick={() => this.setMode("pva")}>
              <img src={pvm} alt="person vs man"></img>
            </button>
          </div>
        </div>
      );
    } else if (!this.state.player) {
      return (
        <div className="game">
          <h1>Tic-Tac-Toe Game</h1>
          <div className="choose-player">
            <h2>Please choose player X or O to start game</h2>
            <button className="setPlayer" onClick={() => this.setPlayer("X")}>
              X
            </button>
            <button className="setPlayer" onClick={() => this.setPlayer("O")}>
              O
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="game">
          <h1>Tic-Tac-Toe Game</h1>
          <div className="grid">
            <div className="game-btn">
              <button onClick={() => this.restartGame()}>
                Restart Game!!!
              </button>
              <button onClick={() => this.restartBoard()}>
                Restart Board!!!
              </button>
            </div>

            <div className="game-board">
              <Board squares={squares} onClick={i => this.handleClick(i)} />
            </div>

            <div className="game-info">
              <h4 className="status">{status}</h4>
              <h4 className="status">TIME: {time}</h4>
            </div>

            <div className="game-history">
              <h4 className="status">History</h4>
              <ul>{moves}</ul>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default Game;
