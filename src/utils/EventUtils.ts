import { Event } from "model/Events"
import { GameStateResponse, GameStatus } from "model/Game"
import { RoundStatus } from "model/Round"
import { Player } from "model/Player"

const callsChanged = (prev: Player[], curr: Player[]): boolean => {
    let changed = false
    prev.forEach(p => {
        curr.forEach(c => {
            if (p.id === c.id && p.call !== c.call && c.call !== 0) {
                changed = true
            }
        })
    })

    return changed
}

const isCallEvent = (
    prevState: GameStateResponse,
    currState: GameStateResponse,
): boolean => {
    return (
        prevState.round?.status === RoundStatus.CALLING &&
        prevState.round.currentHand?.currentPlayerId !==
            currState.round?.currentHand?.currentPlayerId &&
        callsChanged(prevState.players, currState.players)
    )
}

const isPassEvent = (
    prevState: GameStateResponse,
    currState: GameStateResponse,
): boolean => {
    return (
        prevState.round?.status === RoundStatus.CALLING &&
        prevState.round.currentHand?.currentPlayerId !==
            currState.round?.currentHand?.currentPlayerId &&
        !callsChanged(prevState.players, currState.players)
    )
}

const isSelectSuitEvent = (prevState: GameStateResponse): boolean => {
    return prevState.round?.status === RoundStatus.CALLED
}

const isBuyCardsEvent = (prevState: GameStateResponse): boolean => {
    return prevState.round?.status === RoundStatus.BUYING
}

const isCardPlayedEvent = (
    prevState: GameStateResponse,
    currState: GameStateResponse,
): boolean => {
    return prevState.round?.status === RoundStatus.PLAYING
}

const isHandEndEvent = (
    prevState: GameStateResponse,
    currState: GameStateResponse,
): boolean => {
    return (
        prevState.round?.status === RoundStatus.PLAYING &&
        currState.round?.status === RoundStatus.PLAYING &&
        prevState.round?.number === currState.round?.number &&
        prevState.round?.completedHands.length <
            currState.round?.completedHands.length
    )
}

const isRoundEndEvent = (
    prevState: GameStateResponse,
    currState: GameStateResponse,
): boolean => {
    return (
        prevState.round?.status === RoundStatus.PLAYING &&
        currState.round?.status === RoundStatus.CALLING &&
        prevState.round?.number < currState.round?.number
    )
}

const isGameOverEvent = (
    prevState: GameStateResponse,
    currState: GameStateResponse,
): boolean => {
    return (
        prevState.status === GameStatus.ACTIVE &&
        currState.status === GameStatus.COMPLETED
    )
}

export const determineEvent = (
    prevState: GameStateResponse,
    currState: GameStateResponse,
): Event => {
    if (isCallEvent(prevState, currState)) {
        return Event.Call
    }
    if (isPassEvent(prevState, currState)) {
        return Event.Pass
    }
    if (isSelectSuitEvent(prevState)) {
        return Event.SelectSuit
    }
    if (isBuyCardsEvent(prevState)) {
        return Event.BuyCards
    }
    if (isGameOverEvent(prevState, currState)) {
        return Event.GameOver
    }
    if (isRoundEndEvent(prevState, currState)) {
        return Event.RoundEnd
    }
    if (isHandEndEvent(prevState, currState)) {
        return Event.HandEnd
    }
    if (isCardPlayedEvent(prevState, currState)) {
        return Event.CardPlayed
    }
    return Event.Unknown
}
