import { useEffect, useState } from "react";
import GameBoard from "./components/GameBoard";
import { useSnakeGameContext } from "./context/useSnakeGameContext";

export default function App() {
  const { score } = useSnakeGameContext();
  const [highestScore, setHighestScore] = useState<number>(
    localStorage.getItem("highestScore")
      ? parseInt(localStorage.getItem("snakeHighScore")!)
      : 0
  );

  useEffect(() => {
    const highestScore: number = parseInt(
      localStorage.getItem("snakeHighScore") || "0"
    );
    if (highestScore < score) {
      setHighestScore(highestScore);
    }
  }, []);
  return (
    <>
      <div className="canvas-container">
        <div className="absolute flex flex-col ">
          <p className="font-bold">Score: {score}</p>
          <p className="font-bold">Highest Score: {highestScore}</p>
        </div>

        <GameBoard canvasSize={800} />
      </div>
    </>
  );
}
