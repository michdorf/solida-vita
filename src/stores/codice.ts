import {createSignal} from "solid-js";
import { useNavigate } from "solid-start";
declare let cifra: any;

const [codice, setCodice] = createSignal("");
const [cifErrore, setCifErrore] = createSignal(false);

export function decrypt(input: string, enc_versione?: number) {
    const navigate = useNavigate();

    if (!enc_versione) {
        return input;
    }
    if (!codice()) {
        navigate("/unlock");
        return "";
    } else {
        const dez = cifra.dec(input, codice(), enc_versione);
        if (typeof dez === "object" && 'check' in dez) {
            if (!dez.check) {
                setCifErrore(true);
                console.error("Error con decifrazione");
            }
        }
        return typeof dez === "string" ? dez : dez.ret;
    }
}

export function encrypt(input: string, enc_versione: number = 2) {
    const navigate = useNavigate();

    if (!enc_versione) {
        return input;
    }
    if (!codice()) {
        navigate("/unlock");
        return "";
    } else {
        return cifra.enc(input, codice(), enc_versione);
    }
}

export default codice;
export {setCodice};