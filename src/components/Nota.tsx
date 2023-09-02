import {TPlainNota} from "~/routes";
import { unstable_clientOnly } from "solid-start";
import QuadernoSelect from "./quaderno-select";

// ContentEdit usa tributejs che ha if (window) (invece di `typeof window`) che non funziona su server
const ContentEdit = unstable_clientOnly(() => import("~/components/ContentEdit"));

export default function Nota(params: {nota: TPlainNota, onUpdate: (val: TPlainNota) => void, onSalva: () => void}) {
    function onUpdate(contenuto: string) {
        params.onUpdate(Object.assign(params.nota, {plain: contenuto}));
    }
    function updateTitle(title: string) {
        params.onUpdate(Object.assign(params.nota, {titolo: title}));
    }
    function updateQuaderno(quaderno: string) {
        params.onUpdate(Object.assign(params.nota, {quaderno}));
    }

    return (
        <div style="display: flex; flex-direction: column; height: 100%">
            <div>
                <h1><input value={params.nota?.titolo} onchange={ev => updateTitle(ev.currentTarget.value)} /></h1>
                <QuadernoSelect quadernoId={params.nota?.quaderno} onChange={updateQuaderno} />
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