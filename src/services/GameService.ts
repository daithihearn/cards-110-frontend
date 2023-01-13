import { Card } from "../model/Cards"
import { CreateGame, Game, GameState } from "../model/Game"
import { Suit } from "../model/Suit"
import axios from "axios"
import { getDefaultConfig } from "../utils/AxiosUtils"
import { Player, PlayerProfile } from "../model/Player"
import { AppThunk } from "../caches/caches"
import { updateGame, updatePlayers } from "../caches/GameSlice"
import { getAccessToken } from "../caches/MyProfileSlice"
import { addMyGame, removeMyGame, updateMyGames } from "../caches/MyGamesSlice"
import { updatePlayerProfiles } from "../caches/PlayerProfilesSlice"
import { clearSelectedCards, updateMyCards } from "../caches/MyCardsSlice"
import { clearAutoPlay } from "../caches/AutoPlaySlice"

const getGame =
  (gameId: string): AppThunk<Promise<Game>> =>
  async (_, getState) => {
    const accessToken = getAccessToken(getState())

    const response = await axios.get<Game>(
      `${process.env.REACT_APP_API_URL}/api/v1/game?gameId=${gameId}`,
      getDefaultConfig(accessToken)
    )
    return response.data
  }

const refreshGameState =
  (gameId: string): AppThunk<Promise<void>> =>
  async (dispatch, getState) => {
    const accessToken = getAccessToken(getState())
    const response = await axios.get<GameState>(
      `${process.env.REACT_APP_API_URL}/api/v1/gameState?gameId=${gameId}`,
      getDefaultConfig(accessToken)
    )
    dispatch(updateGame(response.data))
    dispatch(updateMyCards(response.data.cards))
    dispatch(clearAutoPlay())
  }

const getAll = (): AppThunk<Promise<Game[]>> => async (dispatch, getState) => {
  const accessToken = getAccessToken(getState())
  const response = await axios.get<Game[]>(
    `${process.env.REACT_APP_API_URL}/api/v1/game/all`,
    getDefaultConfig(accessToken)
  )
  dispatch(updateMyGames(response.data))
  return response.data
}

const getAllPlayers =
  (): AppThunk<Promise<PlayerProfile[]>> => async (dispatch, getState) => {
    const accessToken = getAccessToken(getState())
    const response = await axios.get<PlayerProfile[]>(
      `${process.env.REACT_APP_API_URL}/api/v1/admin/game/players/all`,
      getDefaultConfig(accessToken)
    )
    dispatch(updatePlayerProfiles(response.data))
    return response.data
  }

const getPlayersForGame =
  (gameId: string): AppThunk<Promise<Player[]>> =>
  async (dispatch, getState) => {
    const accessToken = getAccessToken(getState())
    const response = await axios.get<Player[]>(
      `${process.env.REACT_APP_API_URL}/api/v1/game/players?gameId=${gameId}`,
      getDefaultConfig(accessToken)
    )

    dispatch(updatePlayers(response.data))

    return response.data
  }

const put =
  (createGame: CreateGame): AppThunk<Promise<Game>> =>
  async (dispatch, getState) => {
    const accessToken = getAccessToken(getState())
    const response = await axios.put<Game>(
      `${process.env.REACT_APP_API_URL}/api/v1/admin/game`,
      createGame,
      getDefaultConfig(accessToken)
    )

    dispatch(addMyGame(response.data))
    return response.data
  }

const finish =
  (gameId: string): AppThunk<Promise<void>> =>
  async (_, getState) => {
    const accessToken = getAccessToken(getState())

    await axios.put(
      `${process.env.REACT_APP_API_URL}/api/v1/admin/game/finish?gameId=${gameId}`,
      null,
      getDefaultConfig(accessToken)
    )
  }

const cancel =
  (gameId: string): AppThunk<Promise<void>> =>
  async (_, getState) => {
    const accessToken = getAccessToken(getState())

    await axios.put(
      `${process.env.REACT_APP_API_URL}/api/v1/admin/game/cancel?gameId=${gameId}`,
      null,
      getDefaultConfig(accessToken)
    )
  }

const deleteGame =
  (gameId: string): AppThunk<Promise<void>> =>
  async (dispatch, getState) => {
    const accessToken = getAccessToken(getState())

    await axios.delete(
      `${process.env.REACT_APP_API_URL}/api/v1/admin/game?gameId=${gameId}`,
      getDefaultConfig(accessToken)
    )
    dispatch(removeMyGame)
  }

const replay =
  (gameId: string): AppThunk<Promise<void>> =>
  async (_, getState) => {
    const accessToken = getAccessToken(getState())

    await axios.put(
      `${process.env.REACT_APP_API_URL}/api/v1/replay?gameId=${gameId}`,
      null,
      getDefaultConfig(accessToken)
    )
  }

const deal =
  (gameId: string): AppThunk<Promise<void>> =>
  async (_, getState) => {
    const accessToken = getAccessToken(getState())

    await axios.put(
      `${process.env.REACT_APP_API_URL}/api/v1/deal?gameId=${gameId}`,
      null,
      getDefaultConfig(accessToken)
    )
  }

const call =
  (gameId: string, call: number): AppThunk<Promise<void>> =>
  async (_, getState) => {
    const accessToken = getAccessToken(getState())

    await axios.put(
      `${process.env.REACT_APP_API_URL}/api/v1/call?gameId=${gameId}&call=${call}`,
      null,
      getDefaultConfig(accessToken)
    )
  }

const buyCards =
  (gameId: string, cards: Card[] | string[]): AppThunk<Promise<void>> =>
  async (dispatch, getState) => {
    const accessToken = getAccessToken(getState())

    await axios.put(
      `${process.env.REACT_APP_API_URL}/api/v1/buyCards?gameId=${gameId}`,
      cards.map((c) => (typeof c === "string" ? c : c.name)),
      getDefaultConfig(accessToken)
    )
    dispatch(clearSelectedCards)
  }

const chooseFromDummy =
  (gameId: string, cards: Card[], suit: Suit): AppThunk<Promise<void>> =>
  async (dispatch, getState) => {
    const accessToken = getAccessToken(getState())
    await axios.put(
      `${process.env.REACT_APP_API_URL}/api/v1/chooseFromDummy?gameId=${gameId}&suit=${suit}`,
      cards.map((c) => c.name),
      getDefaultConfig(accessToken)
    )
    dispatch(clearSelectedCards)
  }

const playCard =
  (gameId: string, card: string): AppThunk<Promise<void>> =>
  async (_, getState) => {
    const accessToken = getAccessToken(getState())
    await axios.put(
      `${process.env.REACT_APP_API_URL}/api/v1/playCard?gameId=${gameId}&card=${card}`,
      null,
      getDefaultConfig(accessToken)
    )
  }

export default {
  getGame,
  refreshGameState,
  getAll,
  getAllPlayers,
  getPlayersForGame,
  deal,
  deleteGame,
  playCard,
  chooseFromDummy,
  buyCards,
  call,
  replay,
  put,
  finish,
  cancel,
}
