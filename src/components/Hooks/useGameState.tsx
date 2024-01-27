import { useQuery } from "@tanstack/react-query"
import useAccessToken from "auth/accessToken"
import axios from "axios"
import { initialGameState, updateGame } from "caches/GameSlice"
import { updateMyCards } from "caches/MyCardsSlice"
import { useAppDispatch } from "caches/hooks"
import { GameState } from "model/Game"
import { useState } from "react"
import { getDefaultConfig } from "utils/AxiosUtils"

export const useGameState = (gameId: string) => {
    const dispatch = useAppDispatch()
    const { accessToken } = useAccessToken()
    const [revision, setRevision] = useState(-1)

    // Game state query

    useQuery({
        queryKey: ["gameState", accessToken, revision, gameId],
        queryFn: async () => {
            if (!accessToken) {
                // Handle the case when accessToken is undefined
                // For example, return a default value or throw an error
                return initialGameState
            }
            const res = await axios.get<GameState>(
                `${process.env.REACT_APP_API_URL}/api/v1/game/${gameId}/state?revision=${revision}`,
                getDefaultConfig(accessToken),
            )

            if (res.status === 200) {
                setRevision(res.data.revision)
                dispatch(updateGame(res.data))
                dispatch(updateMyCards(res.data.cards))
            }
            return res.data
        },
        // Refetch the data every 2 seconds
        refetchInterval: 2_000,
        enabled: !!accessToken,
    })
}
