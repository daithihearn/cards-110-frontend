import { Actions } from "model/Events"
import { GameState, GameStatus } from "model/Game"
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
    prevState: GameState,
    currState: GameState,
): boolean => {
    return (
        prevState.round?.status === RoundStatus.CALLING &&
        prevState.round.currentHand?.currentPlayerId !==
            currState.round?.currentHand?.currentPlayerId &&
        callsChanged(prevState.players, currState.players)
    )
}

export const isPassEvent = (
    prevState: GameState,
    currState: GameState,
): boolean => {
    return (
        prevState.round?.status === RoundStatus.CALLING &&
        prevState.round.currentHand?.currentPlayerId !==
            currState.round?.currentHand?.currentPlayerId &&
        !callsChanged(prevState.players, currState.players)
    )
}

export const isSelectSuitEvent = (prevState: GameState): boolean => {
    return prevState.round?.status === RoundStatus.CALLED
}

export const isBuyCardsEvent = (prevState: GameState): boolean => {
    return prevState.round?.status === RoundStatus.BUYING
}

export const isCardPlayedEvent = (prevState: GameState): boolean => {
    return prevState.round?.status === RoundStatus.PLAYING
}

export const isHandEndEvent = (
    prevState: GameState,
    currState: GameState,
): boolean => {
    return (
        prevState.round?.status === RoundStatus.PLAYING &&
        currState.round?.status === RoundStatus.PLAYING &&
        prevState.round?.completedHands.length !==
            currState.round?.completedHands.length
    )
}

export const isRoundEndEvent = (
    prevState: GameState,
    currState: GameState,
): boolean => {
    return (
        prevState.round?.status === RoundStatus.PLAYING &&
        currState.round?.status === RoundStatus.PLAYING &&
        prevState.round?.number !== currState.round?.number
    )
}

export const isGameOverEvent = (
    prevState: GameState,
    currState: GameState,
): boolean => {
    return (
        prevState.status === GameStatus.ACTIVE &&
        currState.status === GameStatus.COMPLETED
    )
}

export const determineEvent = (
    prevState: GameState,
    currState: GameState,
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
