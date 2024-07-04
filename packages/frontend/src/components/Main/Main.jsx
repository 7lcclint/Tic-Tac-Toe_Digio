import { useRef, useState, useEffect } from "react";
import Grid from "../Grid/Grid";
import ScoreBar from "../ScoreBar/ScoreBar";
import "./Main.css";

const Main = () => {
  const [playerXName, setPlayerXName] = useState(null);
  const [playerOName, setPlayerOName] = useState(null);
  const [gridSize, setGridSize] = useState(3);
  const [xPlaying, setXPlaying] = useState(true);
  const [square, setSquare] = useState(Array(gridSize * gridSize).fill(null));
  const [scores, setScores] = useState({ xScore: 0, oScore: 0 });
  const [gameOver, setGameOver] = useState(false);
  const inputRef = useRef(null);
  const [newGridSize, setNewGridSize] = useState(gridSize);
  const [gameHistory, setGameHistory] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [moves, setMoves] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [replaySquare, setReplaySquare] = useState(null);
  const [replayIndex, setReplayIndex] = useState(0);
  const [playingAgainstAI, setPlayingAgainstAI] = useState(false);

  const startGame = () => {
    const xName = prompt("Enter Player X's name:");
    if (!xName) {
      resetGame();
      return;
    }

    const oName = prompt("Enter Player O's name:");
    if (!oName) {
      resetGame();
      return;
    }

    setPlayerXName(xName);
    setPlayerOName(oName);
    setGameStarted(true);
  };

  const fetchGameHistory = async () => {
    try {
      const response = await fetch("http://localhost:3000/all-game-history/");
      if (response.ok) {
        const data = await response.json();
        setGameHistory(data);
      } else {
        console.error("Error fetching game history:", response.statusText);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const options = {
      weekday: "short",
      hour: "numeric",
      minute: "numeric",
      month: "long",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const evaluate = (square) => {
    if (gridSize === 3) {
      const winningCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];

      for (let combo of winningCombos) {
        if (
          square[combo[0]] &&
          square[combo[0]] === square[combo[1]] &&
          square[combo[0]] === square[combo[2]]
        ) {
          return square[combo[0]] === "O" ? 10 : -10;
        }
      }
      return 0;
    } else {
      const winningCombos = [];

      for (let i = 0; i < gridSize; i++) {
        winningCombos.push(
          Array.from({ length: gridSize }, (_, idx) => idx + i * gridSize)
        );
        winningCombos.push(
          Array.from({ length: gridSize }, (_, idx) => idx * gridSize + i)
        );
      }
      winningCombos.push(
        Array.from({ length: gridSize }, (_, idx) => idx * (gridSize + 1))
      );
      winningCombos.push(
        Array.from(
          { length: gridSize },
          (_, idx) => (idx + 1) * (gridSize - 1)
        ).slice(0, gridSize)
      );

      for (let combo of winningCombos) {
        if (
          square[combo[0]] &&
          square[combo[0]] === square[combo[1]] &&
          square[combo[0]] === square[combo[2]]
        ) {
          return square[combo[0]] === "O" ? 10 : -10;
        }
      }
      return 0;
    }
  };

  const findBestMove = (currentSquare) => {
    let bestScore = -Infinity;
    let bestMove;
    const depthLimit = 5;

    for (let i = 0; i < currentSquare.length; i++) {
      if (currentSquare[i] === null) {
        currentSquare[i] = "O";
        const score = minimax(
          currentSquare,
          0,
          -Infinity,
          Infinity,
          false,
          depthLimit
        );
        currentSquare[i] = null;
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    return bestMove;
  };

  const minimax = (
    currentSquare,
    depth,
    alpha,
    beta,
    isMaximizing,
    depthLimit
  ) => {
    const score = evaluate(currentSquare);

    if (depth === depthLimit || score === 10 || score === -10)
      return score - depth;
    if (currentSquare.every((cell) => cell !== null)) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < currentSquare.length; i++) {
        if (currentSquare[i] === null) {
          currentSquare[i] = "O";
          const score = minimax(
            currentSquare,
            depth + 1,
            alpha,
            beta,
            false,
            depthLimit
          );
          currentSquare[i] = null;
          bestScore = Math.max(score, bestScore);
          alpha = Math.max(alpha, bestScore);
          if (beta <= alpha) break;
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < currentSquare.length; i++) {
        if (currentSquare[i] === null) {
          currentSquare[i] = "X";
          const score = minimax(
            currentSquare,
            depth + 1,
            alpha,
            beta,
            true,
            depthLimit
          );
          currentSquare[i] = null;
          bestScore = Math.min(score, bestScore);
          beta = Math.min(beta, bestScore);
          if (beta <= alpha) break;
        }
      }
      return bestScore;
    }
  };

  useEffect(() => {
    fetchGameHistory();
  }, []);

  const handlePlayClick = () => {
    setSelectedGame(null);
    setPlayingAgainstAI(false);
    startGame();
    setGameStarted(true);
  };

  const handlePlayVsBotClick = () => {
    setSelectedGame(null);
    setPlayingAgainstAI(true);
    const playerName = prompt("Enter your name:");
    if (!playerName) {
      resetGame();
      return;
    }
    setPlayerXName(playerName);
    setPlayerOName("AI");
    setXPlaying(true);
    setGameStarted(true);
    setSquare(Array(gridSize * gridSize).fill(null));
    setGameOver(false);
    setMoves([]);
    setStartTime(null);
  };

  const resetGame = () => {
    setPlayerXName(null);
    setPlayerOName(null);
    setGameStarted(false);
    setSquare(Array(gridSize * gridSize).fill(null));
    setGameOver(false);
    setScores({ xScore: 0, oScore: 0 });
    setMoves([]);
    setStartTime(null);
    setGameSaved(false);
  };

  const handleSquareClick = (boxIdx) => {
    if (gameOver || square[boxIdx] !== null || (playingAgainstAI && !xPlaying))
      return;

    makeMove(boxIdx);
  };

  const makeMove = (boxIdx) => {
    if (gameOver) return;

    const updatedSquare = [...square];
    updatedSquare[boxIdx] = xPlaying ? "X" : "O";

    setMoves((prevMoves) => [
      ...prevMoves,
      { player: xPlaying ? "X" : "O", position: boxIdx },
    ]);
    setXPlaying(!xPlaying);
    setSquare(updatedSquare);

    const winner = checkWinner(updatedSquare);
    if (winner) {
      if (winner === "O") {
        let { oScore } = scores;
        oScore += 1;
        setScores({ ...scores, oScore });
      } else {
        let { xScore } = scores;
        xScore += 1;
        setScores({ ...scores, xScore });
      }
      setGameOver(true);
    } else if (updatedSquare.every((value) => value !== null)) {
      setGameOver(true);
    }

    if (!startTime) {
      setStartTime(new Date());
    }
  };

  useEffect(() => {
    if (playingAgainstAI && !xPlaying && !gameOver) {
      const aiMove = findBestMove([...square]);
      if (aiMove !== undefined) {
        setTimeout(() => makeMove(aiMove), 500);
      }
    }
  }, [playingAgainstAI, xPlaying, square, gameOver]);

  useEffect(() => {
    console.log("Moves:", moves);
  }, [moves]);

  const checkWinner = (square) => {
    const size = gridSize;
    const generateWinConditions = () => {
      let winConditions = [];
      for (let i = 0; i < size; i++) {
        winConditions.push(
          Array.from({ length: size }, (_, idx) => idx + i * size)
        );
      }
      for (let i = 0; i < size; i++) {
        winConditions.push(
          Array.from({ length: size }, (_, idx) => idx * size + i)
        );
      }
      winConditions.push(
        Array.from({ length: size }, (_, idx) => idx * (size + 1))
      );
      winConditions.push(
        Array.from({ length: size }, (_, idx) => (idx + 1) * (size - 1)).slice(
          0,
          size
        )
      );

      return winConditions;
    };

    const winConditions = generateWinConditions();
    for (let condition of winConditions) {
      const [x, ...rest] = condition;
      if (square[x] && rest.every((idx) => square[idx] === square[x])) {
        setGameOver(true);
        return square[x];
      }
    }

    if (square.every((value) => value !== null)) {
      setGameOver(true);
      return "D";
    }

    return null;
  };

  const [gameSaved, setGameSaved] = useState(false);
  useEffect(() => {
    if (gameOver && !gameSaved) {
      const winner = checkWinner(square);
      saveGameToDatabase(winner);
      setGameSaved(true);
    }
  }, [gameOver, gameSaved, square]);

  const saveGameToDatabase = async (winner) => {
    try {
      const response = await fetch("http://localhost:3000/save-game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerXName,
          playerOName,
          startTime: startTime.toISOString(),
          endTime: new Date().toISOString(),
          gridSize,
          winner,
          moves,
        }),
      });

      if (response.ok) {
        console.log("Game saved successfully!");
        setMoves([]);
        fetchGameHistory();
      } else {
        console.error("Error saving game:", response.statusText);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const resetSquare = () => {
    setGameOver(false);
    setGridSize(newGridSize);
    setSquare(Array(newGridSize * newGridSize).fill(null));
    setGameSaved(false);
  };

  const handleGridSizeChange = (event) => {
    let value = parseInt(event.target.value, 10);
    if (!isNaN(value)) {
      value = Math.min(Math.max(value, 3), 10);
      setNewGridSize(value);
    } else {
      setNewGridSize(3);
    }
  };

  useEffect(() => {
    setGridSize(newGridSize);
    setSquare(Array(newGridSize * newGridSize).fill(null));
  }, [newGridSize]);

  const gameHistoryClick = (game) => {
    console.log("gameHistoryClick: ", game);
    setSelectedGame(game);
    setReplaySquare(Array(game.grid_size * game.grid_size).fill(null));
    setReplayIndex(0);
  };

  useEffect(() => {
    if (selectedGame && replayIndex < selectedGame.moves.length) {
      const timer = setTimeout(() => {
        const newSquare = [...replaySquare];
        const move = selectedGame.moves[replayIndex];
        newSquare[move.position] = move.player;
        setReplaySquare(newSquare);
        setReplayIndex(replayIndex + 1);
      }, (selectedGame.grid_size > 3 ? 0 : 1000);

      return () => clearTimeout(timer);
    }
  }, [selectedGame, replayIndex, replaySquare]);

  return (
    <div className="main">
      <div className="menu-zone">
        <button className="menu-button" onClick={handlePlayClick}>
          Play
        </button>
        <button className="menu-button" onClick={handlePlayVsBotClick}>
          Play Vs Bot
        </button>
        {gameStarted && playerXName && playerOName && (
          <>
            <div className="grid-size-controls">
              <label htmlFor="gridSize">Grid Size :</label>
              <input
                type="number"
                id="gridSize"
                min="3"
                max="10"
                value={newGridSize}
                onChange={handleGridSizeChange}
                ref={inputRef}
              />
            </div>
            <button className="menu-button" onClick={resetSquare}>
              Reset Game
            </button>
          </>
        )}
      </div>
      <div className="game-zone">
        <h2
          className={`${
            gameStarted || playerXName || playerOName || selectedGame
              ? ""
              : "game-zone-h2-notPlay"
          }`}
        >
          {selectedGame ? "Game Replay" : "Tic Tac Toe"}
        </h2>
        {selectedGame ? (
          <>
            <div className="replay">
              <h3 className="replay-X">{selectedGame.playerXName}</h3>
              <h3 className="replay-vs"> vs </h3>
              <h3 className="replay-O">{selectedGame.playerOName}</h3>
            </div>
            <Grid
              square={replaySquare}
              onClick={() => {}}
              gridSize={selectedGame.grid_size}
            />
          </>
        ) : gameStarted && playerXName && playerOName ? (
          <>
            <ScoreBar
              scores={scores}
              xPlaying={xPlaying}
              playerXName={playerXName}
              playerOName={playerOName}
            />
            <Grid
              square={square}
              onClick={gameOver ? resetSquare : handleSquareClick}
              gridSize={gridSize}
            />
          </>
        ) : null}
      </div>
      <div className="history-zone">
        <h2>Match History</h2>
        <section>
          <ul>
            {gameHistory.map((game, index) => (
              <li
                key={index}
                className={`winner-${game.winner}`}
                onClick={() => gameHistoryClick(game)}
              >
                <p>{formatDate(game.start_time)}</p>
                <p>X: {game.playerXName}</p>
                <p>O: {game.playerOName}</p>
                <p>
                  Winner:{" "}
                  {game.winner === "D"
                    ? "Draw"
                    : game.winner === "X"
                    ? game.playerXName
                    : game.playerOName}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Main;
