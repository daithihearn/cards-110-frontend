import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import useAccessToken from "auth/accessToken"
import axios from "axios"
import { CreateGame, Game } from "model/Game"
import { useSnackbar } from "notistack"
import { getDefaultConfig } from "utils/AxiosUtils"
import parseError from "utils/ErrorUtils"

export const useGame = () => {
    const { enqueueSnackbar } = useSnackbar()
    const { accessToken } = useAccessToken()
    const queryClient = useQueryClient()

    const gamesResp = useQuery({
        queryKey: ["myGames", accessToken],
        queryFn: async () => {
            if (!accessToken) {
                // Handle the case when accessToken is undefined
                // For example, return a default value or throw an error
                return []
            }
            const res = await axios.get<Game[]>(
                `${process.env.REACT_APP_API_URL}/api/v1/game/all`,
                getDefaultConfig(accessToken),
            )
            return res.data
        },
        refetchInterval: 5 * 60_000,
    })

    const createGame = useMutation({
        mutationFn: async (createGame: CreateGame) => {
            if (accessToken) {
                axios.put<Game>(
                    `${process.env.REACT_APP_API_URL}/api/v1/game`,
                    createGame,
                    getDefaultConfig(accessToken),
                )
            }
        },
        onSuccess: data =>
            queryClient.invalidateQueries({ queryKey: ["myGames"] }),
        onError: e => enqueueSnackbar(parseError(e), { variant: "error" }),
    })

    return { games: gamesResp.data, createGame: createGame.mutate }
}
