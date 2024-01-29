import { CardName } from "model/Cards"
import { GameStateResponse, GameStatus } from "model/Game"
import { RoundStatus } from "model/Round"
import { Suit } from "model/Suit"

export const BeforeRoundEnd: GameStateResponse = {
    id: "game1",
    revision: 18,
    status: GameStatus.ACTIVE,
    me: {
        id: "player1",
        seatNumber: 1,
        call: 0,
        cardsBought: 0,
        score: 0,
        rings: 0,
        teamId: "1",
        winner: false,
    },
    iamSpectator: false,
    isMyGo: true,
    iamGoer: false,
    iamDealer: true,
    iamAdmin: true,
    maxCall: 25,
    players: [
        {
            id: "player1",
            seatNumber: 1,
            call: 0,
            cardsBought: 0,
            score: 0,
            rings: 0,
            teamId: "1",
            winner: false,
        },
        {
            id: "player2",
            seatNumber: 2,
            call: 25,
            cardsBought: 0,
            score: 0,
            rings: 0,
            teamId: "2",
            winner: false,
        },
    ],
    round: {
        timestamp: "2024-01-25T09:25:58.651Z",
        number: 1,
        dealerId: "player1",
        goerId: "player2",
        suit: Suit.SPADES,
        status: RoundStatus.PLAYING,
        currentHand: {
            timestamp: "2024-01-25T11:37:15.895Z",
            leadOut: CardName.TEN_HEARTS,
            currentPlayerId: "player1",
            playedCards: [
                {
                    playerId: "player2",
                    card: CardName.TEN_HEARTS,
                },
            ],
        },
        dealerSeeingCall: false,
        completedHands: [
            {
                timestamp: "2024-01-25T09:25:58.651Z",
                leadOut: CardName.TWO_SPADES,
                currentPlayerId: "player2",
                playedCards: [
                    {
                        playerId: "player1",
                        card: CardName.TWO_SPADES,
                    },
                    {
                        playerId: "player2",
                        card: CardName.QUEEN_SPADES,
                    },
                ],
            },
            {
                timestamp: "2024-01-25T11:37:01.996Z",
                leadOut: CardName.FIVE_SPADES,
                currentPlayerId: "player1",
                playedCards: [
                    {
                        playerId: "player2",
                        card: CardName.FIVE_SPADES,
                    },
                    {
                        playerId: "player1",
                        card: CardName.EIGHT_CLUBS,
                    },
                ],
            },
            {
                timestamp: "2024-01-25T11:37:07.397Z",
                leadOut: CardName.JACK_SPADES,
                currentPlayerId: "player1",
                playedCards: [
                    {
                        playerId: "player2",
                        card: CardName.JACK_SPADES,
                    },
                    {
                        playerId: "player1",
                        card: CardName.THREE_HEARTS,
                    },
                ],
            },
            {
                timestamp: "2024-01-25T11:37:11.393Z",
                leadOut: CardName.JACK_HEARTS,
                currentPlayerId: "player1",
                playedCards: [
                    {
                        playerId: "player2",
                        card: CardName.JACK_HEARTS,
                    },
                    {
                        playerId: "player1",
                        card: CardName.FIVE_HEARTS,
                    },
                ],
            },
        ],
    },
    cards: [CardName.SIX_HEARTS],
}

export const AfterRoundEnd: GameStateResponse = {
    id: "game1",
    revision: 19,
    status: GameStatus.ACTIVE,
    me: {
        id: "player1",
        seatNumber: 1,
        call: 0,
        cardsBought: 0,
        score: 0,
        rings: 0,
        teamId: "1",
        winner: false,
    },
    iamSpectator: false,
    isMyGo: true,
    iamGoer: false,
    iamDealer: false,
    iamAdmin: true,
    maxCall: 0,
    players: [
        {
            id: "player1",
            seatNumber: 1,
            call: 0,
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
        status: RoundStatus.CALLING,
        currentHand: {
            timestamp: "2024-01-25T11:38:38.687Z",
            currentPlayerId: "player1",
            playedCards: [],
        },
        dealerSeeingCall: false,
        completedHands: [],
    },
    cards: [
        CardName.JACK_CLUBS,
        CardName.JOKER,
        CardName.FOUR_HEARTS,
        CardName.KING_CLUBS,
        CardName.TWO_DIAMONDS,
    ],
}
