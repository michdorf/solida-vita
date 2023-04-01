import IMemoRiga from "~/moduli/memo/memoriga.interface";

export default interface INota extends IMemoRiga {
    titolo:string;
    contenuto: string;
    d_time: number;
    enc_versione: number;
}