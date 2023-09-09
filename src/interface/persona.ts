import IMemoTabella from "~/moduli/memo/memoriga.interface";

export type TSesso = 'm' | 'f' | 'o';
export default interface IPersona extends IMemoTabella {
    keyid: string;
    nome: string;
    sesso: TSesso;
    nota: string;
}