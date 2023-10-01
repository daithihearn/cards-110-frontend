import { Suit } from "model/Suit"
import {
    areAllTrumpCards,
    bestCardLead,
    compareCards,
    containsATrumpCard,
    getBestCard,
    getTrumpCards,
    getWorstCard,
    padMyHand,
    pickBestCards,
    processOrderedCardsAfterGameUpdate,
    removeAllFromHand,
    removeCard,
    removeEmptyCards,
    riskOfMistakeBuyingCards,
} from "./GameUtils"
import { Card, CardName, CARDS, EMPTY } from "model/Cards"
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

const ROUND_BEST_LEAD: Round = {
    suit: Suit.HEARTS,
    currentHand: {
        leadOut: CardName.FIVE_HEARTS,
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
    { ...CARDS.TWO_HEARTS, selected: true },
    CARDS.THREE_HEARTS,
    CARDS.FOUR_HEARTS,
    CARDS.FIVE_HEARTS,
    CARDS.SIX_HEARTS,
]

const HAND2: Card[] = [
    CARDS.TEN_CLUBS,
    CARDS.JACK_CLUBS,
    CARDS.QUEEN_CLUBS,
    { ...CARDS.TWO_DIAMONDS, selected: true },
    CARDS.THREE_DIAMONDS,
]

const HAND3: Card[] = [CARDS.KING_SPADES, CARDS.THREE_DIAMONDS, CARDS.TWO_CLUBS]

const HAND4: Card[] = [
    CARDS.TWO_HEARTS,
    CARDS.JOKER,
    CARDS.THREE_CLUBS,
    CARDS.ACE_HEARTS,
    CARDS.TWO_DIAMONDS,
]

describe("GameUtils", () => {
    describe("removeEmptyCards", () => {
        it("empty hand", () => {
            expect(removeEmptyCards([])).toStrictEqual([])
        })

        it("full hand", () => {
            expect(removeEmptyCards([...HAND1])).toStrictEqual([...HAND1])
        })

        it("hand with empty card at end", () => {
            expect(removeEmptyCards([...HAND1, EMPTY])).toStrictEqual(HAND1)
        })

        it("hand with empty card at beginning", () => {
            expect(removeEmptyCards([EMPTY, ...HAND1])).toStrictEqual(HAND1)
        })

        it("hand with empty card in middle", () => {
            expect(
                removeEmptyCards([CARDS.TWO_HEARTS, EMPTY, ...HAND3]),
            ).toStrictEqual([CARDS.TWO_HEARTS, ...HAND3])
        })

        it("hand with multiple empty cards", () => {
            expect(
                removeEmptyCards([CARDS.TWO_HEARTS, EMPTY, ...HAND3, EMPTY]),
            ).toStrictEqual([CARDS.TWO_HEARTS, ...HAND3])
        })

        it("hand with multiple empty cards at beginning", () => {
            expect(
                removeEmptyCards([EMPTY, EMPTY, CARDS.TWO_HEARTS, ...HAND3]),
            ).toStrictEqual([CARDS.TWO_HEARTS, ...HAND3])
        })

        it("hand with multiple empty cards at end", () => {
            expect(
                removeEmptyCards([CARDS.TWO_HEARTS, ...HAND3, EMPTY, EMPTY]),
            ).toStrictEqual([CARDS.TWO_HEARTS, ...HAND3])
        })

        it("hand with multiple empty cards in middle", () => {
            expect(
                removeEmptyCards([
                    CARDS.TWO_HEARTS,
                    EMPTY,
                    ...HAND3,
                    EMPTY,
                    EMPTY,
                ]),
            ).toStrictEqual([CARDS.TWO_HEARTS, ...HAND3])
        })

        it("hand with only empty cards", () => {
            expect(removeEmptyCards([EMPTY, EMPTY, EMPTY])).toStrictEqual([])
        })
    })
    describe("compareCards", () => {
        it("2 empty hands should return true", () => {
            expect(compareCards([], [])).toBe(true)
        })

        it("equal hands", () => {
            expect(compareCards([...HAND1], [...HAND1])).toBe(true)
        })

        it("different hands", () => {
            expect(compareCards([...HAND1], [...HAND2])).toBe(false)
        })

        it("equal hands with different order", () => {
            expect(compareCards([...HAND1], [...HAND1].reverse())).toBe(true)
        })
    })

    describe("padMyHand", () => {
        it("empty hand", () => {
            expect(padMyHand([])).toStrictEqual([
                { ...EMPTY },
                { ...EMPTY },
                { ...EMPTY },
                { ...EMPTY },
                { ...EMPTY },
            ])
        })

        it("full hand", () => {
            expect(padMyHand([...HAND1])).toStrictEqual([...HAND1])
        })

        it("partial hand", () => {
            expect(padMyHand(HAND3)).toStrictEqual([
                CARDS.KING_SPADES,
                CARDS.THREE_DIAMONDS,
                CARDS.TWO_CLUBS,
                EMPTY,
                EMPTY,
            ])
        })
    })

    describe("processOrderedCardsAfterGameUpdate", () => {
        it("same cards", () => {
            expect(
                processOrderedCardsAfterGameUpdate(
                    [...HAND1],
                    HAND1.map(c => c.name),
                ),
            ).toStrictEqual(HAND1)
        })

        it("same cards with different order", () => {
            expect(
                processOrderedCardsAfterGameUpdate(
                    [...HAND1],
                    HAND1.map(c => c.name).reverse(),
                ),
            ).toStrictEqual(HAND1)
        })

        it("First card removed", () => {
            const handWithFirstCardRemoved = [...HAND1].slice(1)
            const responseFromServer = handWithFirstCardRemoved.map(c => c.name)
            const result = processOrderedCardsAfterGameUpdate(
                [...HAND1],
                responseFromServer,
            )
            expect(result).toStrictEqual([EMPTY, ...handWithFirstCardRemoved])
        })

        it("Last card removed", () => {
            const handWithLastCardRemoved = [...HAND1].slice(0, 4)
            const responseFromServer = handWithLastCardRemoved.map(c => c.name)
            const result = processOrderedCardsAfterGameUpdate(
                [...HAND1],
                responseFromServer,
            )
            expect(result).toStrictEqual([...handWithLastCardRemoved, EMPTY])
        })

        it("Middle card removed", () => {
            const handWithMiddleCardRemoved = [
                ...[...HAND1].slice(0, 2),
                ...[...HAND1].slice(3),
            ]
            const responseFromServer = handWithMiddleCardRemoved.map(
                c => c.name,
            )
            const result = processOrderedCardsAfterGameUpdate(
                [...HAND1],
                responseFromServer,
            )
            const expected = [
                ...[...HAND1].slice(0, 2),
                EMPTY,
                ...[...HAND1].slice(3),
            ]
            expect(result).toStrictEqual(expected)
        })

        it("any other configuration 1", () => {
            expect(
                processOrderedCardsAfterGameUpdate(HAND1, [
                    CardName.FIVE_CLUBS,
                ]),
            ).toStrictEqual(padMyHand([CARDS.FIVE_CLUBS]))
        })

        it("any other configuration 2", () => {
            expect(
                processOrderedCardsAfterGameUpdate(
                    HAND1,
                    HAND3.map(c => c.name),
                ),
            ).toStrictEqual(padMyHand(HAND3))
        })
    })

    describe("areAllTrumpCards", () => {
        it("empty hand", () => {
            expect(areAllTrumpCards([], Suit.HEARTS)).toBe(true)
        })

        it("all trump cards", () => {
            expect(areAllTrumpCards([...HAND1], Suit.HEARTS)).toBe(true)
        })

        it("not all trump cards", () => {
            expect(areAllTrumpCards([...HAND3], Suit.HEARTS)).toBe(false)
        })
    })

    describe("containsATrumpCard", () => {
        it("empty hand", () => {
            expect(containsATrumpCard([], Suit.HEARTS)).toBe(false)
        })

        it("has a trump card", () => {
            expect(containsATrumpCard([...HAND1], Suit.HEARTS)).toBe(true)
        })

        it("doesn't have a trump card", () => {
            expect(containsATrumpCard([...HAND3], Suit.HEARTS)).toBe(false)
        })
    })

    describe("removeCard", () => {
        it("empty hand", () => {
            expect(removeCard(CARDS.TWO_HEARTS, [])).toStrictEqual([])
        })

        it("remove first card", () => {
            expect(removeCard(CARDS.TWO_HEARTS, HAND1)).toStrictEqual(
                [...HAND1].slice(1),
            )
        })

        it("remove last card", () => {
            expect(removeCard(CARDS.SIX_HEARTS, [...HAND1])).toStrictEqual(
                [...HAND1].slice(0, 4),
            )
        })

        it("remove middle card", () => {
            expect(removeCard(CARDS.FOUR_HEARTS, [...HAND1])).toStrictEqual(
                [...HAND1].slice(0, 2).concat([...HAND1].slice(3)),
            )
        })
    })

    describe("removeAllFromHand", () => {
        it("empty hand", () => {
            expect(removeAllFromHand(HAND1, [])).toStrictEqual([])
        })

        it("remove first card", () => {
            expect(removeAllFromHand([CARDS.TWO_HEARTS], HAND1)).toStrictEqual(
                [...HAND1].slice(1),
            )
        })

        it("remove last card", () => {
            expect(
                removeAllFromHand([CARDS.SIX_HEARTS], [...HAND1]),
            ).toStrictEqual([...HAND1].slice(0, 4))
        })

        it("remove middle card", () => {
            expect(
                removeAllFromHand([CARDS.FOUR_HEARTS], [...HAND1]),
            ).toStrictEqual([...HAND1].slice(0, 2).concat([...HAND1].slice(3)))
        })

        it("remove multiple cards", () => {
            expect(
                removeAllFromHand(
                    [CARDS.FOUR_HEARTS, CARDS.TWO_HEARTS],
                    [...HAND1],
                ),
            ).toStrictEqual([
                CARDS.THREE_HEARTS,
                CARDS.FIVE_HEARTS,
                CARDS.SIX_HEARTS,
            ])
        })

        it("remove multiple cards in different order", () => {
            expect(
                removeAllFromHand(
                    [CARDS.TWO_HEARTS, CARDS.FOUR_HEARTS],
                    [...HAND1],
                ),
            ).toStrictEqual([
                CARDS.THREE_HEARTS,
                CARDS.FIVE_HEARTS,
                CARDS.SIX_HEARTS,
            ])
        })

        it("remove all cards", () => {
            expect(removeAllFromHand([...HAND1], [...HAND1])).toStrictEqual([])
        })
    })

    describe("riskOfMistakeBuyingCards", () => {
        it("none selected", () => {
            expect(riskOfMistakeBuyingCards(Suit.HEARTS, [], HAND1)).toBe(true)
        })

        it("no trump cards", () => {
            expect(
                riskOfMistakeBuyingCards(Suit.DIAMONDS, [], [...HAND1]),
            ).toBe(false)
        })

        it("select all cards", () => {
            expect(
                riskOfMistakeBuyingCards(Suit.HEARTS, [...HAND1], [...HAND1]),
            ).toBe(false)
        })

        it("select all trumps", () => {
            expect(
                riskOfMistakeBuyingCards(
                    Suit.SPADES,
                    [CARDS.KING_SPADES],
                    [...HAND3],
                ),
            ).toBe(false)
        })

        it("don't select all trumps", () => {
            expect(
                riskOfMistakeBuyingCards(
                    Suit.HEARTS,
                    [CARDS.TWO_HEARTS],
                    [...HAND1],
                ),
            ).toBe(true)
        })
    })

    describe("getTrumpCards", () => {
        it("empty hand", () => {
            expect(getTrumpCards([], Suit.HEARTS)).toStrictEqual([])
        })

        it("all trump cards", () => {
            expect(getTrumpCards([...HAND1], Suit.HEARTS)).toStrictEqual(HAND1)
        })

        it("no trump cards", () => {
            expect(getTrumpCards([...HAND3], Suit.HEARTS)).toStrictEqual([])
        })

        it("all trump cards with joker and ace of hearts", () => {
            expect(getTrumpCards([...HAND4], Suit.HEARTS)).toStrictEqual([
                CARDS.TWO_HEARTS,
                CARDS.JOKER,
                CARDS.ACE_HEARTS,
            ])
        })

        it("some trump cards", () => {
            expect(getTrumpCards([...HAND3], Suit.SPADES)).toStrictEqual([
                CARDS.KING_SPADES,
            ])
        })
    })

    describe("bestCardLead", () => {
        it("no suit", () => {
            expect(bestCardLead({ ...ROUND, suit: undefined })).toBe(false)
        })

        it("best card lead", () => {
            expect(
                bestCardLead({ ...ROUND_BEST_LEAD, suit: Suit.HEARTS }),
            ).toBe(true)
        })

        it("best card not lead", () => {
            expect(bestCardLead({ ...ROUND, suit: Suit.HEARTS })).toBe(false)
        })
    })

    describe("getBestCard", () => {
        it("empty hand", () => {
            expect(getBestCard([], ROUND)).toBe(undefined)
        })
        it("trump card", () => {
            expect(getBestCard([...HAND1], ROUND)).toStrictEqual(
                CARDS.FIVE_HEARTS,
            )
        })
        it("follow cold card", () => {
            expect(getBestCard([...HAND3], ROUND)).toStrictEqual(
                CARDS.TWO_CLUBS,
            )
        })
    })

    describe("getWorstCard", () => {
        it("empty hand", () => {
            expect(getBestCard([], ROUND)).toBe(undefined)
        })
        it("trump card", () => {
            expect(getWorstCard([...HAND1], ROUND)).toStrictEqual({
                ...CARDS.TWO_HEARTS,
                selected: true,
            })
        })
        it("follow cold card", () => {
            expect(getWorstCard([...HAND3], ROUND)).toStrictEqual(
                CARDS.TWO_CLUBS,
            )
        })
    })

    describe("pickBestCards", () => {
        it("empty hand", () => {
            expect(pickBestCards([], Suit.CLUBS, 4)).toStrictEqual([])
        })
        it("all trumps", () => {
            expect(pickBestCards([...HAND1], Suit.HEARTS, 3)).toStrictEqual(
                HAND1,
            )
        })
        // it("Must keep 2", () => {
        //     expect(pickBestCards([...HAND1], Suit.DIAMONDS, 5)).toStrictEqual([
        //         CARDS.FIVE_HEARTS,
        //         CARDS.SIX_HEARTS,
        //     ])
        // })
    })
})
