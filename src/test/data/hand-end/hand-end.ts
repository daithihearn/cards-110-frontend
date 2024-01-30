import { CardName } from "model/Cards"
import { Event } from "model/Events"
import { GameState, GameStateResponse, GameStatus } from "model/Game"
import { RoundStatus } from "model/Round"
import { Suit } from "model/Suit"

export const BeforeHandEnd: GameStateResponse = {
    id: "game1",
    revision: 25,
    status: GameStatus.ACTIVE,
    me: {
        id: "player1",
        seatNumber: 1,
        call: 15,
        cardsBought: 0,
        score: 0,
        rings: 0,
        teamId: "1",
        winner: false,
    },
    iamSpectator: false,
    isMyGo: true,
    iamGoer: true,
    iamDealer: false,
    iamAdmin: true,
    maxCall: 15,
    players: [
        {
            id: "player1",
            seatNumber: 1,
            call: 15,
            cardsBought: 0,
            score: 0,
            rings: 0,
            teamId: "1",
            winner: false,
        },
        {
            id: "player2",
            seatNumber: 2,
            call: 0,
            cardsBought: 0,
            score: 25,
            rings: 0,
            teamId: "2",
            winner: false,
        },
    ],
    round: {
        timestamp: "2024-01-25T11:38:38.687Z",
        number: 2,
        dealerId: "player2",
        goerId: "player1",
        suit: Suit.CLUBS,
        status: RoundStatus.PLAYING,
        currentHand: {
            timestamp: "2024-01-25T11:38:38.687Z",
            leadOut: CardName.NINE_CLUBS,
            currentPlayerId: "player1",
            playedCards: [
                {
                    playerId: "player2",
                    card: CardName.NINE_CLUBS,
                },
            ],
        },
        dealerSeeingCall: false,
        completedHands: [],
    },
    cards: [
        CardName.JACK_CLUBS,
        CardName.JOKER,
        CardName.KING_CLUBS,
        CardName.ACE_CLUBS,
        CardName.FOUR_CLUBS,
    ],
}

export const AfterHandEnd: GameStateResponse = {
    id: "game1",
    revision: 26,
    status: GameStatus.ACTIVE,
    me: {
        id: "player1",
        seatNumber: 1,
        call: 15,
        cardsBought: 0,
        score: 0,
        rings: 0,
        teamId: "1",
        winner: false,
    },
    iamSpectator: false,
    isMyGo: true,
    iamGoer: true,
    iamDealer: false,
    iamAdmin: true,
    maxCall: 15,
    players: [
        {
            id: "player1",
            seatNumber: 1,
            call: 15,
            cardsBought: 0,
            score: 0,
            rings: 0,
            teamId: "1",
            winner: false,
        },
        {
            id: "player2",
            seatNumber: 2,
            call: 0,
            cardsBought: 0,
            score: 25,
            rings: 0,
            teamId: "2",
            winner: false,
        },
    ],
    round: {
        timestamp: "2024-01-25T11:38:38.687Z",
        number: 2,
        dealerId: "player2",
        goerId: "player1",
        suit: Suit.CLUBS,
        status: RoundStatus.PLAYING,
        currentHand: {
            timestamp: "2024-01-25T12:55:15.854232+01:00",
            currentPlayerId: "player1",
            playedCards: [],
        },
        dealerSeeingCall: false,
        completedHands: [
            {
                timestamp: "2024-01-25T11:38:38.687Z",
                leadOut: CardName.NINE_CLUBS,
                currentPlayerId: "player1",
                playedCards: [
                    {
                        playerId: "player2",
                        card: CardName.NINE_CLUBS,
                    },
                    {
                        playerId: "player1",
                        card: CardName.FOUR_CLUBS,
                    },
                ],
            },
        ],
    },
    cards: [
        CardName.JACK_CLUBS,
        CardName.JOKER,
        CardName.KING_CLUBS,
        CardName.ACE_CLUBS,
    ],
}

export const BeforeHandEnd2: GameStateResponse = {
    id: "6456926",
    revision: 110,
    status: GameStatus.ACTIVE,
    me: {
        id: "player1",
        seatNumber: 2,
        call: 0,
        cardsBought: 0,
        score: 60,
        rings: 0,
        teamId: "2",
        winner: false,
    },
    iamSpectator: false,
    isMyGo: true,
    iamGoer: false,
    iamDealer: true,
    iamAdmin: true,
    maxCall: 15,
    players: [
        {
            id: "player2",
            seatNumber: 1,
            call: 15,
            cardsBought: 0,
            score: 75,
            rings: 1,
            teamId: "1",
            winner: false,
        },
        {
            id: "player1",
            seatNumber: 2,
            call: 0,
            cardsBought: 0,
            score: 60,
            rings: 0,
            teamId: "2",
            winner: false,
        },
    ],
    round: {
        timestamp: "2024-01-30T20:44:58.878Z",
        number: 7,
        dealerId: "player1",
        goerId: "player2",
        suit: Suit.SPADES,
        status: RoundStatus.PLAYING,
        currentHand: {
            timestamp: "2024-01-30T21:22:25.791Z",
            leadOut: CardName.JOKER,
            currentPlayerId: "player1",
            playedCards: [
                {
                    playerId: "player2",
                    card: CardName.JOKER,
                },
            ],
        },
        dealerSeeingCall: false,
        completedHands: [
            {
                timestamp: "2024-01-30T20:44:58.878Z",
                leadOut: CardName.FOUR_DIAMONDS,
                currentPlayerId: "player2",
                playedCards: [
                    {
                        playerId: "player1",
                        card: CardName.FOUR_DIAMONDS,
                    },
                    {
                        playerId: "player2",
                        card: CardName.TEN_SPADES,
                    },
                ],
            },
            {
                timestamp: "2024-01-30T21:19:58.59Z",
                leadOut: CardName.FIVE_SPADES,
                currentPlayerId: "player1",
                playedCards: [
                    {
                        playerId: "player2",
                        card: CardName.FIVE_SPADES,
                    },
                    {
                        playerId: "player1",
                        card: CardName.EIGHT_SPADES,
                    },
                ],
            },
            {
                timestamp: "2024-01-30T21:22:08.874Z",
                leadOut: CardName.JACK_SPADES,
                currentPlayerId: "player1",
                playedCards: [
                    {
                        playerId: "player2",
                        card: CardName.JACK_SPADES,
                    },
                    {
                        playerId: "player1",
                        card: CardName.SEVEN_SPADES,
                    },
                ],
            },
        ],
    },
    cards: [CardName.QUEEN_SPADES, CardName.KING_DIAMONDS],
}

export const AfterHandEnd2: GameStateResponse = {
    id: "6456926",
    revision: 111,
    status: GameStatus.ACTIVE,
    me: {
        id: "player1",
        seatNumber: 2,
        call: 0,
        cardsBought: 0,
        score: 60,
        rings: 0,
        teamId: "2",
        winner: false,
    },
    iamSpectator: false,
    isMyGo: false,
    iamGoer: false,
    iamDealer: true,
    iamAdmin: true,
    maxCall: 15,
    players: [
        {
            id: "player2",
            seatNumber: 1,
            call: 15,
            cardsBought: 0,
            score: 75,
            rings: 1,
            teamId: "1",
            winner: false,
        },
        {
            id: "player1",
            seatNumber: 2,
            call: 0,
            cardsBought: 0,
            score: 60,
            rings: 0,
            teamId: "2",
            winner: false,
        },
    ],
    round: {
        timestamp: "2024-01-30T20:44:58.878Z",
        number: 7,
        dealerId: "player1",
        goerId: "player2",
        suit: Suit.SPADES,
        status: RoundStatus.PLAYING,
        currentHand: {
            timestamp: "2024-01-30T21:25:17.120839667Z",
            currentPlayerId: "player2",
            playedCards: [],
        },
        dealerSeeingCall: false,
        completedHands: [
            {
                timestamp: "2024-01-30T20:44:58.878Z",
                leadOut: CardName.FOUR_DIAMONDS,
                currentPlayerId: "player2",
                playedCards: [
                    {
                        playerId: "player1",
                        card: CardName.FOUR_DIAMONDS,
                    },
                    {
                        playerId: "player2",
                        card: CardName.TEN_SPADES,
                    },
                ],
            },
            {
                timestamp: "2024-01-30T21:19:58.59Z",
                leadOut: CardName.FIVE_SPADES,
                currentPlayerId: "player1",
                playedCards: [
                    {
                        playerId: "player2",
                        card: CardName.FIVE_SPADES,
                    },
                    {
                        playerId: "player1",
                        card: CardName.EIGHT_SPADES,
                    },
                ],
            },
            {
                timestamp: "2024-01-30T21:22:08.874Z",
                leadOut: CardName.JACK_SPADES,
                currentPlayerId: "player1",
                playedCards: [
                    {
                        playerId: "player2",
                        card: CardName.JACK_SPADES,
                    },
                    {
                        playerId: "player1",
                        card: CardName.SEVEN_SPADES,
                    },
                ],
            },
            {
                timestamp: "2024-01-30T21:22:25.791Z",
                leadOut: CardName.JOKER,
                currentPlayerId: "player1",
                playedCards: [
                    {
                        playerId: "player2",
                        card: CardName.JOKER,
                    },
                    {
                        playerId: "player1",
                        card: CardName.QUEEN_SPADES,
                    },
                ],
            },
        ],
    },
    cards: [CardName.KING_DIAMONDS],
}

export const BeforeHandEnd3: GameState = {
    id: "6456926",
    revision: 140,
    status: GameStatus.ACTIVE,
    me: {
        id: "player1",
        seatNumber: 2,
        call: 0,
        cardsBought: 0,
        score: 90,
        rings: 0,
        teamId: "2",
        winner: false,
    },
    iamSpectator: false,
    isMyGo: false,
    iamGoer: false,
    iamDealer: true,
    iamAdmin: true,
    maxCall: 20,
    players: [
        {
            id: "player2",
            seatNumber: 1,
            call: 20,
            cardsBought: 0,
            score: 105,
            rings: 1,
            teamId: "1",
            winner: false,
        },
        {
            id: "player1",
            seatNumber: 2,
            call: 0,
            cardsBought: 0,
            score: 90,
            rings: 0,
            teamId: "2",
            winner: false,
        },
    ],
    round: {
        timestamp: "2024-01-30T21:37:49.537Z",
        number: 9,
        dealerId: "player1",
        goerId: "player2",
        suit: Suit.HEARTS,
        status: RoundStatus.PLAYING,
        currentHand: {
            timestamp: "2024-01-30T21:41:43.265Z",
            leadOut: CardName.SIX_HEARTS,
            currentPlayerId: "player2",
            playedCards: [
                {
                    playerId: "player1",
                    card: CardName.SIX_HEARTS,
                },
            ],
        },
        dealerSeeingCall: false,
        completedHands: [
            {
                timestamp: "2024-01-30T21:37:49.537Z",
                leadOut: CardName.KING_HEARTS,
                currentPlayerId: "player2",
                playedCards: [
                    {
                        playerId: "player1",
                        card: CardName.KING_HEARTS,
                    },
                    {
                        playerId: "player2",
                        card: CardName.ACE_HEARTS,
                    },
                ],
            },
            {
                timestamp: "2024-01-30T21:40:09.247Z",
                leadOut: CardName.TWO_HEARTS,
                currentPlayerId: "player1",
                playedCards: [
                    {
                        playerId: "player2",
                        card: CardName.TWO_HEARTS,
                    },
                    {
                        playerId: "player1",
                        card: CardName.THREE_HEARTS,
                    },
                ],
            },
        ],
    },
    cards: [CardName.TEN_DIAMONDS, CardName.SEVEN_HEARTS],
    cardsFull: [
        {
            name: CardName.EMPTY,
            value: 0,
            coldValue: 0,
            suit: Suit.EMPTY,
            renegable: false,
            selected: false,
        },
        {
            name: CardName.TEN_DIAMONDS,
            value: 108,
            coldValue: 10,
            suit: Suit.DIAMONDS,
            renegable: false,
            selected: false,
        },
        {
            name: CardName.SEVEN_HEARTS,
            value: 105,
            coldValue: 7,
            suit: Suit.HEARTS,
            renegable: false,
            selected: false,
        },
        {
            name: CardName.EMPTY,
            value: 0,
            coldValue: 0,
            suit: Suit.EMPTY,
            renegable: false,
            selected: false,
        },
        {
            name: CardName.EMPTY,
            value: 0,
            coldValue: 0,
            suit: Suit.EMPTY,
            renegable: false,
            selected: false,
        },
    ],
    event: Event.CardPlayed,
}

export const AfterHandEnd3: GameStateResponse = {
    id: "6456926",
    revision: 142,
    status: GameStatus.ACTIVE,
    me: {
        id: "player1",
        seatNumber: 2,
        call: 0,
        cardsBought: 0,
        score: 90,
        rings: 0,
        teamId: "2",
        winner: false,
    },
    iamSpectator: false,
    isMyGo: false,
    iamGoer: false,
    iamDealer: true,
    iamAdmin: true,
    maxCall: 20,
    players: [
        {
            id: "player2",
            seatNumber: 1,
            call: 20,
            cardsBought: 0,
            score: 105,
            rings: 1,
            teamId: "1",
            winner: false,
        },
        {
            id: "player1",
            seatNumber: 2,
            call: 0,
            cardsBought: 0,
            score: 90,
            rings: 0,
            teamId: "2",
            winner: false,
        },
    ],
    round: {
        timestamp: "2024-01-30T21:37:49.537Z",
        number: 9,
        dealerId: "player1",
        goerId: "player2",
        suit: Suit.HEARTS,
        status: RoundStatus.PLAYING,
        currentHand: {
            timestamp: "2024-01-30T21:43:00.666380381Z",
            currentPlayerId: "player2",
            playedCards: [],
        },
        dealerSeeingCall: false,
        completedHands: [
            {
                timestamp: "2024-01-30T21:37:49.537Z",
                leadOut: CardName.KING_HEARTS,
                currentPlayerId: "player2",
                playedCards: [
                    {
                        playerId: "player1",
                        card: CardName.KING_HEARTS,
                    },
                    {
                        playerId: "player2",
                        card: CardName.ACE_HEARTS,
                    },
                ],
            },
            {
                timestamp: "2024-01-30T21:40:09.247Z",
                leadOut: CardName.TWO_HEARTS,
                currentPlayerId: "player1",
                playedCards: [
                    {
                        playerId: "player2",
                        card: CardName.TWO_HEARTS,
                    },
                    {
                        playerId: "player1",
                        card: CardName.THREE_HEARTS,
                    },
                ],
            },
            {
                timestamp: "2024-01-30T21:41:43.265Z",
                leadOut: CardName.SIX_HEARTS,
                currentPlayerId: "player2",
                playedCards: [
                    {
                        playerId: "player1",
                        card: CardName.SIX_HEARTS,
                    },
                    {
                        playerId: "player2",
                        card: CardName.NINE_HEARTS,
                    },
                ],
            },
        ],
    },
    cards: [CardName.TEN_DIAMONDS, CardName.SEVEN_HEARTS],
}
