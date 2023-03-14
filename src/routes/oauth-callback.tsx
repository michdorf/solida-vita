// import { BASEPATH } from '$lib/base-path';

import { redirect } from "solid-start";
import oauthclient, { autoLogin } from "../lib/oauth";
if (typeof window != "undefined" && window.location.search.indexOf("code=") !== -1) {
    oauthclient.exchangeAuthCode().then(() => { 
        autoLogin();
        redirect('/');
    });
}

export default function OAuthCallback() {
    return <h1>Exchanges OAuth credentials</h1>;
}
