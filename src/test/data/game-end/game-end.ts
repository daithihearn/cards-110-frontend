import { CardName } from "model/Cards"
import { GameStateResponse, GameStatus } from "model/Game"
import { RoundStatus } from "model/Round"
import { Suit } from "model/Suit"

export const BeforeGameEnd: GameStateResponse = {
    id: "game1",
    revision: 187,
    status: GameStatus.ACTIVE,
    me: {
        id: "player1",
        seatNumber: 1,
        call: 15,
        cardsBought: 0,
        score: 105,
        rings: 2,
        teamId: "1",
        winner: false,
    },
    iamSpectator: false,
    isMyGo: false,
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
            score: 105,
            rings: 2,
            teamId: "1",
            winner: false,
        },
        {
            id: "player2",
            seatNumber: 2,
            call: 0,
            cardsBought: 0,
            score: 60,
            rings: 2,
            teamId: "2",
            winner: false,
        },
    ],
    round: {
        timestamp: "2024-01-25T12:49:33.956Z",
        number: 14,
        dealerId: "player2",
        goerId: "player1",
        suit: Suit.HEARTS,
        status: RoundStatus.PLAYING,
        currentHand: {
            timestamp: "2024-01-25T12:50:53.224Z",
            leadOut: CardName.THREE_DIAMONDS,
            currentPlayerId: "player2",
            playedCards: [
                {
                    playerId: "player1",
                    card: CardName.THREE_DIAMONDS,
                },
            ],
        },
        dealerSeeingCall: false,
        completedHands: [
            {
                timestamp: "2024-01-25T12:49:33.956Z",
                leadOut: CardName.QUEEN_HEARTS,
                currentPlayerId: "player1",
                playedCards: [
                    {
                        playerId: "player2",
                        card: CardName.QUEEN_HEARTS,
                    },
                    {
                        playerId: "player1",
                        card: CardName.THREE_HEARTS,
                    },
                ],
            },
            {
                timestamp: "2024-01-25T12:50:18.778Z",
                leadOut: CardName.FOUR_HEARTS,
                currentPlayerId: "player1",
                playedCards: [
                    {
                        playerId: "player2",
                        card: CardName.FOUR_HEARTS,
                    },
                    {
                        playerId: "player1",
                        card: CardName.SIX_HEARTS,
                    },
                ],
            },
            {
                timestamp: "2024-01-25T12:50:33.96Z",
                leadOut: CardName.FIVE_HEARTS,
                currentPlayerId: "player2",
                playedCards: [
                    {
                        playerId: "player1",
                        card: CardName.FIVE_HEARTS,
                    },
                    {
                        playerId: "player2",
                        card: CardName.FOUR_DIAMONDS,
                    },
                ],
            },
            {
                timestamp: "2024-01-25T12:50:42.35Z",
                leadOut: CardName.SEVEN_HEARTS,
                currentPlayerId: "player2",
                playedCards: [
                    {
                        playerId: "player1",
                        card: CardName.SEVEN_HEARTS,
                    },
                    {
                        playerId: "player2",
                        card: CardName.SEVEN_CLUBS,
                    },
                ],
            },
        ],
    },
    cards: [],
}

export const AfterGameEnd: GameStateResponse = {
    id: "game1",
    revision: 188,
    status: GameStatus.COMPLETED,
    me: {
        id: "player1",
        seatNumber: 1,
        call: 15,
        cardsBought: 0,
        score: 125,
        rings: 2,
        teamId: "1",
        winner: true,
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
            score: 125,
            rings: 2,
            teamId: "1",
            winner: true,
        },
        {
            id: "player2",
            seatNumber: 2,
            call: 0,
            cardsBought: 0,
            score: 65,
            rings: 2,
            teamId: "2",
            winner: false,
        },
    ],
    round: {
        timestamp: "2024-01-25T12:49:33.956Z",
        number: 14,
        dealerId: "player2",
        goerId: "player1",
        suit: Suit.HEARTS,
        status: RoundStatus.PLAYING,
        currentHand: {
            timestamp: "2024-01-25T13:51:22.941201+01:00",
            currentPlayerId: "player1",
            playedCards: [],
        },
        dealerSeeingCall: false,
        completedHands: [
            {
                timestamp: "2024-01-25T12:49:33.956Z",
                leadOut: CardName.QUEEN_HEARTS,
                currentPlayerId: "player1",
                playedCards: [
                    {
                        playerId: "player2",
                        card: CardName.QUEEN_HEARTS,
                    },
                    {
                        playerId: "player1",
                        card: CardName.THREE_HEARTS,
                    },
                ],
            },
            {
                timestamp: "2024-01-25T12:50:18.778Z",
                leadOut: CardName.FOUR_HEARTS,
                currentPlayerId: "player1",
                playedCards: [
                    {
                        playerId: "player2",
                        card: CardName.FOUR_HEARTS,
                    },
                    {
                        playerId: "player1",
                        card: CardName.SIX_HEARTS,
                    },
                ],
            },
            {
                timestamp: "2024-01-25T12:50:33.96Z",
                leadOut: CardName.FIVE_HEARTS,
                currentPlayerId: "player2",
                playedCards: [
                    {
                        playerId: "player1",
                        card: CardName.FIVE_HEARTS,
                    },
                    {
                        playerId: "player2",
                        card: CardName.FOUR_DIAMONDS,
                    },
                ],
            },
            {
                timestamp: "2024-01-25T12:50:42.35Z",
                leadOut: CardName.SEVEN_HEARTS,
                currentPlayerId: "player2",
                playedCards: [
                    {
                        playerId: "player1",
                        card: CardName.SEVEN_HEARTS,
                    },
                    {
                        playerId: "player2",
                        card: CardName.SEVEN_CLUBS,
                    },
                ],
            },
            {
                timestamp: "2024-01-25T12:50:53.224Z",
                leadOut: CardName.THREE_DIAMONDS,
                currentPlayerId: "player2",
                playedCards: [
                    {
                        playerId: "player1",
                        card: CardName.THREE_DIAMONDS,
                    },
                    {
                        playerId: "player2",
                        card: CardName.FIVE_SPADES,
                    },
                ],
            },
        ],
    },
    cards: [],
}
