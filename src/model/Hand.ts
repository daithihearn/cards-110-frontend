import { Card } from "./Cards"

export interface Hand {
  timestamp: string
  leadOut?: Card
  currentPlayerId: string
  playedCards: Map<string, Card>
}
