import { Dispatch, SetStateAction } from "react";

const COLS: number = 20;
const ROWS: number = 20;

export const checkFruitCollision = (
  snakeHead: [number, number],
  fruit: [number, number],
  megaFruit: null | [number, number],
  setFruit: Dispatch<SetStateAction<[number, number]>>,
  setMegaFruit: Dispatch<SetStateAction<null | [number, number]>>
): number => {
  if (snakeHead[0] === fruit[0] && snakeHead[1] === fruit[1]) {
    generateFruit(setFruit);
    generateMegaFruit(setMegaFruit);
    return 1;
  }

  if (
    megaFruit &&
    snakeHead[0] === megaFruit[0] &&
    snakeHead[1] === megaFruit[1]
  ) {
    setMegaFruit(null);
    return 3;
  }

  return 0;
};

const generateFruit = (
  setFruit: Dispatch<SetStateAction<[number, number]>>
) => {
  const newFruit: [number, number] = [
    Math.floor(Math.random() * COLS),
    Math.floor(Math.random() * ROWS),
  ];
  setFruit(newFruit);
};

export const handleUserDirections = (
  input: { key?: string; direction?: string },
  setDirection: Dispatch<SetStateAction<string>>
) => {
  const directionInput = input.key?.toLowerCase() || input.direction;

  switch (directionInput) {
    case "arrowup":
    case "up":
      setDirection("up");
      break;
    case "arrowdown":
    case "down":
      setDirection("down");
      break;
    case "arrowleft":
    case "left":
      setDirection("left");
      break;
    case "arrowright":
    case "right":
      setDirection("right");
      break;
    case "w":
      setDirection("up");
      break;
    case "s":
      setDirection("down");
      break;
    case "a":
      setDirection("left");
      break;
    case "d":
      setDirection("right");
      break;
    default:
      break;
  }
};

export const checkGameOver = (snake: [number, number][]): boolean => {
  // Check wall collision
  const snakeHead: [number, number] = snake[snake.length - 1];
  if (
    snakeHead[0] < 0 ||
    snakeHead[0] >= COLS ||
    snakeHead[1] < 0 ||
    snakeHead[1] >= ROWS
  ) {
    return true;
  }

  for (let i = 0; i < snake.length - 1; i++) {
    if (snakeHead[0] === snake[i][0] && snakeHead[1] === snake[i][1]) {
      return true;
    }
  }
  return false;
};

export const generateMegaFruit = (
  setMegaFruit: Dispatch<React.SetStateAction<null | [number, number]>>
) => {
  if (Math.random() < 0.1) {
    const newMegaFruit: [number, number] = [
      Math.floor(Math.random() * COLS),
      Math.floor(Math.random() * ROWS),
    ];
    setMegaFruit(newMegaFruit);
  }
};

export const drawFruit = (
  ctx: CanvasRenderingContext2D,
  GRID_SIZE: number,
  fruit: [number, number],
  color: string = "red"
) => {
  ctx.fillStyle = color;
  ctx.fillRect(
    fruit[0] * GRID_SIZE,
    fruit[1] * GRID_SIZE,
    GRID_SIZE,
    GRID_SIZE
  );
};

export const handleProgressStorage = (
  snake: [number, number][],
  score: number,
  highSore: number,
  isGameOver: boolean,
  setHighestScore: Dispatch<SetStateAction<number>>
) => {
  if (isGameOver && score > highSore) {
    localStorage.setItem("highScore", score.toString());
    setHighestScore(score);
  }
  localStorage.setItem("snake", JSON.stringify(snake));
};

export const drawSnake = (
  snake: [number, number][],
  ctx: CanvasRenderingContext2D,
  GRID_SIZE: number
) => {
  snake.forEach(([x, y], index) => {
    if (index === snake.length - 1) {
      const direction = getSnakeDirection(snake);
      const headX = x * GRID_SIZE + GRID_SIZE / 2;
      const headY = y * GRID_SIZE + GRID_SIZE / 2;

      ctx.fillStyle = "green";
      ctx.strokeStyle = "darkgreen";
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.ellipse(
        headX,
        headY,
        GRID_SIZE / 2, // Horizontal radius
        GRID_SIZE / 3, // Vertical radius
        0, // Rotation
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.stroke();

      // Draw the eyes
      ctx.fillStyle = "white";
      ctx.beginPath();
      if (direction === "up" || direction === "down") {
        ctx.arc(
          headX - GRID_SIZE / 4,
          headY - GRID_SIZE / 6,
          2,
          0,
          Math.PI * 2
        ); // Left eye
        ctx.arc(
          headX + GRID_SIZE / 4,
          headY - GRID_SIZE / 6,
          2,
          0,
          Math.PI * 2
        );
      } else {
        ctx.arc(
          headX - GRID_SIZE / 6,
          headY - GRID_SIZE / 4,
          2,
          0,
          Math.PI * 2
        );
        ctx.arc(
          headX - GRID_SIZE / 6,
          headY + GRID_SIZE / 4,
          2,
          0,
          Math.PI * 2
        );
      }
      ctx.fill();

      // Draw a forked tongue
      if (direction === "up") {
        ctx.moveTo(headX - 2, headY - GRID_SIZE / 4); // Left base of the tongue
        ctx.lineTo(headX - 2, headY - GRID_SIZE / 2); // Left tip of the tongue
        ctx.moveTo(headX + 2, headY - GRID_SIZE / 4); // Right base of the tongue
        ctx.lineTo(headX + 2, headY - GRID_SIZE / 2); // Right tip of the tongue
      } else if (direction === "down") {
        ctx.moveTo(headX - 2, headY + GRID_SIZE / 4); // Left base of the tongue
        ctx.lineTo(headX - 2, headY + GRID_SIZE / 2); // Left tip of the tongue
        ctx.moveTo(headX + 2, headY + GRID_SIZE / 4); // Right base of the tongue
        ctx.lineTo(headX + 2, headY + GRID_SIZE / 2); // Right tip of the tongue
      } else if (direction === "left") {
        ctx.moveTo(headX - GRID_SIZE / 4, headY - 2); // Top base of the tongue
        ctx.lineTo(headX - GRID_SIZE / 2, headY - 2); // Top tip of the tongue
        ctx.moveTo(headX - GRID_SIZE / 4, headY + 2); // Bottom base of the tongue
        ctx.lineTo(headX - GRID_SIZE / 2, headY + 2); // Bottom tip of the tongue
      } else if (direction === "right") {
        ctx.moveTo(headX + GRID_SIZE / 4, headY - 2); // Top base of the tongue
        ctx.lineTo(headX + GRID_SIZE / 2, headY - 2); // Top tip of the tongue
        ctx.moveTo(headX + GRID_SIZE / 4, headY + 2); // Bottom base of the tongue
        ctx.lineTo(headX + GRID_SIZE / 2, headY + 2); // Bottom tip of the tongue
      }
      ctx.stroke();
    } else {
      ctx.fillStyle = "green";
      ctx.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
    }
  });
};

export const getSnakeDirection = (snake: number[][]) => {
  const head = snake[snake.length - 1];
  const secondSegment = snake[snake.length - 2];

  if (!secondSegment) return "right";

  const deltaX = head[0] - secondSegment[0];
  const deltaY = head[1] - secondSegment[1];

  if (deltaX === 1) return "right";
  if (deltaX === -1) return "left";
  if (deltaY === 1) return "down";
  if (deltaY === -1) return "up";

  return "right";
};
