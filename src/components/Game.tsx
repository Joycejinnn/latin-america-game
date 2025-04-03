import React, { useState } from 'react';
import './Game.css';

interface GameState {
  year: number;
  resources: {
    gold: number;
    influence: number;
    population: number;
  };
  currentScenario: string;
  choices: string[];
}

const Game: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    year: 1492,
    resources: {
      gold: 100,
      influence: 50,
      population: 1000
    },
    currentScenario: "你是一名西班牙探险家，刚刚抵达新大陆。你面前是一片未知的土地，充满了机遇和危险。",
    choices: ["探索内陆", "建立定居点", "与当地部落接触"]
  });

  const handleChoice = (choice: string) => {
    // 这里将实现选择后的逻辑
    console.log(`玩家选择了: ${choice}`);
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>拉丁美洲历史冒险</h1>
        <div className="resources">
          <span>年份: {gameState.year}</span>
          <span>黄金: {gameState.resources.gold}</span>
          <span>影响力: {gameState.resources.influence}</span>
          <span>人口: {gameState.resources.population}</span>
        </div>
      </div>
      
      <div className="scenario">
        <p>{gameState.currentScenario}</p>
      </div>
      
      <div className="choices">
        {gameState.choices.map((choice, index) => (
          <button 
            key={index}
            onClick={() => handleChoice(choice)}
            className="choice-button"
          >
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Game; 