import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import useAccessToken from "auth/accessToken"
import axios from "axios"
import { PlayerSettings } from "model/PlayerSettings"
import { useSnackbar } from "notistack"
import { getDefaultConfig } from "utils/AxiosUtils"
import parseError from "utils/ErrorUtils"

export const useSettings = () => {
    const { enqueueSnackbar } = useSnackbar()
    const queryClient = useQueryClient()
    const { accessToken } = useAccessToken()

    // Player Settings query
    const { isLoading, data } = useQuery<PlayerSettings>({
        queryKey: ["playerSettings", accessToken],
        queryFn: async () => {
            if (!accessToken) {
                // Handle the case when accessToken is undefined
                // For example, return a default value or throw an error
                throw new Error("Access token is not available")
            }
            const res = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/v1/settings`,
                getDefaultConfig(accessToken),
            )
            return res.data
        },
        // Refetch the data 15 minutes
        refetchInterval: 15 * 60_000,
        enabled: !!accessToken,
    })

    const updateSettings = useMutation({
        mutationFn: async (settings: PlayerSettings) => {
            if (!accessToken) {
                // Handle the case when accessToken is undefined
                // For example, return a default value or throw an error
                throw new Error("Access token is not available")
            }
            axios.put<PlayerSettings>(
                `${process.env.REACT_APP_API_URL}/api/v1/settings`,
                settings,
                getDefaultConfig(accessToken),
            )
        },
        onSuccess: data =>
            queryClient.setQueryData(["playerSettings", accessToken], data),
        onError: e => enqueueSnackbar(parseError(e), { variant: "error" }),
    })

    return {
        updateSettings: updateSettings.mutate,
        isLoading,
        settings: data,
    }
}
