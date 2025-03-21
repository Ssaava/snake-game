import { useSnakeGameContext } from "../context/useSnakeGameContext";
import { clearStorage } from "../utils/helpers";

type Props = {
  canvasSize: number;
  handlePauseGame: () => void;
};
const GameStart = ({ canvasSize, handlePauseGame }: Props) => {
  const {
    highestScore,
    isGamePaused,
    setIsGameOver,
    setSnake,
    gameOver,
    setDirection,
    setFruit,
    setMegaFruit,
    setIsGamePaused,
  } = useSnakeGameContext();

  const handleStartGame = () => {
    setIsGameOver(false);
    setIsGamePaused(false);
    setSnake([
      [0, 0],
      [1, 0],
      [2, 0],
    ]);
    setDirection("right");
    setFruit([5, 0]);
    setMegaFruit(null);
    clearStorage();
  };

  return (
    <div
      className={`absolute top-0 right-0 px-4 bottom-0 left-0 z-10 min-w-screen min-h-screen ${
        canvasSize < 600 ? "pt-6" : "flex items-center justify-center"
      } bg-blur`}
    >
      <div className="border text-center flex flex-col gap-4 settings">
        <h1 className="text-center"> Snake Game</h1>
        {isGamePaused && <h2 className="text-center"> Game is Paused</h2>}
        {gameOver && <h2 className="text-red-500 text-center"> Game Over</h2>}
        <p className="font-bold">Highest Score: {highestScore}</p>

        <div className="flex flex-wrap gap-4 items-center w-fit mx-auto ">
          {isGamePaused ? (
            <>
              <button type="button" onClick={handleStartGame}>
                Start New Game
              </button>
              <button onClick={handlePauseGame}>Resume Game</button>
            </>
          ) : (
            <button type="button" onClick={handleStartGame}>
              Start Game
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameStart;
