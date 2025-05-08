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
    TerrainKnowledge: boolean;
    CommunityLeader: boolean;
    Resilience: boolean;
    Negotiator: boolean;
    CompassionateLeader: boolean;
  };
  currentScenario: string;
  choices: string[];
  currentBranch: number;
  gameEnded: boolean;
  ending: {
    title: string;
    description: string;
  } | null;
  page: number;
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
      TerrainKnowledge: true,
      CommunityLeader: true,
      Resilience: true,
      Negotiator: false,
      CompassionateLeader: false
    },
    currentScenario: "In 1780, there was an Indian village under the Andes Mountains in the Viceroyalty of Peru. For centuries, the indigenous people of this land had lived under the oppressive ruling of Spanish colonizers. Heavy burdens, such as the forced labor in the Potosí silver mines (mita), the harsh taxes levied on basic necessities (alcabala), and the cultural disrespect, left the people struggling for living. The older people still talked about the days when the Inca Empire was strong and prosperous, while many families struggled to maintain the way of life under this relentless exploitation. The prosperity in memory and the exploitation in reality further exacerbated their discontent.\n\nYou are Amaru, a young indigenous man known in your community for:\n- Your deep understanding of the local terrain and the hidden trails in the mountains\n- Your close tie to the community and your ability to handle disputes between families\n- Your strong dissatisfaction against the colonizers",
    choices: ["Attempt to negotiate with the tax collector", "Help villagers hide valuables in the hills"],
    currentBranch: 0,
    gameEnded: false,
    ending: null,
    page: 1
  });

  const handleChoice = (choice: string) => {
    let newState = { ...gameState };
    
    switch (gameState.currentBranch) {
      case 0: // Initial scenario
        if (choice === "Attempt to negotiate with the tax collector") {
          newState.stats.strategy += 5;
          newState.traits.Negotiator = true;
          newState.currentScenario = "The tax collector scoffs but impressed by your community situation, agrees to postpone the payment slightly.";
          newState.choices = ["Discuss rebellion rumors with the elder", "Continue dealing with tax issues"];
        } else if (choice === "Help villagers hide valuables in the hills") {
          newState.stats.strategy += 5;
          newState.stats.unity += 5;
          newState.stats.suspicion += 10;
          newState.currentScenario = "The tax collector leaves with fewer tributes but suspects the community is hiding resources.";
          newState.choices = ["Discuss rebellion rumors with the elder", "Continue dealing with tax issues"];
        }
        newState.currentBranch = 1;
        return setGameState(newState);
        break;

      case 1: // Elder discussion
        if (choice === "Discuss rebellion rumors with the elder") {
          newState.currentScenario = "Travelers from neighboring villages bring news of a growing rebellion led by Túpac Amaru II. He has claimed to be a descendant of the last Inca emperor, and aims to achieve an end to the mita system and other injustices and reform the ruling system.";
          newState.choices = [
            "The elder warns against the action",
            "The elder expresses the necessity of change",
            "The elder recalls stories of Inca resistance"
          ];
        } else if (choice === "Continue dealing with tax issues") {
          newState.currentScenario = "The tax situation remains tense. The corregidor's demands continue to grow.";
          newState.choices = ["Join the rebellion", "Stay in the village"];
        }
        newState.currentBranch = 2;
        return setGameState(newState);

      case 2: // Elder's advice
        if (choice === "The elder warns against the action") {
          newState.stats.strategy += 5;
          newState.stats.courage -= 5;
          newState.currentScenario = "The elder emphasizes the strength of the Spanish army and the risks to your community. His words make you more cautious but also slightly decrease your hope.";
        } else if (choice === "The elder expresses the necessity of change") {
          newState.stats.courage += 5;
          newState.currentScenario = "The elder urges you to consider joining the rebellion, speaking of the possibility of finally getting rid of the colonizers' rule.";
        } else if (choice === "The elder recalls stories of Inca resistance") {
          newState.stats.unity += 5;
          newState.currentScenario = "The elder's stories of Inca resistance strengthen your connection to your heritage and fill you with hope for the future.";
        }
        newState.choices = ["Join the rebellion", "Stay in the village"];
        newState.currentBranch = 3;
        return setGameState(newState);

      case 3: // Crossroads decision
        if (choice === "Join the rebellion") {
          if (newState.stats.courage >= 20) {
            newState.stats.courage += 10;
            newState.currentBranch = 4;
            newState.currentScenario = "You leave your village and join the growing group of the indigenous rebels as a subgroup leader. The rebellion drew support from various social groups and there were not just indigenous farmers, but also some mestizos and even a few Creoles.";
            newState.choices = ["Use terrain knowledge to surround enemies", "Fight bravely at the front", "Protect the wounded"];
          } else {
            newState.currentScenario = "Your courage is not enough to join the rebellion. You must stay in the village.";
            newState.choices = ["Stay in the village"];
          }
        } else if (choice === "Stay in the village") {
          newState.stats.unity += 10;
          newState.currentBranch = 8;
          newState.currentScenario = "You decide to stay in your village. You feel a heavy struggle between the unchosen rebel path and the current choice, adjusting what situation the rebel is facing. But you're determined to protect your community.";
          newState.choices = ["Plead with the corregidor", "Offer small supplies", "Refuse the requirement"];
        }
        return setGameState(newState);

      case 4: // Battle scenario (Branch 1)
        if (choice === "Use terrain knowledge to surround enemies") {
          if (newState.stats.strategy >= 25) {
            newState.stats.strategy += 5;
            newState.stats.unity += 5;
            newState.currentScenario = "The rebels achieve a surprising victory due to your terrain strategy, gaining valuable supplies.";
          } else {
            newState.currentScenario = "Your strategy is not sufficient for this complex maneuver.";
            newState.choices = ["Fight bravely at the front", "Protect the wounded"];
          }
        } else if (choice === "Fight bravely at the front") {
          if (newState.stats.courage >= 25) {
            newState.stats.courage -= 5;
            newState.currentScenario = "The rebels hold their ground, but suffer heavily.";
          } else {
            newState.currentScenario = "Your courage is not enough for this dangerous position.";
            newState.choices = ["Use terrain knowledge to surround enemies", "Protect the wounded"];
          }
        } else if (choice === "Protect the wounded") {
          if (newState.stats.unity >= 25) {
            newState.stats.unity += 2;
            newState.stats.courage -= 2;
            newState.currentScenario = "Few people are lost, and the fight ends in a retreat.";
          } else {
            newState.currentScenario = "Your unity is not enough to effectively protect the wounded.";
            newState.choices = ["Use terrain knowledge to surround enemies", "Fight bravely at the front"];
            return setGameState(newState);
          }
        }
        newState.currentBranch = 5;
        newState.choices = ["Distribute food equally", "Reward the brave fighters", "Help the newcomers"];
        return setGameState(newState);

      case 5: // Food distribution (Branch 1)
        if (choice === "Distribute food equally") {
          newState.stats.unity += 10;
          newState.stats.strategy -= 5;
          newState.currentScenario = "Some higher-ranking rebels complain, but the common fighters are grateful.";
        } else if (choice === "Reward the brave fighters") {
          newState.stats.courage += 10;
          newState.stats.unity -= 10;
          newState.currentScenario = "Distribute the brave ones with more food, but may cause discontent and jealousy among those who contributed less.";
        } else if (choice === "Help the newcomers") {
          newState.stats.unity += 5;
          newState.stats.reputation += 10;
          newState.traits.CompassionateLeader = true;
          newState.currentScenario = "Earns the gratitude of the newcomers and enhances your reputation.";
        }
        newState.currentBranch = 6;
        newState.choices = ["Explore the hidden path alone", "Report to the leadership"];
        return setGameState(newState);

      case 6: // Hidden path (Branch 1)
        if (choice === "Explore the hidden path alone") {
          if (newState.stats.courage >= 30) {
            newState.stats.courage += 5;
            newState.stats.strategy += 5;
            newState.currentScenario = "You discover a shortcut but also spot a small group of Spanish soldiers. You get back quickly with this message, reorganize the scouting routine and warn everyone to feel alert.";
          } else {
            newState.currentScenario = "Your courage is not enough to explore the path alone.";
            newState.choices = ["Report to the leadership"];
          }
        } else if (choice === "Report to the leadership") {
          if (newState.stats.unity >= 30) {
            newState.stats.unity += 5;
            newState.stats.strategy += 5;
            newState.currentScenario = "A scouting group confirms the trail and its strategic value without alerting the Spanish.";
          } else {
            newState.currentScenario = "Your unity is not enough to effectively report to the leadership.";
            newState.choices = ["Explore the hidden path alone"];
          }
        }
        newState.currentBranch = 7;
        return setGameState(newState);

      case 7: // Final battle preparation (Branch 1)
        newState.currentScenario = "The final battle approaches. Your decisions and leadership have shaped the rebellion's course. The Spanish forces are gathering, and the fate of your people hangs in the balance.";
        if (newState.stats.strategy >= 25 && newState.stats.unity >= 25 && newState.stats.courage >= 25) {
          newState.stats.strategy += 10;
          newState.stats.unity += 10;
          newState.stats.courage += 10;
        } else if (newState.stats.strategy >= 25 && newState.stats.courage < 25) {
          newState.stats.strategy += 10;
          newState.stats.unity += 5;
        } else if (newState.stats.strategy < 25 && newState.stats.courage >= 25) {
          newState.stats.courage += 10;
          newState.stats.unity -= 5;
        } else {
          newState.stats.strategy -= 5;
          newState.stats.unity -= 5;
          newState.stats.courage -= 5;
        }
        
        const endingResult = checkEnding(newState);
        if (endingResult) {
          newState.gameEnded = true;
          newState.ending = endingResult;
        }
        return setGameState(newState);

      case 8: // Corregidor confrontation (Branch 2)
        if (choice === "Plead with the corregidor") {
          if (newState.traits.Negotiator && newState.stats.unity >= 25) {
            newState.stats.strategy += 5;
            newState.stats.suspicion += 5;
            newState.currentScenario = "The magistrate is unmoved but, fearing unrest, agrees to slightly reduce his demands.";
          } else {
            newState.currentScenario = "You lack the necessary traits or unity to effectively plead with the corregidor.";
            newState.choices = ["Offer small supplies", "Refuse the requirement"];
          }
        } else if (choice === "Offer small supplies") {
          newState.stats.strategy += 10;
          newState.stats.suspicion += 10;
          newState.currentScenario = "The corregidor accepts the offer, but stays alert to the villagers.";
        } else if (choice === "Refuse the requirement") {
          if (newState.stats.courage >= 30) {
            newState.stats.courage -= 15;
            newState.stats.suspicion += 15;
            newState.currentScenario = "The corregidor is enraged and threatens immediate retaliation.";
          } else {
            newState.currentScenario = "Your courage is not enough to openly defy the corregidor.";
            newState.choices = ["Plead with the corregidor", "Offer small supplies"];
          }
        }
        newState.currentBranch = 9;
        newState.choices = ["Help the wounded rebels", "Refuse to help the rebels"];
        return setGameState(newState);
        break;

      case 9: // Wounded rebels (Branch 2)
        if (choice === "Help the wounded rebels") {
          newState.stats.unity += 10;
          newState.stats.suspicion += 10;
          newState.stats.reputation += 10;
          newState.currentScenario = "The rebels recover and eventually leave, grateful for your help. Before departing, their leader promised to remember your courage. The village remains secret, but rumors begin to spread.";
        } else if (choice === "Refuse to help the rebels") {
          newState.stats.unity -= 5;
          newState.stats.suspicion -= 5;
          newState.stats.reputation -= 5;
          newState.currentScenario = "The rebels were forced to leave the village. For now, the village is spared any suspicion from the colonial forces, and life continues with tense normalcy.";
        }
        // Check for ending
        const ending = checkEnding(newState);
        if (ending) {
          newState.gameEnded = true;
          newState.ending = ending;
        }
        break;
    }
    
    setGameState(newState);
  };

  const checkEnding = (state: GameState) => {
    // Branch 1 endings (after scenario 7)
    if (state.currentBranch === 7) {
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
      } else if (state.stats.strategy < 25 && state.stats.courage >= 25) {
        return {
          title: "Where Hope Burned",
          description: "You charge into the rebellion with passion but little support or planning. You die a hero, but your efforts are buried in blood and didn't make a big change in the oppression situation."
        };
      } else {
        return {
          title: "The Very End",
          description: "You are gradually pulled away from the front lines of the rebellion. Lacking direction, courage, and unity, you remain just a witness to history rather than a part of it."
        };
      }
    }
    
    // Branch 2 endings (after scenario 9)
    if (state.currentBranch === 9) {
      if (state.stats.strategy >= 25 && state.stats.unity >= 25 && 
          state.stats.courage >= 25 && state.stats.suspicion <= 50) {
        return {
          title: "The Shield of the People",
          description: "You navigated between rebellion and survival secretly without alerting the officials, helping the resistance while protecting your people. Your name becomes a symbol of wisdom and resilience."
        };
      } else if (state.stats.strategy >= 25 && state.stats.courage < 25 && state.stats.suspicion <= 50) {
        return {
          title: "The Silent Guardian",
          description: "You chose moderation and patience. Through negotiation and careful offerings, you preserved the village. Some admire your wisdom; others question your indifferent to the rebellion cause."
        };
      } else if (state.stats.strategy < 25 && state.stats.courage >= 25 && 
                 state.stats.unity <= 15 && state.stats.suspicion >= 50) {
        return {
          title: "Where Hope Burned",
          description: "Your open defiance sparked colonial retaliation. Lacking unity, the village collapsed under threat and pressure. Though your rebellion failed, your story becomes legend."
        };
      } else {
        return {
          title: "The Very End",
          description: "You never made a firm stand. The village faded into obscurity, forgotten by both the colonizers and history. Silence replaced memory."
        };
      }
    }
    
    return null;
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>The Resistance of the Andes</h1>
      </div>
      {gameState.page === 1 && (
        <div>
          <div className="scenario">
            <p>
              In 1780, there was an Indian village under the majestic Andes Mountains in the Viceroyalty of Peru. For centuries, the indigenous people of this land had lived under the oppressive ruling of Spanish colonizers. Heavy burdens, such as the forced labor in the Potosí silver mines (mita), the harsh taxes levied on basic necessities (alcabala), and the cultural disrespect, left the people struggling for living. The older people still talked about the days when the Inca Empire was strong and prosperous, while many families struggled to maintain the way of life under this relentless exploitation. The prosperity in memory and the exploitation in reality further exacerbated their discontent.
            </p>
            <img
              src="/plantation.jpg"
              alt="Plantation"
              className="scenario-image"
              style={{ marginTop: 20, maxWidth: "100%", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
            />
          </div>
          <div style={{ textAlign: "center" }}>
            <button className="choice-button" onClick={() => setGameState({ ...gameState, page: 2 })}>
              Next
            </button>
          </div>
        </div>
      )}
      {gameState.page === 2 && (
        <div>
          <div className="scenario">
            <p>
              <b>You are Amaru, a young indigenous man known in your community for:</b>
              <ul>
                <li>Your deep understanding of the local terrain and the hidden trails in the mountains</li>
                <li>Your close tie to the community and your ability to handle disputes between families</li>
                <li>Your strong dissatisfaction against the colonizers</li>
              </ul>
            </p>
          </div>
          <div style={{ textAlign: "center" }}>
            <button className="choice-button" onClick={() => {
              setGameState({
                ...gameState,
                page: 3,
                currentScenario: "A Spanish tax collector arrives in your village who is known for his cruelty, asking for immediate payment. The forced purchase of unwanted and overpriced Spanish goods (the reparto system) often leads to debt and further exploitation.",
                choices: [
                  "Attempt to negotiate with the tax collector",
                  "Help villagers hide valuables in the hills"
                ],
                currentBranch: 0
              });
            }}>
              Start
            </button>
          </div>
        </div>
      )}
      {gameState.page === 3 && (
        <>
          <div className="stats">
            <span>Strategy: {gameState.stats.strategy}</span>
            <span>Unity: {gameState.stats.unity}</span>
            <span>Courage: {gameState.stats.courage}</span>
            <span>Suspicion: {gameState.stats.suspicion}</span>
            <span>Reputation: {gameState.stats.reputation}</span>
          </div>
          <div className="stats-container">
            <h3>Traits</h3>
            <div className="stats">
              {Object.entries(gameState.traits).map(([trait, unlocked]) => (
                // unlocked && <span className="trait" key={trait}>{trait}</span>
                unlocked && <span key={trait}>{trait}</span>
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
        </>
      )}
    </div>
  );
};

export default Game; 