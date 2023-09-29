import { CardName } from "./Cards"
import { Player } from "./Player"
import { Round } from "./Round"

export enum GameStatus {
    NONE = "NONE",
    ACTIVE = "ACTIVE",
    FINISHED = "FINISHED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}

export interface Game {
    id: string
    timestamp: string
    name: string
    status: GameStatus
    adminId: string
    players: Player[]
    currentRound: Round
    completedRounds: Round[]
    iamSpectator: boolean
}

export interface PlayedCard {
    playerId: string
    card: CardName
}

export interface GameState {
    id?: string
    iamSpectator: boolean
    isMyGo: boolean
    iamGoer: boolean
    iamDealer: boolean
    iamAdmin: boolean
    cards: CardName[]
    status: GameStatus
    round?: Round
    maxCall?: number
    me?: Player
    players: Player[]
}

export interface CreateGame {
    players: string[]
    name: string
}
