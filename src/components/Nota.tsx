import NotaT from "~/interface/nota";
import {Show} from "solid-js";

export default function Nota(params: {nota: NotaT | undefined}) {
    return (
        <div style="display: flex; flex-direction: column; height: 100%">
            <div>
                <Show when={params.nota?.titolo} fallback={<h1>No title</h1>}>
                    <h1>{params.nota?.titolo}</h1>
                </Show>
            </div>
            <div style="flex: 1">
                <textarea style={{height: "100%", width: "100%"}} placeholder="Cosa hai in mente?" class="contenuto">{params.nota?.contenuto}</textarea><br/>
            </div>
        </div>
    )
}