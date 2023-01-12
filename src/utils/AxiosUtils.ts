import { AxiosRequestConfig } from "axios"

export const getDefaultConfig = (accessToken?: string): AxiosRequestConfig => {
  if (!accessToken) throw Error("No access token found")
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  }
}
