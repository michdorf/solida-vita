import IMemoRiga from "~/moduli/memo/memoriga.interface";
import Ricorrente from "~/moduli/moduli/ricorrente";

export default interface INota extends IMemoRiga {
    titolo:string;
    pinned: boolean;
    contenuto: string;
    ricorda?: Ricorrente;
    quaderno: string;
    d_time: number;
    enc_versione: number;
}