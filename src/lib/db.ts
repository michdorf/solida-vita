// declare let Memo: any;
import { createEffect } from "solid-js";
import Memo from "../moduli/memo/memo"
import oauthclient, { oauthStatus } from "./oauth";

export default function initMemo() {
    // if (typeof window !== "undefined") {
        let memo = new Memo("vita", ["note"], [["d_time","cambiato"]]);
        memo.sinc.pausa_sinc();
        memo.sinc.endpoint = "/vita/api/sinc.php";
        memo.sinc.access_token = "";
        memo.suPronto(() => {
            console.log("Klar");
        });
    
        createEffect(() => {
            if (oauthStatus() === "authorized") {
                let access_token = oauthclient.getAccessToken();
                if (access_token !== false) {
                    memo.sinc.access_token = access_token;
                    memo.sinc.riprendi_sinc();
                }
            }
        })
    // }
    return memo; 
}
