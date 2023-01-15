import axios from "axios"
import { AppThunk } from "../caches/caches"
import { getAccessToken } from "../caches/MyProfileSlice"
import { getDefaultConfig } from "../utils/AxiosUtils"

const register =
    (gameId: string): AppThunk<Promise<void>> =>
    async (_, getState) => {
        const accessToken = getAccessToken(getState())

        await axios.put(
            `${process.env.REACT_APP_API_URL}/api/v1/spectator/register?gameId=${gameId}`,
            null,
            getDefaultConfig(accessToken),
        )
    }

export default { register }
