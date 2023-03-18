import INota from "~/interface/nota";
import {Show} from "solid-js";
import ContentEdit from "~/components/ContentEdit";
import {TPlainNota} from "~/routes";

export default function Nota(params: {nota: TPlainNota}) {
    return (
        <div style="display: flex; flex-direction: column; height: 100%">
            <div>
                <Show when={params.nota?.titolo} fallback={<h1>No title</h1>}>
                    <h1>{params.nota?.titolo}</h1>
                </Show>
            </div>
            <div style="flex: 1">
                <ContentEdit nota={params.nota}></ContentEdit>
            </div>
        </div>
    )
}