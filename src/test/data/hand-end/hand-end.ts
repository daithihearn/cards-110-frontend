import { CardName } from "model/Cards"
import { GameStateResponse, GameStatus } from "model/Game"
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
