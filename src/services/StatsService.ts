import axios from "axios"
import { AppThunk } from "../caches/caches"
import { updateGameStats } from "../caches/GameStatsSlice"
import { getAccessToken } from "../caches/MyProfileSlice"
import { PlayerGameStats } from "../model/Player"
import { getDefaultConfig } from "../utils/AxiosUtils"

const gameStatsForPlayer =
    (playerId?: string): AppThunk<Promise<PlayerGameStats>> =>
    async (dispatch, getState) => {
        const accessToken = getAccessToken(getState())

        const url = playerId
            ? `${
                  process.env.REACT_APP_API_URL
              }/api/v1/admin/stats/gameStatsForPlayer?playerId=${encodeURIComponent(
                  playerId,
              )}`
            : `${process.env.REACT_APP_API_URL}/api/v1/stats/gameStatsForPlayer`

        const response = await axios.get(url, getDefaultConfig(accessToken))
        dispatch(updateGameStats(response.data))
        return response.data
    }

export default { gameStatsForPlayer }
