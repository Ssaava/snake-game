import { useEffect, useState } from "react";
import GameBoard from "./components/GameBoard";
import { useSnakeGameContext } from "./context/useSnakeGameContext";

export default function App() {
  const { score, highestScore } = useSnakeGameContext();
  const [canvasSize, setCanvasSize] = useState(800);

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
          canvasSize > 600 ? "min-h-100  items-center " : ""
        } justify-center  `}
      >
        <div className="relative">
          {canvasSize > 600 && (
            <>
              <div className="absolute flex flex-col ">
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
    </>
  );
}
