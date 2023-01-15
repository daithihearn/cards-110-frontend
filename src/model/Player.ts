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
}

export interface Team extends Scorable {
    id: string
    player1: Player
    player2: Player
}

export interface MyProfile extends PlayerProfile {
    isPlayer: boolean
    isAdmin: boolean
    accessToken?: string
}

export interface PlayerGameStats {
    gameId: string
    timestamp: string
    winner: boolean
    score: number
    rings: number
}
