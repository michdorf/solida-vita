import IMemoTabella from "~/moduli/memo/memoriga.interface";

export default interface IPersona extends IMemoTabella {
    keyid: string;
    nome: string;
    sesso: 'm' | 'f' | 'o';
    nota: string;
}