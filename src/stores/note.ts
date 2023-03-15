import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { UPDATE_TIPO } from "~/moduli/memo/memo";
import Memo from "~/moduli/memo/memo";
import Nota from "~/interface/nota";

const [note, setNote] = createSignal<Nota[]>([]);
export default note;

export function initNoteStore(memo: Memo) {
    carica_note(memo);

    memo.senti("note", function (tipo, riga: Nota) {
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