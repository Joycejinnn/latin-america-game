import React, { useState } from 'react';
import './Game.css';

interface GameState {
  year: number;
  stats: {
    strategy: number;
    unity: number;
    courage: number;
    suspicion: number;
    reputation: number;
  };
  traits: {
    terrainKnowledge: boolean;
    communityLeader: boolean;
    resilience: boolean;
    negotiator: boolean;
    compassionateLeader: boolean;
  };
  currentScenario: string;
  choices: string[];
  currentBranch: number;
  gameEnded: boolean;
  ending: {
    title: string;
    description: string;
  } | null;
}

const Game: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    year: 1780,
    stats: {
      strategy: 20,
      unity: 20,
      courage: 20,
      suspicion: 0,
      reputation: 0
    },
    traits: {
      terrainKnowledge: true,
      communityLeader: true,
      resilience: true,
      negotiator: false,
      compassionateLeader: false
    },
    currentScenario: "In 1780, there was an Indian village under the majestic Andes Mountains in the Viceroyalty of Peru. For centuries, the indigenous people of this land had lived under the oppressive ruling of Spanish colonizers. Heavy burdens, such as the forced labor in the Potosí silver mines (mita), the harsh taxes levied on basic necessities (alcabala), and the cultural disrespect, left the people struggling for living. The older people still talked about the days when the Inca Empire was strong and prosperous, while many families struggled to maintain the way of life under this relentless exploitation. The prosperity in memory and the exploitation in reality further exacerbated their discontent.\n\nYou are Amaru, a young indigenous man known in your community for:\n- Your deep understanding of the local terrain and the hidden trails in the mountains\n- Your close tie to the community and your ability to handle disputes between families\n- Your strong dissatisfaction against the colonizers",
    choices: ["Attempt to negotiate with the tax collector", "Help villagers hide valuables in the hills"],
    currentBranch: 0,
    gameEnded: false,
    ending: null
  });

  const handleChoice = (choice: string) => {
    let newState = { ...gameState };
    
    switch (gameState.currentBranch) {
      case 0: 
        if (choice === "Attempt to negotiate with the tax collector") {
          newState.stats.strategy += 5;
          newState.traits.negotiator = true;
          newState.currentScenario = "The tax collector scoffs but impressed by your community situation, agrees to postpone the payment slightly.";
          newState.choices = ["Discuss rebellion rumors with the elder", "Continue dealing with tax issues"];
        } else if (choice === "Help villagers hide valuables in the hills") {
          newState.stats.strategy += 5;
          newState.stats.unity += 5;
          newState.stats.suspicion += 10;
          newState.currentScenario = "The tax collector leaves with fewer tributes but suspects the community is hiding resources.";
          newState.choices = ["Discuss rebellion rumors with the elder", "Continue dealing with tax issues"];
        }
        break;
        
      case 1: // Rebellion branch
        if (choice === "Join the rebellion") {
          newState.stats.courage += 10;
          newState.currentBranch = 1;
          newState.currentScenario = "You leave your village and join the growing group of the indigenous rebels as a subgroup leader. The rebellion drew support from various social groups and there were not just indigenous farmers, but also some mestizos and even a few Creoles.";
          newState.choices = ["Use terrain knowledge to surround enemies", "Fight bravely at the front", "Protect the wounded"];
        }
        break;
        
      case 2: // Independent path
        if (choice === "Stay in the village") {
          newState.stats.unity += 10;
          newState.currentBranch = 2;
          newState.currentScenario = "You decide to stay in your village. You feel a heavy struggle between the unchosen rebel path and the current choice, adjusting what situation the rebel is facing. But you're determined to protect your community.";
          newState.choices = ["Plead with the corregidor", "Offer small supplies", "Refuse the requirement"];
        }
        break;
    }
    
    // Check for ending conditions
    const ending = checkEnding(newState);
    if (ending) {
      newState.gameEnded = true;
      newState.ending = ending;
    }
    
    setGameState(newState);
  };

  const checkEnding = (state: GameState) => {
    if (state.currentBranch === 1) { // Rebellion branch endings
      if (state.stats.strategy >= 25 && state.stats.unity >= 25 && state.stats.courage >= 25) {
        return {
          title: "Legendary of the Andes",
          description: "You become a legendary leader—wise, brave, and deeply loved by your people. Under your guidance, the regions that you fight for successfully resist colonial control and remember your name for centuries."
        };
      } else if (state.stats.strategy >= 25 && state.stats.courage < 25) {
        return {
          title: "The Quiet Shield",
          description: "You protect your people through wisdom and solidarity, avoiding direct confrontation. Though the rebellion falters, your village survives and thrives in secret."
        };
      }
      // Add other rebellion endings...
    } else if (state.currentBranch === 2) { // Independent path endings
      if (state.stats.strategy >= 25 && state.stats.unity >= 25 && 
          state.stats.courage >= 25 && state.stats.suspicion <= 50) {
        return {
          title: "The Shield of the People",
          description: "You navigated between rebellion and survival secretly without alerting the officials, helping the resistance while protecting your people. Your name becomes a symbol of wisdom and resilience."
        };
      }
      // Add other independent path endings...
    }
    return null;
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>The Shadow of the Andes</h1>
        <div className="stats">
          <span>Stategy: {gameState.stats.strategy}</span>
          <span>Unity: {gameState.stats.unity}</span>
          <span>Courage: {gameState.stats.courage}</span>
          <span>Suspicion: {gameState.stats.suspicion}</span>
          <span>Reputation: {gameState.stats.reputation}</span>
        </div>
        <div className="traits">
          {Object.entries(gameState.traits).map(([trait, unlocked]) => (
            unlocked && <span key={trait} className="trait">{trait}</span>
          ))}
        </div>
      </div>
      
      <div className="scenario">
        <p>{gameState.currentScenario}</p>
      </div>
      
      {!gameState.gameEnded ? (
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
      ) : (
        <div className="ending">
          <h2>{gameState.ending?.title}</h2>
          <p>{gameState.ending?.description}</p>
          <button onClick={() => window.location.reload()}>Start New Game</button>
        </div>
      )}
    </div>
  );
};

export default Game; 