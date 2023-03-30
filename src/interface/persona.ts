import IMemoTabella from "~/moduli/memo/memotabella.interface";

export default interface IPersona extends IMemoTabella {
    nome: string;
    sesso: 'm' | 'f' | 'o';
    nota: string;
}