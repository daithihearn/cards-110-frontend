export enum Actions {
  Deal = "DEAL",
  ChooseFromDummy = "CHOOSE_FROM_DUMMY",
  BuyCards = "BUY_CARDS",
  LastCardPlayed = "LAST_CARD_PLAYED",
  CardPlayed = "CARD_PLAYED",
  Replay = "REPLAY",
  GameOver = "GAME_OVER",
  BuyCardsNotification = "BUY_CARDS_NOTIFICATION",
  HandCompleted = "HAND_COMPLETED",
  RoundCompleted = "ROUND_COMPLETED",
  Call = "CALL",
  Pass = "PASS",
}

export interface BuyCardsEvent {
  playerId: string
  bought: number
}
