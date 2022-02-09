import auth0Client from '../Auth';

const axios = require('axios');

class ProfileService {

    hasProfile = () => {
        let authHeader = `Bearer ${auth0Client.getAccessToken()}`;

        if (authHeader) {
            let config = {
                headers: {
                    Authorization: authHeader
                }
            };
            const result = axios
                .get(`${process.env.REACT_APP_API_URL}/api/v1/profile/has`, config)
            return result;
        }
    }

    getProfile = () => {
        let authHeader = `Bearer ${auth0Client.getAccessToken()}`;

        if (authHeader) {
            let config = {
                headers: {
                    Authorization: authHeader
                }
            }
            const result = axios
                .get(`${process.env.REACT_APP_API_URL}/api/v1/profile`, config)
            return result;
        }
    }


    updateProfile = (payload) => {
        let authHeader = `Bearer ${auth0Client.getAccessToken()}`;

        if (authHeader) {
            let config = {
                headers: {
                    Authorization: authHeader
                }
            }
            const response = axios
                .put(`${process.env.REACT_APP_API_URL}/api/v1/profile`, payload, config).then(result => auth0Client.updatePicture(result.picture))
            
            return response;
        }
    }
}

const profileService = new ProfileService();

export default profileService;