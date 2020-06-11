import auth0 from 'auth0-js';

class Auth {
  constructor() {
    this.auth0 = new auth0.WebAuth({
      // the following three lines MUST be updated
      domain: process.env.REACT_APP_AUTH0_DOMAIN,
      audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
      redirectUri: process.env.REACT_APP_AUTH0_REDIRECT_URL,
      responseType: 'id_token code token',
      scope: process.env.REACT_APP_AUTH0_SCOPE
    });

    this.getProfile = this.getProfile.bind(this);
    this.getIdToken = this.getIdToken.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
  }

  getProfile() {
    return this.profile;
  }

  getIdToken() {
    return this.idToken;
  }

  getAccessToken() {
    return this.accessToken;
  }

  getScope() {
    return this.scope;
  }


  isAuthenticated() {
    return new Date().getTime() < this.expiresAt;
  }

  signIn() {
    this.auth0.authorize();
  }

  handleAuthentication() {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        if (err) return reject(err);
        if (!authResult || !authResult.idToken) {
          return reject(err);
        }
        this.setSession(authResult);
        resolve();
      });
    })
  }

  setSession(authResult) {

    this.idToken = authResult.idToken;
    this.profile = authResult.idTokenPayload;
    this.accessToken = authResult.accessToken;
    this.scope = authResult.scope;

    // set the time that the id token will expire at
    this.expiresAt = authResult.idTokenPayload.exp * 1000;
  }

  signOut() {
    this.auth0.logout({
      returnTo: process.env.REACT_APP_AUTH0_RETURN_URL,
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
    });
  }

  silentAuth() {
    return new Promise((resolve, reject) => {
      this.auth0.checkSession({}, (err, authResult) => {
        if (err) return reject(err);
        this.setSession(authResult);
        resolve();
      });
    });
  }
}

const auth0Client = new Auth();

export default auth0Client;
