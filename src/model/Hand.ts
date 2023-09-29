import { CardName } from "./Cards"
import { PlayedCard } from "./Game"

export interface Hand {
    timestamp: string
    leadOut?: CardName
    currentPlayerId: string
    playedCards: PlayedCard[]
}
