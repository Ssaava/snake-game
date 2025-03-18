import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { handleUserDirections, moveSnake } from "../utils/helpers";

type Props = {
  canvasSize: number;
  score: number;
  setScore: Dispatch<SetStateAction<number>>;
};
const GameBoard = ({ canvasSize, score, setScore }: Props) => {
  const [snake, setSnake] = useState<[number, number][]>([
    [0, 0],
    [1, 0],
    [2, 0],
  ]);
  const ROWS: number = 20;
  const COLS: number = 20;
  const [fruit, setFruit] = useState<[number, number]>([5, 0]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [megaFruit, setMegaFruit] = useState<null | [number, number]>(null);

  const canvasRef = useRef(null);

  const [direction, setDirection] = useState("right");

  const GRID_SIZE = canvasSize / ROWS;

  useEffect(() => {
    const canvas = canvasRef.current as unknown as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvasSize;
    canvas.height = canvasSize;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // create the fruit
    ctx.fillStyle = "red";
    ctx.fillRect(
      fruit[0] * GRID_SIZE,
      fruit[1] * GRID_SIZE,
      GRID_SIZE,
      GRID_SIZE
    );
    // Draw the mega fruit
    if (megaFruit) {
      ctx.fillStyle = "gold";
      ctx.fillRect(
        megaFruit[0] * GRID_SIZE,
        megaFruit[1] * GRID_SIZE,
        GRID_SIZE,
        GRID_SIZE
      );
    }

    const head = snake[snake.length - 1];

    if (megaFruit && head[0] === megaFruit[0] && head[1] === megaFruit[1]) {
      setScore(score + 5);
      setMegaFruit(null);
    }
    const gameLoop = setInterval(() => {
      !isGameOver &&
        moveSnake(
          snake,
          direction,
          setSnake,
          fruit,
          setFruit,
          setMegaFruit,
          setIsGameOver,
          setScore,
          COLS,
          ROWS
        );
    }, 200);
    snake.forEach(([x, y]) => {
      ctx.fillStyle = "green";
      ctx.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    });
    return () => clearInterval(gameLoop);
  }, [snake]);

  console.log("Score: ", score);

  // handle user directions
  useEffect(() => {
    window.addEventListener("keydown", (e) =>
      handleUserDirections(e, setDirection)
    );
    return () =>
      window.removeEventListener("keydown", (e) =>
        handleUserDirections(e, setDirection)
      );
  }, []);
  return (
    <canvas
      ref={canvasRef}
      style={{ border: "1px solid black", padding: "2px" }}
    />
  );
};

export default GameBoard;
