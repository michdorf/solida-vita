import {createSignal} from "solid-js";

const [codice, setCodice] = createSignal("");

export function decrypt(input: string, enc_versione?: number) {
    if (!codice()) {
        location.href = "/unlock";
        return "";
    } else {
        if (!enc_versione) {
            return input;
        }
        return cifra.dec(input, codice(), enc_versione).ret;;
    }
}

export default codice;
export {setCodice};