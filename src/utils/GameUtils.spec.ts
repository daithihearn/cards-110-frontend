import { Suit } from "model/Suit"
import { compareCards, getBestCard, getWorstCard } from "./GameUtils"
import { Card, CardName, CARDS } from "model/Cards"
import { Round, RoundStatus } from "model/Round"

const ROUND: Round = {
    suit: Suit.HEARTS,
    currentHand: {
        leadOut: CardName.TWO_CLUBS,
        timestamp: "",
        currentPlayerId: "",
        playedCards: [],
    },
    timestamp: "",
    number: 0,
    dealerId: "",
    status: RoundStatus.PLAYING,
    dealerSeeingCall: false,
    completedHands: [],
}

const HAND1: Card[] = [
    CARDS[CardName.TWO_HEARTS],
    CARDS[CardName.THREE_HEARTS],
    CARDS[CardName.FOUR_HEARTS],
    CARDS[CardName.FIVE_HEARTS],
    CARDS[CardName.SIX_HEARTS],
]

const HAND2: Card[] = [
    CARDS[CardName.TEN_CLUBS],
    CARDS[CardName.JACK_CLUBS],
    CARDS[CardName.QUEEN_CLUBS],
    CARDS[CardName.TWO_DIAMONDS],
    CARDS[CardName.THREE_DIAMONDS],
]

const HAND3: Card[] = [
    CARDS[CardName.KING_SPADES],
    CARDS[CardName.THREE_DIAMONDS],
    CARDS[CardName.TWO_CLUBS],
]

describe("GameUtils", () => {
    describe("compareCards", () => {
        it("2 empty hands should return true", () => {
            expect(compareCards([], [])).toBe(true)
        })

        it("equal hands", () => {
            expect(compareCards(HAND1, HAND1)).toBe(true)
        })

        it("different hands", () => {
            expect(compareCards(HAND1, HAND2)).toBe(false)
        })

        it("equal hands with different order", () => {
            expect(compareCards(HAND1, HAND1.reverse())).toBe(true)
        })
    })

    describe("getBestCard", () => {
        it("empty hand", () => {
            expect(getBestCard([], ROUND)).toBe(undefined)
        })
        it("trump card", () => {
            expect(getBestCard(HAND1, ROUND)).toBe(CARDS[CardName.FIVE_HEARTS])
        })
        it("follow cold card", () => {
            expect(getBestCard(HAND3, ROUND)).toBe(CARDS[CardName.TWO_CLUBS])
        })
    })

    describe("getWorstCard", () => {
        it("empty hand", () => {
            expect(getBestCard([], ROUND)).toBe(undefined)
        })
        it("trump card", () => {
            expect(getWorstCard(HAND1, ROUND)).toBe(CARDS[CardName.TWO_HEARTS])
        })
        it("follow cold card", () => {
            expect(getWorstCard(HAND3, ROUND)).toBe(CARDS[CardName.TWO_CLUBS])
        })
    })
})
