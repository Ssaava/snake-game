import { Dispatch, SetStateAction } from "react";

export const moveSnake = (
  snake: [number, number][],
  direction: string,
  setSnake: Dispatch<SetStateAction<[number, number][]>>,
  fruit: [number, number],
  setFruit: Dispatch<SetStateAction<[number, number]>>,
  setMegaFruit: Dispatch<SetStateAction<null | [number, number]>>,
  setIsGameOver: Dispatch<SetStateAction<boolean>>,
  setScore: Dispatch<SetStateAction<number>>,
  COLS: number,
  ROWS: number
) => {
  const newSnake: [number, number][] = [...snake];
  const snakeHead: [number, number] = [...newSnake[newSnake.length - 1]] as [
    number,
    number
  ];
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

  newSnake.push(snakeHead);
  //   check collision and remove the tail
  if (
    !checkFruitCollision(
      snakeHead,
      fruit,
      setFruit,
      setMegaFruit,
      setScore,
      COLS,
      ROWS
    )
  ) {
    newSnake.shift();
  }
  setSnake(newSnake);
  const gameOver: boolean = checkGameOver(snake, COLS, ROWS);
  setIsGameOver(gameOver);
};

const checkFruitCollision = (
  snakeHead: [number, number],
  fruit: [number, number],
  setFruit: Dispatch<SetStateAction<[number, number]>>,
  setMegaFruit: Dispatch<SetStateAction<null | [number, number]>>,
  setScore: Dispatch<SetStateAction<number>>,

  COLS: number,
  ROWS: number
) => {
  if (snakeHead[0] === fruit[0] && snakeHead[1] === fruit[1]) {
    generateFruit(setFruit, COLS, ROWS);
    generateMegaFruit(setMegaFruit, COLS, ROWS);
    setScore((prev) => (prev += 1));
    return true;
  }
  return false;
};

const generateFruit = (
  setFruit: Dispatch<SetStateAction<[number, number]>>,
  COLS: number,
  ROWS: number
) => {
  const newFruit: [number, number] = [
    Math.floor(Math.random() * COLS),
    Math.floor(Math.random() * ROWS),
  ];
  setFruit(newFruit);
};

export const handleUserDirections = (e: { key: any }, setDirection: any) => {
  switch (e.key) {
    case "ArrowUp":
      setDirection("up");
      break;
    case "ArrowDown":
      setDirection("down");
      break;
    case "ArrowLeft":
      setDirection("left");
      break;
    case "ArrowRight":
      setDirection("right");
      break;
  }
};

export const checkGameOver = (
  snake: [number, number][],
  COLS: number,
  ROWS: number
): boolean => {
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
  setMegaFruit: Dispatch<React.SetStateAction<null | [number, number]>>,
  COLS: number,
  ROWS: number
) => {
  if (Math.random() < 0.1) {
    const newMegaFruit: [number, number] = [
      Math.floor(Math.random() * COLS),
      Math.floor(Math.random() * ROWS),
    ];
    setMegaFruit(newMegaFruit);
  }
};
