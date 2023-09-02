import {createStore} from "solid-js/store";
import IQuaderno from "~/interface/quaderno";
import { caricaDaDb } from "~/lib/db";
import Memo from "~/moduli/memo/memo";

const [quaderni, setQuaderni] = createStore<IQuaderno[]>([]);

let memo: Memo;
export function initQuaderni(memoA: Memo) {
    memo = memoA;
    caricaDaDb('quaderni').then(qs => setQuaderni(qs as IQuaderno[]));
}

export function nuovoQuaderno(): IQuaderno {
    let UUID = memo ? memo.uuid() : (Math.random() + 1).toString(36).substring(7);

    return {
        UUID: UUID,
        titolo: "test"
    }
}

export function salvaQuaderno(quaderno: IQuaderno) {
    let trovato = false;
    setQuaderni(quaderni => {
        return quaderni.map(q => {
            if (q.UUID === quaderno.UUID) {
                trovato = true;
                return quaderno;
            } else {
                return q;
            }
        });
    });
    if (!trovato) {
        setQuaderni([...quaderni, quaderno]);
        memo?.inserisci('quaderni', quaderno);
    } else {
        memo?.update('quaderni', quaderno.UUID, quaderno);
    }
    return quaderno;
}

export default quaderni;