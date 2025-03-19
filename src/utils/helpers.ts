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

export const checkCurrentDirection = (
  snakeHead: [number, number],
  direction: string
) => {
  switch (direction) {
    case "up":
      snakeHead[1] -= 1;
      break;
    case "down":
      snakeHead[1] += 1;
      break;
    case "left":
      snakeHead[0] -= 1;
      break;
    case "right":
      snakeHead[0] += 1;
      break;
  }
};

export const handleHighScoreStorage = (
  score: number,
  highSore: number,
  isGameOver: boolean,
  setHighestScore: Dispatch<SetStateAction<number>>
) => {
  if (isGameOver && score > highSore) {
    localStorage.setItem("highScore", score.toString());
    setHighestScore(score);
  }
};
