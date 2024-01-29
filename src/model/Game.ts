import { Card, CardName } from "./Cards"
import { Event } from "./Events"
import { Player } from "./Player"
import { Round } from "./Round"

export enum GameStatus {
    NONE = "NONE",
    ACTIVE = "ACTIVE",
    COMPLETED = "COMPLETED",
}

export interface Game {
    id: string
    revision: number
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

export interface GameStateResponse {
    id?: string
    revision: number
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

export interface GameState extends GameStateResponse {
    cardsFull: Card[]
    event: Event
}

export interface CreateGame {
    players: string[]
    name: string
}
