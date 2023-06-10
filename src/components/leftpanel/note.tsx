import { For } from "solid-js";
import NotaVoce from "../NotaVoce";
import { TPlainNota } from "~/routes";
import note, { salvaInDb, setNotaEditato, setNotaSelto, nuovaNota as nuovaNotaStore, salvaInDb as memoSalvaInDb, INota } from "~/stores/note";

export default function NoteLista(props: {onSelected: (nota: INota) => void}) {
    const quaderno = "mm"; //FIXX

    function nuovaNota(quaderno: string) {
        const nota = nuovaNotaStore(quaderno);
        setNotaEditato(nota);
    }

    return (
        <>
        <button onClick={() => nuovaNota(quaderno)}>Add</button>
        <For each={note().sort((a,b) => b.d_time - a.d_time)}>{(nota) => 
            <NotaVoce nota={nota} onselect={() => props.onSelected(nota)} onpin={(pin) => {memoSalvaInDb(Object.assign(nota, {pinned: pin}))}} />
        }</For>
        </>
    );
}