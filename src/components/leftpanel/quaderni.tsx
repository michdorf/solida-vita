import { For, Show, createSignal } from "solid-js"
import QuadernoForm from "./quadernoform"
import quaderni, { salvaQuaderno } from "~/stores/quaderni"
import QuadernoSelect from "../quaderno-select"

export default function Quaderni() {    
    return (
        <>
        <button>Nuovo quaderno</button>
        <Show when={true}>
            <QuadernoForm onSubmit={salvaQuaderno}/>
        </Show>
        <For each={quaderni}>{
            (quaderno) => <><b>{quaderno.titolo}</b><br/></>
        }</For>
        </>
    )
}