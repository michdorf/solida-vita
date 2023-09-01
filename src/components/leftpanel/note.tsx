import { For, createSignal } from "solid-js";
import NotaVoce from "../NotaVoce";
import note, { setNotaEditato, nuovaNota as nuovaNotaStore, salvaInDb as memoSalvaInDb, INota } from "~/stores/note";
import QuadernoSelect from "../quaderno-select";

export default function NoteLista(props: {onSelected: (nota: INota) => void}) {
    const [quadernoSelez, setQuaderno] = createSignal<string>("");

    const noteFiltrati = () => note().filter(nota => quadernoSelez() === "" || nota.quaderno === quadernoSelez()).sort((a,b) => b.d_time - a.d_time);

    function nuovaNota(quaderno: string) {
        const nota = nuovaNotaStore(quaderno);
        setNotaEditato(nota);
    }

    return (
        <>
        <QuadernoSelect onChange={qUUID => setQuaderno(qUUID)}></QuadernoSelect>
        <button onClick={() => nuovaNota(quadernoSelez() || "")}>Add</button>
        <For each={noteFiltrati()}>{(nota) => 
            <NotaVoce nota={nota} onselect={() => props.onSelected(nota)} onpin={(pin) => {memoSalvaInDb(Object.assign(nota, {pinned: pin}))}} />
        }</For>
        </>
    );
}