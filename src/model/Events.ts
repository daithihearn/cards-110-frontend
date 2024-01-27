export enum Actions {
    Unknown = "Unknown",
    Call = "Call",
    Pass = "Pass",
    SelectSuit = "SelectSuit",
    BuyCards = "BuyCards",
    CardPlayed = "CardPlayed",
    GameOver = "GameOver",
    RoundEnd = "RoundEnd",
    HandEnd = "HandEnd",
}

export interface BuyCardsEvent {
    playerId: string
    bought: number
}
