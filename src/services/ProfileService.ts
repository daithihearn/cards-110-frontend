import { getDefaultConfig } from "utils/AxiosUtils"

import axios from "axios"
import jwt_decode from "jwt-decode"
import { AppThunk } from "caches/caches"
import { getAccessToken, updateMyProfile } from "caches/MyProfileSlice"

const hasProfile = (): AppThunk<Promise<boolean>> => async (_, getState) => {
    const accessToken = getAccessToken(getState())

    try {
        await axios.get<boolean>(
            `${process.env.REACT_APP_API_URL}/api/v1/profile`,
            getDefaultConfig(accessToken),
        )
        return true
    } catch (e: any) {
        // If the error code is 404, then the user doesn't have a profile
        if (e.response && e.response.status === 404) return false
        throw e
    }
}

export interface UpdateProfilePayload {
    name: string
    picture: string
    forceUpdate?: boolean
}

interface ProfileResponse {
    id: string
    name: string
    picture: string
    pictureLocked: boolean
    lastAccess: string
}

interface JWTToken {
    permissions: string[]
}

const updateProfile =
    (
        payload: UpdateProfilePayload,
        accessToken?: string,
    ): AppThunk<Promise<void>> =>
    async (dispatch, getState) => {
        const token = accessToken ?? getAccessToken(getState())
        if (!token) throw Error("No access token found")

        const response = await axios.put<ProfileResponse>(
            `${process.env.REACT_APP_API_URL}/api/v1/profile`,
            payload,
            getDefaultConfig(token),
        )
        const decodedAccessToken = jwt_decode<JWTToken>(token)
        dispatch(
            updateMyProfile({
                id: response.data.id,
                name: response.data.name,
                picture: response.data.picture,
                isPlayer:
                    decodedAccessToken.permissions.indexOf("read:game") !== -1,
                isAdmin:
                    decodedAccessToken.permissions.indexOf("read:admin") !== -1,
                accessToken: token,
                lastAccess: response.data.lastAccess,
            }),
        )
    }

export default { hasProfile, updateProfile }
