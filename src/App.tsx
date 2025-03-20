import { useEffect } from "react";
import GameBoard from "./components/GameBoard";
import GameStart from "./components/GameStart";
import { useSnakeGameContext } from "./context/useSnakeGameContext";

export default function App() {
  const {
    score,
    highestScore,
    isGameOver,
    setIsGamePaused,
    isGamePaused,
    setSnake,
    setIsGameOver,
    setDirection,
    setFruit,
    setMegaFruit,
  } = useSnakeGameContext();
  const canvasSize = Math.min(Math.max(window.innerWidth * 0.9, 300), 800);

  const handlePauseGame = () => {
    setIsGamePaused((prev) => !prev);

    if (isGamePaused) {
      const snakeItem = localStorage.getItem("snake");
      const directionItem = localStorage.getItem("snake-direction");
      const fruitItem = localStorage.getItem("snake-fruit");
      const megaFruitItem = localStorage.getItem("snake-mega-fruit");

      if (!snakeItem) return;
      if (!directionItem) return;
      if (!fruitItem) return;
      if (!megaFruitItem) return;

      setIsGameOver(false);
      setIsGamePaused(false);
      setSnake(JSON.parse(snakeItem));
      setDirection(directionItem);
      setFruit(JSON.parse(fruitItem));
      setMegaFruit(JSON.parse(megaFruitItem));
    }
  };

  useEffect(() => {});

  return (
    <>
      <div
        className={`flex w-full game-container ${
          canvasSize > 600 ? "min-h-screen  items-center " : ""
        } justify-center  `}
      >
        <div className="relative">
          {canvasSize > 600 && (
            <button
              onClick={handlePauseGame}
              className="absolute -top-10 left-0 flex flex-col "
            >
              pause
            </button>
          )}

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

      {isGameOver ? (
        <>
          <GameStart
            canvasSize={canvasSize}
            handlePauseGame={handlePauseGame}
          />
        </>
      ) : (
        isGamePaused && (
          <>
            <GameStart
              canvasSize={canvasSize}
              handlePauseGame={handlePauseGame}
            />
          </>
        )
      )}
    </>
  );
}
