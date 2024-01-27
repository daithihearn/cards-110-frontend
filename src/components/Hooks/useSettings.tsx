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
                return {
                    autoBuyCards: false,
                }
            }
            const res = await axios.get<PlayerSettings>(
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
                return {
                    autoBuyCards: false,
                }
            }
            const res = await axios.put<PlayerSettings>(
                `${process.env.REACT_APP_API_URL}/api/v1/settings`,
                settings,
                getDefaultConfig(accessToken),
            )
            return res.data
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
