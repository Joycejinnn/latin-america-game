import React, { useState } from 'react';
import './Game.css';
import plantation from '../assets/plantation.jpg';

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
    Rebel: boolean;
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
  resultPending: boolean;
  resultText: string;
  retryCurrent?: boolean;
}

function getStatChangeText(oldStats: { strategy: number; unity: number; courage: number; suspicion: number; reputation: number; }, newStats: { strategy: number; unity: number; courage: number; suspicion: number; reputation: number; }) {
  const changes = [];
  if (newStats.strategy !== oldStats.strategy) changes.push(`Strategy ${newStats.strategy > oldStats.strategy ? "+" : ""}${newStats.strategy - oldStats.strategy}`);
  if (newStats.unity !== oldStats.unity) changes.push(`Unity ${newStats.unity > oldStats.unity ? "+" : ""}${newStats.unity - oldStats.unity}`);
  if (newStats.courage !== oldStats.courage) changes.push(`Courage ${newStats.courage > oldStats.courage ? "+" : ""}${newStats.courage - oldStats.courage}`);
  if (newStats.suspicion !== oldStats.suspicion) changes.push(`Suspicion ${newStats.suspicion > oldStats.suspicion ? "+" : ""}${newStats.suspicion - oldStats.suspicion}`);
  if (newStats.reputation !== oldStats.reputation) changes.push(`Reputation ${newStats.reputation > oldStats.reputation ? "+" : ""}${newStats.reputation - oldStats.reputation}`);
  return changes.length > 0 ? `\n\nStatistic Changes: ${changes.join(", ")}` : "";
}

function getTraitChangeText(
  oldTraits: GameState['traits'],
  newTraits: GameState['traits']
) {
  const changes = [];
  for (const key of Object.keys(newTraits) as Array<keyof GameState['traits']>) {
    if (!oldTraits[key] && newTraits[key]) {
      changes.push(`Trait unlocked: ${key}`);
    }
  }
  return changes.length > 0 ? `\n${changes.join(", ")}` : "";
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
      CompassionateLeader: false,
      Rebel: false
    },
    currentScenario: "In 1780, there was an Indian village under the Andes Mountains in the Viceroyalty of Peru. For centuries, the indigenous people of this land had lived under the oppressive ruling of Spanish colonizers. Heavy burdens, such as the forced labor in the Potosí silver mines (mita), the harsh taxes levied on basic necessities (alcabala), and the cultural disrespect, left the people struggling for living. The older people still talked about the days when the Inca Empire was strong and prosperous, while many families struggled to maintain the way of life under this relentless exploitation. The prosperity in memory and the exploitation in reality further exacerbated their discontent.\n\nYou are Amaru, a young indigenous man known in your community for:\n- Your deep understanding of the local terrain and the hidden trails in the mountains\n- Your close tie to the community and your ability to handle disputes between families\n- Your strong dissatisfaction against the colonizers",
    choices: ["Attempt to negotiate with the tax collector", "Help villagers hide valuables in the hills"],
    currentBranch: 0,
    gameEnded: false,
    ending: null,
    page: 1,
    resultPending: false,
    resultText: "",
    retryCurrent: false
  });

  const handleChoice = (choice: string) => {
    let newState = { ...gameState };
    let oldStats = { ...newState.stats };
    let oldTraits = { ...newState.traits };

    switch (gameState.currentBranch) {
      case 0: {
        if (choice === "Attempt to negotiate with the tax collector") {
          newState.stats.strategy += 5;
          newState.traits.Negotiator = true;
          newState.resultText = "You attempt to negotiate with the tax collector, explaining the community's hardship and pleading for more time for submitting the tax. The tax collector scoffs but impressed by your community situation, agrees to postpone the payment slightly.";
        } else if (choice === "Help villagers hide valuables in the hills") {
          newState.stats.strategy += 5;
          newState.stats.unity += 5;
          newState.stats.suspicion += 10;
          newState.resultText = "You use your knowledge of the terrain to help villagers hide some valuables in the nearby hills. The tax collector leaves with fewer tributes but suspects the community is hiding resources.";
        }
        newState.resultText += getStatChangeText(oldStats, newState.stats);
        newState.resultText += getTraitChangeText(oldTraits, newState.traits);
        newState.resultPending = true;
        break;
      }

      case 1: // Elder discussion
        if (choice === "The elder warns against the action") {
          newState.stats.strategy += 5;
          newState.stats.courage -= 5;
          newState.resultText = " The elder warns against the action, emphasizing the strength of the Spanish army and the risks to your community. His words make you more cautious but also slightly decrease your hope.";
        } else if (choice === "The elder expresses the necessity of change") {
          newState.stats.courage += 5;
          newState.traits.Rebel = true;
          newState.resultText = "The elder expresses the necessity of change and the possibility of finally getting rid of the ruling from the colonizers, urging you to consider joining their cause.";
        } else if (choice === "The elder recalls stories of Inca resistance") {
          newState.stats.unity += 5;
          newState.traits.Rebel = true;
          newState.resultText = "The elder recalls stories of Inca resistance and describes images about a future where their people will regain the land. The elder's stories strengthen your connection to your community and fill you with hope for the future.";
        }
        newState.resultText += getStatChangeText(oldStats, newState.stats);
        newState.resultText += getTraitChangeText(oldTraits, newState.traits);
        newState.resultPending = true;
        break;

      case 2: // Crossroads decision
        if (choice === "Join the rebellion") {
          if (newState.traits.Rebel) {
            if (newState.stats.courage >= 20) {
              newState.stats.courage += 10;
              newState.resultText = "You leave your village and join the growing group of the indigenous rebels as a subgroup leader. The rebellion drew support from various social groups and there were not just indigenous farmers, but also some mestizos and even a few Creoles.";
            } else {
              newState.resultText = "Your courage is not enough to join the rebellion. You must stay in the village.";
            }
          }else{
              newState.resultText = "After the disscussion with the elder, you carefully consider the warning and balance the risk as well as the opportunity, and finally decide to stay in the village.";
          }
        } else if (choice === "Stay in the village") {
          newState.stats.unity += 10;
          newState.resultText = "You decide to stay in your village. You feel a heavy struggle between the unchosen rebel path and the current choice, adjusting what situation the rebel is facing. But you're determined to protect your community.";
        }
        newState.resultText += getStatChangeText(oldStats, newState.stats);
        newState.resultText += getTraitChangeText(oldTraits, newState.traits);
        newState.resultPending = true;
        break;

      case 3: // Battle scenario (Branch 1)
        if (choice === "Use terrain knowledge to surround enemies") {
          if (newState.stats.strategy >= 25) {
            newState.stats.strategy += 5;
            newState.stats.unity += 5;
            newState.resultText = "The rebels achieve a surprising victory due to your terrain strategy and gain valuable supplies.";
            newState.retryCurrent = false;
          } else {
            newState.resultText = "Your strategy is not sufficient for this complex maneuver. Please choose another option.";
            newState.retryCurrent = true;
          }
        } else if (choice === "Fight bravely at the front") {
          if (newState.stats.courage >= 25) {
            newState.stats.courage -= 5;
            newState.resultText = "You fight bravely at the front, inspiring your comrades with your courage. You hold your ground, but suffer heavily.";
            newState.retryCurrent = false;
          } else {
            newState.resultText = "Your courage is not enough for this dangerous option. Please choose another option.";
            newState.retryCurrent = true;
          }
        } else if (choice === "Protect the wounded") {
          if (newState.stats.unity >= 25) {
            newState.stats.unity += 2;
            newState.stats.courage -= 2;
            newState.resultText = "You focus on protecting the wounded and helping them retreat to the safe place. Few people sacrificed, and the fight ends in a retreat.";
            newState.retryCurrent = false;
          } else {
            newState.resultText = "Your unity is not enough to effectively protect the wounded. Please choose another option.";
            newState.retryCurrent = true;
          }
        }
        newState.resultText += getStatChangeText(oldStats, newState.stats);
        newState.resultText += getTraitChangeText(oldTraits, newState.traits);
        newState.resultPending = true;
        break;

      case 5: // Food distribution (Branch 1)
        if (choice === "Distribute food equally") {
          newState.stats.unity += 10;
          newState.stats.strategy -= 5;
          newState.resultText = "You suggest that the food should be distributed equally among all rebels, regardless of rank or contribution. Some higher-ranking rebels complain, while the common ones are grateful.";
        } else if (choice === "Reward the brave fighters") {
          newState.stats.courage += 10;
          newState.stats.unity -= 10;
          newState.resultText = "You distribute the food to the brave ones with more food, but may cause discontent and jealousy among those who contributed less.";
        } else if (choice === "Help the newcomers") {
          newState.stats.unity += 5;
          newState.stats.reputation += 10;
          newState.traits.CompassionateLeader = true;
          newState.resultText = "You notice a group of newly arrived, exhausted rebels who haven't received any food and secretly let them get a portion before the general distribution, earning the gratitude of the newcomers and enhances your reputation.";
        }
        newState.resultText += getStatChangeText(oldStats, newState.stats);
        newState.resultText += getTraitChangeText(oldTraits, newState.traits);
        newState.resultPending = true;
        break;

      case 6: // Hidden path (Branch 1)
        if (choice === "Explore the hidden path alone") {
          if (newState.stats.courage >= 30) {
            newState.stats.courage += 5;
            newState.stats.strategy += 5;
            newState.retryCurrent = false;
            newState.resultText = "You explore the path alone first, hoping to gain a strategic advantage for the rebels. After a while, you discover a shortcut but also spot a small group of Spanish soldiers. You get back quickly with this message, reorganize the scouting routine and warn everyone to feel alert.";
          } else {
            newState.retryCurrent = true;
            newState.resultText = "Your courage is not enough to explore the path alone. Please choose another option.";
          }
        } else if (choice === "Report to the leadership") {
            newState.stats.unity += 5;
            newState.stats.strategy += 5;
            newState.retryCurrent = false;
            newState.resultText = "You report the discovery to the rebel leadership and suggest a small team to explore together. A scouting group confirms the trail and its strategic value without alerting the Spanish.";
        }
        newState.resultText += getStatChangeText(oldStats, newState.stats);
        newState.resultText += getTraitChangeText(oldTraits, newState.traits);
        newState.resultPending = true;
        break;

      case 7: // Final battle preparation (Branch 1)
        newState.resultText = "The final battle approaches. Your decisions and leadership have shaped the rebellion's course. The Spanish forces are gathering, and the fate of your people hangs in the balance.";
        newState.resultPending = true;
        break;

      case 4: // Branch 2: Independent path
        if (choice === "Plead with the corregidor") {
          if (newState.traits.Negotiator && newState.stats.unity >= 25) {
            newState.stats.strategy += 5;
            newState.stats.suspicion += 5;
            newState.retryCurrent = false;
            newState.resultText = "You plead with the corregidor, emphasizing the village's poverty and inability to meet his demands. The corregidor is unmoved but fearing your potential unrest, and finally agrees to slightly reduce his demands.";
          } else {
            newState.retryCurrent = true;
            newState.resultText = "You lack the necessary traits or unity to effectively plead with the corregidor. Please choose another option.";
          }
        } else if (choice === "Offer small supplies") {
          newState.stats.strategy += 10;
          newState.stats.suspicion += 10;
          newState.retryCurrent = false;
          newState.resultText = "You offer a small amount of supplies but subtly warn that excessive demands could lead to unrest situation. The corregidor accepts the offer, but stays alert to the villagers.";
        } else if (choice === "Refuse the requirement") {
          if (newState.stats.courage >= 30) {
            newState.stats.courage -= 15;
            newState.stats.suspicion += 15;
            newState.retryCurrent = false;
            newState.resultText = "The corregidor is enraged and threatens immediate retaliation.";
          } else {
            newState.retryCurrent = true;
            newState.resultText = "Your courage is not enough to openly defy the corregidor. Please choose another option.";
          }
        }
        newState.resultText += getStatChangeText(oldStats, newState.stats);
        newState.resultText += getTraitChangeText(oldTraits, newState.traits);
        newState.resultPending = true;
        break;

      case 8: // Wounded rebels (Branch 2)
        if (choice === "Help the wounded rebels") {
          newState.stats.unity += 10;
          newState.stats.suspicion += 10;
          newState.stats.reputation += 10;
          newState.resultText = "You secretly provide them with food and shelter under the risk of the corregidor's wrath. The rebels recover and eventually leave, grateful for your help. Before departing, their leader promised to remember your courage. The village tries to keep it a secret, but rumors still begin to spread.";
        } else if (choice === "Refuse to help the rebels") {
          newState.stats.unity -= 5;
          newState.stats.suspicion -= 5;
          newState.stats.reputation -= 5;
          newState.resultText = "You refuse their entry due to the fear of the consequences for your village. The rebels were forced to leave the village. However, some villagers whisper that your decision lacked compassion, while others wonder whether rejecting the rebels might one day come back to attack them.";
        }
        newState.resultText += getStatChangeText(oldStats, newState.stats);
        newState.resultText += getTraitChangeText(oldTraits, newState.traits);
        newState.resultPending = true;
        break;

      default:
        break;
    }

    setGameState(newState);
  };

  const handleNextResult = () => {
    const lastResult = gameState.resultText;
    let newState = { ...gameState, resultPending: false, resultText: "" };

    if (gameState.retryCurrent) {
      newState.retryCurrent = false;
      setGameState(newState);
      return;
    }

    switch (gameState.currentBranch) {
      case 0:
        newState.currentScenario = "Travelers from neighboring villages bring news of a growing rebellion led by Túpac Amaru II. He has claimed to be a descendant of the last Inca emperor, and aims to achieve an end to the mita system and other injustices and reform the ruling system. They speak of his capture and execution of the cruel corregidor, which generates both hope and fear in the hearts of the people. You discuss these rumors with a respected elder in your village. He shares stories of past uprisings and the potential dangers and opportunities of joining such a movement. The Bourbon Reforms also affected the wealth and status of the Kurakas, which could influence their stance on the rebellion and the situation may be negative to the rebellions.";
        newState.choices = [
          "The elder warns against the action",
          "The elder expresses the necessity of change",
          "The elder recalls stories of Inca resistance"
        ];
        newState.currentBranch = 1;
        break;

      case 1:
        newState.currentScenario = "News of Túpac Amaru II's rebellion reaches your village directly. On one hand, his people arrive and persuade all indigenous people to join their fight against the colonizers. They promise to abolish the mita system, heavy taxes, and restore the of indigenous rights. On the other hand, the corregidor threatens severe punishment for anyone who joins the rebels. Will you join the rebellion or stay in the village?";
        newState.choices = ["Join the rebellion", "Stay in the village"];
        newState.currentBranch = 2;
        break;

      case 2:
        if (
          lastResult === "You leave your village and join the growing group of the indigenous rebels as a subgroup leader. The rebellion drew support from various social groups and there were not just indigenous farmers, but also some mestizos and even a few Creoles."
        ) {
          // branch1
          newState.currentScenario = "Your group soon gets involved in a small-scale fight with a group of Spanish colonial soldiers. Although the rebels are poorly equipped, they fight with great bravery.";
          newState.choices = [
            "Use terrain knowledge to surround enemies",
            "Fight bravely at the front",
            "Protect the wounded"
          ];
          newState.currentBranch = 3;
        } else {
          // branch2
          newState.currentScenario = "The local corregidor sends word that he expects the village to remain loyal and provide supplies for the Spanish troops. The elders choose you to speak on behalf of the community.";
          newState.choices = [
            "Plead with the corregidor",
            "Offer small supplies",
            "Refuse the requirement"
          ];
          newState.currentBranch = 4;
        }
        break;

      case 3:
        newState.currentScenario = "After a successful fight, the rebels gain a small supply of food. Under the situation that the colonial government transformed indigenous community lands into plantation-based economies, indigenous's self-sufficiency got limited and food became a rare resource. You are assigned to manage the distribution.";
        newState.choices = [
          "Distribute food equally",
          "Reward the brave fighters",
          "Help the newcomers"
        ];
        newState.currentBranch = 5;
        break;

      case 5:
        newState.currentScenario = "While scouting ahead of the main rebel force, you notice some unusual markings on a rock face, possibly indicating a hidden path into the mountains.";
        newState.choices = [
          "Explore the hidden path alone",
          "Report to the leadership"
        ];
        newState.currentBranch = 6;
        break;

      case 6:
        newState.currentScenario = "The final battle is coming. Prepare yourself and your people.";
        newState.choices = [
          "Face the final battle"
        ];
        newState.currentBranch = 7;
        break;

      case 7:
        const ending1 = checkEnding({ ...newState, currentBranch: 7 });
        if (ending1) {
          newState.currentScenario = lastResult;
          newState.gameEnded = true;
          newState.ending = ending1;
        }
        break;

      case 4:
        newState.currentScenario = "A small group of wounded rebels fleeing from a recent battle seeks help and refuge in your village.";
        newState.choices = [
          "Help the wounded rebels",
          "Refuse to help the rebels"
        ];
        newState.currentBranch = 8;
        break;

      case 8:
        const ending2 = checkEnding({ ...newState, currentBranch: 9 });
        if (ending2) {
          newState.currentScenario = lastResult;
          newState.gameEnded = true;
          newState.ending = ending2;
        }
        break;

      default:
        break;
    }
    setGameState(newState);
  };

  const checkEnding = (state: GameState) => {
    // Branch 1 endings (after scenario 7)
    if (state.currentBranch === 7) {
      if (state.stats.strategy >= 25 && state.stats.courage >= 25) {
        return {
          title: "Legendary of the Andes",
          description: "You become a legendary leader—wise, brave, and deeply loved by your people. Under your guidance, the regions that you fight for successfully resist colonial control and remember your name for centuries."
        };
      } else if (state.stats.strategy >= 25 && state.stats.courage < 25) {
        return {
          title: "The Quiet Shield",
          description: "You protect your people through wisdom and solidarity, avoiding direct confrontation. Though the rebellion falters, your village survives and thrives in secret."
        };
      } else if (state.stats.courage >= 25) {
        return {
          title: "Where Hope Burned",
          description: "You charge into the rebellion with passion but little support or planning. You die a hero, but your efforts are buried in blood and didn't make a big change in the oppression situation."
        };
      } else {
        return {
          title: "The Very End",
          description: "You are gradually pulled away from the front lines of the rebellion. Lacking direction and courage, you remain just a witness to history rather than a part of it."
        };
      }
    }
    
    // Branch 2 endings (after scenario 9)
    if (state.currentBranch === 9) {
      if (state.stats.strategy >= 25 && state.stats.courage >= 25 && state.stats.unity >= 25 && state.stats.suspicion <= 50) {
        return {
          title: "The Shield of the People",
          description: "You navigated between rebellion and survival secretly without alerting the officials, helping the resistance while protecting your people. Your name becomes a symbol of wisdom and resilience."
        };
      } else if ((state.stats.strategy >= 25 || state.stats.courage >= 25||state.stats.unity >= 25) && state.stats.suspicion <= 50) {
        return {
          title: "The Silent Guardian",
          description: "You chose moderation and patience. Through negotiation and careful offerings, you preserved the village. Some admire your wisdom; others question your indifferent to the rebellion cause."
        };
      } else if (state.stats.suspicion > 50) {
        return {
          title: "The Very End",
          description: "Your open defiance sparked colonial retaliation and attracted so much attention of the officials that the colonial government sent a force to control your community. None of Unity, Strategy, or Courage makes a difference in the end, and the village collapsed under threat and pressure."
        };
      } else {
        return {
          title: "Where Hope Burned",
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
        <h2>122090872 Yiyao Jin</h2>
      </div>
      {gameState.page === 1 && (
        <div>
          <div className="scenario">
            <p>
              In 1780, there was an Indian village under the majestic Andes Mountains in the Viceroyalty of Peru. For centuries, the indigenous people of this land had lived under the oppressive ruling of Spanish colonizers. Heavy burdens, such as the forced labor in the Potosí silver mines (mita), the harsh taxes levied on basic necessities (alcabala), and the cultural disrespect, left the people struggling for living.
            </p>
            <p>
              The older people still talked about the days when the Inca Empire was strong and prosperous, while many families struggled to maintain the way of life under this relentless exploitation. The prosperity in memory and the exploitation in reality further exacerbated their discontent.
            </p>
            <img
              src={plantation}
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
                currentScenario: "A Spanish tax collector known for his cruelty arrives in your village, asking for immediate payment. The forced purchase of unwanted and overpriced Spanish goods often leads to debt and further exploitation.",
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
            <p>{gameState.resultPending ? gameState.resultText : gameState.currentScenario}</p>
          </div>
          {gameState.resultPending ? (
            <div style={{ textAlign: "center" }}>
              <button className="choice-button" onClick={handleNextResult}>Next</button>
            </div>
          ) : !gameState.gameEnded ? (
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