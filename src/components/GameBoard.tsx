import { useEffect, useRef } from "react";
import { useSnakeGameContext } from "../context/useSnakeGameContext";
import { drawFruit, generateMegaFruit } from "../utils/helpers";

type Props = {
  canvasSize: number;
};
const ROWS = 20;
const COLS = 20;
const GameBoard = ({ canvasSize }: Props) => {
  const {
    snake,
    fruit,
    megaFruit,
    setMegaFruit,
    score,
    setScore,
    moveSnake,
    isGameOver,
  } = useSnakeGameContext();

  const canvasRef = useRef(null);

  const GRID_SIZE = canvasSize / ROWS;

  useEffect(() => {
    const canvas = canvasRef.current as unknown as HTMLCanvasElement;
    if (!canvas) return;
    const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvasSize;
    canvas.height = canvasSize;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw the normal the fruit
    drawFruit(ctx, GRID_SIZE, fruit);
    if (megaFruit) {
      drawFruit(ctx, GRID_SIZE, megaFruit, "gold");
    }

    const gameLoop = setInterval(() => {
      if (!isGameOver) {
        moveSnake();
      }
    }, 200);
    snake.forEach(([x, y]) => {
      ctx.fillStyle = "green";
      ctx.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    });
    return () => clearInterval(gameLoop);
  }, [snake, isGameOver]);

  return (
    <canvas
      ref={canvasRef}
      style={{ border: "1px solid black", padding: "2px" }}
    />
  );
};

export default GameBoard;
