import {createEffect, createSignal} from "solid-js";
import { UPDATE_TIPO } from "~/moduli/memo/memo";
import Memo from "~/moduli/memo/memo";
import type INota from "~/interface/nota";
import {TPlainNota} from "~/routes";
import {encrypt} from "~/stores/codice";
export {INota};

const [note, setNote] = createSignal<INota[]>([]);
export default note;

let memo: Memo;
export function initNoteStore(memoArg: Memo) {
    memo = memoArg;
    carica_note(memoArg);

    initMemoEffect();

    memoArg.senti("note", function (tipo, riga: INota) {
        switch (tipo) {
            case UPDATE_TIPO.INSERIMENTO:
                setNote(note => [...note, riga]);
                // sort_app_note(app.note);
            break;
            case UPDATE_TIPO.UPDATE:
                setNote(note => {
                    return note.map(nota => (nota.UUID === riga.UUID) ? riga : nota)
                });
                // var nota = app.note.filter((nota) => nota.UUID === riga.UUID)[0];
                // unisci_vue_oggetti(nota, riga);
            break;
            default:
    
        }
    });
}

function carica_note(memo: Memo) {
    memo.seleziona("note").then(function (righe: any) {
        let rnote = [];
        for (let i = 0; i < righe.length; i++) {
        if (righe[i].eliminatoil) {
            continue;
        }
        rnote.push(righe[i]);
        }
        setNote(rnote);
        // app.note.sort(function (a, b) { return b.d_time - a.d_time });
    });
}

export function salvaNota(nota: TPlainNota) {
    let trovato = false;
    setNote(note => {
        return note.map(n => {
            if (n.UUID === nota.UUID) {
                trovato = true;
                return nota;
            } else {
                return n;
            }
        });
    });
    if (!trovato) {
        setNote([...note(), nota]);
    }
}

export function salvaInDb(nota: TPlainNota, nuova: boolean = false) {
    const enc_versione = 2;
    const clone = Object.assign({}, nota);
    if (clone.plain) {
        console.warn("Nota plain non definita. Forse non hai decriptato.");
        clone.contenuto = encrypt(clone.plain, enc_versione);
        clone.enc_versione = enc_versione;
    }
    if (!(delete clone.plain)) {
        console.error("Error removing plain when saving to DB");
    }
    if (nuova) {
        memo.inserisci('note', clone);
    } else {
        memo.update<INota>('note', clone.UUID, clone);
    }
}

function initMemoEffect() {
    createEffect(() => {
        // console.log("Camb in note:", note());
    })
}