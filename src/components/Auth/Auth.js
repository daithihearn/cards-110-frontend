import auth0 from 'auth0-js'

class Auth {
    constructor() {
        this.auth0 = new auth0.WebAuth({
            domain: process.env.REACT_APP_AUTH0_DOMAIN,
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
            redirectUri: process.env.REACT_APP_AUTH0_REDIRECT_URL,
            responseType: 'id_token code token',
            scope: process.env.REACT_APP_AUTH0_SCOPE
        })

        this.handleAuthentication = this.handleAuthentication.bind(this)
        this.signIn = this.signIn.bind(this)
        this.signOut = this.signOut.bind(this)
    }

    signIn() {
        this.auth0.authorize()
    }

    handleAuthentication() {
        return new Promise((resolve, reject) => {
            this.auth0.parseHash((err, authResult) => {
                if (err) return reject(err)
                if (!authResult || !authResult.idToken) {
                    return reject(err)
                }
                resolve(authResult)
            })
        })
    }

    signOut() {
        this.auth0.logout({
            returnTo: process.env.REACT_APP_AUTH0_RETURN_URL,
            clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
        })
    }

    silentAuth() {
        return new Promise((resolve, reject) => {
            this.auth0.checkSession({}, (err, authResult) => {
                if (err) return reject(err)
                resolve(authResult)
            })
        })
    }
}

const auth0Client = new Auth()

export default auth0Client
