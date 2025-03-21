import { useEffect, useRef, useState } from "react";
import { useSnakeGameContext } from "../context/useSnakeGameContext";
import { drawFruit, drawSnake, handleUserDirections } from "../utils/helpers";

type Props = {
  canvasSize: number;
};
const ROWS = 20;
const GameBoard = ({ canvasSize }: Props) => {
  const {
    snake,
    fruit,
    megaFruit,
    direction,
    moveSnake,
    isGameOver,
    isGamePaused,
    setDirection,
  } = useSnakeGameContext();
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });

  const canvasRef = useRef(null);

  const GRID_SIZE = canvasSize / ROWS;

  // @ts-ignore
  const handleTouchStart = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  // @ts-ignore
  const handleTouchMove = (e) => {
    e.preventDefault();
    if (!touchStart) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        handleUserDirections({ direction: "right" }, direction, setDirection);
      } else {
        handleUserDirections({ direction: "left" }, direction, setDirection);
      }
    } else {
      if (deltaY > 0) {
        handleUserDirections({ direction: "down" }, direction, setDirection);
      } else {
        handleUserDirections({ direction: "up" }, direction, setDirection);
      }
    }

    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

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
        !isGamePaused && moveSnake();
      }
    }, 200);

    drawSnake(snake, ctx, GRID_SIZE);

    return () => clearInterval(gameLoop);
  }, [snake, isGameOver]);

  return (
    <canvas
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      ref={canvasRef}
      style={{ border: "1px solid black", padding: "2px", touchAction: "none" }}
      tabIndex={0}
    />
  );
};

export default GameBoard;
