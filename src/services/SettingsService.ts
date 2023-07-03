import axios from "axios"
import { AppThunk } from "caches/caches"
import { getAccessToken } from "caches/MyProfileSlice"
import { PlayerSettings } from "model/PlayerSettings"
import { getDefaultConfig } from "utils/AxiosUtils"
import { updateSettings as updateSettingsCache } from "caches/SettingsSlice"

const getSettings =
    (): AppThunk<Promise<PlayerSettings>> => async (dispatch, getState) => {
        const accessToken = getAccessToken(getState())

        const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/v1/settings`,
            getDefaultConfig(accessToken),
        )
        dispatch(updateSettingsCache(response.data))
        return response.data
    }

const updateSettings =
    (settings: PlayerSettings): AppThunk<Promise<void>> =>
    async (dispatch, getState) => {
        const accessToken = getAccessToken(getState())

        await axios.put(
            `${process.env.REACT_APP_API_URL}/api/v1/settings`,
            settings,
            getDefaultConfig(accessToken),
        )

        dispatch(updateSettingsCache(settings))
    }

export default { getSettings, updateSettings }
