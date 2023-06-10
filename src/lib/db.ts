// declare let Memo: any;
import { createEffect } from "solid-js";
import { initNoteStore } from "~/stores/note";
import Memo from "../moduli/memo/memo"
import oauthclient, { oauthStatus } from "./oauth";
import { setMemoIst } from "~/stores/memo";
import { initQuaderni } from "~/stores/quaderni";

let memo: Memo;
export default function initMemo() {
    // if (typeof window !== "undefined") {
        memo = new Memo("vita", ["note","persone","quaderni"], [["d_time","cambiato"],["cambiato"],["cambiato"]]);
        setMemoIst(memo);
        memo.sinc.pausa_sinc();
        memo.sinc.endpoint = "/vita/api/sinc.php";
        memo.sinc.access_token = "";
        
        memo.suPronto(() => {
            console.log("Klar");
            initNoteStore(memo);
            initQuaderni(memo);
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

export function caricaDaDb(nomeTabella: string) {
    return new Promise((resolve) => {
        memo.seleziona(nomeTabella).then(function (righe: any) {
            let r = [];
            for (let i = 0; i < righe.length; i++) {
            if (righe[i].eliminatoil) {
                continue;
            }
            r.push(righe[i]);
            }
            
            resolve(r);
        });
    });
}