import { useQuery } from "@tanstack/react-query"
import useAccessToken from "auth/accessToken"
import axios from "axios"
import { PlayerGameStats } from "model/Player"
import { getDefaultConfig } from "utils/AxiosUtils"

export const useStats = (playerId: string) => {
    const { accessToken } = useAccessToken()

    const statsResponse = useQuery<PlayerGameStats[]>({
        queryKey: ["playerStats", accessToken, playerId],
        queryFn: async () => {
            if (!accessToken) {
                // Handle the case when accessToken is undefined
                // For example, return a default value or throw an error
                throw new Error("Access token is not available")
            }
            const response = await axios.get(
                `${
                    process.env.REACT_APP_API_URL
                }/api/v1/stats/${encodeURIComponent(playerId)}`,
                getDefaultConfig(accessToken),
            )
            return response.data
        },
        refetchInterval: 15 * 60_000,
        enabled: !!accessToken,
    })

    return {
        stats: statsResponse.data ?? [],
    }
}
