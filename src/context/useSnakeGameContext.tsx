import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  checkCurrentDirection,
  checkFruitCollision,
  checkGameOver,
  handleUserDirections,
} from "../utils/helpers";

type SnakeGameContextType = {
  moveSnake: () => void;
  isGameOver: boolean;
  score: number;
  snake: [number, number][];
  fruit: [number, number];
  megaFruit: null | [number, number];
  direction: string;
  setSnake: Dispatch<SetStateAction<[number, number][]>>;
  setDirection: Dispatch<SetStateAction<string>>;
  setScore: Dispatch<SetStateAction<number>>;
  setFruit: Dispatch<SetStateAction<[number, number]>>;
  setMegaFruit: Dispatch<SetStateAction<null | [number, number]>>;
};

const SnakeGameContextProvider = createContext<SnakeGameContextType>(
  {} as SnakeGameContextType
);

export const SnakeGameContext = ({ children }: { children: ReactNode }) => {
  const [snake, setSnake] = useState<[number, number][]>([
    [0, 0],
    [1, 0],
    [2, 0],
  ]);
  const [direction, setDirection] = useState("right");
  const [isGameOver, setIsGameOver] = useState(false);
  const [fruit, setFruit] = useState<[number, number]>([5, 0]);
  const [megaFruit, setMegaFruit] = useState<null | [number, number]>(null);
  const [score, setScore] = useState<number>(0);

  const moveSnake = () => {
    const newSnake: [number, number][] = [...snake];
    const snakeHead: [number, number] = [...newSnake[newSnake.length - 1]] as [
      number,
      number
    ];

    checkCurrentDirection(snakeHead, direction);
    const snakeGrowth = checkFruitCollision(
      snakeHead,
      fruit,
      megaFruit,
      setFruit,
      setMegaFruit
    );

    newSnake.push(snakeHead);

    if (snakeGrowth === 0) {
      newSnake.shift();
    } else {
      setScore((prev) => prev + snakeGrowth);
      if (snakeGrowth === 3) {
        for (let i = 0; i < 2; i++) {
          newSnake.unshift(newSnake[0]);
        }
      }
    }

    setSnake(newSnake);
    const gameOver: boolean = checkGameOver(snake);
    setIsGameOver(gameOver);
  };

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
    <>
      <SnakeGameContextProvider.Provider
        value={{
          moveSnake: moveSnake,
          isGameOver: isGameOver,
          score: score,
          snake: snake,
          direction: direction,
          fruit: fruit,
          megaFruit: megaFruit,
          setSnake: setSnake,
          setDirection: setDirection,
          setScore: setScore,
          setFruit: setFruit,
          setMegaFruit: setMegaFruit,
        }}
      >
        {children}
      </SnakeGameContextProvider.Provider>
    </>
  );
};

export const useSnakeGameContext = () => {
  return useContext(SnakeGameContextProvider);
};
