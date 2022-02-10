const initialState = {
    idToken: null,
    accessToken: null,
    scope: null,
    expiresAt: null
}

export default function authReducer(state = initialState, action) {
    switch (action.type) {
        case 'auth/updateIdToken': {
            return {
                idToken: action.payload
            }
        }
        case 'auth/updateAccessToken': {
            return {
                accessToken: action.payload
            }
        }
        case 'auth/updateScope': {
            return {
                scope: action.payload
            }
        }
        case 'auth/updateExpiresAt': {
            return {
                expiresAt: action.payload
            }
        }
        case 'auth/update': {
            return {
                idToken: action.payload.idToken,
                accessToken: action.payload.accessToken,
                scope: action.payload.scope,
                expiresAt: action.payload.expiresAt
            }
        }
        default:
          return state
    }
}