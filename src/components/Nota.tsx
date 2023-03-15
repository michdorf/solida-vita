import NotaT from "~/interface/nota";
import {Show} from "solid-js";

export default function Nota(params: {nota: NotaT | undefined}) {
    return (
        <>
        <Show when={params.nota?.titolo} fallback={<h1>No title</h1>}>
            <h1>{params.nota?.titolo}</h1>
        </Show>
        <textarea placeholder="Cosa hai in mente?" class="contenuto" style="font-size: 20px; height: 168px" onkeyup="handleTextAreaHeight($event)" onfocus="handleTextAreaHeight($event)">{params.nota?.contenuto}</textarea><br/>
        </>
    )
}