const axios = require("axios")

class ProfileService {
  hasProfile = (accessToken) => {
    let authHeader = `Bearer ${accessToken}`

    if (authHeader) {
      let config = {
        headers: {
          Authorization: authHeader,
        },
      }
      const result = axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/profile/has`,
        config
      )
      return result
    }
  }

  getProfile = (accessToken) => {
    let authHeader = `Bearer ${accessToken}`

    if (authHeader) {
      let config = {
        headers: {
          Authorization: authHeader,
        },
      }
      const result = axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/profile`,
        config
      )
      return result
    }
  }

  updateProfile = (payload, accessToken) => {
    let authHeader = `Bearer ${accessToken}`

    if (authHeader) {
      let config = {
        headers: {
          Authorization: authHeader,
        },
      }
      const result = axios.put(
        `${process.env.REACT_APP_API_URL}/api/v1/profile`,
        payload,
        config
      )
      return result
    }
  }
}

const profileService = new ProfileService()

export default profileService
