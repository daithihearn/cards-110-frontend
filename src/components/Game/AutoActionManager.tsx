import { useEffect } from "react"
import GameService from "services/GameService"

import { useAppDispatch, useAppSelector } from "caches/hooks"
import { getGameId, getIsInBunker } from "caches/GameSlice"

const AutoActionManager = () => {
    const dispatch = useAppDispatch()

    const gameId = useAppSelector(getGameId)
    const isInBunker = useAppSelector(getIsInBunker)

    const call = (id: string, callAmount: number) =>
        dispatch(GameService.call(id, callAmount)).catch(console.error)

    // If in the bunker, Pass
    useEffect(() => {
        if (gameId && isInBunker) call(gameId, 0)
    }, [gameId, isInBunker])

    return null
}

export default AutoActionManager
