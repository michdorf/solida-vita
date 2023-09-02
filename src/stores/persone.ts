import {createStore} from "solid-js/store";
import IPersona from "~/interface/persona";
import IQuaderno from "~/interface/quaderno";
import { caricaDaDb } from "~/lib/db";
import Memo from "~/moduli/memo/memo";

const [persone, setPersone] = createStore<IPersona[]>([]);

let memo: Memo;
export function initPersone(memoA: Memo) {
    memo = memoA;
    caricaDaDb('persone').then(per => setPersone(per as IPersona[]));
}

export function nuovaPersona(): IPersona {
    let UUID = memo ? memo.uuid() : (Math.random() + 1).toString(36).substring(7);

    return {
        UUID: UUID,
        key: "",
        nome: "",
        sesso: "f",
        nota: ""
    }
}

export function salvaPersona(persona: IPersona) {
    let trovato = false;
    setPersone(persone => {
        return persone.map(p => {
            if (p.UUID === persona.UUID) {
                trovato = true;
                return persona;
            } else {
                return p;
            }
        });
    });
    if (!trovato) {
        setPersone([...persone, persona]);
        memo?.inserisci('persone', persona);
    } else {
        memo?.update('persone', persona.UUID, persona);
    }
    return persona;
}

export default persone;