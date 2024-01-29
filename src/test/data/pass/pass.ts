import { CardName } from "model/Cards"
import { GameStateResponse, GameStatus } from "model/Game"
import { RoundStatus } from "model/Round"

export const BeforePass: GameStateResponse = {
    id: "game1",
    revision: 79,
    status: GameStatus.ACTIVE,
    me: {
        id: "player1",
        seatNumber: 1,
        call: 0,
        cardsBought: 0,
        score: 40,
        rings: 1,
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
            score: 40,
            rings: 1,
            teamId: "1",
            winner: false,
        },
        {
            id: "player2",
            seatNumber: 2,
            call: 0,
            cardsBought: 0,
            score: 5,
            rings: 1,
            teamId: "2",
            winner: false,
        },
    ],
    round: {
        timestamp: "2024-01-25T12:57:48.548711+01:00",
        number: 6,
        dealerId: "player2",
        status: RoundStatus.CALLING,
        currentHand: {
            timestamp: "2024-01-25T12:57:48.548711+01:00",
            currentPlayerId: "player1",
            playedCards: [],
        },
        dealerSeeingCall: false,
        completedHands: [],
    },
    cards: [
        CardName.FOUR_HEARTS,
        CardName.NINE_HEARTS,
        CardName.THREE_DIAMONDS,
        CardName.SEVEN_SPADES,
        CardName.TEN_CLUBS,
    ],
}

export const AfterPass: GameStateResponse = {
    id: "game1",
    revision: 80,
    status: GameStatus.ACTIVE,
    me: {
        id: "player1",
        seatNumber: 1,
        call: 0,
        cardsBought: 0,
        score: 40,
        rings: 1,
        teamId: "1",
        winner: false,
    },
    iamSpectator: false,
    isMyGo: false,
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
            score: 40,
            rings: 1,
            teamId: "1",
            winner: false,
        },
        {
            id: "player2",
            seatNumber: 2,
            call: 0,
            cardsBought: 0,
            score: 5,
            rings: 1,
            teamId: "2",
            winner: false,
        },
    ],
    round: {
        timestamp: "2024-01-25T11:57:48.548Z",
        number: 6,
        dealerId: "player2",
        status: RoundStatus.CALLING,
        currentHand: {
            timestamp: "2024-01-25T11:57:48.548Z",
            currentPlayerId: "player2",
            playedCards: [],
        },
        dealerSeeingCall: false,
        completedHands: [],
    },
    cards: [
        CardName.FOUR_HEARTS,
        CardName.NINE_HEARTS,
        CardName.THREE_DIAMONDS,
        CardName.SEVEN_SPADES,
        CardName.TEN_CLUBS,
    ],
}