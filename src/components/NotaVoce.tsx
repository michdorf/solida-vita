import './NotaVoce.css';
import Nota from "~/interface/nota";
import {Show} from "solid-js";

export default function NotaVoce(params: {nota: Nota, onselect?: () => void}) {
    return (
        <a class="nota voce" onClick={params.onselect}>
            <div class="">
                <Show when={params.nota.titolo} fallback={<b>No title</b>}>
                    <b>{params.nota.titolo}</b>
                </Show>
                <br />
                <Show when={!params.nota.enc_versione} fallback={"Locked"}>
                    <i>{params.nota.contenuto.substring(0,400)}</i>
                </Show>
            </div>
        </a>
    )
}