/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface Point {
  x: number;
  y: number;
}

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
  isPaused: boolean;
}

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 };

export const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreChange, isPaused }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood({ x: 5, y: 5 });
    setScore(0);
    onScoreChange(0);
    setGameOver(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
          y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
        };

        // Collision with self
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Collision with food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => {
            const nextScore = s + 10;
            onScoreChange(nextScore);
            return nextScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, 150);
    return () => clearInterval(interval);
  }, [direction, food, gameOver, generateFood, onScoreChange, isPaused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw food
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ff00ff';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#00ffff' : '#00cccc';
      ctx.shadowBlur = index === 0 ? 15 : 5;
      ctx.shadowColor = '#00ffff';
      ctx.beginPath();
      ctx.roundRect(
        segment.x * cellSize + 2,
        segment.y * cellSize + 2,
        cellSize - 4,
        cellSize - 4,
        4
      );
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    if (gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00ffff';
      ctx.font = 'bold 30px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);
      ctx.font = '20px Inter';
      ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
      ctx.font = '16px Inter';
      ctx.fillText('Press R to restart', canvas.width / 2, canvas.height / 2 + 50);
    }
  }, [snake, food, gameOver, score]);

  useEffect(() => {
    const handleReset = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'r' && gameOver) {
        resetGame();
      }
    };
    window.addEventListener('keydown', handleReset);
    return () => window.removeEventListener('keydown', handleReset);
  }, [gameOver]);

  return (
    <div className="relative group">
      <canvas
        ref={canvasRef}
        width={480}
        height={480}
        className="bg-transparent"
      />
      {!gameOver && isPaused && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
          <div className="text-neon-cyan font-mono tracking-[0.5em] text-2xl animate-pulse uppercase">Pause_Active</div>
        </div>
      )}
    </div>
  );
};
