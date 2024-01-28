import { Actions } from "model/Events"
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

export const isCallEvent = (
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

export const isPassEvent = (
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

export const isSelectSuitEvent = (prevState: GameStateResponse): boolean => {
    return prevState.round?.status === RoundStatus.CALLED
}

export const isBuyCardsEvent = (prevState: GameStateResponse): boolean => {
    return prevState.round?.status === RoundStatus.BUYING
}

export const isCardPlayedEvent = (prevState: GameStateResponse): boolean => {
    return prevState.round?.status === RoundStatus.PLAYING
}

export const isHandEndEvent = (
    prevState: GameStateResponse,
    currState: GameStateResponse,
): boolean => {
    return (
        prevState.round?.status === RoundStatus.PLAYING &&
        currState.round?.status === RoundStatus.PLAYING &&
        prevState.round?.completedHands.length !==
            currState.round?.completedHands.length
    )
}

export const isRoundEndEvent = (
    prevState: GameStateResponse,
    currState: GameStateResponse,
): boolean => {
    return (
        prevState.round?.status === RoundStatus.PLAYING &&
        currState.round?.status === RoundStatus.PLAYING &&
        prevState.round?.number !== currState.round?.number
    )
}

export const isGameOverEvent = (
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
): Actions => {
    if (isCallEvent(prevState, currState)) {
        return Actions.Call
    }
    if (isPassEvent(prevState, currState)) {
        return Actions.Pass
    }
    if (isSelectSuitEvent(prevState)) {
        return Actions.SelectSuit
    }
    if (isBuyCardsEvent(prevState)) {
        return Actions.BuyCards
    }
    if (isRoundEndEvent(prevState, currState)) {
        return Actions.RoundEnd
    }
    if (isHandEndEvent(prevState, currState)) {
        return Actions.HandEnd
    }
    if (isCardPlayedEvent(prevState)) {
        return Actions.CardPlayed
    }
    if (isGameOverEvent(prevState, currState)) {
        return Actions.GameOver
    }
    return Actions.Unknown
}
