import { Suit } from "model/Suit"
import {
    areAllTrumpCards,
    bestCardLead,
    calculateMinCardsToKeep,
    canRenege,
    compareCards,
    containsATrumpCard,
    getBestCard,
    getColdCards,
    getTrumpCards,
    getWorstCard,
    padMyHand,
    parseCards,
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
    completedHands: [
        {
            leadOut: CardName.FIVE_DIAMONDS,
            timestamp: "",
            currentPlayerId: "",
            playedCards: [{ card: CardName.ACE_HEARTS, playerId: "blah" }],
        },
    ],
}

const ROUND_WILD_LEAD: Round = {
    suit: Suit.HEARTS,
    currentHand: {
        leadOut: CardName.ACE_HEARTS,
        timestamp: "",
        currentPlayerId: "",
        playedCards: [],
    },
    timestamp: "",
    number: 0,
    dealerId: "",
    status: RoundStatus.PLAYING,
    dealerSeeingCall: false,
    completedHands: [
        {
            leadOut: CardName.FIVE_DIAMONDS,
            timestamp: "",
            currentPlayerId: "",
            playedCards: [{ card: CardName.SIX_SPADES, playerId: "blah" }],
        },
    ],
}

const ROUND_NOTHING_LEAD: Round = {
    suit: Suit.HEARTS,
    currentHand: {
        timestamp: "",
        currentPlayerId: "",
        playedCards: [],
    },
    timestamp: "",
    number: 0,
    dealerId: "",
    status: RoundStatus.PLAYING,
    dealerSeeingCall: false,
    completedHands: [
        {
            leadOut: CardName.FIVE_DIAMONDS,
            timestamp: "",
            currentPlayerId: "",
            playedCards: [{ card: CardName.ACE_HEARTS, playerId: "blah" }],
        },
    ],
}

const CardNames1 = [
    CardName.TWO_HEARTS,
    CardName.THREE_HEARTS,
    CardName.FOUR_HEARTS,
    CardName.JACK_HEARTS,
    CardName.SIX_HEARTS,
]

const HAND1: Card[] = [
    { ...CARDS.TWO_HEARTS, selected: true },
    CARDS.THREE_HEARTS,
    CARDS.FOUR_HEARTS,
    CARDS.JACK_HEARTS,
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

const CardNames4 = [
    CardName.TWO_HEARTS,
    CardName.JOKER,
    CardName.THREE_CLUBS,
    CardName.ACE_HEARTS,
    CardName.TWO_DIAMONDS,
]

const HAND4: Card[] = [
    CARDS.TWO_HEARTS,
    CARDS.JOKER,
    CARDS.THREE_CLUBS,
    CARDS.ACE_HEARTS,
    CARDS.TWO_DIAMONDS,
]

const HAND_RENEG: Card[] = [
    CARDS.THREE_DIAMONDS,
    CARDS.TWO_CLUBS,
    CARDS.THREE_CLUBS,
    CARDS.FIVE_HEARTS,
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

        it("different length hands", () => {
            expect(compareCards([...HAND1], [...HAND1, CARDS.ACE_CLUBS])).toBe(
                false,
            )
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

    describe("parseCards", () => {
        it("empty hand", () => {
            expect(parseCards([])).toStrictEqual([])
        })

        it("full hand", () => {
            const result = parseCards(CardNames1)

            expect(result.length).toBe(5)

            result.forEach(c => {
                expect(c).toStrictEqual(CARDS[c.name])
            })
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
                CARDS.JACK_HEARTS,
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
                CARDS.JACK_HEARTS,
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

    describe("getColdCards", () => {
        it("empty hand", () => {
            expect(getColdCards([], Suit.HEARTS)).toStrictEqual([])
        })

        it("all cold cards", () => {
            expect(getColdCards([...HAND1], Suit.HEARTS)).toStrictEqual([])
        })

        it("no cold cards", () => {
            expect(getColdCards([...HAND3], Suit.HEARTS)).toStrictEqual(HAND3)
        })

        it("all cold cards with joker and ace of hearts", () => {
            expect(getColdCards([...HAND4], Suit.HEARTS)).toStrictEqual([
                CARDS.THREE_CLUBS,
                CARDS.TWO_DIAMONDS,
            ])
        })

        it("some cold cards", () => {
            expect(getColdCards([...HAND3], Suit.SPADES)).toStrictEqual([
                CARDS.THREE_DIAMONDS,
                CARDS.TWO_CLUBS,
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
            expect(() => getBestCard([], ROUND)).toThrow()
        })
        it("trump card", () => {
            expect(getBestCard([...HAND1], ROUND_BEST_LEAD)).toStrictEqual(
                CARDS.JACK_HEARTS,
            )
        })
        it("follow cold card", () => {
            expect(getBestCard([...HAND3], ROUND)).toStrictEqual(
                CARDS.TWO_CLUBS,
            )
        })
        it("only one card left", () => {
            expect(getBestCard([CARDS.JOKER], ROUND)).toStrictEqual(CARDS.JOKER)
        })
        it("Hand with EMPTY cards", () => {
            expect(getBestCard([EMPTY, ...HAND3], ROUND)).toStrictEqual(
                CARDS.TWO_CLUBS,
            )
        })
    })

    describe("canRenege", () => {
        it("not a trump card", () => {
            expect(() =>
                canRenege(CARDS.TWO_CLUBS, CARDS.TWO_HEARTS, Suit.HEARTS),
            ).toThrow()
        })
        it("not a trump card", () => {
            expect(() =>
                canRenege(CARDS.TWO_HEARTS, CARDS.TWO_CLUBS, Suit.HEARTS),
            ).toThrow()
        })
        it("not a renegable card", () => {
            expect(
                canRenege(CARDS.THREE_HEARTS, CARDS.TWO_HEARTS, Suit.HEARTS),
            ).toBe(false)
        })
        it("renegable card", () => {
            expect(
                canRenege(CARDS.ACE_HEARTS, CARDS.TWO_HEARTS, Suit.HEARTS),
            ).toBe(true)
        })
        it("renegable card", () => {
            expect(canRenege(CARDS.JOKER, CARDS.TWO_HEARTS, Suit.HEARTS)).toBe(
                true,
            )
        })
        it("renegable card", () => {
            expect(
                canRenege(CARDS.JACK_HEARTS, CARDS.TWO_HEARTS, Suit.HEARTS),
            ).toBe(true)
        })
        it("renegable card", () => {
            expect(
                canRenege(CARDS.FIVE_HEARTS, CARDS.TWO_HEARTS, Suit.HEARTS),
            ).toBe(true)
        })
        it("renegable card lower than card lead out", () => {
            expect(canRenege(CARDS.ACE_HEARTS, CARDS.JOKER, Suit.HEARTS)).toBe(
                false,
            )
        })
        it("renegable card lower than card lead out", () => {
            expect(
                canRenege(CARDS.ACE_HEARTS, CARDS.JACK_HEARTS, Suit.HEARTS),
            ).toBe(false)
        })
        it("renegable card lower than card lead out", () => {
            expect(
                canRenege(CARDS.ACE_HEARTS, CARDS.FIVE_HEARTS, Suit.HEARTS),
            ).toBe(false)
        })
        it("renegable card lower than card lead out", () => {
            expect(canRenege(CARDS.JOKER, CARDS.JACK_HEARTS, Suit.HEARTS)).toBe(
                false,
            )
        })
        it("renegable card lower than card lead out", () => {
            expect(canRenege(CARDS.JOKER, CARDS.FIVE_HEARTS, Suit.HEARTS)).toBe(
                false,
            )
        })
        it("renegable card lower than card lead out", () => {
            expect(
                canRenege(CARDS.JACK_HEARTS, CARDS.FIVE_HEARTS, Suit.HEARTS),
            ).toBe(false)
        })
    })

    describe("getWorstCard", () => {
        it("empty hand", () => {
            expect(() => getWorstCard([], ROUND)).toThrow()
        })
        it("no card lead - cold card", () => {
            expect(getWorstCard([...HAND3], ROUND_NOTHING_LEAD)).toStrictEqual(
                CARDS.THREE_DIAMONDS,
            )
        })
        it("no card lead - trump card", () => {
            expect(getWorstCard([...HAND1], ROUND_NOTHING_LEAD)).toStrictEqual({
                ...CARDS.TWO_HEARTS,
                selected: true,
            })
        })
        it("trump card lead - follow trump", () => {
            expect(getWorstCard([...HAND1], ROUND_BEST_LEAD)).toStrictEqual({
                ...CARDS.TWO_HEARTS,
                selected: true,
            })
        })
        it("trump card lead - follow cold", () => {
            expect(getWorstCard([...HAND3], ROUND_BEST_LEAD)).toStrictEqual(
                CARDS.THREE_DIAMONDS,
            )
        })
        it("follow cold card", () => {
            expect(getWorstCard([...HAND3], ROUND)).toStrictEqual(
                CARDS.TWO_CLUBS,
            )
        })
        it("wild cards lead", () => {
            expect(getWorstCard([...HAND4], ROUND_WILD_LEAD)).toStrictEqual(
                CARDS.TWO_HEARTS,
            )
        })
        it("Can reneg five", () => {
            expect(
                getWorstCard([...HAND_RENEG], ROUND_WILD_LEAD),
            ).toStrictEqual(CARDS.THREE_DIAMONDS)
        })
        it("Can reneg - but it's the only card left", () => {
            expect(getWorstCard([CARDS.JOKER], ROUND_WILD_LEAD)).toStrictEqual(
                CARDS.JOKER,
            )
        })
    })

    describe("calculateMinCardsToKeep", () => {
        it("less than 2 players. Should throw an error", () => {
            expect(() => {
                calculateMinCardsToKeep(1)
            }).toThrow()
        })
        it("more than 6 players. Should throw an error", () => {
            expect(() => {
                calculateMinCardsToKeep(7)
            }).toThrow()
        })
        it("2 players", () => {
            expect(calculateMinCardsToKeep(2)).toBe(0)
        })
        it("3 players", () => {
            expect(calculateMinCardsToKeep(3)).toBe(0)
        })
        it("4 players", () => {
            expect(calculateMinCardsToKeep(4)).toBe(0)
        })
        it("5 players", () => {
            expect(calculateMinCardsToKeep(5)).toBe(1)
        })
        it("6 players", () => {
            expect(calculateMinCardsToKeep(6)).toBe(2)
        })
    })

    describe("pickBestCards", () => {
        it("empty hand", () => {
            expect(pickBestCards([], Suit.CLUBS, 4)).toStrictEqual([])
        })
        it("all trumps", () => {
            expect(pickBestCards(CardNames1, Suit.HEARTS, 3)).toStrictEqual(
                CardNames1,
            )
        })
        it("Must keep 2", () => {
            expect(pickBestCards(CardNames1, Suit.DIAMONDS, 6)).toStrictEqual([
                CardName.JACK_HEARTS,
                CardName.SIX_HEARTS,
            ])
        })
        it("Must keep 1", () => {
            expect(pickBestCards(CardNames1, Suit.DIAMONDS, 5)).toStrictEqual([
                CardName.JACK_HEARTS,
            ])
        })
        it("Must keep 0", () => {
            expect(pickBestCards(CardNames1, Suit.DIAMONDS, 4)).toStrictEqual(
                [],
            )
        })
        it("Must keep 0", () => {
            expect(pickBestCards(CardNames1, Suit.DIAMONDS, 3)).toStrictEqual(
                [],
            )
        })
        it("Must keep 0", () => {
            expect(pickBestCards(CardNames1, Suit.DIAMONDS, 2)).toStrictEqual(
                [],
            )
        })
        it("Wild cards one", () => {
            expect(pickBestCards(CardNames4, Suit.HEARTS, 4)).toStrictEqual([
                CardName.TWO_HEARTS,
                CardName.JOKER,
                CardName.ACE_HEARTS,
            ])
        })
        it("Wild cards 2", () => {
            expect(pickBestCards(CardNames4, Suit.SPADES, 2)).toStrictEqual([
                CardName.JOKER,
                CardName.ACE_HEARTS,
            ])
        })
    })
})
