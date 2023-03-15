// import { BASEPATH } from '$lib/base-path';
import { redirect } from "solid-start";
import oauthclient, { autoLogin } from "../lib/oauth";
import {onMount} from "solid-js";

export default function OAuthCallback() {
    onMount(() => {
        if (typeof window != "undefined" && window.location.search.indexOf("code=") !== -1) {
            oauthclient.exchangeAuthCode().then(() => {
                autoLogin();
                location.href = '/';
            });
        }
    });

    return <h1>Exchanges OAuth credentials</h1>;
}
