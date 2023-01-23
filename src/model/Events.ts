export enum Actions {
    REPLAY = "REPLAY",
    CALL = "CALL",
    PASS = "PASS",
    CHOOSE_FROM_DUMMY = "CHOOSE_FROM_DUMMY",
    BUY_CARDS = "BUY_CARDS",
    CARD_PLAYED = "CARD_PLAYED",
    GAME_OVER = "GAME_OVER",
    ROUND_COMPLETED = "ROUND_COMPLETED",
    HAND_COMPLETED = "HAND_COMPLETED",
}

export interface BuyCardsEvent {
    playerId: string
    bought: number
}
