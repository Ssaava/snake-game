import { useEffect, useState } from "react";
import GameBoard from "./components/GameBoard";
import { useSnakeGameContext } from "./context/useSnakeGameContext";

export default function App() {
  const {
    score,
    highestScore,
    isGameOver,
    setIsGameOver,
    setSnake,
    setDirection,
    setFruit,
  } = useSnakeGameContext();
  const [canvasSize, setCanvasSize] = useState(800);

  const handleStartGame = () => {
    setIsGameOver(false);
    setSnake([
      [0, 0],
      [1, 0],
      [2, 0],
    ]);
    setDirection("right");
    setFruit([5, 0]);
  };

  useEffect(() => {
    const adjustCanvasSize = () => {
      setCanvasSize(Math.min(Math.max(window.innerWidth * 0.9, 300), 800));
    };
    adjustCanvasSize();
    window.addEventListener("resize", adjustCanvasSize);
    return () => window.removeEventListener("resize", adjustCanvasSize);
  }, []);

  return (
    <>
      <div
        className={`flex w-full game-container ${
          canvasSize > 600 ? "min-h-screen  items-center " : ""
        } justify-center  `}
      >
        <div className="relative">
          {canvasSize > 600 && (
            <>
              <div className="absolute top-0 right-0 flex flex-col ">
                <p className="font-bold">Score: {score}</p>
                <p className="font-bold">Highest Score: {highestScore}</p>
              </div>
            </>
          )}
          <GameBoard canvasSize={canvasSize} />
        </div>
      </div>
      {canvasSize < 600 && (
        <div className="flex flex-col items-center justify-center">
          <p className="font-bold">Score: {score}</p>
          <p className="font-bold">Highest Score: {highestScore}</p>
        </div>
      )}

      {isGameOver && (
        <>
          <div className="absolute top-0 right-0 bottom-0 left-0 z-10 min-w-screen min-h-screen flex items-center justify-center bg-blur">
            <div className="border text-center flex flex-col gap-4 settings">
              <h1 className="text-center"> Snake Game</h1>
              <p className="font-bold">Highest Score: {highestScore}</p>

              <div className="flex gap-4 items-center w-fit mx-auto ">
                <button type="button" onClick={handleStartGame}>
                  Start Game
                </button>
                <button type="button" onClick={handleStartGame}>
                  Restart Game
                </button>
                <button>Resume Game</button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
