import { createSignal } from 'solid-js';
import OAuthClient from '../oauth-client/src/oauthclient'

export const useOauth = true; // process.env.NODE_ENV === 'development';

// TODO: update oauth-client to work when window and localStorage are undefined

export type LoginState = 'authorized' | 'access-token expired' | 'refresh-token expired' | 'no token';
const [oauthStatus, setAuthStatus] = createSignal<LoginState>();
export { oauthStatus };

let oauthclient = new OAuthClient({
    authorization_url: "https://dechiffre.dk/oauth-server/v1/authorize.php",
    token_url: "https://dechiffre.dk/oauth-server/v1/token.php",
    client_id: import.meta.env.VITE_CLIENT_ID,
    client_secret: import.meta.env.VITE_CLIENT_SECRET,
    redirect_uri: import.meta.env.VITE_REDIRECT_URI
});

export function autoLogin() {
    return new Promise<string | false>((resolve, reject) => {
        const token = oauthclient.getAccessToken();
        if (token) {
            fetch(`https://dechiffre.dk/oauth-server/v1/resource.php`, {
                method: 'POST',
                mode: 'cors',
                headers: new Headers({
                    'Authorization': 'Bearer ' + token
                })
            }).then(async (response) => {
                let resp: string | object = await response.text();
                if (resp[0] === "{") {
                    resp = JSON.parse(resp);
                }
                let nonEntrato = (typeof resp === "object" ? 'error' in resp : resp.substring(0,6) === "ERRORE");
                if (nonEntrato) {
                    console.error("Resource error: " + (typeof resp !== "string" ? JSON.stringify(resp) : resp));
                    oauthclient.refreshToken().then((accesstoken) => {
                        console.info(`refreshed`);
                        resolve(accesstoken.access_token);
                        setAuthStatus('authorized');
                    }).catch(() => {
                        console.error(`error with refresh in autoLogin()`);
                        setAuthStatus("no token");
                        reject();
                    });
                } else {
                    setAuthStatus('authorized');
                    resolve(token);
                }
            }).catch((e) => {
                setAuthStatus('no token');
                console.error("Error in autologin()");
            });
        } else {
            setAuthStatus("no token");
            reject("no token");
        }
    });
}

export default oauthclient;