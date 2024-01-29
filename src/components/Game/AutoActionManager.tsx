import { useEffect } from "react"

import { useAppSelector } from "caches/hooks"
import { getGameId, getIsInBunker } from "caches/GameSlice"
import { useGameActions } from "components/Hooks/useGameActions"

const AutoActionManager = () => {
    const { call } = useGameActions()
    const gameId = useAppSelector(getGameId)
    const isInBunker = useAppSelector(getIsInBunker)

    // If in the bunker, Pass
    useEffect(() => {
        if (gameId && isInBunker) call({ gameId, call: "0" })
    }, [gameId, isInBunker])

    return null
}

export default AutoActionManager
