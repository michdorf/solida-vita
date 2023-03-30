import './NotaVoce.css';
import Nota from "~/interface/nota";
import {Show} from "solid-js";

export default function NotaVoce(props: {nota: Nota, onselect?: () => void, onpin?: (pin: boolean) => void}) {
    let onpin = props.onpin || function (pin: boolean) {}; 

    return (
        <a class="nota voce" onClick={props.onselect}>
            <div style={{display: "flex"}}>
            <div><input type='checkbox' checked={props.nota.pinned} onchange={(event) => onpin(event.currentTarget.checked)} /></div>
            <div style="flex: 1">
                <Show when={props.nota.titolo} fallback={<b>No title</b>}>
                    <b>{props.nota.titolo}</b>
                </Show>
                <br />
                <Show when={!props.nota.enc_versione} fallback={"Locked"}>
                    <i>{props.nota.contenuto.substring(0,400)}</i>
                </Show>
            </div>
            </div>
        </a>
    )
}