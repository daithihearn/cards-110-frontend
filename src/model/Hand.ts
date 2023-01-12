import { Card } from "./Cards"
import { PlayedCard } from "./Game"

export interface Hand {
  timestamp: string
  leadOut?: Card
  currentPlayerId: string
  playedCards: PlayedCard[]
}
