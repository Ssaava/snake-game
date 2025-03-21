import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  checkFruitCollision,
  checkGameOver,
  clearStorage,
  handleProgressStorage,
  handleUserDirections,
} from "../utils/helpers";

type SnakeGameContextType = {
  moveSnake: () => void;
  isGameOver: boolean;
  gameOver: boolean;
  isGamePaused: boolean;
  score: number;
  highestScore: number;
  snake: [number, number][];
  fruit: [number, number];
  megaFruit: null | [number, number];
  direction: string;
  setSnake: Dispatch<SetStateAction<[number, number][]>>;
  setDirection: Dispatch<SetStateAction<string>>;
  setScore: Dispatch<SetStateAction<number>>;
  setFruit: Dispatch<SetStateAction<[number, number]>>;
  setMegaFruit: Dispatch<SetStateAction<null | [number, number]>>;
  setIsGameOver: Dispatch<SetStateAction<boolean>>;
  setIsGamePaused: Dispatch<SetStateAction<boolean>>;
};

const SnakeGameContextProvider = createContext<SnakeGameContextType>(
  {} as SnakeGameContextType
);

export const SnakeGameContext = ({ children }: { children: ReactNode }) => {
  const [snake, setSnake] = useState<[number, number][]>(
    localStorage.getItem("snake")
      ? JSON.parse(localStorage.getItem("snake") || "[]")
      : [
          [0, 0],
          [1, 0],
          [2, 0],
        ]
  );
  const [direction, setDirection] = useState("right");
  const [isGameOver, setIsGameOver] = useState(
    localStorage.getItem("snake-game-over")
      ? JSON.parse(localStorage.getItem("snake-game-over") || "true")
      : true
  );
  const [isGamePaused, setIsGamePaused] = useState(
    localStorage.getItem("snake-game-paused")
      ? JSON.parse(localStorage.getItem("snake-game-paused") || "true")
      : false
  );
  const [fruit, setFruit] = useState<[number, number]>(
    localStorage.getItem("snake-fruit")
      ? JSON.parse(localStorage.getItem("snake-fruit") || "[]")
      : [5, 0]
  );
  const [megaFruit, setMegaFruit] = useState<null | [number, number]>(
    localStorage.getItem("snake-fruit")
      ? JSON.parse(localStorage.getItem("snake-mega-fruit") || "[]")
      : null
  );
  const [score, setScore] = useState<number>(
    localStorage.getItem("snake-score")
      ? Number(localStorage.getItem("snake-score"))
      : 0
  );
  const [highestScore, setHighestScore] = useState(
    Number(localStorage.getItem("highScore")) || 0
  );

  const [gameOver, setGameOver] = useState<boolean>(false);
  const isKeyPressed = useRef(false);
  const moveSnake = () => {
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
    const snakeGrowth = checkFruitCollision(
      snakeHead,
      fruit,
      megaFruit,
      setFruit,
      setMegaFruit
    );

    newSnake.push(snakeHead);
    const gameOver: boolean = checkGameOver(newSnake);
    if (gameOver) {
      setGameOver(gameOver);
      setIsGameOver(gameOver);
      clearStorage();
      return;
    }

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
  };

  useEffect(() => {
    handleProgressStorage(
      snake,
      fruit,
      megaFruit,
      score,
      highestScore,
      isGameOver,
      direction,
      isGamePaused,
      setHighestScore
    );
    if (isGameOver) {
      clearStorage();
    }
  }, [score, isGameOver, isGamePaused]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isKeyPressed.current) {
        isKeyPressed.current = true;
        handleUserDirections({ key: e.key }, direction, setDirection);
      }
    };

    const handleKeyUp = () => {
      isKeyPressed.current = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [direction]);
  return (
    <>
      <SnakeGameContextProvider.Provider
        value={{
          moveSnake: moveSnake,
          isGameOver: isGameOver,
          gameOver: gameOver,
          isGamePaused: isGamePaused,
          score: score,
          highestScore: highestScore,
          snake: snake,
          direction: direction,
          fruit: fruit,
          megaFruit: megaFruit,
          setSnake: setSnake,
          setDirection: setDirection,
          setScore: setScore,
          setFruit: setFruit,
          setMegaFruit: setMegaFruit,
          setIsGameOver: setIsGameOver,
          setIsGamePaused: setIsGamePaused,
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
