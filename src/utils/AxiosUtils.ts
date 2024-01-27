import { AxiosRequestConfig } from "axios"

export const getDefaultConfig = (accessToken?: string): AxiosRequestConfig => {
    return {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
    }
}
