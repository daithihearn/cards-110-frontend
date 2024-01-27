export interface Scorable {
    score: number
    rings: number
    winner: boolean
}

export interface Player extends Scorable {
    id: string
    teamId: string
    seatNumber: number
    call: number
    cardsBought?: number
}

export interface PlayerProfile {
    id: string
    name: string
    picture: string
    lastAccess: string
}

export interface Team extends Scorable {
    id: string
    player1: Player
    player2: Player
}

export interface PlayerGameStats {
    gameId: string
    timestamp: string
    winner: boolean
    score: number
    rings: number
}
