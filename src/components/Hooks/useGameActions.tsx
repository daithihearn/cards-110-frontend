import { useMutation, useQueryClient } from "@tanstack/react-query"
import useAccessToken from "auth/accessToken"
import axios from "axios"
import { initialGameState, updateGame } from "caches/GameSlice"
import { updateMyCards } from "caches/MyCardsSlice"
import { useAppDispatch } from "caches/hooks"
import { Card, CardName } from "model/Cards"
import { GameState } from "model/Game"
import { Suit } from "model/Suit"
import { useSnackbar } from "notistack"
import { getDefaultConfig } from "utils/AxiosUtils"
import parseError from "utils/ErrorUtils"

export const useGameActions = () => {
    const dispatch = useAppDispatch()
    const { accessToken } = useAccessToken()
    const { enqueueSnackbar } = useSnackbar()
    const queryClient = useQueryClient()

    const call = useMutation({
        mutationFn: async ({
            gameId,
            call,
        }: {
            gameId: string
            call: string
        }) => {
            if (!accessToken) {
                return initialGameState
            }
            const response = await axios.put<GameState>(
                `${process.env.REACT_APP_API_URL}/api/v1/game/${gameId}/call?call=${call}`,
                null,
                getDefaultConfig(accessToken),
            )
            return response.data
        },
        onSuccess: data => {
            queryClient.setQueryData(["gameState"], data)
            dispatch(updateGame(data))
            dispatch(updateMyCards(data.cards))
        },
        onError: e => enqueueSnackbar(parseError(e), { variant: "error" }),
    })

    const buyCards = useMutation({
        mutationFn: async ({
            gameId,
            cards,
        }: {
            gameId: string
            cards: CardName[]
        }) => {
            if (!accessToken) {
                return initialGameState
            }
            const response = await axios.put<GameState>(
                `${process.env.REACT_APP_API_URL}/api/v1/game/${gameId}/buy`,
                { cards },
                getDefaultConfig(accessToken),
            )
            return response.data
        },
        onSuccess: data => {
            queryClient.setQueryData(["gameState"], data)
            dispatch(updateGame(data))
            dispatch(updateMyCards(data.cards))
        },
        onError: e => enqueueSnackbar(parseError(e), { variant: "error" }),
    })

    const selectSuit = useMutation({
        mutationFn: async ({
            gameId,
            cards,
            suit,
        }: {
            gameId: string
            cards: Card[]
            suit: Suit
        }) => {
            if (!accessToken) {
                return initialGameState
            }
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/api/v1/game/${gameId}/suit`,
                {
                    suit: suit,
                    cards: cards.map(c => c.name),
                },
                getDefaultConfig(accessToken),
            )
            return response.data
        },
        onSuccess: data => {
            queryClient.setQueryData(["gameState"], data)
            dispatch(updateGame(data))
            dispatch(updateMyCards(data.cards))
        },
        onError: e => enqueueSnackbar(parseError(e), { variant: "error" }),
    })

    const playCard = useMutation({
        mutationFn: async ({
            gameId,
            card,
        }: {
            gameId: string
            card: CardName
        }) => {
            if (!accessToken) {
                return initialGameState
            }
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/api/v1/game/${gameId}/play?card=${card}`,
                null,
                getDefaultConfig(accessToken),
            )
            return response.data
        },
        onSuccess: data => {
            queryClient.setQueryData(["gameState"], data)
            dispatch(updateGame(data))
            dispatch(updateMyCards(data.cards))
        },
        onError: e => enqueueSnackbar(parseError(e), { variant: "error" }),
    })

    const deleteGame = useMutation({
        mutationFn: async ({ gameId }: { gameId: string }) => {
            if (accessToken) {
                axios.delete(
                    `${process.env.REACT_APP_API_URL}/api/v1/game/${gameId}`,
                    getDefaultConfig(accessToken),
                )
            }
        },
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ["myGames", "gameState"],
            }),
        onError: e => enqueueSnackbar(parseError(e), { variant: "error" }),
    })

    return {
        call: call.mutate,
        buyCards: buyCards.mutate,
        selectSuit: selectSuit.mutate,
        playCard: playCard.mutate,
        deleteGame: deleteGame.mutate,
    }
}
