import { ParentProps, Show, createEffect, createSignal, onMount } from "solid-js";
import { Portal } from "solid-js/web";

export default function Modal(props: ParentProps & {show: boolean}) {
    const [modal, setModal] = createSignal<HTMLElement | null>(null);
    createEffect(() => {
        if (props.show && modal()) {
            modal()!.style.display = props.show ? "block" : "none";
        }
    });

    onMount(() => {
        setModal(document.getElementById("modal"));
    });

    return (
        <Show when={modal()}>
        <Portal mount={modal()!}>
            {props.children}
        </Portal>
        </Show>
    );
}