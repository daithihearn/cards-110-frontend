import { Hand } from "./Hand"
import { Suit } from "./Suit"

export enum RoundStatus {
  CALLING = "CALLING",
  CALLED = "CALLED",
  BUYING = "BUYING",
  PLAYING = "PLAYING",
}

export interface Round {
  timestamp: string
  number: number
  dealerId: string
  goerId?: string
  suit?: Suit
  status: RoundStatus
  currentHand: Hand
  dealerSeeingCall: boolean
  completedHands: Hand[]
}
