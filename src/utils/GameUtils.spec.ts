import { compareCards } from "./GameUtils"
import { Card, CardName, CARDS } from "model/Cards"

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
})
