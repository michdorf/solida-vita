import { ParentProps, Show, createEffect, createSignal, onMount } from "solid-js";
import { Portal } from "solid-js/web";

export default function Modal(props: ParentProps & {show: boolean}) {
    const [hide, setHide] = createSignal(true);
    const [modal, setModal] = createSignal<HTMLElement | null>(null);
    createEffect(() => {
        if (props.show && modal()) {
            setHide(props.show);
            modal()!.style.display = props.show ? "block" : "none";
        }
    });

    onMount(() => {
        setModal(document.getElementById("modal"));
    });

    return (
        <>
        <Show when={modal() && props.show}>
        <Portal mount={modal()!}>
            <button onClick={() => setHide(true)}>Luk</button>
            {props.children}
        </Portal>
        </Show>
        </>
    );
}