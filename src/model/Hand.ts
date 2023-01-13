import { PlayedCard } from "./Game"

export interface Hand {
  timestamp: string
  leadOut?: string
  currentPlayerId: string
  playedCards: PlayedCard[]
}
