import {createSignal} from "solid-js";
import { useNavigate } from "solid-start";
declare let cifra: any;

const [codice, setCodice] = createSignal("");
const [cifErrore, setCifErrore] = createSignal(false);

export enum ENCRYPT_ERRORS {
    NEEDSCODE,
    FAILEDDECRYPT
};

export function decrypt(input: string, enc_versione?: number): string | ENCRYPT_ERRORS.NEEDSCODE {
    const navigate = useNavigate();

    if (!enc_versione) {
        return input;
    }
    if (!codice()) {
        navigate("/unlock");
        return ENCRYPT_ERRORS.NEEDSCODE;
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

export function encrypt(input: string, enc_versione: number = 2): ENCRYPT_ERRORS.NEEDSCODE | string {
    if (!enc_versione) {
        return input;
    }
    if (!codice()) {
        setCifErrore(true);
        return ENCRYPT_ERRORS.NEEDSCODE;
    } else {
        return cifra.enc(input, codice(), enc_versione);
    }
}

export default codice;
export {setCodice};