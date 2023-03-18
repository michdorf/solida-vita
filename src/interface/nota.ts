import IMemoTabella from "~/moduli/memo/memotabella.interface";

export default interface INota extends IMemoTabella {
    titolo:string;
    contenuto: string;
    d_time: number;
    enc_versione: number;
}