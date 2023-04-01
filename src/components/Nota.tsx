import INota from "~/interface/nota";
import {Show} from "solid-js";
import {TPlainNota} from "~/routes";
import { unstable_clientOnly } from "solid-start";

// ContentEdit usa tributejs che ha if (window) (invece di `typeof window`) che non funziona su server
const ContentEdit = unstable_clientOnly(() => import("~/components/ContentEdit"));

export default function Nota(params: {nota: TPlainNota, onUpdate: (val: TPlainNota) => void, onSalva: () => void}) {
    function onUpdate(contenuto: string) {
        params.onUpdate(Object.assign(params.nota, {plain: contenuto}));
    }

    return (
        <div style="display: flex; flex-direction: column; height: 100%">
            <div>
                <Show when={params.nota?.titolo} fallback={<h1>No title</h1>}>
                    <h1>{params.nota?.titolo}</h1>
                </Show>
            </div>
            <div style="flex: 1">
                <ContentEdit nota={params.nota} onUpdate={val => onUpdate(val)}></ContentEdit>
            </div>
            <div style={{'text-align': 'right'}}>
                <button onclick={params.onSalva}>Salva</button>
            </div>
        </div>
    )
}