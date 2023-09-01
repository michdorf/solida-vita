import { For, Show, createSignal } from "solid-js";
import quaderni, { salvaQuaderno } from "~/stores/quaderni";
import QuadernoForm from "./leftpanel/quadernoform";
import Modal from "./modal";

export default function QuadernoSelect(props: {quadernoId?: string, onChange: (uuid: string) => void}) {

    const [aggModo, setAggModo] = createSignal(false);

    function onChange(e: Event) {
        if (!e.currentTarget) {
            return;
        }
        const value = (e.currentTarget as HTMLSelectElement).value;
        if (value === "agg") {
            setAggModo(true);
            return;
        }
        props.onChange(value);
    }

    const modal = document.getElementById("modal");

    return (
        <>
        {/* props.quadernoId */}
        <Modal show={aggModo()}>
            <QuadernoForm onSubmit={(q) => {salvaQuaderno(q); setAggModo(false);}}></QuadernoForm>
        </Modal>
        <select onChange={onChange}>
            <option selected={!props.quadernoId} value="">Tutti quaderni</option>
            <optgroup label="Seleziona quaderno">
            <For each={quaderni}>{(quaderno) => 
                <option value={quaderno.UUID} selected={props.quadernoId === quaderno.UUID}>{quaderno.titolo}</option>
            }</For>
            </optgroup>
            <option value="agg">+ Aggiungi</option>
        </select>
        </>
    )
}