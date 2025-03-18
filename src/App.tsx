import GameBoard from "./components/GameBoard";
import { useSnakeGameContext } from "./context/useSnakeGameContext";

export default function App() {
  const { score, highestScore } = useSnakeGameContext();

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
