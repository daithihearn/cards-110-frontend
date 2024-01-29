import { useQuery } from "@tanstack/react-query"
import useAccessToken from "auth/accessToken"
import axios from "axios"
import { getRevision, initialGameState, updateGame } from "caches/GameSlice"
import { useAppDispatch, useAppSelector } from "caches/hooks"
import { GameStateResponse } from "model/Game"
import { getDefaultConfig } from "utils/AxiosUtils"

export const useGameState = (gameId?: string) => {
    const dispatch = useAppDispatch()
    const { accessToken } = useAccessToken()
    const revision = useAppSelector(getRevision)

    // Game state query

    useQuery({
        queryKey: ["gameState", accessToken, revision, gameId],
        queryFn: async () => {
            if (!accessToken || !gameId) {
                // Handle the case when accessToken is undefined
                // For example, return a default value or throw an error
                return initialGameState
            }
            const res = await axios.get<GameStateResponse>(
                `${process.env.REACT_APP_API_URL}/api/v1/game/${gameId}/state?revision=${revision}`,
                getDefaultConfig(accessToken),
            )

            if (res.status === 200) {
                dispatch(updateGame(res.data))
            }
            return res.data
        },
        // Refetch the data every 2 seconds
        refetchInterval: 5_000,
        enabled: !!accessToken && !!gameId,
    })
}
