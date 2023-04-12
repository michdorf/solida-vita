import IMemoRiga from "~/moduli/memo/memoriga.interface";

export default interface INota extends IMemoRiga {
    titolo:string;
    pinned: boolean;
    contenuto: string;
    ricorda: string;
    quaderno: string;
    d_time: number;
    enc_versione: number;
}