import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import useAccessToken from "auth/accessToken"
import axios from "axios"
import { PlayerProfile } from "model/Player"
import { useSnackbar } from "notistack"
import { getDefaultConfig } from "utils/AxiosUtils"

export interface UpdateProfilePayload {
    name: string
    picture: string
    forceUpdate?: boolean
}

export const useProfiles = () => {
    const { enqueueSnackbar } = useSnackbar()
    const queryClient = useQueryClient()
    const { accessToken } = useAccessToken()

    const myProfileRes = useQuery<PlayerProfile>({
        queryKey: ["myProfile", accessToken],
        queryFn: async () => {
            if (!accessToken) {
                // Handle the case when accessToken is undefined
                // For example, return a default value or throw an error
                return {
                    id: "",
                    name: "",
                    picture: "",
                    lastAccess: "",
                }
            }
            const res = await axios.get<PlayerProfile>(
                `${process.env.REACT_APP_API_URL}/api/v1/profile`,
                getDefaultConfig(accessToken),
            )
            return res.data
        },
        // Refetch the data 15 minutes
        refetchInterval: 15 * 60_000,
        enabled: !!accessToken,
    })

    // Player Profiles query
    const allProfiles = useQuery<PlayerProfile[]>({
        queryKey: ["playerProfiles", accessToken],
        queryFn: async () => {
            if (!accessToken) {
                // Handle the case when accessToken is undefined
                // For example, return a default value or throw an error
                return []
            }
            const res = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/v1/profile/all`,
                getDefaultConfig(accessToken),
            )
            return res.data
        },
        // Refetch the data 15 minutes
        refetchInterval: 15 * 60_000,
        enabled: !!accessToken,
    })

    // Mutations
    const updateProfile = useMutation({
        mutationFn: async (profile: UpdateProfilePayload) => {
            if (accessToken) {
                await axios.put<PlayerProfile>(
                    `${process.env.REACT_APP_API_URL}/api/v1/profile`,
                    profile,
                    getDefaultConfig(accessToken),
                )
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["myProfile", "playerProfiles"],
            })
        },
        onError: e => enqueueSnackbar(e.message, { variant: "error" }),
    })

    return {
        updateProfile: updateProfile.mutate,
        myProfile: myProfileRes.data,
        allProfiles: allProfiles.data ?? [],
    }
}
