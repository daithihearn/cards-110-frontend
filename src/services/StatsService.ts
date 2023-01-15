import axios from "axios"
import { AppThunk } from "../caches/caches"
import { updateGameStats } from "../caches/GameStatsSlice"
import { getAccessToken } from "../caches/MyProfileSlice"
import { PlayerGameStats } from "../model/Player"
import { getDefaultConfig } from "../utils/AxiosUtils"

const gameStatsForPlayer =
    (): AppThunk<Promise<PlayerGameStats>> => async (dispatch, getState) => {
        const accessToken = getAccessToken(getState())

        const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/v1/stats/gameStatsForPlayer`,
            getDefaultConfig(accessToken),
        )
        dispatch(updateGameStats(response.data))
        return response.data
    }

export default { gameStatsForPlayer }
